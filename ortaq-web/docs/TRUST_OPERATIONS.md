# ORTAQ Trust Operations

Operational backbone for fraud prevention, verification, and accountability — designed **before scale**.

**Principle:** Trust comes from visible process, documented evidence, and human escalation — not badges or marketing language.

---

## 1. Threat model

Assume bad actors will:

- Submit fake companies or altered registry documents
- Use straw founders or stolen identities
- Astroturf interest (“50 people viewing”, fake waitlists)
- Coordinate small investments to simulate momentum
- Misstate financials or hide related-party transactions
- Abuse support channels to harass or extract refunds
- Exploit trust UI with “verified” theater

**Response:** Separate internal ops states from public labels. Append-only audit. No public metric without partner attestation.

---

## 2. Verification architecture

### 2.1 Company verification

| Check | Source | Required before committee |
|-------|--------|---------------------------|
| MERSİS registry match | Trade registry API / manual | Yes |
| Trade registry gazette | TTSG | Yes |
| Tax status | GİB / issuer declaration | Yes |
| Beneficial ownership | Declaration + cross-check | Yes |
| Sanctions screening | List provider | Yes |
| Litigation search | Manual / provider | Recommended |
| Site visit / field call | Ops notes | Recommended |
| Bank account verification | Partner / bank letter | Before live |

**States:** `draft → submitted → intake_review → document_check → field_verification → committee_review → partner_review → approved | rejected | suspended`

See `ortaq-shared/src/trust/verification-states.ts` for allowed transitions (no skipping steps).

### 2.2 Founder verification

- Identity via **e-Devlet** or notarized ID (never store raw TCKN in public API)
- PEP and sanctions screening
- Role verification (founder / director / signatory)
- Optional interview recorded in audit log

### 2.3 Document verification

Each document: SHA-256 hash, version chain, reviewer notes.

**Required pack before committee:**

- Memorandum (izahname)
- Financial statements (period per disclosure standard)
- Use of funds plan (must sum to 100%)
- Signed risk disclosure

Investor-visible only after approval + legal sign-off.

### 2.4 Financial disclosure standards

- State assurance level honestly: audited / reviewed / management only / not provided
- Projections labeled **tahmin** — never presented as realized revenue
- Related-party transactions mandatory
- Round size > 3× revenue triggers extra review (`DISCLOSURE_RULES`)

---

## 3. Campaign approval workflow

Eight gates (all required unless waived with senior ops + audit):

1. Company verification  
2. Founder verification  
3. Document pack complete  
4. Financial disclosure review  
5. Investment committee (finance / field / legal votes)  
6. Legal review  
7. Licensed platform approval (SPK partner)  
8. Final risk disclosure  

**Live rule:** `investorReady = true` only when all gates passed AND partner approved.

Material facts locked after approval — changes require re-review.

---

## 4. Fraud detection & manipulation prevention

| Signal | Default action |
|--------|----------------|
| Investment velocity (device) | Block + flag after 3/24h |
| Coordinated same-amount investments | Flag for review |
| Referral ring (5+ same hour) | Flag |
| Registry / document mismatch | Pause campaign |
| Complaint cluster (3+ / 7d same campaign) | Escalate L2 |

**Fake momentum — disabled by default:**

- No live viewer counts
- No “% funded” without partner feed
- No testimonials without verified investment + moderation
- No public waitlist counts

Implementation: `ortaq-api/src/services/fraud-service.ts`

---

## 5. Escalation & support

| Tier | SLA | Handles |
|------|-----|---------|
| L1 Support | 48h | General inquiries |
| L2 Trust Ops | 24h | Verification disputes, complaint clusters |
| L3 Compliance | 8h | Fraud confirmed, regulatory keywords |
| L4 Executive | 4h | Media inquiries |
| L5 Regulator | 1h | SPK / formal regulatory contact |

Complaints receive public reference: `ORTAQ-2026-00001`  
API: `POST /v1/complaints`, `GET /v1/complaints/:publicRef`

Auto-escalation rules in `ortaq-shared/src/trust/escalation.ts`

---

## 6. Crisis communication

Pre-written templates (legal-reviewed), append-only:

- Campaign suspended
- Partner outage
- Data incident
- Fraud confirmed

**Never delete prior statements.** Spokesperson role assigned by severity.

---

## 7. Investor complaints & trust recovery

**Complaint categories:** misleading information, document missing, identity theft, harassment, technical, other.

**Recovery actions after confirmed failure:**

- Public post-mortem
- Process change documented on transparency feed
- Affected user notification
- Extended review period
- Third-party audit (material cases)

---

## 8. Moderation

Targets: campaign copy, company claims, user reports, (future) comments.

Actions: approve, reject, request edit, hide, escalate fraud.

Every action → audit event with moderator ID.

UGC disabled until moderation queue live.

---

## 9. Public transparency architecture

**Public API (read-only):**

| Endpoint | Content |
|----------|---------|
| `GET /v1/trust/platform` | Partner status, honest stats, manipulation flags |
| `GET /v1/trust/transparency` | Accountability feed |
| `GET /v1/trust/campaigns` | Verification summaries |
| `GET /v1/campaigns/:slug` | Per-campaign gate progress |

**Never public:** internal notes, reviewer names, fraud signal details, full audit log.

---

## 10. Admin / ops (internal)

Protected by `ADMIN_API_KEY` header.

| Endpoint | Purpose |
|----------|---------|
| `GET /admin/queue` | Ops dashboard summary |
| `GET /admin/audit` | Recent audit events |
| `GET /admin/fraud/signals` | Open fraud queue |
| `POST /admin/fraud/signals/:id/resolve` | Resolve signal |
| `POST /admin/verification/transition` | Enforced state machine |

**Phase 2:** Postgres + reviewer UI at `(app)/panel` (not public).

---

## 11. Audit trail

Append-only. Event types include:

- Verification state changes  
- Document upload/reject  
- Gate pass/waive  
- Committee decisions  
- Fraud signals  
- Escalations  
- Moderation actions  
- Partner webhooks  
- Consent records  

Schema: `ortaq-api/db/schema.sql`

---

## 12. Public vs internal labels

| Internal state | Public label (TR) |
|----------------|-------------------|
| draft, submitted | Gönderilmedi |
| *review states* | İncelemede |
| approved | Onaylandı |
| approved_conditional | Koşullu onay |
| rejected | Uygun bulunmadı |
| suspended_* | Askıya alındı |
| withdrawn_* | Geri çekildi |

Platform labels (`verified`, `illustrative`, `planned`, `pending`) remain for regulatory facts and examples — separate from entity verification.

---

## 13. Build order

1. ✅ Shared domain types (`ortaq-shared`)  
2. ✅ API routes + in-memory store + audit  
3. ✅ Postgres schema  
4. Web components consuming public API  
5. Partner webhooks (SPK platform)  
6. e-Devlet auth + consent persistence  
7. Admin panel + reviewer queue  
8. Object storage for documents  

---

## 14. What we refuse to do

- Display “verified” without completed checks  
- Show funding progress without partner data  
- Hide rejection reasons when material to investors  
- Delete crisis or enforcement records  
- Skip workflow steps via admin override without audit  

---

## Code map

```
ortaq-shared/src/trust/     # Domain types, state machine, rules
ortaq-api/db/schema.sql     # Postgres schema
ortaq-api/src/domain/       # Audit log, dev store
ortaq-api/src/services/     # Verification, fraud
ortaq-api/src/routes/       # Public + admin APIs
ortaq-web/lib/trust/        # Client types + API
ortaq-web/components/trust/ # Public UI components
```
