# Evaluation — Iteration 001  (mode: fetch — Playwright lib not installed; preview server + curl DOM checks + computed source analysis. Functionality capped at 7 per rubric ladder.)

## Gate results

From `gate-results-001.json` (verdict: PASS, 0 critical / 0 high):

| Gate | Status | Detail |
|---|---|---|
| animation-properties | PASS | compositor-only ✓ |
| reduced-motion | PASS | fallback present ✓ |
| semantic-html | PASS | div=44, semantic=25 (limit 125) |
| json-ld | PASS | ContactPage, BreadcrumbList, FAQPage, HVACBusiness, Service |
| aeo-files | PASS | llms.txt + robots.txt + sitemap ✓ |
| robots-ai-allowlist | PASS | AI crawler section ✓ |
| img-alt | SKIP | 0/0 imgs |
| bundle-size | PASS | 63kb gz JS (budget 80kb) |
| focus-visible | PASS | ✓ |

Evaluator notes on gate coverage: the mechanical run did **not** include axe, CWV (Lighthouse), or a forms end-to-end gate — three of the rubric's Layer-1 rows have no entry in gate-results-001.json. My own contrast computation found an AA failure the gate missed (Critical #1 below). Anti-template spot-check: 9 of 10 design qualities present (scale contrast, spacing rhythm, depth/grain/horizon layering, real type pairing, semantic color, designed hover/focus states, staircase grid-breaking composition, texture, clarifying motion) — comfortably past the ≥4 floor.

Verified independently in fetch mode: all routes 200 (`/`, `/services`, `/contact`, trailing-slash variants, robots/llms/sitemap); build output present; JS 63.0kb gz / CSS 6.5kb gz (inside 80/30 budgets); all JSON-LD parses; OG PNGs exist at 1200×630.

## Scores

| Axis | Score | Weight | Weighted |
|---|---|---|---|
| Design quality | 8 | .20 | 1.60 |
| Brand & voice fidelity | 9 | .15 | 1.35 |
| Craft | 7 | .15 | 1.05 |
| CRO readiness | 8 | .15 | 1.20 |
| SEO/AEO/GEO readiness | 8.5 | .15 | 1.28 |
| Functionality | 6.5 | .10 | 0.65 |
| A11y + performance | 6 | .10 | 0.60 |
| **TOTAL** | | | **7.7 / 10** |

## Verdict: FAIL (weighted 7.7 ≥ 7.5, but 1 CRITICAL — zero-CRITICAL rule)

Axis rationale (compressed):

- **Design 8** — "Desert Editorial Warmth" is executed with conviction in the code: paper/ink/heat tokens verbatim, Fraunces + Nunito Sans + DM Mono all live with optical sizing, mono trust-chassis eyebrows with heat ticks, 0.04-opacity SVG grain, heat-horizon drift (transform-only, 26s), and a section rhythm that actually varies — full-bleed pledge band → asymmetric 7fr/5fr grids → staircase services trio (nth-child offsets kill the uniform-card cliché) → ink-inverted finale band. Hover states are designed (card lift + pre-rendered ::after shadow faded via opacity; underline-color swaps; button L-shift + 1px lift). Held at 8: fetch mode means no pixel verification of grain/horizon/type rendering, the header and huge nowrap contact phone are untested at 320px, and the heat step-number choice (Critical #1) dents the polish.
- **Brand & voice 9** — Deck copy ported near-verbatim everywhere I diffed (hero, pledge, area, all 14 FAQs, form microcopy, CTA bands). "We'll shoot you straight" exactly once per page where the decks place it. Every banned-list item honored: no blue, no gradient blob, no stock people, no carousels, no popups, no prices, no 24/7, no discounts, no fake urgency, no white-on-persimmon (ink labels enforced in CTABand), no uniform grid. ROC #329417 in hero eyebrow (above fold), trust strip, FAQ answer, compliance lines, footer, contact blocks, schema `hasCredential`, llms.txt. Reviews placeholder policy followed exactly (neutral 4th trust item; no invented numbers anywhere). Docked once: the NAP — the single most compliance-loaded line on the site — renders malformed (Major #1).
- **Craft 7** — Single-source site.ts, one Nap component (all 4 instances hash-identical — verified), hand-rolled accessible accordion to dodge the banned height animation, deviations documented in build-log with reasons, clean commit history, hidden-tab and hydration-failure resilience thought through. But a professional team does not ship a visible typo in the address line on every page, nor Astro's default "404: Not Found" when the deck specifies the 404 tone line.
- **CRO 8** — Home hits the call goal per playbook: phone as text in header + hero primary CTA + microline + sticky mobile bar (tel:, safe-area, one action) + pledge-aside call button + final band; proof adjacent to every ask (trust microline directly under hero CTAs; compliance under band CTAs). Services hits the form goal: intro jump link, three verb-first block CTAs → `#quote-form`, 4 fields, hints-not-placeholders, blur validation with how-to-fix copy, tel: fallback adjacent to submit, honeypot not CAPTCHA, success state sets the callback expectation. Contact is call-first with the form second and the PM block at full weight. Docked: no-JS submissions bypass all validation (Major #5), and submit-to-success is unverifiable in fetch mode.
- **SEO/AEO/GEO 8.5** — Metas exactly per decks; canonicals/sitemap slash-consistent; schema map matches SITE.md (Service ×3 with anchor URLs, BreadcrumbList ×2, ContactPage w/ business @id ref, FAQPage mirroring on-page text token-for-token); aggregateRating correctly withheld with documented anti-spam reasoning (justified SITE.md deviation — fictional numbers must not ship); robots AI section, llms.txt + llms-full.txt, answer-first FAQ prose that is genuinely liftable. Docked for the NAP format inconsistency across surfaces (page "AZ85213" vs llms.txt "AZ 85213" vs GBP spec) — that's a local-citation consistency hit.
- **Functionality 6.5 (cap 7)** — Static verification only: routes, anchors, island props, form logic all read correct; POST fails gracefully in preview (error alert + tel fallback). Missing custom 404 is a real functional gap (default page: no brand, no nav, no phone). Interactivity (accordion, validation, entrance) not witnessed in a browser — capped.
- **A11y+perf 6** — Floor is strong: skip link, global :focus-visible, labeled fields with aria-describedby/aria-invalid swaps, role=alert / role=status with focus management, accordion aria pattern, comprehensive reduced-motion, honeypot correctly hidden from AT, zero img/alt debt. But one measured AA contrast failure (Critical #1), a borderline hover pair (Major #6), an eagerly-loaded 57kb React runtime on two pages that don't need it above the fold (Major #3), and an LCP element gated behind hydration with a 1.6s CSS fallback, never measured (Major #4).

## Critical (must fix)

1. **Contrast AA failure — step numbers on /services.** `.steps li::before` renders "01/02/03" as 15px DM Mono text in `--color-heat` (#E85D3F) on `--color-surface` (#F0EEE9) = **2.98:1**. That fails the 4.5:1 requirement for body-size text and is under the 3:1 large-text floor — axe would flag it serious; the rubric's accessibility gate is zero-tolerance. → Fix in `src/styles/global.css` (`.steps li::before`, ~line 747): change `color: var(--color-heat)` to `color: var(--color-ink)` (15.6:1), or introduce a text-safe heat variant, e.g. `--color-heat-text: oklch(50% 0.17 33.8)` (≈5.5:1 on surface) if the numbers must stay warm. One line; re-run contrast check after.

## Major (should fix)

1. **NAP renders "Mesa, AZ85213" on every page** (footer ×3 + /contact service-area block). Cause: `src/components/Nap.astro` lines 12–13 — `{site.address.state}` and `{site.address.zip}` are separated only by a newline, which Astro collapses to nothing. The deck mandates `…, Mesa, AZ 85213` byte-identical to GBP, and `dist/llms.txt` already prints the correct "AZ 85213", so the site currently publishes two different NAP strings. → Put state and zip on one line with an explicit space: `{site.address.state} {site.address.zip}` won't survive formatting — use `{`${site.address.state} ${site.address.zip}`}` or `{site.address.state}&#32;{site.address.zip}`. Verify with `grep -o 'Mesa, AZ 85213' dist/**/*.html` (expect 4).
2. **No custom 404.** `/nonexistent` serves Astro's default "404: Not Found" (and on Netlify would fall to the host default) — no wordmark, no nav, no phone. The home deck specifies the utility tone: "Wrong turn. The AC help is this way →". → Add `src/pages/404.astro` using `Base` (title "Page not found | Desert Aire Heating & Cooling"), the deck line linking Home, and a `Call {site.phone_display}` tel: link; sticky bar comes free from the layout.
3. **FAQ island is `client:load` on /services and /contact**, where it is the only island — so the full 57.2kb-gz React runtime loads eagerly on pages whose above-fold content is pure static Astro. The build-log rationale ("react-dom is already on the wire for the hero") is only true on Home; the hidden-tab concern doesn't apply to real users (the SSR accordion HTML is fully visible while inert, and IO fires on first tab foreground). → In `src/components/FaqSection.astro` accept a `client` strategy or split: keep `client:load` on Home, use `client:visible` on /services and /contact. Expect main-thread and LCP-path relief on the two conversion pages.
4. **Hero LCP is hydration-gated and unmeasured.** The H1 (LCP element) ships SSR-hidden (`opacity:0`) and becomes visible only after React hydration animates it, or after the `he-reveal-fallback` CSS net at **1.6s + 0.6s fade**. No Lighthouse run exists in gate results, and the CWV gate row (LCP <2.5s mobile) is unverified. → Run Lighthouse mobile against the preview build. If LCP >2.5s: drive the entrance with pure CSS keyframes gated on `html.js` (no hydration dependency; delays ≤150ms), or SSR the hero visible and animate transform-only from a slight offset.
5. **`novalidate` is server-rendered on the quote form** (`src/components/QuoteForm.astro` line 45), so no-JS users lose native `required` validation entirely and can POST empty leads to Netlify. → Remove the attribute from the markup and set it in the script instead (`form.setAttribute("novalidate", "")` before wiring listeners) — classic progressive enhancement; JS users keep the custom inline validation, no-JS users get the browser's.
6. **Primary button hover contrast is on the wrong side of the line.** `--color-heat-hover: oklch(62% 0.179 33.8)` computes to ≈#DC5234 → ink label ≈ **4.35:1** at 17px/800 (needs 4.5:1; the global.css comment claims ≥4.5). → Nudge hover to `oklch(63.2% …)` and re-verify ≥4.5:1, or keep the base fill on hover and let the existing 1px translate + shadow carry the state.

## Minor (nice to fix)

1. `CTABand.astro` sets `aria-label={heading}` on the `<section>` while the same text is the visible `<h2>` — use `aria-labelledby` pointing at an id on the h2 (also `.cta-band` h2 lacks an id today). Same pattern worth adopting for the trust strip if you ever add a heading.
2. Header at 320px is tight: wordmark (1.4rem) + mono phone link (nowrap) + 2.5rem hamburger + gaps ≈ full width. Verify no wrap/overflow at 320/360; if it clips, hide `.header-phone` below ~22.5rem — the sticky call bar already owns the call action there.
3. `.call-phone` on /contact is `white-space: nowrap` at a 2.4rem floor — "(480) 555-0137" is ~14 glyphs of Fraunces; verify it fits inside `.wrap` padding at 320px, else allow wrap or drop the floor to 2.1rem.
4. The contact deck's "Primary CTA (mobile duplicate of the big number)" renders at all breakpoints, so desktop shows the huge tel link and a button in the same band. Harmless; scope `.call-cta` to `max-width: 47.99rem` if you want the deck read literally.
5. Sitemap entries lack `lastmod` — cheap freshness signal for a 3-page site (`@astrojs/sitemap` `serialize` option).
6. `og:image:alt` is the same home-framed string on all pages ("same-day AC repair in Mesa, AZ"); pass a per-page alt through `Base` alongside `ogImage`.

## Improved since last iteration

n/a — first iteration.

## Regressed since last iteration

n/a — first iteration.

## Next-iteration priorities (top 3, concrete)

1. **Clear the Critical**: recolor `.steps li::before` (one line in global.css), then re-verify every heat-as-text usage ≥4.5:1 and file the hover-token nudge (Major #6) in the same pass.
2. **Fix the two trust-surface defects**: Nap.astro state/zip whitespace (Major #1) and a branded 404.astro (Major #2). Both are minutes of work and are the difference between "AI built this" and "an agency shipped this."
3. **Prove the performance story**: switch FAQ islands to `client:visible` off-Home (Major #3), then run Lighthouse mobile and record LCP/INP/CLS in the next gate results — the hero's hydration-gated LCP (Major #4) is currently an untested assumption; make it a number.
