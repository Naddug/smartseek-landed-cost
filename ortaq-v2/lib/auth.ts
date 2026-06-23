import type { NextAuthOptions } from "next-auth";
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
    };
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

/**
 * NextAuth configuration skeleton.
 * TODO: Wire Prisma adapter and real providers when auth sprint begins.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // TODO: Add CredentialsProvider or OAuth providers
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/giris",
    newUser: "/kayit/yol-secimi",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "partner";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "partner";
      }
      return session;
    },
  },
};
