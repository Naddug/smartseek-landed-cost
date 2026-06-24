/**
 * API-contract + continuation smoke test.
 *
 * Unlike scripts/smoke-auth.ts (which exercises the SERVICE layer), this invokes
 * the REAL Next route handler `POST /api/auth/register` and asserts its HTTP
 * contract, then asserts the premium auth-continuation routing helpers.
 *
 * It does NOT boot a server and does NOT cover the browser NextAuth cookie
 * round-trip (see "Not Proven Yet" in the report).
 *
 * Run:
 *   node --experimental-strip-types --experimental-loader ./scripts/_alias-loader.mjs scripts/smoke-auth-api.ts
 */
import { POST } from "@/app/api/auth/register/route";
import {
  createDossierEntryHref,
  loginHref,
  registerPathChoiceHref,
  sanitizeNextPath,
} from "@/lib/auth/routes";
import { premiumPackageHref } from "@/lib/marketing/premium-packages";
import { resolvePostAuthDestination } from "@/lib/auth/session-policy";

const env = process.env as Record<string, string | undefined>;
let failures = 0;
function check(name: string, pass: boolean, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

function registerRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function main() {
  // ---- PHASE A: route handler HTTP contract (file store / dev) ----
  const email = `api+${Date.now()}@ortaq.test`;
  const okRes = await POST(registerRequest({ email, password: "verylongpass123", name: "API", role: "partner" }));
  const okBody = (await okRes.json()) as { ok?: boolean; role?: string };
  check("POST /api/auth/register new → 200 {ok:true}", okRes.status === 200 && okBody.ok === true, `status=${okRes.status}`);

  const dupRes = await POST(registerRequest({ email, password: "verylongpass123" }));
  check("POST duplicate email → 409", dupRes.status === 409, `status=${dupRes.status}`);

  const weakRes = await POST(registerRequest({ email: `api2+${Date.now()}@ortaq.test`, password: "123" }));
  check("POST weak password → 400", weakRes.status === 400, `status=${weakRes.status}`);

  // ---- PHASE B: persistence unavailable → 503 (no fake success) ----
  env.NODE_ENV = "production";
  delete env.DATABASE_URL;
  const downRes = await POST(registerRequest({ email: `api3+${Date.now()}@ortaq.test`, password: "verylongpass123" }));
  check("POST when persistence unavailable → 503", downRes.status === 503, `status=${downRes.status}`);
  env.NODE_ENV = "development";

  // ---- PHASE C: premium auth-continuation routing (pure helpers) ----
  const partnerNext = premiumPackageHref("partner");
  check("premium partner deep-link", partnerNext === "/guven-kalite?paket=partner#premium-detail", partnerNext);
  check(
    "login gate preserves premium destination",
    loginHref(partnerNext) === `/giris?next=${encodeURIComponent(partnerNext)}`
  );
  check(
    "owner premium → register gate carries dossier intent",
    createDossierEntryHref(false) === registerPathChoiceHref("/panel/dosya-olustur")
  );
  check("sanitize preserves premium query+hash", sanitizeNextPath(partnerNext) === partnerNext);
  check(
    "onboarded user returns to intended premium destination",
    resolvePostAuthDestination({ role: "partner", sideSelected: true, onboardingCompleted: true }, partnerNext) ===
      partnerNext
  );
  check(
    "new user chains premium destination through onboarding",
    resolvePostAuthDestination({ role: "partner", sideSelected: true, onboardingCompleted: false }, partnerNext) ===
      `/onboarding/ortak?next=${encodeURIComponent(partnerNext)}`
  );
  check("open-redirect (//) blocked", sanitizeNextPath("//evil.example.com") === "/panel");
  check("open-redirect (scheme) blocked", sanitizeNextPath("https://evil.example.com") === "/panel");

  console.log(`\n${failures === 0 ? "ALL API + CONTINUATION CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("SMOKE ERROR:", error);
  process.exit(1);
});
