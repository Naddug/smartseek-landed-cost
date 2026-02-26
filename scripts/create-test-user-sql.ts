/**
 * Prints SQL to create/reset the test user. No DB connection needed.
 * Run: npx tsx scripts/create-test-user-sql.ts
 * Then paste the output into Railway Dashboard → Postgres → Data → Query
 *
 * Credentials: test@smartseek.com / SmartSeek2024!
 */

import bcrypt from "bcryptjs";

const TEST_EMAIL = "test@smartseek.com";
const TEST_PASSWORD = "SmartSeek2024!";
const TEST_FIRST_NAME = "Test";
const TEST_LAST_NAME = "User";

async function main() {
  const hash = await bcrypt.hash(TEST_PASSWORD, 10);
  const escapedHash = hash.replace(/'/g, "''");

  console.log("-- Paste this into Railway → Postgres → Data → Query\n");
  console.log(`
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, created_at, updated_at)
VALUES (
  '${TEST_EMAIL}',
  '${escapedHash}',
  '${TEST_FIRST_NAME}',
  '${TEST_LAST_NAME}',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email_verified = true,
  updated_at = NOW();
`);
  console.log("\n-- Then run the query. Login: test@smartseek.com / SmartSeek2024!");
}

main().catch(console.error);
