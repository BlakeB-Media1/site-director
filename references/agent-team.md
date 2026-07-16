# Agent Team — roster, prompts, wiring

The Creative Director is the MAIN SESSION, not a spawned agent. Reasons this
matters: the main session holds the Skill tool, AskUserQuestion (Phase 0 only),
the user's full context, and the authority to arbitrate. Relaying those
through a sub-agent adds a lossy hop and nothing else. You direct; agents
produce.

## Rules of engagement

1. Spawn every agent of a phase in ONE message (`run_in_background: true`,
   explicit `name:`). Names take the `sd-` prefix — other named agents may be
   live in the session.
2. Prompts must be self-contained: agents get FILE PATHS, not conversation
   history. If an agent needs a fact, it's in the brief, a research file, or
   the reference pack — point to it.
3. SendMessage carries pointers ("deck ready: .site-director/copy/copy-deck-home.md")
   + one-line summaries. Payloads live on disk.
4. Every agent prompt ends with done criteria + where to report. An agent
   that can't finish reports WHAT it produced, what degraded, and why —
   partial artifacts beat silent stalls.
5. Stall recovery: no message and no artifact mtime change for ~10 minutes →
   respawn once, fresh, same prompt. Second stall → do that agent's work
   inline (you have the same instructions) and log it.

## Roster

| Name | Base | Phase | Long-lived? |
|---|---|---|---|
| Creative Director | main session | all | — |
| sd-research-brand | general-purpose | 1 | no |
| sd-research-competitors | general-purpose | 1 | no |
| sd-research-trends | general-purpose | 1 | no |
| sd-research-keywords | **seo-specialist** (existing) | 1 | no |
| sd-research-personas | general-purpose | 1 | no |
| sd-copywriter | general-purpose | 3 | until decks done |
| sd-builder | general-purpose | 3–4 | YES — owns code + dev server |
| sd-seo-engineer | general-purpose | 3 tail | no |
| sd-qa-evaluator | general-purpose (gan-evaluator adaptation) | 4 | NO — fresh each iteration |
| build-error-resolver | existing agent, as-is | 3–4 on demand | no |
| code-reviewer | existing agent, as-is | 4 optional, once | no |

## Prompt templates

Replace `<PROJECT_DIR>`, `<SKILL_DIR>` (= this skill's directory), and
brief-specific values. Keep the structure; tighten wording freely.

### sd-research-brand (only when rebuild/reference URL exists)

```
Extract the design + content reality of <EXISTING_URL> for a rebuild.
Follow the firecrawl-website-design-clone skill recipe: scrape with
--format branding + a full-page screenshot, plus 3-5 key inner pages as
markdown. Distill to <PROJECT_DIR>/.site-director/research/brand.md:
current palette/type/spacing, page inventory, content worth keeping,
what's broken (dated patterns, missing trust signals, weak CTAs).
Read the brief first: <PROJECT_DIR>/.site-director/BRIEF.md.
Firecrawl from Bash = bare `firecrawl`. Budget: ≤10 credits.
Done = file written. SendMessage main: "brand.md ready" + 3-bullet summary.
```

### sd-research-competitors

```
Competitive teardown for <CLIENT> (<NICHE>, <MARKET>). Competitors:
<URLS or "find 4 via firecrawl search '<niche> <city>'">.
Per competitor: firecrawl map (find money pages), scrape home + 1-2 service
pages (--format markdown --only-main-content). Analyze: positioning, offer,
proof (reviews/badges/guarantees), CTAs, gaps we can exploit.
Write <PROJECT_DIR>/.site-director/research/competitors.md:
comparison table + "exploitable gaps" list + per-competitor 3-bullet notes.
Budget: ≤<15|25> credits (lite|full). Skip a competitor that won't scrape.
Done = file written. SendMessage main: "competitors.md ready" + top gap.
```

### sd-research-trends

```
Trend delta for a <STYLE_DIRECTION> <SITE_ARCHETYPE> build, July 2026.
FIRST read the baked pack: <SKILL_DIR>/reference-pack/trends-2026.md,
typography-2026.md, color-2026.md — that's the baseline, don't re-research it.
THEN one live pass: firecrawl search "<niche> website design 2026" --scrape
--limit 3 --json. Note only what's NEW or niche-specific vs the pack.
Write <PROJECT_DIR>/.site-director/research/trends-delta.md: confirmed
direction candidates (3), palette + type candidates fitting the brief's
style direction, anti-patterns to avoid for this niche.
Budget: ≤8 credits. Done = file written. SendMessage main: 1-line delta.
```

### sd-research-keywords (spawn as seo-specialist)

The seo-specialist agent base is READ-ONLY (Read/Grep/Glob/WebSearch/WebFetch —
no Write/Bash). Its prompt must therefore end with: "Return the COMPLETE
keywords.md content as your final message — you cannot write files; the
Creative Director persists it." Budget zero firecrawl for this agent
(it has no shell). Verified in the v1 dry run: it correctly refused to claim
a write it couldn't do.

```
Keyword + answer-engine map for <CLIENT>, <SERVICES>, <MARKET>.
Deliver <PROJECT_DIR>/.site-director/research/keywords.md:
1. Per SITE.md page (see <PROJECT_DIR>/SITE.md draft in brief if present):
   primary keyword, 2-3 secondary, search intent.
2. Local pack terms (service + city permutations) if local business.
3. AEO question set: 10-15 real questions customers ask (People-Also-Ask
   style) mapped to pages — these become FAQ blocks + FAQPage schema.
4. Title/meta patterns per page type.
Use WebSearch/WebFetch only (you have no shell or write tools).
Done = return the COMPLETE keywords.md content as your final message —
the Creative Director writes it to disk.
```

### sd-research-personas

```
Persona brief for <CLIENT>. Inputs: <PROJECT_DIR>/.site-director/BRIEF.md
(Audience block), <AGENCY_HUB personas if preset on>, competitors.md if
already present. Produce <PROJECT_DIR>/.site-director/research/personas.md:
2-3 personas (job-to-be-done, top objections, decision triggers, device +
urgency context) + per-persona messaging angle + objection→proof mapping
(which trust element answers which fear). No web research needed unless the
brief is thin — then ≤5 firecrawl credits on review-mining (scrape client's
+ competitors' review pages for actual customer language; quote it).
Done = file written. SendMessage main: "personas.md ready".
```

### sd-copywriter

```
You write every word of the site. Inputs (read all first):
.site-director/BRIEF.md (VOICE PROFILE — it is law), DIRECTION.md, SITE.md,
research/personas.md, research/keywords.md, research/competitors.md,
<SKILL_DIR>/references/cro-playbook.md, <SKILL_DIR>/references/seo-aeo-geo.md
(§copy patterns).
Per SITE.md page, write .site-director/copy/copy-deck-<slug>.md:
- H1 (keyword-mapped, persona-angled) + subhead
- Section-by-section copy in SITE.md order (hero → proof → services → …)
- CTAs (verb-first, one primary per page)
- FAQ: 3-6 answer-first Q&As from keywords.md question set (quotable,
  40-80 word answers — they double as FAQPage schema + AEO fodder)
- Meta title (≤60) + description (≤155)
- Microcopy: form labels, buttons, error/success states
Voice check every deck against the VOICE PROFILE before marking done.
Banned: hype adjectives without proof, "we're passionate about", any claim
the brief can't back. Every stat needs a source from research files.
As EACH deck finishes: SendMessage sd-builder "deck ready: <path>".
When all done: SendMessage main "copy complete: N decks".
```

### sd-builder (long-lived; gan-generator discipline)

```
You build the site and keep it green. Inputs (read first):
.site-director/BRIEF.md, DIRECTION.md, SITE.md, DESIGN.md,
<SKILL_DIR>/references/stack-recipes.md (Recipe <A|B>),
<SKILL_DIR>/references/motion-registry.md, and the gate rules in
<SKILL_DIR>/references/qa-rubric.md (they're the law you build against).
Sequence:
1. Scaffold per recipe. git init if needed. Commit "scaffold".
2. tokens.css from DESIGN.md (OKLCH). Layout shell (nav/footer) first.
3. Build pages as copy decks arrive (SendMessage from sd-copywriter;
   also poll .site-director/copy/ every few minutes as fallback).
   Registry components per motion-registry.md (≤2 showpieces/page,
   swap framer-motion→motion), custom motion via Motion primitives,
   semantic HTML, a11y as you go (labels, focus rings, contrast, alt).
4. Commit per page: "page: <slug>". Append one line to build-log.md.
5. Keep dev server running. After all pages: run the recipe verify build;
   fix or escalate. Write builder-state.md (what's built, port, known gaps).
Phase 4: you receive fix lists (gate output + feedback-NNN.md path).
Fix EVERY item or state why not (with evidence). Commit "qa-iter-N".
Never: deploy, touch BRIEF.md, ask the user anything.
Report to main when: scaffold up, each page done, build green, each QA
iteration done. Pointers + one line only.
```

### sd-seo-engineer

```
Technical SEO/AEO/GEO pass on the built site at <PROJECT_DIR>.
Inputs: SITE.md, research/keywords.md, copy decks (meta lines),
<SKILL_DIR>/references/seo-aeo-geo.md (checklists + templates — follow it
exactly), site.ts if Recipe B.
Do: per-page title/meta/canonical wired; JSON-LD per page type (values from
site.ts/brief — no invented facts); llms.txt + llms-full.txt; sitemap;
robots.txt with the AI-crawler allowlist; security headers per recipe;
internal links per SITE.md link plan; OG tags + image refs.
Validate: JSON-LD parses (node script or manual), no page missing meta.
Commit "seo pass". Write .site-director/research/seo-pass-notes.md with
anything you couldn't complete + why.
Done = commit + notes. SendMessage main: "seo pass done" + gaps if any.
```

### sd-qa-evaluator (fresh spawn per iteration)

```
You are the Evaluator (iteration <N>) — QA engineer + design critic. Be
ruthlessly strict: a pass must mean genuinely good, not "good for an AI".
Do NOT read previous feedback files first — score blind, then diff.
Inputs: <SKILL_DIR>/references/qa-rubric.md (rubric + gates + calibration),
.site-director/BRIEF.md + DIRECTION.md (brand fidelity axis), SITE.md,
copy decks (voice check), mechanical gate output at
.site-director/gate-results-<N>.json (already run for you).
Test the LIVE app at <URL> (Playwright if available; else screenshots via
the browser tools; else code-only — state your mode).
Walk every page: first impression, feature/interaction pass (forms! the
primary conversion path gets tested end-to-end), responsive 375/768/1440,
keyboard nav, edge cases (long text, empty states, rapid clicks).
Score all 7 axes per the rubric. Weighted formula + PASS rule are in the
rubric. Then read feedback-<N-1>.md (if N>1) and fill improved/regressed.
Write .site-director/feedback/feedback-<NNN>.md in the rubric's exact
format. Every issue: what's wrong → how to fix, referencing specific
elements. Done = file written. SendMessage main: "iter <N>: <score> —
<PASS|FAIL>, <X> critical".
```

## Arbitration (Creative Director, Phase 4)

Read every feedback file before forwarding. You may:
- **Overrule taste**: evaluator wants a different aesthetic than DIRECTION.md
  → brand fidelity wins; strike the item, log the override in build-log.md.
- **Never overrule**: CRITICAL gates (mechanical or rubric) — they're the
  floor, not opinions.
- **Downgrade**: an issue that contradicts the brief (e.g. evaluator wants
  pricing shown, brief says no pricing) → strike, log.
- **Escalate**: 3 iterations without pass → stop looping; open items go in
  quality-report.md. Do not burn iterations 4+ chasing decimals — the user's
  final review exists for exactly this judgment call.

## Optional: Workflow-tool variant (Phase 1 only)

If the session supports the Workflow tool, the research fan-out maps cleanly
to a single-phase workflow (5 parallel `agent()` calls with a schema-forced
summary each, barrier, then synthesis inline). Use it when you want
deterministic fan-out + progress UI; skip it when in doubt — the Agent-tool
pattern above is the portable default and behaves identically for this
phase's purposes.
