/**
 * Deterministic auth smoke test — exercises the REAL registration + credential
 * verification code paths against the local file store (no database required).
 *
 * Run locally:
 *   node --experimental-strip-types --experimental-loader ./scripts/_alias-loader.mjs scripts/smoke-auth.ts
 *
 * Exit code 0 = all checks passed. Non-zero = a real auth-core regression.
 */
import { registerUser, verifyCredentials } from "@/lib/auth/register";

let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

async function main() {
  const email = `smoke+${Date.now()}@ortaq.test`;
  const password = "verylongpass123";

  const created = await registerUser({
    email,
    password,
    name: "Smoke Test",
    role: "opportunity_owner",
  });
  check("new user registers", created.ok, JSON.stringify(created));

  const duplicate = await registerUser({ email, password });
  check(
    "duplicate email rejected (CONFLICT)",
    !duplicate.ok && duplicate.code === "CONFLICT"
  );

  const weak = await registerUser({
    email: `weak${Date.now()}@ortaq.test`,
    password: "123",
  });
  check("weak password rejected (INVALID)", !weak.ok && weak.code === "INVALID");

  const goodLogin = await verifyCredentials(email, password);
  check(
    "login with correct password succeeds",
    Boolean(goodLogin && goodLogin.email === email),
    goodLogin ? `role=${goodLogin.role}` : "null"
  );

  const badLogin = await verifyCredentials(email, "wrong-password-999");
  check("login with wrong password rejected", badLogin === null);

  console.log(`\n${failures === 0 ? "ALL AUTH SMOKE CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("SMOKE ERROR:", error);
  process.exit(1);
});
