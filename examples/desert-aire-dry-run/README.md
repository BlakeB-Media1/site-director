# Example run: Desert Aire Heating & Cooling

A complete, real site-director run — the validation dry run from the
skill's build session (July 2026). **The client is fictional** (invented
business, 555 phone number, fictional address/license/domain), but every
artifact here is genuine output: real competitor scrapes, real research,
real copy decks, real QA failures and fixes.

Final result: a 4-page Astro site scoring **8.4/10** (PASS) in 2 QA
iterations, 63.1kb gz JS against an 80kb budget, ~20 Firecrawl credits.
The full narrative is in [../../BUILD-STORY.md](../../BUILD-STORY.md).

## Reading order

| File | What it shows |
|---|---|
| `BRIEF.md` | the ONE approval — a complete pre-approved brief (Phase 0) |
| `research/competitors.md` | teardown of 3 real Phoenix-market HVAC sites + exploitable gaps |
| `research/trends-delta.md` | baked-pack baseline + live niche delta → 3 direction candidates |
| `research/keywords.md` | keyword map + 14-question AEO set, page-assigned |
| `research/personas.md` | personas + objection→proof mapping |
| `DIRECTION.md` | the Creative Director's synthesis — every choice traced |
| `SITE.md` / `DESIGN.md` | page map w/ per-page conversion goals · OKLCH token system |
| `copy/copy-deck-*.md` | every word of the site, voice-checked, with the builder-deviation reconciliation recorded |
| `feedback/feedback-001.md` | iteration 1: **7.7 FAIL** — evaluator's own contrast math caught what the gates couldn't |
| `feedback/feedback-002.md` | iteration 2: **8.4 PASS** — blind re-score, all fixes independently verified |
| `quality-report.md` | the final package: gates, scores, degradations, open items, deploy instructions |
| `research/seo-pass-notes.md` | the SEO engineer's shipped/withheld decisions (note the schema-honesty call on fictional reviews) |

## Things worth noticing

- The brief's fictional "312 reviews, 4.9★" never renders anywhere — the
  schema-honesty rule forbids structured data the page can't back. The
  re-enable path is documented for when real review data exists.
- Iteration 1's CRITICAL (2.98:1 contrast) was found by the *evaluator
  doing math*, not the mechanical gates — which is why the rubric now
  requires it.
- The copywriter and builder resolved four spec deviations peer-to-peer,
  with the decks updated to stay the source of truth.
- The generated site itself isn't committed here (it's ~a full Astro
  project); these are the orchestration artifacts, which is what the skill
  is about.
