import type { NextAuthOptions } from "next-auth";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import { defaultRoleForSignup, parseUserRole } from "@/lib/auth/roles";
import {
  findOrCreateOAuthUser,
  hydrateAuthSession,
} from "@/lib/auth/user-repository";

export const SIGNUP_ROLE_COOKIE = "ortaq_signup_role";

function readSignupRoleCookie(): UserRole | null {
  return parseUserRole(cookies().get(SIGNUP_ROLE_COOKIE)?.value);
}

function clearSignupRoleCookie() {
  cookies().delete(SIGNUP_ROLE_COOKIE);
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

/**
 * NextAuth callbacks, decoupled from provider wiring so they can be unit-tested
 * deterministically (see scripts/smoke-auth-session.ts) without constructing the
 * OAuth/email providers.
 */
export const authCallbacks: NonNullable<NextAuthOptions["callbacks"]> = {
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
};
