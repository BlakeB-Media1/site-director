# QA Rubric — gates, axes, loop

Two layers, run in order. Mechanical gates are deterministic and cheap — they
catch the objective failures so the evaluator spends judgment only where
judgment is needed. The rubric axes are scored by a FRESH evaluator each
iteration (a reused evaluator anchors on its own previous scores; fresh eyes
keep the bar honest).

## Layer 1 — CRITICAL gates (mechanical, zero tolerance)

Run `node <SKILL_DIR>/scripts/gate-check.mjs <PROJECT_DIR>` (+ any anti-slop
detector you have installed — e.g. the impeccable skill's detect.mjs).
ANY failure = automatic FAIL for the iteration regardless of scores; the fix
list goes straight to the builder.

Known blind spot (v1 dry-run lesson): gate-check greps — it does NO color
math. The evaluator MUST compute contrast for every text-on-fill pair
(`node <SKILL_DIR>/scripts/contrast-check.mjs` gives the OKLCH→ratio
pipeline; extend its pairs to the project's actual combinations). An
evaluator-computed AA failure counts as CRITICAL exactly like a gate row.

| Gate | Rule | Source |
|---|---|---|
| Animation properties | no animation/transition on width/height/top/left/margin/padding/border/font-size — transform/opacity/clip-path/filter only; `prefers-reduced-motion` fallback present | coding-style rule |
| Semantic HTML | div count ≤ 5× semantic elements (header/nav/main/section/article/aside/footer) | stitch gate 8b |
| Anti-template | page shows ≥4 of the 10 design qualities (below); centered-hero + gradient blob + uniform cards + gray-on-white = instant fail | design-quality rule |
| Schema | every JSON-LD block parses; required page types present (seo-aeo-geo.md) | — |
| AEO files | llms.txt present + robots.txt with AI-crawler section + sitemap | — |
| Accessibility | axe: zero serious/critical; visible focus; contrast AA (4.5:1 body, 3:1 large); labels on all inputs; alt on all imgs | testing rule |
| Build | recipe build exits 0 | — |
| Forms | primary conversion path works end-to-end (submit → success state) | CRO floor |
| Bundle | landing ≤150kb JS gz (Next) / microsite ≤80kb (Astro agency); CSS ≤30kb | performance rule |
| CWV | LCP <2.5s, INP <200ms, CLS <0.1 (Lighthouse, local) | performance rule |

The 10 design qualities (anti-template gate counts these): scale-contrast
hierarchy · intentional spacing rhythm · depth/layering · real type pairing ·
semantic color · designed hover/focus/active states · grid-breaking or bento
composition · texture/atmosphere where fitting · motion that clarifies ·
data-viz as part of the system.

## Layer 2 — Rubric axes (evaluator judgment, 1–10 each)

| Axis | Weight | What 8+ looks like |
|---|---|---|
| Design quality | .20 | direction executed with conviction; hierarchy obvious at arm's length; nothing reads template |
| Brand & voice fidelity | .15 | DIRECTION.md + VOICE PROFILE recognizable in every section; zero off-brand drift |
| Craft | .15 | spacing/alignment/radius consistent; polished states; no orphan elements; code clean |
| CRO readiness | .15 | every page hits its SITE.md conversion goal per cro-playbook.md; primary action unmissable on mobile |
| SEO/AEO/GEO readiness | .15 | keyword-mapped metas, schema complete, FAQ answer-first, internal links per plan |
| Functionality | .10 | every feature + edge case works (long text, empty, rapid clicks) |
| A11y + performance | .10 | beyond the gate floor: keyboard flow feels designed; CWV comfortably inside budget |

```
weighted = design*.20 + brand*.15 + craft*.15 + cro*.15 + seo*.15 + func*.10 + a11yperf*.10
PASS = weighted ≥ 7.5 AND zero CRITICAL gate failures
```

### Calibration (hold the line)

1–3 broken/embarrassing · 4–5 functional but clearly AI-generated ·
6 decent, unremarkable · 7 solid junior work · 8 professional with rough
edges · 9 senior, polished · 10 ship-as-real-product. "Overall good effort"
is cope; do not award potential. Compare against what a professional human
team would ship for a paying client.

## feedback-NNN.md format (exact)

```markdown
# Evaluation — Iteration NNN  (mode: playwright|screenshot|code-only)

## Gate results
<copy of gate-results-NNN.json summary — pass/fail per gate>

## Scores
| Axis | Score | Weight | Weighted |
|---|---|---|---|
| Design quality | X | .20 | X.X |
| Brand & voice fidelity | X | .15 | X.X |
| Craft | X | .15 | X.X |
| CRO readiness | X | .15 | X.X |
| SEO/AEO/GEO readiness | X | .15 | X.X |
| Functionality | X | .10 | X.X |
| A11y + performance | X | .10 | X.X |
| **TOTAL** | | | **X.X / 10** |

## Verdict: PASS / FAIL (≥7.5 + zero CRITICAL)

## Critical (must fix)
1. [what's wrong] → [how to fix, element-specific]
## Major (should fix)
## Minor (nice to fix)
## Improved since last iteration
## Regressed since last iteration
## Next-iteration priorities (top 3, concrete)
```

Feedback quality rules (inherited from the GAN evaluator): every issue has a
how-to-fix · reference specific elements/files · quantify where possible
("CLS 0.15, budget 0.1") · compare against SITE.md/spec · acknowledge real
improvements (calibrates the loop).

## Loop protocol (Creative Director runs this)

```
for N in 1..3:
  run gate-check.mjs (+ optional detectors) → .site-director/gate-results-N.json
  if mechanical CRITICALs: send fix list to sd-builder, re-run gates, continue
  spawn fresh sd-qa-evaluator (iteration N) → feedback-NNN.md
  arbitrate (agent-team.md rules) → forward actionable list to sd-builder
  builder fixes, commits "qa-iter-N"
  if PASS: break
if no PASS after 3: remaining items → quality-report.md § Open Items; proceed to Phase 5
```

Evaluator degradation ladder: Playwright → screenshot-only (browser tools) →
code-only (build/lint/greps). State the mode in the feedback header; a
code-only pass caps Functionality at 7 (untested interactivity can't score
higher — you didn't see it work).
