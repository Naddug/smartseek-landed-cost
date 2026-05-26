# ORTAQ Visual System

Documentary editorial direction for Turkey’s ownership-culture brand.  
**Not** fintech, SaaS, crypto, or startup landing pages.

---

## 1. Photography system

| Role | Subject matter | Treatment |
|------|----------------|-----------|
| **Economy context** | Production, logistics, real workplaces | Full-frame, natural light, no filters |
| **Human scale** | Workers, hands, tools (when licensed) | Medium shot, not stock-smile |
| **Place** | Anatolian industry, warehouses, workshops | Wide environmental, grounded |
| **Never** | Glass towers, crypto charts, handshakes in suits, AI gloss |

**Rules**
- Every photo labeled honestly (`stok görsel`, `örnek`) — never implied as a campaign subject
- Credit line always visible (11px, soft ink)
- No overlays, gradients, duotone, or blur vignettes
- Focal point defined in `lib/media.ts` — crop to activity, not empty ceiling
- Replace stock with commissioned documentary photography as campaigns launch

**Aspect ratios**
- `editorial` — 4:3 mobile → 5:4 desktop (hero, features)
- `panorama` — 16:9 (section breaks, full-bleed mobile)
- `square` — 1:1 (rare; profiles only)

---

## 2. Visual hierarchy

1. **Headline (Fraunces)** — one idea per screen, max 2 lines mobile
2. **Dek (lead)** — muted ink, one sentence context
3. **Body** — readable measure, never wall-of-text
4. **Metadata** — labels, credits, status (smallest, softest)
5. **Action** — ink buttons; terracotta reserved for links and accents

Priority order: **trust → clarity → action**. Never conversion-first visual noise.

---

## 3. Grid rhythm

- **Base grid:** 4px
- **Container:** 64rem (`max-w-6xl`) editorial width; 42rem (`max-w-2xl`) prose width
- **Columns:** 12-col at `lg+`; hero splits 5/7 text/image
- **Gutter:** 16px mobile → 24px tablet → 32px desktop

---

## 4. Editorial composition rules

- **One focal element per section** — image *or* card cluster, not both competing
- **Horizontal rules** (`EditorialRule`) separate chapters, not shadow cards
- **Tone alternation:** default → alt → warm → default (parchment breathing)
- **Cards:** border-only, no elevation; white on alt/warm backgrounds only
- **Numbers:** process steps use large muted numerals (01, 02…) — not icon timelines
- **Whitespace is content** — trust sections get +20% vertical padding vs CTA sections

---

## 5. Mobile image behavior

- Hero/context images **bleed to screen edge** on mobile (`-mx-4`) — documentary spread feel
- Aspect tightens on mobile (4:3) to reduce scroll depth
- `priority` load on above-fold hero only
- Captions stay below image, never overlay
- Sticky mobile bar stays **text-only** — no pulsing buttons

---

## 6. Trust-oriented whitespace

| Section type | Spacing token | Intent |
|--------------|---------------|--------|
| Hero | `breath` | Arrival, calm |
| Trust / process | `default` | Read and understand |
| Risk | `default` + warm tone | Pause, seriousness |
| CTA close | `quiet` | Gentle exit, no pressure |
| Legal | `compact` | Reference density |

Minimum paragraph gap: 12px. Section header to content: 32–40px.

---

## 7. Section pacing (homepage)

```
Hero (breath) → TrustStrip (tight band) → Process (alt) → Risk (warm) →
Template (default) → Trust depth (alt, quiet) → CTA (quiet + rule)
```

Each transition changes background tone or adds a rule — user always knows “where” they are.

---

## 8. Image cropping rules

- **object-position** from media registry (e.g. `center 40%` for production lines)
- Crop to **hands, machines, material** — not blank floors or sky
- Minimum subject fill: 60% of frame
- Never stretch; `object-cover` only
- Wide shots for logistics; tighter for hero intimacy

---

## 9. Typography–image relationships

- Headline and image **never share the same column** on desktop without 40px+ gap
- Captions use `figure-note` — smaller than body, soft ink
- Image sits **after** headline block on mobile; **beside** on desktop hero
- Section kickers (`editorial-kicker`) always precede headlines, never follow images
- Fraunces for titles; DM Sans for everything else — no third font

---

## 10. Real economy storytelling visuals

Visual story arc across pages:

1. **Home** — “This is real industry” (production line photo)
2. **Process** — numbered operational steps, no funnel graphics
3. **Template** — warehouse/logistics (where money goes in the real world)
4. **Trust** — text claims with honest status labels
5. **Onboarding** — no imagery; safety through words and spacing

Future campaign pages: one documentary photo per company, shot on site, captioned with location and date.

---

## Reference tone

Closer to: documentary journalism, Monocle, Turkish institutional annual reports, industrial photo essays.  
Further from: Dribbble fintech, crypto DeFi, AI SaaS gradients.

## Implementation map

| File | Role |
|------|------|
| `app/globals.css` | Tokens + editorial utilities |
| `design/typography.ts` | Composable type classes |
| `lib/media.ts` | Photo registry + focal points |
| `components/media/DocumentaryImage.tsx` | Figure component |
| `components/ui/Section.tsx` | Rhythm + headers |
| `components/ui/EditorialRule.tsx` | Section dividers |
