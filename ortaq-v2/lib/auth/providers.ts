import { hasDatabase } from "@/lib/auth/db";

export type AuthProviderFlags = {
  google: boolean;
  linkedin: boolean;
  emailMagicLink: boolean;
  emailPassword: boolean;
};

export function getAuthProviderFlags(): AuthProviderFlags {
  return {
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
    linkedin: Boolean(
      process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
    ),
    emailMagicLink: Boolean(
      hasDatabase() && process.env.EMAIL_SERVER && process.env.EMAIL_FROM
    ),
    emailPassword: true,
  };
}
