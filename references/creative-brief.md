# Creative Brief — the one approval gate

The brief is the entire authorization for the run. Everything the agent team
does afterward must trace back to a field in this file. That's why intake is
the only phase allowed to ask the user anything: a thin brief doesn't make the
run more flexible, it makes every later decision a guess made in the user's
name. Spend the effort here.

## Intake protocol

1. **Harvest before asking.** Pull answers from: the invocation message,
   attached docs, an existing VOICE PROFILE, prior `.site-director/` runs in
   the project, the agency hub (`01 - Projects\Website-Agency\` — offer.md,
   runbooks, personas) when the client is an agency client, and the existing
   site itself if this is a rebuild (a quick scrape answers most brand
   questions better than a questionnaire).
2. **Draft `BRIEF.md`** with every field below either filled or explicitly
   marked `DEFAULTED: <value> — <why>`.
3. **Decide: ask or proceed.**
   - Complete brief + user said "go" → invocation IS the approval. Skip the
     question. Record `APPROVED: via invocation, <date>` in the header.
   - Material gaps or a rebuild whose direction could plausibly go two ways →
     ONE AskUserQuestion batch (max 4 questions). Standard batch: (a) approve
     brief as drafted / with edits, (b) stack recipe, (c) style direction —
     top 3 candidates with one-line rationale each, (d) AI-image consent.
4. **Lock.** After approval, append `LOCKED: <timestamp>`. The brief is
   immutable for the run. New information discovered mid-run goes to
   `quality-report.md` § Open Items, never back into the brief.

## BRIEF.md template

```markdown
# Creative Brief — <Client / Project>
APPROVED: <via invocation | via question batch> <date>
LOCKED: <timestamp>

## Business
- Client / brand name:
- What they sell, to whom, where (one paragraph):
- Primary market / geography:            # drives GEO + local SEO if local
- Agency preset: on | off                # local-service overrides
- NAP + facts (REQUIRED for local; copywriter tokenizes, site.ts renders):
  phone (display + E.164) · street address · hours (incl. opening time —
  success-state copy references it) · GBP/review URL · socials
  # v1 dry-run lesson: without these the copywriter must invent-or-tokenize;
  # tokens work, but real facts here save a reconciliation round

## Brand & voice
- Brand guidelines source: <doc/url/none — if none, derive in Phase 2>
- VOICE PROFILE: <paste block | "generate via brand-voice in Phase 2">
- Logo / brand assets location:
- Non-negotiables (colors, taglines, legal lines, license numbers):

## Audience
- Personas: <paste | pointer to docs | "derive in Phase 1">
- Top 3 customer objections (if known):

## Conversion (CRO)
- Primary conversion action:             # e.g. "call or quote form"
- Secondary action:                      # e.g. "newsletter, service pages visit"
- Current metrics if rebuild (traffic, conv %, source):
- Offer / pricing display rules:

## Scope
- Build type: new | rebuild
- Existing site URL (rebuild):
- Pages: <route — purpose — conversion goal>   # or "tier: starter|pro|premium" w/ agency preset
- Stack recipe: A (Next.js) | B (Astro)        # see stack-recipes.md decision table
- Deploy target: Vercel | Netlify | Cloudflare Pages   # instructions only, never executed
- Domain (for canonical URLs, schema, llms.txt):

## Style
- Style direction: <one from the real list — never "clean/modern">
- Reference sites the client likes / hates:
- Theme: light | dark | both

## Assets
- Photography source: client-supplied at <path> | stock guidance | AI-generated
- AI image generation consent: yes | no        # captured HERE so the run never has to ask
- OG / social images: generate | supplied

## Research & measurement
- Research budget: full (~60-90 credits) | lite (~25-40) | offline (baked pack only)
- Competitors (3-5 URLs, or "find in Phase 1"):
- Analytics: GA4 id | none | add-later         # consent-mode snippet if GA4
```

Required minimum to lock without asking: Business block, primary conversion
action, pages (or tier), stack, style direction, research budget, AI-image
consent. Everything else may be DEFAULTED with a recorded reason.

## Defaults (when the user pre-approves a thin brief)

| Field | Default | Why |
|---|---|---|
| Stack | Recipe A; Recipe B if agency preset on | registry-native vs agency template |
| Theme | light | local-service trust; dark only by direction |
| Research budget | lite | best cost/coverage ratio |
| Deploy target | Vercel (A) / Netlify (B) | recipe-native |
| AI images | no | consent must be explicit, never assumed |
| Analytics | none | measurement is opt-in |

## Pre-flight: permissions (tell the user once, at intake)

Autonomy dies on permission prompts, and this skill must never bypass the
permission system. If this is the first site-director run in a project,
include one line in the approval batch or the intake summary: recommend
allowlisting `npm`, `npx`, `node`, `firecrawl`, and `git` in the project's
`.claude/settings.json` permissions so the build doesn't stall mid-run
waiting for a shell approval. The user does this manually, once. If they
decline, the run still works — it just may pause for prompts, which is their
choice, not a skill failure.

## Queue mode intake (agency batches)

If the invocation names multiple clients, write `.site-director/queue.md`
(one row per client: name, brief source, status) and collect ALL briefs
up front — the single approval batch covers the whole queue. Then run
Phases 0–5 per client serially. One review package per site. See
`agency-preset.md`.
