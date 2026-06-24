-- Profile onboarding fields
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "completionLevel" TEXT NOT NULL DEFAULT 'incomplete';
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "profileData" JSONB NOT NULL DEFAULT '{}';
