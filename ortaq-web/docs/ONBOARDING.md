# ORTAQ Onboarding — Trust Psychology

Mobile-first, fear-reducing flow for Turkish retail users.

## Principles

- **Slow enough to trust** — 6 steps, no skip, no progress bar
- **No conversion pressure** — no signup, no payment, exit always visible
- **Fear targets addressed explicitly** — scams, money path, complexity, hidden terms
- **SPK-safe** — regulatory facts, no promises, pending states labeled

## Flow (6 steps)

```
┌─────────────────────────────────────┐
│ Banner: Kayıt yok. Ödeme yok.       │
├─────────────────────────────────────┤
│ 1. safety   — Bu sayfa ne için?     │
│ 2. about    — ORTAQ ne, ne değil?    │
│ 3. money    — Paranız nereye gider? │  ← "where is my money?"
│ 4. risk     — Riskler + onay kutusu │
│ 5. process  — Sırada ne var?        │
│ 6. wait     — Henüz işlem yok       │  ← empty / waiting state
└─────────────────────────────────────┘
```

## Trust communication layers

| Layer | Where | Purpose |
|-------|--------|---------|
| Banner | Top strip | No signup/payment, can leave |
| Status badge | Each page | illustrative / pending |
| ReassuranceNote | Footer, money step | Plain context, not CTA |
| TrustCommunicationLayer | Waiting step | Partner status honest |
| EmptyStateBlock | Step 6 | No fake "loading" or redirect |

## Component map

```
components/onboarding/
  OnboardingShell.tsx      — layout, banner, footer note
  OnboardingProgress.tsx   — text "2 / 6" only
  SafetyFramingStep.tsx
  AboutStep.tsx
  MoneyPathStep.tsx        — money reassurance UX
  RiskEducationStep.tsx    — gate + link to /riskler
  ProcessOverviewStep.tsx
  WaitingStep.tsx          — delay + empty state + what you can do
  EmptyStateBlock.tsx
  ReassuranceNote.tsx
  TrustCommunicationLayer.tsx

lib/onboarding/flow.ts     — step order + helpers
```

## What we avoid

- Progress bars, confetti, streaks, "almost there"
- Disabled platform button as primary CTA (removed)
- Forced forward without risk checkbox
- Dashboard preview or portfolio tease

## Entry points

- `/basla` — direct
- Homepage CTA — quiet text link only: "İlk kez mi? Önce okuyun."

## Future (when platform live)

Step 6 becomes **verification intro** (e-Devlet mention, external redirect to licensed platform). Keep same calm shell; add explicit "You are leaving ORTAQ" note before redirect.
