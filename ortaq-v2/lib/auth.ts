import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import { verifyCredentials } from "@/lib/auth/register";
import { getAuthSecret } from "@/lib/auth/secret";
import { hydrateAuthSession } from "@/lib/auth/user-repository";
import { authCallbacks, SIGNUP_ROLE_COOKIE } from "@/lib/auth/callbacks";

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

export { SIGNUP_ROLE_COOKIE };

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
    ...authCallbacks,
  },
  secret: getAuthSecret(),
};

export { registerUser } from "@/lib/auth/register";
export { authContinueHref, postAuthRedirect, sanitizeNextPath } from "@/lib/auth/routes";
export {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";
