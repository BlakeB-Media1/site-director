# Evaluation — Iteration 002  (mode: fetch — browser pane renders no frames; preview server on :4324 + curl DOM analysis + computed-source checks + independent contrast math. Functionality capped at 7 per rubric ladder. Fresh evaluator; scored blind before reading feedback-001.)

## Gate results

From `gate-results-002.json` (verdict: PASS, 0 critical / 0 high):

| Gate | Status | Detail |
|---|---|---|
| animation-properties | PASS | compositor-only ✓ |
| reduced-motion | PASS | fallback present ✓ |
| semantic-html | PASS | div=46, semantic=26 (limit 130) |
| json-ld | PASS | ContactPage, BreadcrumbList, FAQPage, HVACBusiness, Service |
| aeo-files | PASS | llms.txt + robots.txt + sitemap ✓ |
| robots-ai-allowlist | PASS | AI crawler section ✓ |
| img-alt | SKIP | 0/0 imgs |
| bundle-size | PASS | 63kb gz JS (budget 80kb, 5 files) |
| focus-visible | PASS | ✓ |

Gate-coverage note (same gap as iteration 1): the mechanical run still has **no axe, no CWV (Lighthouse), and no forms end-to-end row** — three rubric Layer-1 gates remain without entries. I substituted independent contrast math for the color half of axe: ran `scripts/contrast-check.mjs` and re-derived every pair through two separate pipelines (hex fallbacks → WCAG luminance, and OKLCH → linear sRGB → luminance; agreement within 0.01). All rendered text pairs pass AA, including the alpha-composited ink-band text feedback-001 never checked (cta-body paper@0.85 = 11.51:1, eyebrow@0.72 = 8.58:1, compliance@0.62 = 6.69:1). CWV remains a claim, not a number (Major #1).

Verified independently in fetch mode: all 4 pages serve correctly (`/` `/services/` `/contact/` 200; `/nonexistent` returns **real HTTP 404** with the branded page); dist is fresh (built 20:23:57, after last src change); JS 64.6kb raw gz across 5 files ≈ 63kb gate figure, CSS 6.7kb gz; all 10 JSON-LD blocks parse; OG PNGs 200 (44–55kb); anti-template spot-check ≥8 of 10 qualities present in computed styles (scale contrast, spacing rhythm, grain + horizon layering, three-family type pairing with real roles, semantic heat/error/success color, designed hover/focus/active states, staircase grid-breaking trio, clarifying entrance/reveal motion).

## Scores

| Axis | Score | Weight | Weighted |
|---|---|---|---|
| Design quality | 8.5 | .20 | 1.70 |
| Brand & voice fidelity | 9 | .15 | 1.35 |
| Craft | 8.5 | .15 | 1.28 |
| CRO readiness | 9 | .15 | 1.35 |
| SEO/AEO/GEO readiness | 8.5 | .15 | 1.28 |
| Functionality | 7 | .10 | 0.70 |
| A11y + performance | 7.5 | .10 | 0.75 |
| **TOTAL** | | | **8.4 / 10** |

## Verdict: PASS (weighted 8.4 ≥ 7.5, zero CRITICAL)

Axis rationale (compressed):

- **Design 8.5** — Desert Editorial Warmth holds with conviction across all 4 pages: verbatim tokens, Fraunces/Nunito Sans/DM Mono all live with roles (italic display proof lines, mono trust chassis), 0.04 grain, transform-only horizon drift, and real rhythm variation — full-bleed trust strip → staircase trio (nth-child offsets) → 7fr/5fr pledge band with heat-rule aside → mono city ledger → ink-inverted finale. The 404 stays in-system (page-header pattern, dual CTA, zero new design). Held at 8.5, not 9: fetch mode can't confirm pixel composition, 320px header/contact-phone behavior is still unverified (carryover minors), and the home page mixes typographic quote styles (below).
- **Brand & voice 9** — Diffed 20+ deck strings verbatim across all pages; all pass. Constraint sweep clean: no prices (the only `$` on any page is Astro's island runtime JS), no 24/7 claim, no discounts, no fake urgency, no invented stats — fictional 4.9/312 renders nowhere (pages, llms.txt, llms-full.txt all clean) while the neutral "Written quotes, no surprises" placeholder ships exactly per deck. ROC #329417: hero eyebrow above the fold, trust strip, FAQ answer, compliance lines, NAP ×5, schema, llms.txt. 404 copy is voiced and CD-logged as a deck addendum. The NAP — last iteration's brand wound — is now byte-identical in all 5 on-page instances **and** matches llms.txt/llms-full.txt character-for-character ("2244 E Main St, Mesa, AZ 85213").
- **Craft 8.5** — The fix quality this iteration is what earns the bump: Nap.astro renders the address as a single template string with the failure mode documented; the hover token was re-derived mathematically (oklch 63.1% = 4.56:1, confirmed independently) instead of eyeballed; the novalidate fix is textbook progressive enhancement; contrast-check.mjs turns DESIGN.md's color rules into executable proof. Remaining nits: mixed quotes, CTABand aria-label pattern (carryover), internal-link slash form (Major #3), 404 canonical (Minor #1).
- **CRO 9** — Every page hits its SITE.md goal per playbook. Home: phone-as-text ×7 (header, hero primary + microline, pledge aside, final band, sticky bar), proof adjacent to every ask, secondary CTA visibly subordinate. Services: intro jump link, three verb-first block CTAs → `#quote-form`, 4 fields, hints-not-placeholders, blur validation with how-to-fix copy, honeypot (aria-hidden + tabindex=-1) not CAPTCHA, tel: fallback adjacent to submit, success state that sets the same-day callback expectation, call-fallback band after FAQ. Contact: call-first with huge tap-to-call number, form second, PM block at full weight. Even the 404 converts (tel: primary + home ghost + sticky bar). Not 10: submit→success is unverifiable in fetch mode and reviews-proof adjacency is necessarily the placeholder treatment.
- **SEO/AEO/GEO 8.5** — Titles/descriptions byte-exact to decks and keywords.md (49/153, 47/141, 48/153 chars), one intent stage per page, no cannibalization. Schema map matches SITE.md: HVACBusiness (geo, hours, areaServed, hasCredential) + FAQPage(3) on /, Service ×3 + BreadcrumbList + FAQPage(9) on /services, ContactPage with resolving `#business` @id ref + BreadcrumbList + FAQPage(2) on /contact; aggregateRating correctly withheld (documented anti-spam reasoning — justified SITE.md deviation). FAQ schema text mirrors on-page island text token-for-token including the phone substitution. llms.txt is genuinely liftable; llms-full.txt regenerates with the corrected NAP. Docked: internal links are slash-inconsistent with canonicals (Major #3), 404 self-canonicalizes (Minor #1), and /services' "furnace/heating repair" secondary keyword exists only as a select option (Minor #6).
- **Functionality 7 (cap 7)** — Everything verifiable without a browser verifies: routes + real 404 status, anchor targets present, island props/directives correct, form logic reads correct with graceful failure (role=alert + tel fallback, button re-enable), double-submit guarded, success focus management, hero has both a noscript override and a 1.6s CSS fallback net, background-tab paths handled for both islands. Interactivity not witnessed — capped. One real no-JS gap: the FAQ answers (Major #2).
- **A11y + perf 7.5** — Floor is comfortably beaten: skip link, designed :focus-visible ring, labeled fields with aria-describedby/aria-invalid swaps, role=status/alert with focus moves, correct accordion ARIA, details/summary keyboard-native mobile nav, comprehensive reduced-motion, AT-hidden honeypot. Iteration-1's Critical contrast failure is gone (step numbers now ink = 14.84:1) and the hover fill now clears AA with margin. Perf engineering improved (client:idle moves react-dom off the critical path on all pages) — but the LCP element is still SSR-hidden behind hydration with only the 1.6s CSS net, three font families load from Google with no metric-tuned fallbacks, and after two iterations there is still no CWV measurement. "Comfortably inside budget" cannot be claimed unmeasured — that ceiling holds this axis at 7.5.

## Critical (must fix)

None. Gate run reports 0 critical/high; my independent sweep (contrast both pipelines, schema parse, claims discipline, NAP consistency, form no-JS path, status codes) found no zero-tolerance failures.

## Major (should fix)

1. **CWV is still unmeasured after two iterations — the hero LCP is an engineered guess.** (Carryover: feedback-001 Major #4.) The H1 ships SSR-hidden (`opacity:0`, inline) and becomes visible via hydration animation (~0.5s post-hydrate) or the `he-reveal-fallback` net at 1.6s + 0.6s fade (`src/styles/global.css` ~line 431). The rubric's Layer-1 CWV row (LCP <2.5s mobile) has never produced a number. → Run Lighthouse mobile against `dist/` (e.g. `npx lighthouse http://localhost:4324/ --preset=perf --form-factor=mobile`) and record LCP/INP/CLS in gate-results-003.json. If LCP >2.5s: drive the entrance with pure CSS keyframes gated on `html.js` (delays ≤150ms, no hydration dependency) and let the island only handle reduced-motion/hidden-tab cleanup.
2. **FAQ answers are unreachable without JS.** `.faq-a` collapses via ungated `grid-template-rows: 0fr` (global.css ~line 833) and the toggle is React-only, so no-JS users see 14 questions with dead buttons and no answers (feedback-001's "SSR accordion HTML is fully visible while inert" was wrong — questions render, answers don't). Text is in the DOM, so AEO parity holds; this is a human no-JS gap on a site that otherwise engineers no-JS carefully (form, hero, reveals). → Render each item as native `<details><summary>` in the island markup (styled identically; keep the grid-rows animation by toggling a class post-hydration), or add `html:not(.js) .faq-a { grid-template-rows: 1fr; }` + `html:not(.js) .faq-a-inner { opacity: 1; }` to global.css as the two-line floor.
3. **Every internal link 301-hops against its canonical.** Canonicals + sitemap use trailing-slash (`https://desertairemesa.com/services/`) but all internal hrefs are slash-less (`/services`, `/contact` — 20+ instances across Header, Footer, cards, fallbacks, 404). On Netlify pretty-URLs each click/crawl takes a 301 to the slash form. → Emit trailing-slash hrefs everywhere (`/services/`, `/services/#quote-form` — fragments survive redirects but shouldn't need to), or set `trailingSlash: "never"` + `build.format: "file"` in astro.config.mjs and re-check canonicals; either way, one consistent URL form site-wide.

## Minor (nice to fix)

1. **404 hygiene:** it self-canonicalizes to `https://desertairemesa.com/404/` and carries no `noindex`. Low risk while the status is 404, but belt-and-braces: suppress the canonical and add `<meta name="robots" content="noindex">` via a `Base` prop. Its `og:image`/alt also reuse the home card (carryover of feedback-001 Minor #6 — thread a per-page `ogImageAlt` through Base while you're there).
2. **Mixed quote typography on home:** trust-strip item 4 uses curly `“…”` while every apostrophe/quote elsewhere is straight (`don't`, `"you need a whole new unit"` on /services). An editorial-serif brand should pick one convention (prefer typographic) and apply it site-wide — cheap find/replace in the four page files + decks note.
3. **Focus ring on surface bands is 2.98:1.** `:focus-visible` outline is `--color-heat`, which measures 3.13:1 on `--color-bg` but 2.98:1 on `--color-surface` — controls inside `.band`, `.trust-strip`, `.cta-band--surface` (pledge Call button, contact call-first links) sit a hair under the 3:1 non-text target. → `outline-color: var(--color-ink)` scoped to surface contexts, or darken the ring token to ~oklch(60%) and re-run contrast-check.
4. **Font loading has no metric-tuned fallbacks:** Fraunces/Nunito Sans swap from Georgia/system-ui without `size-adjust`/`font-size-adjust` overrides — visible reflow risk on slow connections (unmeasured CLS). Add `@font-face` fallback overrides (e.g. via fontaine-style metrics) or accept and measure in the Major #1 Lighthouse run.
5. **Unaddressed iteration-1 minors, still valid:** CTABand `aria-label={heading}` duplication (→ `aria-labelledby` + id on the h2) · sitemap `lastmod` missing (`@astrojs/sitemap` serialize) · 320px header and `.call-phone` nowrap width unverified (needs one browser/screenshot pass) · desktop duplicate call button in the contact call-first band (deck reads "mobile duplicate").
6. **Heating intent is thin on /services:** secondary keyword `furnace repair mesa az` (keywords.md) surfaces only as the "Heating repair" select option. One candor-voiced sentence in the repair or maintenance block ("Heat pumps and furnaces get the same straight diagnosis in winter") would cover it without a new page.

## Improved since last iteration

All six iteration-1 Majors and the Critical are verifiably resolved — this was a disciplined fix pass:

1. **Critical #1 cleared:** `.steps li::before` is now `--color-ink` — 14.84:1 on surface (was heat at 2.98:1). Re-verified through both my pipelines; no heat-as-text usage remains anywhere.
2. **NAP fixed and provable (Major #1):** Nap.astro single-template-string render; "2244 E Main St, Mesa, AZ 85213" spaced correctly; all 5 on-page NAP blocks byte-identical (incl. the new 404 footer and /contact's second instance) and identical to llms.txt + llms-full.txt.
3. **Branded 404 shipped (Major #2)** — and it returns a real HTTP 404, keeps full chrome + sticky call bar, converts with a tel: primary, and its copy addendum is CD-logged.
4. **Hydration strategy fixed (Major #3, improved on the suggestion):** FAQ islands are now `client:idle={{timeout:2000}}` — off the critical path on /services + /contact like the recommended `client:visible`, but immune to the hidden-tab dead-hydration failure the builder documented. Right call.
5. **novalidate is progressive enhancement now (Major #5):** absent from served HTML on both forms (verified), added by script post-hydration — no-JS users keep native required/tel validation.
6. **Hover token now passes with proof (Major #6):** `--color-heat-hover: oklch(63.1% …)` = 4.56:1 vs ink, derived by the new `scripts/contrast-check.mjs` (itself a process improvement: DESIGN.md color rules are now executable).
7. **Gate deltas:** div/semantic ratio effectively unchanged (46/26) with a whole page added; bundle held at 63kb gz.

## Regressed since last iteration

Nothing found. Bundle, schema, metas, deck fidelity, and section orders are unchanged or improved; the added 404 introduced no new gate pressure (div count +2, zero new JS). The three untouched iteration-1 minors are carried in Minor #5 rather than counted as regressions.

## Next-iteration priorities (top 3, concrete)

1. **Make CWV a number (Major #1):** Lighthouse mobile against the preview build, record LCP/INP/CLS in gate-results-003.json; if LCP >2.5s, move the hero entrance to CSS-first. This is the only rubric Layer-1 row still dark after two iterations.
2. **Close the no-JS FAQ gap (Major #2):** native `<details>` markup or the two-line `html:not(.js)` CSS floor — pick one, keep the grid-rows motion for JS users.
3. **One URL form everywhere (Major #3) + 404 hygiene (Minor #1):** trailing-slash internal hrefs to match canonicals/sitemap, drop the 404 canonical, add noindex — a single small SEO-tidy commit.
