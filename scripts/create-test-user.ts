/**
 * Create or reset the test user for SmartSeek.
 * Loads .env automatically — add DATABASE_URL to .env (copy from Railway Variables).
 * Use when login fails (e.g. user doesn't exist in Railway DB, or password was changed).
 *
 * Run against Railway: railway run npx tsx scripts/create-test-user.ts
 * Run locally: npx tsx scripts/create-test-user.ts
 *
 * Credentials after running:
 *   Email: test@smartseek.com
 *   Password: SmartSeek2024!
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { users, userProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const TEST_EMAIL = "test@smartseek.com";
const TEST_PASSWORD = "SmartSeek2024!";
const TEST_FIRST_NAME = "Test";
const TEST_LAST_NAME = "User";
const TEST_CREDITS = 999; // Admin gets unlimited; this is for non-admin fallback

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function createOrResetTestUser() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL required in .env");

  // Use single connection + retries — Railway often ECONNRESET from external
  // Railway and cloud Postgres use self-signed certs; allow for local/CI runs
  const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
  const pool = new pg.Pool({
    connectionString: url,
    max: 1,
    ssl: isLocalhost ? undefined : { rejectUnauthorized: false },
  });

  const db = drizzle(pool, { schema });

  const run = async () => {
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
    const [existing] = await db.select().from(users).where(eq(users.email, TEST_EMAIL));

    let userId: string;
    if (existing) {
      await db
        .update(users)
        .set({
          passwordHash,
          firstName: TEST_FIRST_NAME,
          lastName: TEST_LAST_NAME,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      userId = existing.id;
      console.log(`✅ Updated existing user ${TEST_EMAIL} with new password.`);
    } else {
      const inserted = await db.insert(users).values({
        email: TEST_EMAIL,
        passwordHash,
        firstName: TEST_FIRST_NAME,
        lastName: TEST_LAST_NAME,
        emailVerified: true,
      }).returning();
      const newUser = inserted[0];
      if (!newUser) throw new Error("Failed to create user");
      userId = newUser.id;
      console.log(`✅ Created new user ${TEST_EMAIL}.`);
    }

    // Ensure test user has admin role and credits for testing (if user_profiles exists)
    try {
      const [existingProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (existingProfile) {
        await db.update(userProfiles).set({
          role: "admin",
          topupCredits: TEST_CREDITS,
          monthlyCredits: 10,
          updatedAt: new Date(),
        }).where(eq(userProfiles.userId, userId));
        console.log(`✅ Set test user as admin with ${TEST_CREDITS} top-up credits.`);
      } else {
        await db.insert(userProfiles).values({
          userId,
          role: "admin",
          plan: "free",
          monthlyCredits: 10,
          topupCredits: TEST_CREDITS,
        });
        console.log(`✅ Created profile: admin role, ${TEST_CREDITS} credits.`);
      }
    } catch (profileErr: any) {
      if (profileErr?.code === "42P01") {
        console.log("⚠️  user_profiles table not found — run migrations first. Profile will be created on first login.");
      } else {
        throw profileErr;
      }
    }
  };

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("Creating/resetting test user...");
      await run();
      break;
    } catch (e: any) {
      if (attempt === maxRetries) {
        await pool.end();
        throw e;
      }
      console.log(`Attempt ${attempt}/${maxRetries} failed (${e.code || e.message}), retrying in 2s...`);
      await sleep(2000);
    }
  }

  console.log("\nYou can now log in with:");
  console.log(`  Email: ${TEST_EMAIL}`);
  console.log(`  Password: ${TEST_PASSWORD}`);

  await pool.end();
}

createOrResetTestUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
