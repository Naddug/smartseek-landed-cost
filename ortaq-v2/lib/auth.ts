import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "E-posta",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const account = demoUsers[credentials.email.toLowerCase()];
        if (!account || account.password !== credentials.password) return null;

        return {
          id: credentials.email,
          email: credentials.email.toLowerCase(),
          name: account.name,
          role: account.role,
        };
      },
    }),
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
