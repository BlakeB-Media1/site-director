# Quality Report — Desert Aire Heating & Cooling (dry run)
2026-07-15 · site-director v1.0.0 · Recipe B (Astro) · local-service preset · lite research budget

## Verdict: PASS — 8.4 / 10 weighted, 0 CRITICAL (iteration 2 of ≤3)

| Axis | Iter 1 | Iter 2 |
|---|---|---|
| Design quality (.20) | 8 | 8.5 |
| Brand & voice fidelity (.15) | 9 | 9 |
| Craft (.15) | — | 8.5 |
| CRO readiness (.15) | — | 9 |
| SEO/AEO/GEO (.15) | 8.5 | 8.5 |
| Functionality (.10) | — | 7 (fetch-mode cap) |
| A11y + performance (.10) | — | 7.5 |
| **Weighted** | **7.7 FAIL (1 critical)** | **8.4 PASS** |

## Mechanical gates (gate-results-002.json): all PASS
animation-properties ✓ · reduced-motion ✓ · semantic-html (44 div / 25 semantic) ✓ ·
json-ld (10/10 blocks parse, correct types) ✓ · aeo-files (llms.txt + robots + sitemap) ✓ ·
robots AI allowlist (9 UAs) ✓ · bundle 63.1kb gz JS (budget 80) ✓ · focus-visible ✓ ·
img-alt (no imgs — typographic design) —

## QA loop history
- Seeded gate-validation violation (transition: height) → caught at exact line → removed. ✓ gates fire.
- Iter 1 (7.7, FAIL): evaluator's independent contrast math caught heat-on-surface step numerals at 2.98:1 — a class of failure the mechanical gate can't see. + 5 majors.
- Iter 2 (8.4, PASS): all six fixed with computed verification (2.98→14.84:1; NAP byte-identical ×5 incl. llms-full.txt; branded 404; client:idle islands; native no-JS validation restored; hover 4.56:1). Fresh evaluator scored blind, verified all fixes independently.

## What shipped
4 pages (/, /services, /contact, 404) · Desert Editorial Warmth direction (Fraunces + Nunito Sans + DM Mono, Cloud-Dancer warm paper + persimmon heat accent, paper grain) · dual-journey conversion armature (sticky mobile call bar + 4-field quote form w/ honeypot, tel: fallback, deck-exact validation copy) · deck-verbatim copy, voice-checked, zero prices, zero invented stats · ROC #329417 in eyebrow/trust strip/footer/schema · JSON-LD: HVACBusiness (geo/hours/areaServed/hasCredential) + Service×3 + FAQPage×3 + BreadcrumbList + ContactPage · llms.txt + llms-full.txt (build-generated) · robots.txt AI-crawler allowlist · security _headers · typographic OG cards ×3 · sitemap · git history: 11 clean commits.

## Degradations (logged per skill rules)
- QA ran fetch-mode (this environment's browser pane renders no frames; Playwright browsers not installed) — Functionality capped at 7 by rubric; visual pixel sweep deferred to the operator's review.
- Islands client:load/client:idle instead of client:visible (hidden-pane hydration; also better for testability — client:idle is the keeper).
- AggregateRating + review counts withheld everywhere: brief's 312/4.9 is fictional and never rendered — schema honesty rule. One-line re-add documented in schema.ts when real GBP data exists.

## Open items (for the operator's review / post-deploy)
1. CWV: Lighthouse mobile run post-deploy (hero LCP hydration-gated — likely fine at 63kb, unmeasured here).
2. FAQ no-JS floor: answers collapse to 0fr without JS — add noscript/`:target` fallback (one commit).
3. Trailing-slash 301 hops on internal links vs canonicals (one-commit tidy).
4. sameAs/GBP link empty; real reviews → re-enable AggregateRating + proof-strip counts.
5. Real client swap: replace fictional NAP/license/domain in src/data/site.ts; rich-results + header validation post-deploy.

## Deploy (NOT executed — user runs after review)
`netlify deploy --prod` from project root (dist/), or connect repo in Netlify UI. _headers ships CSP/HSTS set. Netlify form detection: quote form uses data-netlify pattern — enable form notifications to client email.

## Research spend
~17–22 firecrawl credits (competitors ~11, trends ~6, keywords ~0–5, personas 0) — under the lite budget (25–40).

## AI upsell hooks (agency)
Missed-call texting on the tel: line · AI receptionist demo (call answering after hours — site promises callback "when we open at {OPEN_TIME}") · review-request automation (site is proof-hungry: real GBP reviews unlock the proof strip + AggregateRating) · seasonal landing pages (monsoon/heat) · GA4 + call-tracking dashboard (analytics: none — measurement upsell).

## Review checklist (the operator's ONE final review)
1. Open the preview (`npm run preview` in the project dir) — walk /, /services, /contact, /404 on desktop + phone width.
2. Judge the direction: does Desert Editorial Warmth land? (DIRECTION.md explains every choice.)
3. Read the hero + pledge copy out loud — is the voice right?
4. Tap-test: sticky call bar, tel: links, quote form validation + success state.
5. Skim feedback-002.md (what the evaluator still wants) + open items above.
6. Deploy or request changes.
