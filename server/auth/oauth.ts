import type { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { authStorage } from "../replit_integrations/auth/storage";
import { storage } from "../storage";
import { db } from "../db";
import { creditTransactions } from "@shared/schema";

const OAUTH_CALLBACK_BASE = process.env.OAUTH_CALLBACK_BASE || "";

export interface OAuthProfile {
  id: string;
  provider: "google" | "facebook" | "linkedin" | "apple";
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}

function normalizeOAuthProfile(profile: any, provider: OAuthProfile["provider"]): OAuthProfile {
  let email: string | undefined;
  let firstName: string | undefined;
  let lastName: string | undefined;
  let displayName: string | undefined;

  if (provider === "google") {
    email = profile.emails?.[0]?.value;
    firstName = profile.name?.givenName;
    lastName = profile.name?.familyName;
    displayName = profile.displayName;
  } else if (provider === "facebook") {
    email = profile.emails?.[0]?.value;
    const parts = (profile.displayName || profile.name?.givenName || "").split(" ");
    firstName = parts[0] || profile.name?.givenName;
    lastName = parts.slice(1).join(" ") || profile.name?.familyName;
    displayName = profile.displayName;
  } else if (provider === "linkedin") {
    email = profile.emails?.[0]?.value;
    firstName = profile.name?.givenName;
    lastName = profile.name?.familyName;
    displayName = profile.displayName || [firstName, lastName].filter(Boolean).join(" ");
  } else {
    email = profile.email;
    firstName = profile.name?.firstName;
    lastName = profile.name?.lastName;
    displayName = profile.name ? [profile.name.firstName, profile.name.lastName].filter(Boolean).join(" ") : undefined;
  }

  return {
    id: profile.id,
    provider,
    email: email || null,
    firstName: firstName || null,
    lastName: lastName || null,
    displayName: displayName || null,
  };
}

async function findOrCreateOAuthUser(oauth: OAuthProfile) {
  const email = (oauth.email || "").toLowerCase().trim();
  if (!email) {
    throw new Error("OAuth provider did not return an email address");
  }

  let user = await authStorage.getUserByEmail(email);
  if (user) {
    return user;
  }

  const firstName = oauth.firstName || oauth.displayName?.split(" ")[0] || "User";
  const lastName = oauth.lastName || oauth.displayName?.split(" ").slice(1).join(" ") || "";

  user = await authStorage.createUser({
    email,
    passwordHash: null,
    firstName: firstName.trim() || "User",
    lastName: lastName.trim(),
    emailVerified: true,
  });

  let profile = await storage.getUserProfile(user.id);
  if (!profile) {
    profile = await storage.createUserProfile({
      userId: user.id,
      role: "buyer",
      plan: "free",
    });
    await db.insert(creditTransactions).values({
      userId: user.id,
      amount: 2,
      type: "free_trial",
      creditSource: "topup",
      description: "OAuth signup: 2 free credits",
    });
  }

  return user;
}

export function setupOAuth(app: Express) {
  if (!OAUTH_CALLBACK_BASE) {
    console.log("OAUTH_CALLBACK_BASE not set — OAuth routes disabled");
    return;
  }

  app.use(passport.initialize());

  const callbackBase = OAUTH_CALLBACK_BASE.replace(/\/$/, "");

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${callbackBase}/api/auth/google/callback`,
        },
        async (_accessToken: string, _refreshToken: string, profile: Record<string, unknown>, done: (err: Error | null, user?: { id: string }) => void) => {
          try {
            const oauth = normalizeOAuthProfile(profile, "google");
            const user = await findOrCreateOAuthUser(oauth);
            done(null, { id: user.id });
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${callbackBase}/api/auth/facebook/callback`,
          profileFields: ["id", "displayName", "emails", "name"],
        },
        async (_accessToken: string, _refreshToken: string, profile: Record<string, unknown>, done: (err: Error | null, user?: { id: string }) => void) => {
          try {
            const oauth = normalizeOAuthProfile(profile, "facebook");
            const user = await findOrCreateOAuthUser(oauth);
            done(null, { id: user.id });
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );
  }

  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: `${callbackBase}/api/auth/linkedin/callback`,
          scope: ["openid", "profile", "email"],
        },
        async (_accessToken: string, _refreshToken: string, profile: Record<string, unknown>, done: (err: Error | null, user?: { id: string }) => void) => {
          try {
            const oauth = normalizeOAuthProfile(profile, "linkedin");
            const user = await findOrCreateOAuthUser(oauth);
            done(null, { id: user.id });
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );
  }

  const authCallback = (provider: string) => (req: any, res: any) => {
    passport.authenticate(provider, (err: Error | null, user: { id: string } | false) => {
      if (err) {
        console.error(`OAuth ${provider} error:`, err);
        return res.redirect(`/login?error=${encodeURIComponent(err.message)}`);
      }
      if (!user) {
        return res.redirect("/login?error=Authentication%20failed");
      }
      req.session.userId = user.id;
      req.session.save((saveErr: Error) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.redirect("/login?error=Session%20error");
        }
        res.redirect("/dashboard");
      });
    })(req, res);
  };

  if (process.env.GOOGLE_CLIENT_ID) {
    app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get("/api/auth/google/callback", authCallback("google"));
  }

  if (process.env.FACEBOOK_APP_ID) {
    app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    app.get("/api/auth/facebook/callback", authCallback("facebook"));
  }

  if (process.env.LINKEDIN_CLIENT_ID) {
    app.get("/api/auth/linkedin", passport.authenticate("linkedin"));
    app.get("/api/auth/linkedin/callback", authCallback("linkedin"));
  }

  app.get("/api/auth/apple", (_req, res) => {
    res.status(501).json({ error: "Apple Sign In requires Apple Developer setup. Use Google, Facebook, or LinkedIn." });
  });
}
