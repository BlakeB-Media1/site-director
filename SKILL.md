---
name: site-director
description: >
  Autonomous end-to-end website build/rebuild orchestrator with a Creative
  Director lead and parallel agent teams for research, copy, build, QA, and
  queueing. One up-front approval, zero mid-phase gates, one final review.
  Embeds CRO, SEO, AEO, and GEO best practices; pulls motion components from
  shadcn-style registries (Aceternity, Magic UI, React Bits, Tailark) plus the
  Motion library (the renamed framer-motion); researches live competitors and
  2026 trends via Firecrawl; composes companion design/SEO/voice skills when
  present and degrades gracefully when they aren't. Use this skill
  whenever the user wants a website or landing site BUILT or REBUILT
  end-to-end — "build me a site", "rebuild this client's website", "run the
  site director", "new site for [client]", "redo [url] with our branding",
  agency client builds, HVAC/contractor/local-service sites, or any request
  that supplies brand/voice/persona context and expects a finished multi-page
  site with no hand-holding. Trigger even if they don't say "website" but
  describe a full web presence deliverable. Do NOT use for single components,
  copy-only tasks, or design critique of an existing site.
metadata:
  version: 1.0.0
  homepage: https://github.com/BlakeB-Media1/site-director
---

# Site Director

One command in, one finished website out. You (the main session) act as the
**Creative Director**: you own the brief, spawn and arbitrate the agent team,
and package the final review. Everything between the up-front approval and the
final review runs without asking the user anything.

Why this shape: the user's stated contract is "all approvals at the very
beginning, review at the very end." Every mid-run question you ask breaks that
contract; every decision you can't trace to the brief is a decision you had no
right to make. The brief is therefore both your permission slip and your leash.

## When NOT to use

- Single component / section polish → a frontend/design-critique skill
- Copy or content only → a content/brand-voice skill
- Critique/audit of a live site without a rebuild → a design-audit or SEO skill
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
└── quality-report.md                 # final gate results + degradations + open items
.firecrawl/                           # raw scrape outputs
```

## Phase protocol

Read the reference file named in each phase before running it the first time.

### Phase 0 — Intake → locked brief (serial, Creative Director)

Read `references/creative-brief.md`. Gather context from: the user's message,
any supplied docs, existing VOICE PROFILE, the user's client-context folder
if the local-service preset is on. If rebuilding, capture the existing site URL. Draft `BRIEF.md`
(every required field filled or explicitly defaulted). If anything material is
missing or ambiguous, batch it into ONE AskUserQuestion (brief confirm + stack
+ top-3 style directions + AI-image consent). Lock the brief. Write
`next-task.md` → `phase-1`.

Style direction must be a real one (editorial, neo-brutalism, dark/light
luxury, bento, scrollytelling, Swiss, retro-futurism, …). "Clean and modern"
is the banned default — pick 3 candidates from research + reference pack and
have the user choose in the single batch (or choose yourself if pre-approved,
recording the rationale in DIRECTION.md).

**Exit:** BRIEF.md locked. **Queue mode:** if the invocation lists multiple
clients, write `queue.md` and run Phases 0–5 per client serially; one review
package per site. See `references/local-service-preset.md`.

### Phase 1 — Research fan-out (parallel, barrier at end)

Read `references/research-protocol.md` and `references/agent-team.md`. Spawn
ALL research agents in ONE message, `run_in_background: true`:

- `sd-research-brand` — only if rebuild/reference URL exists; scrapes the
  existing site's design system (branding + screenshots) → `research/brand.md`
- `sd-research-competitors` — map + scrape 3–5 competitor sites →
  `research/competitors.md`
- `sd-research-trends` — reads `reference-pack/` then live-deltas niche
  trends → `research/trends-delta.md`
- `sd-research-keywords` — a `seo-specialist` agent if you have one, else
  general-purpose + AEO question mapping → `research/keywords.md`
- `sd-research-personas` — brief + client-context docs → `research/personas.md`

Barrier: proceed when all five files exist (or their agents reported
degradation). Log arrivals in `build-log.md`.

### Phase 2 — Synthesis (serial, Creative Director — this is YOUR craft)

Read all five research files + `reference-pack/trends-2026.md`,
`typography-2026.md`, `color-2026.md`. If you have companion design-
intelligence skills installed (see the composition table), query them for
style/palette/typography candidates; otherwise the reference pack + research
files carry the choice. If no VOICE PROFILE was supplied, derive one from
the client's existing materials (a `brand-voice` skill formalizes this if
installed; a careful reading of their site/reviews/docs works without it).

Write three artifacts:
- `DIRECTION.md` — chosen style direction + why (traced to brief/research),
  motion language, imagery/asset plan, what we're deliberately NOT doing
- `SITE.md` — page table (route, purpose, **per-page conversion goal** from
  `references/cro-playbook.md`), nav model, internal-link plan
- `DESIGN.md` — full token system: OKLCH colors, type pairing (from research
  or reference pack; Google-Fonts-available), clamp() scales, spacing, radius,
  shadow, motion durations/easings, component inventory

**Exit:** all three exist and every choice traces. No user gate.

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
Director spawns a `build-error-resolver` agent if you have one (else debugs
inline) scoped to the error.

**Exit:** all pages built, `npm run build` (or recipe equivalent) exits 0,
dev server up. Write `next-task.md` → `phase-4`.

### Phase 4 — QA loop (supervisor loop, ≤3 iterations)

Read `references/qa-rubric.md`. Each iteration:

1. Run mechanical gates first: `node scripts/gate-check.mjs <project-dir>`
   (+ any anti-slop detector you have installed, e.g. impeccable's detect.mjs).
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
| 3 Build | copywriter ∥ builder, seo tail | build green + pages done |
| 4 QA | loop: gates → evaluator → builder | score ≥7.5 & no CRITICAL, ≤3 iters |
| 5 Package | serial (CD) | user's final review |

## Composition table (optional enhancers — compose, don't duplicate)

Site-director is self-contained: the reference pack, playbooks, and scripts
in this repo carry every phase. If you ALSO have these companion skills or
agents installed, invoke them where the table says — each one deepens a
phase; none is required.

| Need | If installed, use | Without it |
|---|---|---|
| Style/palette/type intelligence | a design-intelligence skill (e.g. ui-ux-pro-max) | `reference-pack/` trends/typography/color files |
| Design QA / critique / motion polish | a design-critique skill (e.g. impeccable) + its detectors | `references/qa-rubric.md` + `scripts/gate-check.mjs` |
| Rebuild design-system scrape | a site-clone skill (e.g. firecrawl-website-design-clone) | `references/research-protocol.md` rebuild recipe |
| Voice profile | a brand-voice skill | derive from client materials in Phase 2 |
| SEO audit depth | an SEO skill / seo-specialist agent | `references/seo-aeo-geo.md` checklists |
| CRO audit pass | a conversion-audit skill | `references/cro-playbook.md` rubric hooks |
| Build failures | a build-error-resolver agent | builder self-diagnoses, then you debug inline |
| Hard rules (always in force) | your own web rule pack, if you keep one | the gates in `references/qa-rubric.md` (self-contained) |

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
| Dev server won't start | builder self-diagnoses (or a build-error-resolver agent); if still red after 2 passes, code-only QA + open item |
| Evaluator stalls (no file in ~10 min) | check artifact mtimes; respawn once fresh |
| Score plateaus < 7.5 after 3 iters | ship with Open Items — the user's review decides |
| Context pressure mid-run | artifacts already on disk; summarize + continue from `next-task.md` |
| User interrupts mid-run | state saved; next invocation resumes |

## Reference index

| File | Read when |
|---|---|
| `references/creative-brief.md` | Phase 0 |
| `references/research-protocol.md` | Phase 1, and when refreshing the pack |
| `references/agent-team.md` | before any spawn (1, 3, 4) |
| `references/stack-recipes.md` | Phase 3 scaffold |
| `references/motion-registry.md` | Phase 3 build |
| `references/cro-playbook.md` | Phases 2–3 (page goals, copy, layouts) |
| `references/seo-aeo-geo.md` | Phase 3 tail + Phase 4 gates |
| `references/qa-rubric.md` | Phase 4 |
| `references/local-service-preset.md` | local-service briefs + queue mode |
| `reference-pack/*` | Phase 2 synthesis; trends delta in Phase 1 |
