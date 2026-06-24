import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import { hasDatabase } from "@/lib/auth/db";
import {
  applySignupRoleToUser,
  ensureUserProfile,
  getUserProfile,
} from "@/lib/auth/profile";
import { defaultRoleForSignup, parseUserRole } from "@/lib/auth/roles";
import { verifyCredentials } from "@/lib/auth/register";
import { getAuthSecret } from "@/lib/auth/secret";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      onboardingCompleted: boolean;
      sideSelected: boolean;
    };
  }

  interface User {
    role: UserRole;
    onboardingCompleted?: boolean;
    sideSelected?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    onboardingCompleted: boolean;
    sideSelected: boolean;
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

        if (hasDatabase()) {
          try {
            const user = await verifyCredentials(email, credentials.password);
            if (user) {
              const profile = await getUserProfile(user.id);
              return {
                ...user,
                onboardingCompleted: profile?.onboardingCompleted ?? false,
                sideSelected: Boolean(profile?.sideSelectedAt),
              };
            }
          } catch (error) {
            console.error("[auth] Database credentials check failed:", error);
          }
        }

        const demo = demoUsers[email];
        if (!demo || demo.password !== credentials.password) return null;

        return {
          id: email,
          email,
          name: demo.name,
          role: demo.role,
          onboardingCompleted: true,
          sideSelected: true,
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

  if (hasDatabase() && process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
    providers.push(
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      })
    );
  }

  return providers;
}

async function hydrateTokenFromDatabase(userId: string, token: {
  role?: UserRole;
  onboardingCompleted?: boolean;
  sideSelected?: boolean;
}) {
  if (!hasDatabase()) return token;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const profile = await getUserProfile(userId);

  if (user) token.role = user.role;
  token.onboardingCompleted = profile?.onboardingCompleted ?? false;
  token.sideSelected = Boolean(profile?.sideSelectedAt);
  return token;
}

export const authOptions: NextAuthOptions = {
  adapter: hasDatabase() ? PrismaAdapter(prisma) : undefined,
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
    async signIn({ user, account }) {
      if (!hasDatabase() || !user.id) return true;

      try {
        const signupRole = readSignupRoleCookie();

        if (signupRole && account?.provider !== "credentials") {
          await applySignupRoleToUser(user.id, signupRole);
          clearSignupRoleCookie();
        } else {
          await ensureUserProfile(user.id, {
            role: signupRole ?? undefined,
            markSideSelected: Boolean(signupRole),
          });
        }
      } catch (error) {
        console.error("[auth] Profile bootstrap failed:", error);
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role ?? defaultRoleForSignup(undefined);
        token.onboardingCompleted = user.onboardingCompleted ?? false;
        token.sideSelected = user.sideSelected ?? true;
      }

      if (hasDatabase() && token.sub && (trigger === "update" || !user)) {
        try {
          await hydrateTokenFromDatabase(token.sub, token);
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
        session.user.sideSelected = token.sideSelected ?? true;
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
export { postAuthRedirect, sanitizeNextPath } from "@/lib/auth/routes";
export {
  resolvePostAuthDestination,
  sessionToPostAuthContext,
} from "@/lib/auth/session-policy";
