# CRO Playbook

Conversion isn't a section of the site; it's the reason each page exists.
Phase 2 assigns every SITE.md page a conversion goal from this file; the
copywriter writes to it; the builder lays out for it; the rubric's CRO axis
scores against it. Lead-generation is the default lens (services businesses,
agency clients) — adjust for other models where noted.

## Page → conversion goal map (defaults)

| Page | Primary goal | Secondary |
|---|---|---|
| Home | primary action (call / quote form) | route to service pages |
| Service page | quote request for THAT service | call |
| Area/city page | call (local intent = urgent) | quote form |
| Pricing | primary action with plan preselected | FAQ engagement |
| About | trust transfer → primary action | reviews click-through |
| Contact | form submit or call | map/directions |
| Blog/article | newsletter or internal route | AEO/GEO visibility (see seo-aeo-geo) |

## Pattern library

### Hero (every page above the fold)
- **Message match**: H1 answers the exact query/ad that brought the visitor —
  service + place + outcome ("Same-Day AC Repair in Mesa"). The persona file
  tells you the angle; keywords.md tells you the words.
- ONE primary CTA, verb-first, visually loudest element after the H1.
  Secondary CTA (if any) styled clearly subordinate.
- For call-first businesses: phone number AS TEXT in the hero (tap-to-call,
  and AI answer engines quote it).
- Proof adjacency: rating + review count within eyeshot of the CTA. Proof
  next to the ask converts; proof in a far-away section decorates.
- No carousel heroes. No auto-playing video with sound. Ever.

### Social proof
- Real numbers beat adjectives: "4.9★ · 312 Google reviews" > "trusted by
  many". Pull from brief/site.ts — never invent (gate: every stat traces).
- Quote reviews with specifics (job type, city, outcome) — mined customer
  language doubles as GEO quotable material.
- Faces > logos > stars alone, when assets exist. Stock faces are worse than
  nothing (trust reads it instantly).

### CTAs
- Verb + outcome: "Get My Free Quote", "Book Service Today" — not "Submit",
  "Learn More".
- Accent token reserved for CTAs (semantic color — the rubric checks this).
- **Sticky mobile call bar** on every page for call-first businesses
  (agency preset: mandatory). Thumb-reachable, tel: link, doesn't cover
  content (safe-area padding).
- One primary action per viewport. Competing CTAs split intent.

### Forms
- ≤4 fields for a first contact (name, phone, service, note). Every field
  you add costs completions; ask the rest on the phone.
- Multi-step ONLY for quote builders (step 1 = the easy commitment: service
  type; contact info LAST — sunk-cost works for you).
- Inline validation on blur; error text says how to fix; success state
  confirms what happens next ("We'll call within 15 minutes" — set the
  expectation the business can keep, from the brief).
- `tel:` fallback adjacent to every form: "Prefer to talk? Call …".
- Honeypot or light anti-spam; never a CAPTCHA on a lead form if avoidable
  (friction kills; per security rules prefer honeypots).

### Pricing (when the brief shows pricing)
- Anchor high→low or feature the recommended tier (⭐ + "Most popular") —
  one visually elevated option, mirroring the offer ladder pattern.
- Price framing per brief rules; if the business quotes custom, sell the
  QUOTE (what they get, how fast) instead of hiding the price wall.
- FAQ under pricing handles the top 3 objections from personas.md.

### Trust blocks
- License/ROC number, insured/bonded, years, guarantees — rendered as a
  scannable strip, not a paragraph. (Agency preset: license number is a
  hard requirement — it's also in LocalBusiness schema.)
- Guarantees phrased as risk-reversal ("Fixed right or the diagnostic is
  free") only if the brief backs them.

### FAQ (objection handling + AEO dual-duty)
- 3–6 questions per page, from keywords.md question set + personas.md
  objections. Answer-first (the first sentence IS the answer, 40–80 words,
  quotable) — this is what answer engines lift.
- Marked up as FAQPage schema (seo-aeo-geo.md template).

### Urgency & seasonality
- Only true urgency: real response times, real seasonal demand ("AC season"
  in Phoenix is real; fake countdown timers are brand poison and the
  evaluator is told to flag them).

## Layout heuristics

- F-pattern for text-heavy, Z-pattern for hero→proof→CTA landers; either
  way the primary action appears in the first viewport AND after each
  major proof block (people convert when convinced, not at a fixed scroll
  depth).
- Directional cues (gaze, arrows, motion) point AT the CTA, never away.
- Whitespace around the primary CTA is part of the CTA.
- Mobile first in fact, not slogan: the call bar, form reachability, and
  LCP budget are mobile numbers (most local-service traffic is mobile,
  often urgent).

## Measurement (if brief enables analytics)

GA4 + consent mode v2 snippet; events: call clicks (tel: taps), form
submits, quote-builder step completion. Wire event names into
quality-report.md so the client can verify post-launch. No analytics
without the brief saying so.

## Rubric hooks (what the CRO axis checks)

1. Every page hits its assigned goal pattern (this file).
2. Primary action reachable in one thumb move on mobile.
3. Proof adjacent to ask.
4. Forms follow the field/validation/fallback rules.
5. Zero fake urgency, zero unverifiable claims.
