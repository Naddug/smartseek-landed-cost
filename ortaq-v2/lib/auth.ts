import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import { defaultRoleForSignup, parseUserRole } from "@/lib/auth/roles";
import { verifyCredentials } from "@/lib/auth/register";
import { getAuthSecret } from "@/lib/auth/secret";
import {
  findOrCreateOAuthUser,
  hydrateAuthSession,
} from "@/lib/auth/user-repository";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      onboardingCompleted: boolean;
      sideSelected: boolean;
      profileCompletionLevel: import("@/types/profile-onboarding").ProfileCompletionLevel;
    };
  }

  interface User {
    role: UserRole;
    onboardingCompleted?: boolean;
    sideSelected?: boolean;
    profileCompletionLevel?: import("@/types/profile-onboarding").ProfileCompletionLevel;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    onboardingCompleted: boolean;
    sideSelected: boolean;
    profileCompletionLevel: import("@/types/profile-onboarding").ProfileCompletionLevel;
  }
}

export const SIGNUP_ROLE_COOKIE = "ortaq_signup_role";

const demoUsers: Record<
  string,
  { password: string; name: string; role: UserRole }
> = {
  "demo@ortaq.biz": {
    password: "demo",
    name: "Ayşe Yılmaz",
    role: "opportunity_owner",
  },
  "ortak@ortaq.biz": {
    password: "demo",
    name: "Mehmet Kaya",
    role: "partner",
  },
};

function demoAuthEnabled(): boolean {
  return process.env.ORTAQ_ENABLE_DEMO_AUTH === "true";
}

function readSignupRoleCookie(): UserRole | null {
  return parseUserRole(cookies().get(SIGNUP_ROLE_COOKIE)?.value);
}

function clearSignupRoleCookie() {
  cookies().delete(SIGNUP_ROLE_COOKIE);
}

function buildProviders(): NextAuthOptions["providers"] {
  const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
      id: "credentials",
      name: "E-posta",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();

        const user = await verifyCredentials(email, credentials.password);
        if (user) {
          const session = await hydrateAuthSession(user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            onboardingCompleted: session.onboardingCompleted,
            sideSelected: session.sideSelected,
            profileCompletionLevel: session.profileCompletionLevel,
          };
        }

        if (!demoAuthEnabled()) return null;

        const demo = demoUsers[email];
        if (!demo || demo.password !== credentials.password) return null;

        return {
          id: email,
          email,
          name: demo.name,
          role: demo.role,
          onboardingCompleted: true,
          sideSelected: true,
          profileCompletionLevel: "complete" as const,
        };
      },
    }),
  ];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    providers.push(
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  if (
    hasDatabase() &&
    process.env.EMAIL_SERVER &&
    process.env.EMAIL_FROM
  ) {
    providers.push(
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      })
    );
  }

  return providers;
}

async function resolveOAuthUser(
  input: {
    email: string;
    name?: string | null;
    image?: string | null;
    provider: string;
    providerAccountId: string;
  },
  signupRole: UserRole | null
) {
  return findOrCreateOAuthUser({
    email: input.email,
    name: input.name,
    image: input.image,
    provider: input.provider,
    providerAccountId: input.providerAccountId,
    role: signupRole,
  });
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/giris",
    newUser: "/kayit/yol-secimi",
    verifyRequest: "/giris?magic=sent",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email || account?.provider === "credentials") return true;

      try {
        const signupRole = readSignupRoleCookie();
        await resolveOAuthUser(
          {
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider ?? "oauth",
            providerAccountId:
              account?.providerAccountId ??
              (profile as { sub?: string } | undefined)?.sub ??
              user.email,
          },
          signupRole
        );

        if (signupRole) clearSignupRoleCookie();
      } catch (error) {
        console.error("[auth] OAuth sign-in failed:", error);
        return false;
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user?.email && account && account.provider !== "credentials") {
        try {
          const signupRole = readSignupRoleCookie();
          const stored = await resolveOAuthUser(
            {
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            signupRole
          );
          const session = await hydrateAuthSession(stored.id);

          token.sub = stored.id;
          token.role = session.role;
          token.onboardingCompleted = session.onboardingCompleted;
          token.sideSelected = session.sideSelected;
          token.profileCompletionLevel = session.profileCompletionLevel;

          if (signupRole) clearSignupRoleCookie();
          return token;
        } catch (error) {
          console.error("[auth] OAuth JWT hydrate failed:", error);
        }
      }

      if (user) {
        token.sub = user.id;
        token.role = user.role ?? defaultRoleForSignup(undefined);
        token.onboardingCompleted = user.onboardingCompleted ?? false;
        token.sideSelected = user.sideSelected ?? false;
        token.profileCompletionLevel = user.profileCompletionLevel ?? "incomplete";
      }

      if (token.sub && (trigger === "update" || !user)) {
        try {
          const session = await hydrateAuthSession(token.sub);
          token.role = session.role;
          token.onboardingCompleted = session.onboardingCompleted;
          token.sideSelected = session.sideSelected;
          token.profileCompletionLevel = session.profileCompletionLevel;
        } catch (error) {
          console.error("[auth] Session hydrate failed:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "partner";
        session.user.onboardingCompleted = token.onboardingCompleted ?? false;
        session.user.sideSelected = token.sideSelected ?? false;
        session.user.profileCompletionLevel = token.profileCompletionLevel ?? "incomplete";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  secret: getAuthSecret(),
};

export { registerUser } from "@/lib/auth/register";
export { authContinueHref, postAuthRedirect, sanitizeNextPath } from "@/lib/auth/routes";
export {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";
