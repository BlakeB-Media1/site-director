# How Site Director Was Built

The skill was designed, researched, written, and validated end-to-end in a
single Claude Code session (July 2026) — using the same multi-agent
patterns the skill itself encodes. This document is the build log, kept
because the process is half the product: the dry run's failures shaped the
shipped skill.

## 1. Recon (three parallel explorer agents)

Before a line was written, three agents mapped the terrain:

- **Skill inventory** — ranked the local design-skill library (design
  intelligence databases, critique engines, taste/anti-slop references,
  an existing phase-gated website-builder skill) to decide what to
  *compose* vs what the new skill had to own itself. Verdict: the new
  ground was orchestration + CRO + AEO/GEO; everything visual already
  existed to be referenced, not rewritten.
- **Orchestration layer** — mapped agent-team messaging patterns, a
  GAN-style planner/generator/evaluator harness (the direct ancestor of
  this skill's build↔QA loop, including its weighted-rubric scoring and
  "ruthlessly strict" evaluator stance), and the Firecrawl CLI's exact
  command palette.
- **Live web research** — settled the "Framer / 21st.dev" question with
  current facts: `framer-motion` is now `motion` (v12, MIT, independent);
  component registries (Aceternity, Magic UI, React Bits, Tailark,
  HyperUI) are pullable via the shadcn CLI with no API keys; generative
  component services need metered keys and were rejected for the build
  path. Also shortlisted the AEO/GEO evidence base and the trend/type/color
  crawl targets.

## 2. Design decisions that survived

- **Creative Director = the main session**, not a spawned agent. Only the
  main thread holds the approval tool, the user's context, and arbitration
  authority; relaying those through a sub-agent adds a lossy hop.
- **One approval, then immutability.** The brief is the permission slip
  and the leash. Mid-run discoveries become quality-report open items,
  never questions.
- **Artifacts are memory.** Every phase writes files; agents read files,
  not transcripts. Messages carry pointers. This is what makes runs
  resumable and context-pressure-proof.
- **Two QA layers.** Deterministic gates (grep-able failures: banned
  animation properties, div ratios, missing schema/llms.txt, bundle
  budgets) run first and cost nothing; a fresh evaluator per iteration
  handles everything needing judgment — fresh, so it can't anchor on its
  own previous scores.
- **Registries + Motion over builder integrations**: deterministic, free,
  MIT, reproducible, no keys.

## 3. Baking the reference pack

Three parallel agents researched and distilled the 2026 pack in ~15
Firecrawl credits (most sources fetched free):

- **Registry catalog** — scraped six registry indexes, curl-verified ~115
  install endpoints (93 marked ✓ in the shipped catalog), and captured
  live gotchas: one registry had pivoted platforms entirely, another's
  documented path 404s in favor of `/registry/{slug}.json`, a third
  gates some items behind login.
- **Trends / typography / color** — gallery + trend-report sweep,
  cross-checked against a 74-pairing font corpus (13 of the 20 shipped
  pairings were net-new), OKLCH values computed from the Ottosson
  conversion rather than transcribed, WCAG ratios computed per pair.
- **AEO/GEO playbook** — the sober version: Google removed FAQ rich
  results (May 2026); llms.txt sits at ~10% adoption with no confirmed
  major-crawler consumption (ship it as 15-minute insurance, don't
  oversell); the Princeton GEO paper's effect sizes pulled from the full
  text (quotations +41%, statistics +31%, citations +30%, keyword
  stuffing negative); a 16-row AI-crawler UA table from vendor docs.

## 4. The dry run (where it earned the version number)

A fictional client — **Desert Aire Heating & Cooling**, Mesa AZ residential
HVAC — went through all six phases for real. Everything in
[`examples/desert-aire-dry-run/`](examples/desert-aire-dry-run/) is the
actual output.

**Research fan-out**: four agents in parallel. Real competitor teardown
(three actual Phoenix-market HVAC companies; headline finding: none paired
a same-day promise with repair-first honesty, and none displayed a license
number on-page — an uncontested hero position). Trend delta on top of the
baked pack. Keyword/AEO map with 14 real customer questions. Personas with
an objection→proof table.

**Synthesis**: direction "Desert Editorial Warmth" — Fraunces + Nunito Sans
+ DM Mono eyebrows, warm Cloud-Dancer paper base + persimmon heat accent,
dual-journey conversion armature (emergency call path ∥ planned quote
path). Every choice traced to brief, research, or pack.

**Build**: copywriter and builder ran in parallel, reconciling through
SendMessage without the orchestrator's involvement — the copywriter
arbitrated four builder deviations, tokenized an over-specific success-state
time into the `site.ts` contract, re-voiced a flat FAQ heading, and resumed
the builder with the one required code change. The builder blew the 80kb
JS budget with full `motion/react` (~26kb), self-corrected to the
`motion/mini` WAAPI engine (3.5kb hero island), and hand-wrote the FAQ
accordion after checking the registry item animated `height` — which the
skill's own gates ban.

**QA loop, the honest part**:

| Iteration | Score | Verdict | What happened |
|---|---|---|---|
| seed | — | gate FAIL | a `transition: height` violation was deliberately planted; `gate-check.mjs` flagged the exact file:line; builder removed it |
| 1 | 7.7 | **FAIL** | evaluator's independent contrast math found step numerals at **2.98:1** (AA needs 4.5:1) — a failure class the grep gates can't see — plus 5 majors (NAP whitespace collapse, no 404, eager hydration, stripped native validation, hover contrast 4.35:1) |
| 2 | 8.4 | **PASS** | all six fixed with computed verification (2.98 → 14.84:1; NAP byte-identical ×5 including llms-full.txt; branded 404; `client:idle` islands; native no-JS validation restored; hover 4.56:1). Fresh evaluator scored blind, reproduced the contrast pipeline independently |

Final: 4 pages, 63.1kb gz JS (budget 80), 10/10 JSON-LD blocks parsing,
zero invented facts (the fictional review numbers were *withheld from
schema and UI* by the honesty rule — schema may only claim what the page
shows), ~20 Firecrawl credits total.

## 5. What the dry run changed in the skill

Seven lessons were folded back in before release — the reason the example
is worth shipping:

1. A read-only research agent can't write files → its prompt template now
   returns content for the Director to persist.
2. The brief template gained a required NAP/hours block (the copywriter
   had to tokenize facts that didn't exist).
3. The motion size ladder (CSS → `motion/mini` → `motion/react`) became
   doctrine after the budget blowout.
4. "Check the animation mechanics BEFORE pulling a registry item" became
   failure-ladder step 0.
5. `contrast-check.mjs` was harvested from the builder's fix work into the
   skill's scripts — and the rubric now *requires* the evaluator to do
   color math, naming the gate script's blind spot explicitly.
6. `client:idle` replaced `client:visible` as the below-fold hydration
   default (works in headless/hidden-tab QA environments; still defers).
7. Version drift is expected: recipes track "latest" and log actual
   versions instead of pinning majors (the dry run scaffolded a newer
   Astro/Tailwind/React than the recipe text assumed, frictionlessly).

## 6. Costs (so you can budget)

| Item | Credits |
|---|---|
| Reference pack bake (one-time, mostly free fetches) | ~15 |
| Dry-run research, `lite` budget | ~17–22 |
| Quarterly pack refresh (JS-heavy galleries) | ~100–150 |

Token-wise, a full run is a multi-agent workload — budget accordingly and
use the artifact files, not the transcript, as your source of truth when
reviewing.
