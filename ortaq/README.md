# ORTAQ.BIZ — Product Architecture

Greenfield ownership platform. Separate from SmartSeek.

## Run

```bash
npm run dev:ortaq    # http://localhost:5174
npm run build:ortaq
```

## Architecture

```
ortaq/src/
├── design/
│   ├── tokens.ts       # Colors, space, type, radius, shadow
│   └── typography.ts   # Composable type classes
├── lib/
│   ├── i18n.ts         # TR default, EN secondary
│   ├── media.ts        # Documentary stock placeholders
│   └── cn.ts
├── components/
│   ├── brand/Logo.tsx
│   ├── layout/         # PublicShell, header, footer, trust strip, mobile CTA
│   ├── trust/          # LicenseBadge, ClaimRow, StatusBadge, ProcessTimeline, ...
│   ├── media/          # DocumentaryImage
│   ├── home/           # HeroSection, CampaignTemplateSection, CtaSection
│   └── ui/             # Button, Section, Card (ProseBlock)
├── locales/tr.json | en.json
└── pages/
    HomePage, TrustPage, RiskPage, CompanyDetailPage, OnboardingPage, LegalPage, NotFoundPage
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (6 sections, trust-first) |
| `/guven` | Trust model + committee roles (no fake names) |
| `/riskler` | Full risk and limits |
| `/sirket/ornek` | Illustrative campaign page (no invented company) |
| `/basla` | Onboarding shell (education gates, no auth) |
| `/gizlilik` | Privacy (stub, honest) |
| `/kullanim` | Terms (stub, honest) |

## Homepage (mobile-first)

```
Header → Hero + TrustStrip → ProcessTimeline → RiskDisclosure
→ CampaignTemplateSection → TrustDepthSection → CtaSection → Footer
MobileStickyCta (homepage only)
```

## Design system

- **2 CTAs:** primary (terracotta), secondary (outline)
- **Trust status:** verified | illustrative | planned | pending
- **Space:** 4px grid via `design/tokens.ts`
- **Type:** Fraunces + DM Sans, calm line heights on mobile
- **Imagery:** local documentary stock via `DocumentaryImage` (not campaign photos)

## Trust rules

- `StatusBadge` on every trust claim
- `LicenseBadge` never claims active license without partner
- No fake committee names, companies, metrics, or dashboard states
- Footer: regulatory strip, support, dispute, entity note

## Next.js migration

See `docs/NEXT_MIGRATION.md`. Sprint A completes on Vite first.
