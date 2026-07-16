# Pack Manifest

Baked: **2026-07-15** · Total firecrawl spend: **~15 credits** (most sources
fetched free via WebFetch/WebSearch) · Staleness rule: SKILL.md warns when
this date is >90 days old — refresh via `node scripts/refresh-pack.mjs`,
then have Claude re-distill `_raw/` into these files
(research-protocol.md § refresh).

| File | Lines | Primary sources | Method |
|---|---|---|---|
| trends-2026.md | 154 | figma resource library, land-book, siteinspire, onepagelove, recent.design (ex-godly), webflow/wix/muzli trend articles | WebFetch + 7 firecrawl scrapes |
| typography-2026.md | 174 | typewolf (top-15 + SOTD), fontsinuse, cross-checked vs a 74-pairing reference corpus | WebFetch; 13 pairings are net-new vs corpus |
| color-2026.md | 133 | same gallery set, palette-focused | OKLCH computed via Ottosson conversion, WCAG ratios computed |
| registry-catalog.md | 263 | aceternity, magicui, reactbits, tailark, hyperui, originui (+ awesome-shadcn-ui) | firecrawl scrapes + ~115 endpoints curl-verified (93 ✓ in file) |
| aeo-geo-playbook.md | 288 | llmstxt.org, arXiv 2311.09735 full text, vendor crawler docs (16 UAs), Google structured-data docs, searchengineland | WebFetch/WebSearch only — 0 credits |

## Live findings baked in (why per-run freshness checks matter)

- **Google removed FAQ rich results** (May 2026; HowTo gone since 2023) —
  FAQPage markup downgraded to optional; answer-first content format remains
  the AEO lever.
- **llms.txt reality**: ~10% adoption, ~0.1% of AI-bot hits, Google
  confirmed non-support (July 2025). Ship it as 15-minute insurance, don't
  oversell it.
- **GEO effect sizes** (KDD'24 full text): quotations +41%, statistics +31%,
  citations +30%; keyword stuffing NEGATIVE.
- **Origin UI pivoted** → coss.com/ui, rebuilt on Base UI (not Radix); old
  `/r/comp-XX.json` URLs still 301-resolve.
- **Aceternity** registry path is `/registry/{slug}.json` (`/r/` 404s);
  lamp-effect + signup-form are login-gated (401).
- **shadcn** item JSON lives at `/r/styles/new-york-v4/{name}.json`.
- **Tailark**: `@tailark/{block}` namespace; kits dusk/mist/veil free,
  quartz paid (their bento/secondary-hero JSONs 404 = pro-only).
- **motion v12 confirmed** in live registry payloads (Magic UI + Aceternity
  declare `motion`, import from `motion/react`).
- **godly.website rebranded** → recent.design (refresh script updated).

## Refresh commands (what refresh-pack.mjs runs)

```
firecrawl scrape "<source>" --format markdown --only-main-content -o reference-pack/_raw/<group>-<slug>.md
firecrawl search "web design trends <year>" --scrape --limit 3 --json
```

Full source list lives in `scripts/refresh-pack.mjs` (SOURCES map) and each
pack file's `## Sources` footer.
