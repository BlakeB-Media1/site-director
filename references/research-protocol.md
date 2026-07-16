# Research Protocol — Firecrawl recipes + budgets

Two research layers. The **baked pack** (`reference-pack/`) answers "what does
good look like in 2026" — trends, typography, color, AEO/GEO evidence,
registry catalog. It was researched once and refreshes quarterly. The
**per-run refresh** answers only what the pack can't: THIS client, THIS
market, THIS niche, right now. Don't re-research the internet on every build;
don't trust the pack for anything client-specific.

## CLI facts (Windows)

- Bash tool: bare `firecrawl`. PowerShell: `firecrawl.cmd` (exec policy
  blocks the .ps1 shim). Verify auth: `firecrawl --status`.
- Outputs to `.firecrawl/` via `-o`; quote URLs; multi-format → JSON.
- `search` costs ~2 credits; `scrape` ~1/page; refunds via
  `firecrawl search-feedback <id>` when results were junk.

## Budgets (brief sets one)

| Budget | Credits | What runs |
|---|---|---|
| full | ~60–90 | everything below, 5 competitors, deeper scrapes |
| lite (default) | ~25–40 | everything below, 3 competitors, home+1 page each |
| offline | 0 | baked pack + WebSearch only; log the degradation |

Agents get per-task caps in their prompts (agent-team.md). Caps are real:
hitting one means distill what you have, note the cut, move on.

## Per-run recipes (Phase 1 agents)

### Rebuild scrape (sd-research-brand)
```bash
firecrawl scrape "<EXISTING_URL>" --format branding -o .firecrawl/brand.json
firecrawl scrape "<EXISTING_URL>" --format markdown,screenshot --only-main-content -o .firecrawl/home.json
# + 3-5 inner pages, markdown only
```
Deeper treatment (full design-system extraction): follow the
`firecrawl-website-design-clone` skill — it produces an agent-ready
DESIGN-SOURCE.md; store as `research/brand.md` appendix.

### Competitors (sd-research-competitors)
```bash
firecrawl search "<niche> <city>" --limit 5 --json          # if brief lacks URLs
firecrawl map "<competitor>" --limit 30 --json               # find money pages
firecrawl scrape "<competitor>/<money-page>" --format markdown --only-main-content
```
Distill per competitor: positioning, offer, proof, CTA pattern, gaps.

### Niche trends delta (sd-research-trends)
```bash
firecrawl search "<niche> website design 2026" --scrape --limit 3 --json
```
Read the pack FIRST; the delta file records only what's new/niche-specific.

### Keywords/AEO (sd-research-keywords)
WebSearch primary (free). Firecrawl only for SERP-content pulls:
```bash
firecrawl search "<service> <city>" --scrape --limit 3 --json   # what ranks now
```
Question mining: search "<service> questions", People-Also-Ask phrasing,
review sites (customer language).

### Persona review-mining (sd-research-personas, thin briefs only)
```bash
firecrawl scrape "<google-maps-or-yelp-reviews-url>" --format markdown -o .firecrawl/reviews.json
```
Quote real customer language into personas.md — it becomes copy fodder.

## Distillation rule

Raw scrapes stay in `.firecrawl/`. Research files
(`.site-director/research/*.md`) contain DISTILLED findings: claims + the
source path/URL. The copywriter and builder read research files only — if a
finding matters, it's distilled; if it's not distilled, it doesn't exist.

## Baked pack — refresh recipe (quarterly, NOT per run)

`node <SKILL_DIR>/scripts/refresh-pack.mjs` re-runs the bake (~100–150
credits; trend galleries are JS-heavy). Manual equivalent per file:

| Pack file | Sources | Method |
|---|---|---|
| registry-catalog.md | shadcn/Aceternity/MagicUI/ReactBits/Tailark/HyperUI/OriginUI indexes + awesome-shadcn-ui README | WebFetch for GitHub; firecrawl scrape for JS registry pages; re-verify add-URLs |
| trends-2026.md | figma trends library, land-book, godly, siteinspire, onepagelove + fresh trend articles via search | firecrawl scrape/search |
| typography-2026.md | typewolf, fontsinuse (+ cross-check any font-pairing corpus you keep) | WebFetch/firecrawl |
| color-2026.md | same gallery set, palette-focused | derived during trends pass |
| aeo-geo-playbook.md | llmstxt.org, vendor crawler docs, GEO research followups | WebFetch mostly (≈0 credits) |

After refresh: update `PACK-MANIFEST.md` (bake date, commands, source list).
The SKILL.md prerequisite check warns at >90 days — warn, never block.

## Honesty rules (apply to every research artifact)

- Every claim in a research file carries a source (URL or scrape path).
- Failed scrapes get a line ("X wouldn't render — skipped"), not silence.
- Credits spent per agent land in build-log.md — the quality report totals
  them so you can see cost per build.
