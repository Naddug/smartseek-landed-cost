import type { Express, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import appleSignin from "apple-signin-auth";
import { authStorage } from "../replit_integrations/auth/storage";
import { storage } from "../storage";
import { db } from "../db";
import { creditTransactions } from "@shared/schema";

const OAUTH_CALLBACK_BASE =
  process.env.OAUTH_CALLBACK_BASE ||
  process.env.RAILWAY_STATIC_URL ||
  "https://smartseek-landed-cost-production.up.railway.app";

export interface OAuthProfile {
  id: string;
  provider: "google" | "facebook" | "linkedin" | "apple";
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatar?: string | null;
}

function normalizeOAuthProfile(profile: any, provider: OAuthProfile["provider"]): OAuthProfile {
  let email: string | undefined;
  let firstName: string | undefined;
  let lastName: string | undefined;
  let displayName: string | undefined;
  let avatar: string | undefined;

  if (provider === "google") {
    email = profile.emails?.[0]?.value;
    firstName = profile.name?.givenName;
    lastName = profile.name?.familyName;
    displayName = profile.displayName;
    avatar = profile.photos?.[0]?.value;
  } else if (provider === "facebook") {
    email = profile.emails?.[0]?.value;
    const parts = (profile.displayName || profile.name?.givenName || "").split(" ");
    firstName = parts[0] || profile.name?.givenName;
    lastName = parts.slice(1).join(" ") || profile.name?.familyName;
    displayName = profile.displayName;
    avatar = profile.photos?.[0]?.value || profile.photos?.[0];
  } else if (provider === "linkedin") {
    email = profile.emails?.[0]?.value;
    firstName = profile.name?.givenName;
    lastName = profile.name?.familyName;
    displayName = profile.displayName || [firstName, lastName].filter(Boolean).join(" ");
    avatar = profile.photos?.[0];
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
    avatar: avatar || null,
  };
}

async function findOrCreateOAuthUser(oauth: OAuthProfile) {
  const providerIdField = `${oauth.provider}Id` as "googleId" | "facebookId" | "linkedinId" | "appleId";
  const getByProviderId =
    oauth.provider === "google"
      ? authStorage.getUserByGoogleId
      : oauth.provider === "facebook"
        ? authStorage.getUserByFacebookId
        : oauth.provider === "linkedin"
          ? authStorage.getUserByLinkedinId
          : authStorage.getUserByAppleId;

  let user = await getByProviderId.call(authStorage, oauth.id);
  if (user) return user;

  const email = (oauth.email || "").toLowerCase().trim();
  if (!email) {
    throw new Error("OAuth provider did not return an email address");
  }

  user = await authStorage.getUserByEmail(email);
  if (user) {
    const updated = await authStorage.updateUser(user.id, {
      [providerIdField]: oauth.id,
      profileImageUrl: oauth.avatar || user.profileImageUrl,
    });
    return updated!;
  }

  const firstName = oauth.firstName || oauth.displayName?.split(" ")[0] || "User";
  const lastName = oauth.lastName || oauth.displayName?.split(" ").slice(1).join(" ") || "";

  user = await authStorage.createUser({
    email,
    passwordHash: null,
    firstName: firstName.trim() || "User",
    lastName: lastName.trim(),
    emailVerified: true,
    [providerIdField]: oauth.id,
    profileImageUrl: oauth.avatar,
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
      description: `OAuth signup (${oauth.provider}): 2 free credits`,
    });
  }

  return user;
}

const oauthStub = (provider: string) => (_req: Request, res: Response) => {
  res.status(501).json({ error: `${provider} OAuth not configured yet. Use email/password.` });
};

export function setupOAuth(app: Express) {
  const callbackBase = OAUTH_CALLBACK_BASE.replace(/\/$/, "");

  app.get("/api/auth/providers", (_req, res) => {
    res.json({
      google: !!process.env.GOOGLE_CLIENT_ID,
      facebook: !!process.env.FACEBOOK_APP_ID,
      linkedin: !!process.env.LINKEDIN_CLIENT_ID,
      apple: !!process.env.APPLE_CLIENT_ID,
    });
  });

  if (!callbackBase) {
    app.get("/api/auth/google", oauthStub("Google"));
    app.get("/api/auth/facebook", oauthStub("Facebook"));
    app.get("/api/auth/linkedin", oauthStub("LinkedIn"));
    app.get("/api/auth/apple", oauthStub("Apple"));
    console.log("OAUTH_CALLBACK_BASE not set — OAuth routes disabled (stubs registered)");
    return;
  }

  app.use(passport.initialize());

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
          profileFields: ["id", "displayName", "emails", "name", "photos"],
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
  } else {
    app.get("/api/auth/google", oauthStub("Google"));
  }

  if (process.env.FACEBOOK_APP_ID) {
    app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    app.get("/api/auth/facebook/callback", authCallback("facebook"));
  } else {
    app.get("/api/auth/facebook", oauthStub("Facebook"));
  }

  if (process.env.LINKEDIN_CLIENT_ID) {
    app.get("/api/auth/linkedin", passport.authenticate("linkedin"));
    app.get("/api/auth/linkedin/callback", authCallback("linkedin"));
  } else {
    app.get("/api/auth/linkedin", oauthStub("LinkedIn"));
  }

  if (process.env.APPLE_CLIENT_ID) {
    app.get("/api/auth/apple", (_req, res) => {
      const params = new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        redirect_uri: `${callbackBase}/api/auth/apple/callback`,
        response_type: "code id_token",
        scope: "name email",
        response_mode: "form_post",
      });
      res.redirect(`https://appleid.apple.com/auth/authorize?${params}`);
    });

    app.post("/api/auth/apple/callback", async (req, res) => {
      try {
        const { id_token, user: appleUser } = req.body;
        if (!id_token) {
          return res.redirect("/login?error=Apple%20sign-in%20failed");
        }
        const payload = await appleSignin.verifyIdToken(id_token, {
          audience: process.env.APPLE_CLIENT_ID,
          ignoreExpiration: false,
        });

        const email = payload.email || `apple_${payload.sub}@noemail.com`;
        let firstName = "User";
        let lastName = "";
        if (appleUser && typeof appleUser === "string") {
          try {
            const parsed = JSON.parse(appleUser);
            firstName = parsed.name?.firstName || firstName;
            lastName = parsed.name?.lastName || "";
          } catch {
            // ignore
          }
        }
        const name = `${firstName} ${lastName}`.trim() || email.split("@")[0];

        const oauth: OAuthProfile = {
          id: payload.sub,
          provider: "apple",
          email,
          firstName: firstName !== "User" ? firstName : null,
          lastName: lastName || null,
          displayName: name,
        };
        const user = await findOrCreateOAuthUser(oauth);
        (req as any).session.userId = user.id;
        (req as any).session.save((saveErr: Error) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.redirect("/login?error=Session%20error");
          }
          res.redirect("/dashboard");
        });
      } catch (err) {
        console.error("Apple OAuth error:", err);
        res.redirect("/login?error=Apple%20sign-in%20failed");
      }
    });
  } else {
    app.get("/api/auth/apple", oauthStub("Apple"));
  }
}
