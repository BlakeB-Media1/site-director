---
name: site-director
description: >
  Use when the user wants a website or landing site BUILT or REBUILT end-to-end —
  "build me a site", "rebuild this client's website", "run the site director",
  "new site for [client]", "redo [url] with our branding", agency client builds,
  HVAC/contractor/local-service sites, or any request supplying brand/voice/persona
  context that expects a finished multi-page site with no hand-holding. Also use
  when they want website prototype variants generated and presented for selection
  before a build commits. Trigger even if they don't say "website" but describe a
  full web presence deliverable. Do NOT use for single components, copy-only tasks,
  or design critique of an existing site (impeccable handles those).
metadata:
  version: 2.0.0
  author: Blake + Claude
---

# Site Director v2

One command in, one finished website out. You (the main session) act as the
**Creative Director**: you own the brief, spawn and arbitrate the agent team,
and package the final review. Everything between the up-front approval and the
final review runs without asking the user anything.

Why this shape: the user's stated contract is "all approvals at the very
beginning, review at the very end." Every mid-run question you ask breaks that
contract; every decision you can't trace to the brief is a decision you had no
right to make. The brief is therefore both your permission slip and your leash.

## When NOT to use

- Single component / section polish → `impeccable` or `frontend-design`
- Copy or content only → `content-engine` / `brand-voice`
- Critique/audit of a live site without a rebuild → `impeccable` (audit), `seo`
- Stitch as the *build engine* (generate every page in Stitch, export, convert) →
  `stitch-website-builder`. v2 uses Stitch only to prototype directions in Phase
  3.5; the build itself is always ours.
- Site hosted in Framer specifically → `framer` skill (out of scope here)

## Prerequisites (check in Phase 0, degrade or refuse per table)

| Requirement | Verify | If missing |
|---|---|---|
| Node ≥ 18 | `node --version` | refuse — builds impossible |
| Firecrawl CLI + auth | `firecrawl --status` (Bash) / `firecrawl.cmd --status` (PS) | degrade research to `offline` (reference-pack only) |
| Playwright | `npx playwright --version` | QA degrades: playwright → screenshot → code-only |
| Project dir + write access | probe file | refuse |
| Reference pack fresh | `reference-pack/PACK-MANIFEST.md` bake date < 90 days | warn in report; offer `scripts/refresh-pack.mjs` later — never block a run |
| Permissions pre-flight | see `references/creative-brief.md` §Pre-flight | warn: shell prompts may interrupt autonomy |

## Operating rules

1. **One approval.** If the invocation already includes a complete brief
   (all required fields in `references/creative-brief.md`) and the user said
   to proceed, that IS the approval — ask nothing. Otherwise draft `BRIEF.md`
   and run exactly ONE AskUserQuestion batch. After approval the brief is
   immutable for the run; log gaps in `quality-report.md` instead of asking.
2. **Artifacts are memory.** Every phase writes files; no knowledge lives only
   in a transcript. Agents read files, not conversation history. SendMessage
   carries pointers + one-line summaries, never payloads.
3. **Never deploy.** Package deploy instructions; the user deploys after the
   final review. No exceptions, including "just staging".
4. **`sd-` prefix** on every spawned agent name (collision safety).
5. **Trace or drop.** Any design/copy/structure decision must trace to the
   brief, the research files, or the reference pack. Untraceable cleverness is
   how autonomous runs drift off-brand.
6. **Degrade, don't block.** Registry pull fails → hand-write with Motion
   primitives. Firecrawl dry → baked pack. Playwright missing → screenshot
   QA. Log every degradation in `quality-report.md`.
7. **Budget the run.** The brief's research budget (full/lite/offline) caps
   firecrawl spend — see `references/research-protocol.md`.

## Artifacts (all in the project directory)

```
SITE.md, DESIGN.md                    # root — page map + design system (OKLCH tokens)
.site-director/
├── BRIEF.md                          # locked creative brief
├── DIRECTION.md                      # creative direction rationale
├── research/{brand,competitors,trends-delta,keywords,personas}.md
├── copy/copy-deck-<page>.md          # one per page
├── feedback/feedback-NNN.md          # QA iterations
├── build-log.md                      # append-only event log
├── next-task.md                      # resume pointer (delete on completion)
├── queue.md                          # agency batch mode only
├── prototypes/                       # Phase 3.5 only
│   ├── site-director-prototypes.html # selectable variant gallery (self-contained)
│   ├── styles.css                    # auxiliary stylesheet (overrides)
│   ├── prototypes.json               # normalized variants (gallery input)
│   ├── selection.json                # chosen prototype id
│   ├── <id>.png                      # cached screenshots (signed URLs expire)
│   └── <id>.html                     # Stitch export — layout reference only
└── quality-report.md                 # final gate results + degradations + open items
.firecrawl/                           # raw scrape outputs
```

## Phase protocol

Read the reference file named in each phase before running it the first time.

### Phase 0 — Intake → locked brief (serial, Creative Director)

Read `references/creative-brief.md`. Gather context from: the user's message,
any supplied docs, existing VOICE PROFILE, agency hub materials if the agency
preset is on. If rebuilding, capture the existing site URL. Draft `BRIEF.md`
(every required field filled or explicitly defaulted). If anything material is
missing or ambiguous, batch it into ONE AskUserQuestion (brief confirm + stack
+ top-3 style directions + AI-image consent + **prototype gate**). Lock the
brief. Write `next-task.md` → `phase-1`.

**Prototype gate field.** Default `off`. `on` pauses the run at Phase 3.5 so the
user picks a variant; that is the user electing to break their own zero-gate
rule, so only ever set it because they asked. `off` still generates the gallery —
you just auto-select. `skip` runs no prototypes at all.

Style direction must be a real one (editorial, neo-brutalism, dark/light
luxury, bento, scrollytelling, Swiss, retro-futurism, …). "Clean and modern"
is the banned default — pick 3 candidates from research + reference pack and
have the user choose in the single batch (or choose yourself if pre-approved,
recording the rationale in DIRECTION.md).

**Exit:** BRIEF.md locked. **Queue mode:** if the invocation lists multiple
clients, write `queue.md` and run Phases 0–5 per client serially; one review
package per site. See `references/agency-preset.md`.

### Phase 1 — Research fan-out (parallel, barrier at end)

Read `references/research-protocol.md` and `references/agent-team.md`. Spawn
ALL research agents in ONE message, `run_in_background: true`:

- `sd-research-brand` — only if rebuild/reference URL exists; wraps
  `firecrawl-website-design-clone` recipe → `research/brand.md`
- `sd-research-competitors` — map + scrape 3–5 competitor sites →
  `research/competitors.md`
- `sd-research-trends` — reads `reference-pack/` then live-deltas niche
  trends → `research/trends-delta.md`
- `sd-research-keywords` — reuses the `seo-specialist` agent + AEO question
  mapping → `research/keywords.md`
- `sd-research-personas` — brief + agency hub docs → `research/personas.md`

Barrier: proceed when all five files exist (or their agents reported
degradation). Log arrivals in `build-log.md`.

### Phase 2 — Synthesis (serial, Creative Director — this is YOUR craft)

Read all five research files. For design intelligence, read
`references/design-elements.json` — the unified `designElements` corpus merging
**Impeccable**, **TASTE**, and **UI/UX Pro Max** with the reference pack (172
palettes, 93 type pairings, 90 registry components, plus a pointer index for
styles / UX guidelines / charts). Build it with `node
scripts/build-design-elements.mjs` if absent or stale. Query
`ui-ux-pro-max:ui-ux-pro-max` (`search.py` runs with `python` on Windows) for
ranked recommendations beyond the corpus; sanity-check against
`design-taste-frontend` instincts. If no VOICE PROFILE was supplied, generate
one now via the `brand-voice` skill from the client's existing materials.

Write three artifacts:
- `DIRECTION.md` — chosen style direction + why (traced to brief/research),
  motion language, imagery/asset plan, what we're deliberately NOT doing
- `SITE.md` — page table (route, purpose, **per-page conversion goal** from
  `references/cro-playbook.md`), nav model, internal-link plan
- `DESIGN.md` — full token system: OKLCH colors, type pairing (from research
  or reference pack; Google-Fonts-available), clamp() scales, spacing, radius,
  shadow, motion durations/easings, component inventory

**Exit:** all three exist and every choice traces. No user gate.

### Phase 3.5 — Prototype gate (serial, Creative Director — optional)

Read `references/prototype-gate.md`. Skip entirely if the brief set the gate to
`skip`, or if `mcp__stitch__list_projects` fails — **this phase never blocks a
run**; degrade, log in `quality-report.md`, go to Phase 3.

`DESIGN.md` from Phase 2 is exactly the Stitch design-system input. Run the
`googleStitchConnector` plan (`node connectors/google-stitch-connector.mjs plan`)
against the `mcp__stitch__*` tools: upload DESIGN.md → design system → baseline
screen → `generate_variants` (3 by default, `EXPLORE`, varying LAYOUT /
COLOR_SCHEME / TEXT_FONT — never TEXT_CONTENT, copy belongs to `sd-copywriter`).

Download each variant's screenshot locally — Stitch's `downloadUrl` is signed and
expires — then `normalize` and render the gallery:

```
node connectors/google-stitch-connector.mjs normalize --screens <screens.json> \
  --local-dir prototypes --project <id> --out .site-director/prototypes/prototypes.json
node scripts/generate-prototype-html.mjs --in .site-director/prototypes/prototypes.json \
  --out .site-director/prototypes
```

- Gate `off` (default): score the variants on the 5-axis rubric in the reference,
  auto-select the winner, record it and the runners-up in `DIRECTION.md`, continue.
- Gate `on`: write `next-task.md` → `phase-3.5-awaiting-selection`, hand the user
  the gallery path, stop. Resume on their choice.

The winner is **build reference, not build output** — Stitch HTML never ships. If
a variant contradicts `DESIGN.md`, `DESIGN.md` wins; note the delta in `build-log.md`.

**Exit:** `selection.json` (or a logged auto-selection) exists, or the phase
degraded. Write `next-task.md` → `phase-3`.

### Phase 3 — Build (parallel producer→consumer)

Read `references/stack-recipes.md` (Recipe A: Next.js; Recipe B: Astro/agency)
+ `references/motion-registry.md` + `references/agent-team.md`. Spawn
copywriter + builder together in ONE message; spawn the seo-engineer
separately once the builder reports pages exist (it works on built output):

- `sd-copywriter` — writes `copy/copy-deck-<page>.md` per SITE.md page:
  headlines, sections, CTAs, FAQ (AEO answer-first), microcopy — enforcing
  VOICE PROFILE + `references/cro-playbook.md`. Announces each finished deck
  via SendMessage to `sd-builder`.
- `sd-builder` — long-lived. Scaffolds the stack recipe, builds pages as
  decks arrive: DESIGN.md tokens, registry components (≤2 showpieces/page),
  Motion for custom animation, semantic HTML, a11y from the start. Commits
  per page (`git init` if none). Keeps dev server running. Writes
  `build-log.md` entries + `builder-state.md`.
- `sd-seo-engineer` — tail pass once pages exist: per-page metadata,
  JSON-LD (per `references/seo-aeo-geo.md`), `llms.txt` + `llms-full.txt`,
  sitemap, robots.txt with AI-crawler allowlist, security headers.

On build failure the builder self-diagnoses once; if still red, Creative
Director spawns `build-error-resolver` (existing agent) scoped to the error.

**Exit:** all pages built, `npm run build` (or recipe equivalent) exits 0,
dev server up. Write `next-task.md` → `phase-4`.

### Phase 4 — QA loop (supervisor loop, ≤3 iterations)

Read `references/qa-rubric.md`. Each iteration:

1. Run mechanical gates first: `node scripts/gate-check.mjs <project-dir>`
   + impeccable's slop detector (`node <impeccable>/scripts/detect.mjs`).
   Mechanical CRITICALs go straight to the builder — no evaluator needed.
2. Spawn a FRESH `sd-qa-evaluator` (adapted gan-evaluator; fresh each
   iteration so scores stay unbiased). It tests the live app, scores the
   7-axis rubric, writes `feedback/feedback-NNN.md`.
3. Arbitrate as Creative Director: brand fidelity overrules evaluator taste;
   CRITICAL gates overrule everything; note overrides in `build-log.md`.
4. Send the actionable list to `sd-builder`; it fixes and commits.

**Exit:** weighted score ≥ 7.5 AND zero CRITICAL gate failures — or 3
iterations reached, in which case remaining items become the top of
`quality-report.md` § Open Items. Optionally run `code-reviewer` once here.

### Phase 5 — Package (serial, Creative Director)

Write `quality-report.md`: gate table, final scores per axis, iteration
history, degradations, open items, CWV + bundle numbers. Assemble the final
review message for the user: preview URL (local dev server or `preview_start`),
score summary, what to look at first, deploy instructions for the brief's
target (Vercel/Netlify/CF Pages) — **not executed**. Delete `next-task.md`.
Store one memory-worthy lesson if the run surfaced a reusable pattern.

## Parallelism map

| Phase | Mode | Barrier |
|---|---|---|
| 0 Intake | serial | user approval (the only one) |
| 1 Research | 4–5 agents parallel | all research files present |
| 2 Synthesis | serial (CD) | artifacts complete |
| 3.5 Prototype | serial (CD), optional | selection made or phase degraded |
| 3 Build | copywriter ∥ builder, seo tail | build green + pages done |
| 4 QA | loop: gates → evaluator → builder | score ≥7.5 & no CRITICAL, ≤3 iters |
| 5 Package | serial (CD) | user's final review |

## Composition table (invoke, don't duplicate)

| Need | Use |
|---|---|
| Unified palettes/type/components | `references/design-elements.json` (`designElements` — Impeccable + TASTE + UI/UX Pro Max merged) |
| Style/palette/type intelligence | `ui-ux-pro-max:ui-ux-pro-max` (`python scripts/search.py "<q>" --design-system`) |
| Stitch prototypes + testing URL | `googleStitchConnector` (`connectors/google-stitch-connector.mjs`) |
| Variant gallery for selection | `generatePrototypeHTML()` (`scripts/generate-prototype-html.mjs`) |
| Design QA / critique / motion polish | `impeccable` (audit, critique, animate) + `scripts/detect.mjs` |
| Motion skeletons & anti-slop instincts | `design-taste-frontend` (taste-skill) |
| Rebuild scrape → DESIGN-SOURCE.md | `firecrawl-website-design-clone` |
| Voice profile | `brand-voice` |
| SEO audit depth | `seo` skill + `seo-specialist` agent |
| CRO audit pass | `anthropic-skills:conversion-funnel-auditor` |
| Build failures | `build-error-resolver` agent |
| Hard rules (always in force) | `~/.claude/rules/web/*.md` |

## Resume protocol

Every phase transition writes `next-task.md` (phase + one-line state). On
invocation, if `.site-director/next-task.md` exists, announce the resume
point, verify artifacts for completed phases exist, and continue — do not
re-run finished phases or re-ask anything.

## Failure modes

| Symptom | Response |
|---|---|
| Firecrawl auth/credits dead | research budget → offline (baked pack); log it |
| Registry add fails | hand-write section with Motion primitives; log it |
| Dev server won't start | `build-error-resolver`; if still red after 2 passes, code-only QA + open item |
| Evaluator stalls (no file in ~10 min) | check artifact mtimes; respawn once fresh |
| Stitch MCP unauthed / variant gen fails | Phase 3.5 degrades to `skip`; build from `DESIGN.md`; log it |
| Gallery thumbnails 404 | signed Stitch URLs lapsed — re-fetch `get_screen` and cache locally |
| Score plateaus < 7.5 after 3 iters | ship with Open Items — the user's review decides |
| Context pressure mid-run | artifacts already on disk; summarize + continue from `next-task.md` |
| User interrupts mid-run | state saved; next invocation resumes |

## Reference index

| File | Read when |
|---|---|
| `references/creative-brief.md` | Phase 0 |
| `references/research-protocol.md` | Phase 1, and when refreshing the pack |
| `references/agent-team.md` | before any spawn (1, 3, 4) |
| `references/prototype-gate.md` | Phase 3.5 (Stitch variants + gallery) |
| `references/design-elements.json` | Phase 2 synthesis (unified `designElements`) |
| `references/stack-recipes.md` | Phase 3 scaffold |
| `references/motion-registry.md` | Phase 3 build |
| `references/cro-playbook.md` | Phases 2–3 (page goals, copy, layouts) |
| `references/seo-aeo-geo.md` | Phase 3 tail + Phase 4 gates |
| `references/qa-rubric.md` | Phase 4 |
| `references/agency-preset.md` | agency/local-service briefs + queue mode (operator-specific; not bundled in the public repo — skip the preset if absent) |
| `reference-pack/*` | Phase 2 synthesis; trends delta in Phase 1 |
