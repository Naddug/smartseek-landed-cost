# ORTAQ Web — Agent Handoff

Transfer document for continuing work in Claude (or another agent).  
**Primary app:** `ortaq-web/` (Next.js 15, App Router, TypeScript, Tailwind v4, i18next).

---

## What this project is

**ORTAQ** — Turkish equity crowdfunding discovery platform (pre-transaction).  
Positioning: **premium industrial evaluation layer** for Turkish production SMEs — not generic fintech, not cinematic marketing.

Live (may lag local): https://ortaq-web.vercel.app  
Local dev: `npm run dev` → http://localhost:3001

---

## Current state (May 2026)

### Done — product pivot

**Homepage** (`components/views/HomePageView.tsx`):
- Product-first layout: hero, platform stats strip, company cards, sectors, trust, activity log, process, CTA
- Components in `components/product/`
- No cinematic layers, no “Katman” / mystery copy

**Company dossier** (`/sirket/[slug]`):
- Full modular dossier in `components/dossier/`
- Operational evaluation UI: snapshot, production, facility, machines, export, customers, field log, growth, risks, review, documents
- Sticky section nav on mobile
- Sample data: `lib/campaigns/karat-parca-konya.ts`

**Shared utilities:**
- `lib/product/` — homepage card data, company summary helpers
- `lib/dossier/nav.ts` — dossier section IDs for anchor nav
- `locales/tr.json` + `locales/en.json` — keys under `homeProduct.*` and `dossier.*`

### Legacy (still in repo, not wired to homepage)

Old cinematic home components remain in `components/home/` (HeroSection, HomeNetworkEntry, ImmersiveImage, etc.). Safe to delete after confirming nothing imports them.

Duplicate tree: `components/components/` — legacy parity folder, likely dead weight.

### Not done / next steps

1. Deploy latest to Vercel production (`main` branch, root dir = `ortaq-web`)
2. Simplify `/degerlendirme` (evaluation criteria) to match dossier tone
3. Remove unused cinematic components
4. Connect domain `ortaq.biz` on Vercel
5. `ortaq-api/` exists but CI skipped until lockfile tracked

---

## Run locally

```bash
cd ortaq-web
npm install
npm run dev          # http://localhost:3001
npm run build        # production check
```

No `.env` required for static MVP. See `.env.example` if adding analytics.

---

## Deploy (Vercel)

- Project: `ortaq-web` (root directory in Vercel = `ortaq-web`)
- GitHub repo: `Naddug/smartseek-landed-cost` (verify remote)
- Build skip: `scripts/vercel-should-build.sh`
- Docs: `DEPLOY.md`

Manual deploy:
```bash
cd ortaq-web
npx vercel deploy --prod
```

---

## Key file map

| Area | Path |
|------|------|
| Homepage | `components/views/HomePageView.tsx` |
| Product sections | `components/product/*` |
| Company dossier | `components/views/CampaignDetailView.tsx` |
| Dossier modules | `components/dossier/*` |
| Campaign data | `lib/campaigns/karat-parca-konya.ts`, `types.ts` |
| Ops signals | `lib/operations/pulse.ts` |
| Design tokens | `design/typography.ts`, `app/globals.css` |
| i18n | `locales/tr.json`, `locales/en.json` |
| Media registry | `lib/media.ts`, `public/media/*.jpg` |

---

## Design principles (do not regress)

- **Product clarity** over cinematic aesthetics
- **Honest metrics** — review counts, not fake investor numbers
- **Operational language** — inspection, saha, doğrulama, dosya
- **Turkish industrial realism** — manufacturing, logistics, export
- **Dense but readable** — B2B financial product patterns (PitchBook / Carta quality bar)
- **Mobile-first** — sticky nav, compact cards, horizontal scroll where needed

### Avoid

- Full-bleed cinematic heroes, dark gradient overlays
- “Hidden network”, Katman, perde arkası copy
- Fake urgency, fake social proof, crypto energy
- Generic crowdfunding clone UI

---

## Adding a new company dossier

1. Create `lib/campaigns/your-company.ts` matching `SimulatedCampaign` type (include `marketMix`, `operationalFriction`)
2. Register in `lib/campaigns/index.ts`
3. Optional: map photo in `lib/product/company-summary.ts` → `campaignMedia`
4. Add TR/EN copy if new sector-specific labels needed

---

## Commands

```bash
npm run dev
npm run build
npm run lint
node scripts/validate-production.mjs   # if present
```

---

## Archive note

If you received `ortaq-web-handoff.tar.gz`, extract and run `npm install` inside `ortaq-web/`.  
Archive excludes `node_modules`, `.next`, `.vercel` for size.
