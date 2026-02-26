import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import { authStorage } from "./storage";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../sendgridClient";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

function isDummyOrSqliteDb(): boolean {
  const url = process.env.DATABASE_URL || "";
  return (
    url.includes("localhost:5432/dummy") ||
    url.startsWith("file:")
  );
}

function useMemorySessionStore(): boolean {
  if (isDummyOrSqliteDb()) return true;
  if (process.env.USE_MEMORY_SESSION === "true") return true;
  // Railway Postgres often has ECONNRESET with pg session store — use memory by default
  const url = process.env.DATABASE_URL || "";
  if (url.includes("railway") || url.includes("rlwy.net")) return true;
  return false;
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const useMemoryStore = useMemorySessionStore();
  const isDev = process.env.NODE_ENV !== "production";

  const sessionStore = useMemoryStore
    ? new (createMemoryStore(session))({
        checkPeriod: 24 * 60 * 60 * 1000, // prune expired every 24h
        ttl: sessionTtl,
      })
    : (() => {
        const pgStore = connectPg(session);
        return new pgStore({
          conString: process.env.DATABASE_URL,
          createTableIfMissing: true,
          ttl: sessionTtl,
          tableName: "sessions",
        });
      })();

  if (useMemoryStore) {
    console.log("Using in-memory session store (sessions reset on deploy).");
  }

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "lax" : ("none" as const),
      maxAge: sessionTtl,
    },
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", true);
  app.use(getSession());

  // Signup endpoint
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      if (!firstName || !lastName) {
        return res.status(400).json({ error: "First name and last name are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const existingUser = await authStorage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const passwordHash = await hashPassword(password);
      const user = await authStorage.createUser({
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailVerified: false,
      });

      // Generate verification token and send email
      const verificationToken = await authStorage.setVerificationToken(user.id);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      try {
        await sendVerificationEmail(user.email, verificationToken, baseUrl);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Continue anyway - user can request resend
      }

      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.json({ 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName,
          emailVerified: false,
          message: "Account created. Please check your email to verify your account."
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await authStorage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        emailVerified: user.emailVerified
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Verify email endpoint
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Invalid verification token" });
      }

      const user = await authStorage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }

      // Check if token is expired
      if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
        return res.status(400).json({ error: "Verification token has expired. Please request a new one." });
      }

      await authStorage.verifyEmail(user.id);
      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  // Resend verification email
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: "Email is already verified" });
      }

      const verificationToken = await authStorage.setVerificationToken(user.id);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      await sendVerificationEmail(user.email, verificationToken, baseUrl);
      res.json({ success: true, message: "Verification email sent" });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  // Forgot password - send reset email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await authStorage.getUserByEmail(email.toLowerCase().trim());
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
      }

      const resetToken = await authStorage.setPasswordResetToken(user.id);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      try {
        console.log(`Sending password reset email to ${user.email}...`);
        await sendPasswordResetEmail(user.email, resetToken, baseUrl);
        console.log(`Password reset email sent successfully to ${user.email}`);
      } catch (emailError: any) {
        console.error("Failed to send password reset email:", emailError?.message || emailError);
        if (emailError?.response?.body) {
          console.error("SendGrid error details:", JSON.stringify(emailError.response.body));
        }
      }

      res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const user = await authStorage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Check if token is expired
      if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
        return res.status(400).json({ error: "Reset token has expired. Please request a new one." });
      }

      const passwordHash = await hashPassword(password);
      await authStorage.updateUser(user.id, {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      });

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware to check if user's email is verified
export const requireEmailVerified: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = await authStorage.getUser(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  
  if (!user.emailVerified) {
    return res.status(403).json({ 
      message: "Email verification required", 
      code: "EMAIL_NOT_VERIFIED" 
    });
  }
  
  next();
};
