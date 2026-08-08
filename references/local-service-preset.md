# Local-Service Preset

Applied when the brief sets `Local-service preset: on`. Everything here
OVERRIDES the general defaults; anything not mentioned falls through to the
normal protocol. Built for lead-generation trades and home-services
businesses (HVAC, plumbing, electrical, roofing, landscaping, cleaning…) —
and written as a worked example of HOW to build a preset, so you can copy
this file and make your own vertical (see the footer).

## Hard overrides

| Default | Preset |
|---|---|
| Stack | Recipe B (Astro) — speed + static + programmatic pages |
| Theme | light (trust default for local service) |
| Primary conversion | phone call; quote form secondary |
| Sticky mobile call bar | MANDATORY every page |
| LocalBusiness JSON-LD | MANDATORY (most specific @type: HVACBusiness, Plumber, RoofingContractor, …) with geo, hours, areaServed, aggregateRating, license |
| License number | MANDATORY in trust strip + schema where the trade is licensed |
| Bundle budget | microsite: ≤80kb JS gz |
| NAP consistency | footer + contact + schema byte-identical |

## Tier → page sets (map to your own offer ladder)

| Tier | Pages |
|---|---|
| Starter | Home · Services (one page, all services) · About · Contact · Reviews |
| Pro | Home · per-service pages (from site.ts services[]) · About · Contact · Reviews · FAQ |
| Premium | Pro + per-city area pages (service_areas[]) + city×service programmatic pages + 2-3 seasonal landing pages |

Programmatic pages (`/areas/[city]`, `/[city]-[service]`) generate from
`site.ts` — one Astro dynamic route each, unique H1/intro/proof per page
(city-specific review quotes where available; engines and humans both punish
find-and-replace city swaps). The copywriter writes one TEMPLATE deck per
programmatic route with slot rules + per-city uniqueness requirements, not
N identical decks.

## site.ts is the client database

Populate once in Phase 3 scaffold, from the brief. Every client fact on the
site renders FROM it: phone (call bar, hero, schema), hours (footer,
schema), reviews (proof blocks, aggregateRating), license (trust strip,
schema), service_areas (area pages, areaServed). A fact that appears
anywhere else hard-coded is a defect (the evaluator is told to grep for
stray literals of the phone number).

## Messaging context (worked example: a desert-metro HVAC client)

How market context shapes the messaging spine — substitute your client's
market physics:

- Seasonality is real urgency: in a Phoenix-style desert metro, AC season
  (May–Sep, 110°+ heat) IS the business; monsoon damage (roof/electrical)
  clusters Jun–Sep. Seasonal landing pages and hero angles use ACTUAL
  season relevance — the brief's build date decides the lead angle. A
  Minneapolis furnace client inverts the calendar; a coastal roofer tracks
  storm season.
- Speed-of-response is the #1 conversion lever for urgent trades
  ("same-day", "2-hour window") — but only claims the brief authorizes.
- Multilingual markets: if the brief flags a second language, a nav-level
  toggle beats machine-translated footer links (note as Open Item if out
  of scope — don't half-ship i18n).
- Persona source order: brief → your client-context folder (personas,
  offer docs, call notes) → review mining. Homeowner-urgent vs
  property-manager-planned are the two default personas for home services
  when nothing else is known.

## Proof pattern (local service)

Rating + count adjacent to every primary CTA ("4.9★ · 312 Google reviews" —
real numbers only; the schema-honesty rule withholds anything not shown
on-page). Link the count to the Google Business Profile reviews URL. Photo
proof: real trucks/techs/jobs from the client's assets; NEVER stock hardhat
people — an empty proof slot plus an Open Item beats fake proof.

## Lead routing note (packaged, not executed)

Form submits need a destination the client actually checks: default
Netlify/CF form email notification to the brief's contact email; SMS
forwarding (Twilio/Zapier) is a common follow-on — flag it in
quality-report.md so the site owner sees the option.

## Queue mode (multi-client batches)

`.site-director/queue.md`:

```markdown
# Site Director Queue — <date>
| # | Client | Brief | Status | Score | Review package |
|---|--------|-------|--------|-------|----------------|
| 1 | <name> | <path or inline> | pending/building/done | — | — |
```

Rules: collect ALL briefs at intake (the single approval covers the queue) ·
process serially (one dev server, one context at a time; parallel client
builds trade coherence for speed and lose) · update the row after each
Phase 5 · one review package per client · a failed build doesn't stop the
queue (mark FAILED + open items, continue) · after the last client, one
summary message: table + links to every quality-report.md.

## Build your own preset

Copy this file to `references/<vertical>-preset.md` and change four things:

1. **Hard overrides table** — stack, theme, conversion action, and the
   non-negotiables your vertical's buyers expect (license? certifications?
   portfolio? menu?).
2. **Page-set tiers** — map to how you actually package the work.
3. **Messaging context** — your market's physics: seasonality, urgency,
   proof norms, decision-makers.
4. **Proof pattern** — what trust looks like in that vertical (reviews vs
   portfolio vs credentials vs case studies).

Then reference it from the brief (`<vertical> preset: on`) and add one line
to SKILL.md's reference index. The orchestrator picks it up like any other
reference file.
