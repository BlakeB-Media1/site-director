# Design System — Desert Aire Heating & Cooling

Direction: Desert Editorial Warmth (see DIRECTION.md). Light theme only.
Palette: Cloud Dancer Reset warmed (reference-pack color-2026 #1 + Clay from
#4). All interactive contrast pairs verified in the pack.

## Tokens (styles/tokens.css — single source of truth)

```css
:root {
  /* color — OKLCH with hex fallback comments */
  --color-bg:        oklch(96.6% 0.008 73.7);   /* #F7F3EE paper */
  --color-surface:   oklch(94.9% 0.007 88.6);   /* #F0EEE9 */
  --color-ink:       oklch(22.2% 0.006 91.6);   /* #1C1B18 — 15.6:1 on bg AAA */
  --color-ink-soft:  oklch(40% 0.008 85);       /* muted body/captions ≥7:1 */
  --color-heat:      oklch(65.3% 0.179 33.8);   /* #E85D3F persimmon — large/UI fills only, NEVER white text on it */
  --color-clay:      oklch(62% 0.122 40.3);     /* #C36A4A support accent */
  --color-success:   oklch(52.9% 0.106 154.6);  /* #2E7D4F 4.6:1 */
  --color-error:     oklch(50% 0.182 29.5);     /* #B42318 6.0:1 */

  /* type — Fraunces display / Nunito Sans body / DM Mono eyebrows (Google Fonts, swap, subset) */
  --font-display: "Fraunces", ui-serif, Georgia, serif;
  --font-body: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, monospace;
  --text-hero:    clamp(2.6rem, 1.2rem + 5.5vw, 5.5rem);   /* Fraunces opsz high */
  --text-h2:      clamp(1.9rem, 1.2rem + 2.2vw, 3rem);
  --text-h3:      clamp(1.3rem, 1.1rem + 0.8vw, 1.7rem);
  --text-base:    clamp(1rem, 0.95rem + 0.3vw, 1.125rem);  /* body ≥16px, lh 1.6 */
  --text-eyebrow: 0.8125rem;                               /* mono, uppercase, tracking 0.08em */

  /* space & shape */
  --space-section: clamp(4.5rem, 3rem + 6vw, 9rem);
  --space-block:   clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --radius-sm: 6px;  --radius-md: 12px;
  --shadow-soft: 0 1px 2px oklch(22% 0.006 91 / 0.06), 0 8px 24px oklch(22% 0.006 91 / 0.07);

  /* motion */
  --duration-fast: 150ms; --duration-normal: 320ms; --duration-slow: 700ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Rules

- CTA fills: `--color-heat` with **ink labels** (white-on-persimmon fails at
  3.0:1). Hover = L-shift (darken ~6%), not opacity.
- Eyebrow pattern (mono, uppercase): trust chassis lines like
  `SAME-DAY · MESA, AZ · ROC #329417` — opens hero and each section.
- Paper grain: one subtle SVG-noise overlay on bg (opacity ≤0.04) — the
  signature texture; never on text containers.
- Heat-horizon accent: soft radial persimmon→clay gradient band, hero bottom
  edge only; slow CSS drift (transform), reduced-motion: static.
- Section rhythm varies (editorial): full-bleed band → contained 2-col →
  offset asymmetric — never three identical card grids in a row.

## Components

Header (wordmark type-only + nav + phone text link) · StickyCallBar (mobile,
tel:, safe-area) · Hero (eyebrow → Fraunces H1 → proof line → dual CTA) ·
TrustStrip (rating + count + ROC + same-day, above fold) · ServiceBlock
(h3 + copy + candor line + link) · PledgeBand (repair-first, full-bleed
surface) · QuoteForm (name, phone, service select, note optional; inline
validation; success promise line; tel: fallback adjacent) · FAQ (accordion,
answer-first, FAQPage schema) · AreaList (4 cities, NAP-consistent) ·
CTABand (final, heat fill, ink label) · Footer (NAP + ROC + hours + links).

Registry budget: ≤1 showpiece/page — candidate: subtle animated hero
background from catalog IF it survives the 80kb Astro budget; otherwise CSS
gradient drift (preferred). Structural pulls (accordion) free.

## Motion spec

Hero entrance: eyebrow fade → H1 rise (24px, expo) → proof line → CTAs,
total ≤900ms, once. Scroll reveals: opacity+y(24px), stagger 80ms,
`once: true`, margin -80px. Accordion: height via grid-template-rows trick
or clip-path (NOT height animation — gate bans it). All Motion islands
`client:visible`; CSS-first for static sections. `prefers-reduced-motion`:
everything instant.
