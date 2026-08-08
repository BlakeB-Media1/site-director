# Copy Deck — Home (`/`)

Desert Aire Heating & Cooling · Dry-run fictional client
Conversion goal: **phone call** (primary) · route to /services quote form (secondary)
Primary keyword: `ac repair mesa az` · Persona lead: #1 "No-Cool Right Now" homeowner

## Deck-wide rules & tokens

- **Tokens** (builder pulls values from `site.ts` — never hardcode):
  `{{PHONE}}` display number · `{{PHONE_TEL}}` tel: href · `{{HOURS}}` open hours ·
  `{{ADDRESS}}` street address for NAP. NAP block must be byte-identical on every page.
- **Placeholders:** review rating/count does not exist (fictional client, no corpus).
  Slots marked `[REVIEWS — PLACEHOLDER]` render a neutral treatment; never invent
  numbers or quotes. In a real engagement: pull rating + count from Google Business
  Profile and mine quotes themed honesty/punctuality.
- **Claims discipline:** no prices, no discounts, no 24/7 claim (brief doesn't back
  one), no invented operational stats. "Licensed, bonded, insured" and pledge wording
  derive from research (personas.md marks pledge language *proposed* — confirm with
  client before a real launch).
- Hints render as helper text near the field/control — never as input `placeholder`
  attributes.
- **Approved builder deviations (2026-07-15):** NAP includes zip 85213 (sourced from
  site.ts, byte-identical everywhere incl. GBP); FAQ sections use the voiced chrome
  heading specified in section 06 (eyebrow "FAQ" + "Quick answers, no runaround.").

---

## Meta

- **Title (49):** AC Repair Mesa AZ | Desert Aire Heating & Cooling
- **Description (153):** Same-day AC repair in Mesa, AZ from a family-run crew serving the East Valley for 14 years. Free quotes, honest diagnosis, no surprise upsells. Call now.

---

## 01 · Hero (dual CTA)

**Eyebrow (mono):** SAME-DAY · MESA, AZ · ROC #329417

**H1:** Same-Day AC Repair in Mesa, AZ

**Subhead:** We know what 115° feels like. If your AC quit, we can usually be there
today — with a free written quote in your hand before we touch a thing.

**Proof line (directly above CTAs — this is the positioning sentence):**
Quote today, fixed tomorrow. And we'll tell you straight when a repair is enough.

**Primary CTA (loudest element after H1):** Call {{PHONE}}
— renders the number as text, `href="{{PHONE_TEL}}"`. Support microline beneath:
"Tap to call — fastest way onto today's schedule."

**Secondary CTA (visibly subordinate):** Get a Free Quote → `/services#quote-form`

**Trust microline (under CTAs):** Family-run in Mesa for 14 years · Licensed AZ ROC #329417

---

## 02 · Trust strip (ROC + reviews + same-day)

Scannable strip, four items, no paragraphs:

1. **Licensed & bonded** — AZ ROC #329417
2. **Family-run** — 14 years in Mesa
3. **Same-day service** — Mesa, Gilbert, Chandler, Tempe
4. `[REVIEWS — PLACEHOLDER]` — reserve slot for "★ rating · count Google reviews";
   until real data exists, render: **Written quotes, no surprises** — "The number
   you approve is the number you pay."

---

## 03 · Services trio (each card links to a /services anchor)

**Eyebrow (mono):** WHAT WE DO

**Section head:** Three jobs. One straight answer first.

**Card 1 — AC Repair** → `/services#repair`
Warm air, weak air, no air. We diagnose it, show you the part that failed, and fix
it with your written OK — usually the same day you call.
Link label: See how repairs work →

**Card 2 — AC Replacement** → `/services#replace`
When a system is truly done, we show you why — the failed part and the math — and
quote a replacement you can decide on without a hard sell. Sleep on it. It's your house.
Link label: Repair or replace? Get the straight answer →

**Card 3 — Maintenance & Tune-Ups** → `/services#maintenance`
The desert is hard on machines. A spring tune-up catches the small failure before
July turns it into a hot house and an emergency call.
Link label: See what a tune-up covers →

---

## 04 · Repair-first pledge (persona 2 trust block — the uncontested position)

**Eyebrow (mono):** THE REPAIR-FIRST PLEDGE

**Headline:** If it can be fixed, we fix it.

**Body:**
Plenty of outfits quote you a new unit before the panel is even off. We don't work
that way. If your system can be repaired, that's what we recommend. If it truly
can't, we show you the failed part and the math — then you decide, on your own
schedule. No scare stories. No commission chasing.

We've been family-run in Mesa for 14 years. We're still here because we don't burn
our neighbors.

**Sub-point (price-uncertainty proof, required beside call CTA):**
Every job starts with a free quote, in writing, before any work. It's also why we
won't quote prices over the phone — a guess isn't a promise, and we'd rather be
right than fast.

**Primary CTA:** Call {{PHONE}}
**Text link:** How we decide repair vs. replace → `/services#replace`

---

## 05 · Service area (4 cities)

**Eyebrow (mono):** MESA · GILBERT · CHANDLER · TEMPE

**Headline:** East Valley only. On purpose.

**Body:**
We work four cities: Mesa — home base — plus Gilbert, Chandler, and Tempe. Close
enough to show up inside the window we give you. When you book, you get an arrival
window. When your tech rolls, you get a text.

**City list (render as list, Mesa flagged "home base"):**
Mesa, AZ · Gilbert, AZ · Chandler, AZ · Tempe, AZ

**Property-manager nod (one line, persona 3):**
Managing rentals out here? We handle tenant AC calls once — written quote and job
summary sent to you, not a sales pitch to your tenant.

**Link:** In the area? Get in touch → `/contact`

---

## 06 · FAQ (3 questions — Home set from keywords.md §3)

**Eyebrow (mono):** FAQ
**Section heading (all pages use this line):** Quick answers, no runaround.

Answer-first: first sentence answers completely. 40–80 words each. FAQPage schema.

**Q1: Do you offer same-day or emergency AC repair in Mesa, AZ?**
Yes — same-day AC repair is the standard we aim for in Mesa and across the East
Valley, not a premium add-on. Call {{PHONE}}; if a truck can reach you today, it
will. You'll get an arrival window when you book, a text when your tech is on the
way, and a written quote to approve before any work starts.

**Q2: Is Desert Aire Heating & Cooling licensed and insured in Arizona?**
Yes. Desert Aire Heating & Cooling is a licensed, bonded, and insured Arizona
contractor — ROC #329417 — and we print that number on every page so you can verify
it with the Registrar of Contractors yourself. We've been family-run in Mesa for
14 years. If a contractor won't show you a license number, keep scrolling.

**Q3: What areas do you serve besides Mesa?**
Gilbert, Chandler, and Tempe — plus Mesa, where we're based. That's the whole list,
on purpose. A tight East Valley footprint is what keeps a same-day promise honest;
we'd rather cover four cities well than fifteen badly. On the edge of the area?
Call anyway — we'll tell you straight whether we can reach you today.

---

## 07 · Final CTA band

**Eyebrow (mono):** SAME-DAY · EAST VALLEY

**Headline:** It's not getting cooler out there.

**Body:** Call now and we'll shoot you straight — what's wrong, what it takes to
fix it, in writing, today.

**Primary CTA:** Call {{PHONE}}
**Secondary CTA:** Get a Free Quote → `/services#quote-form`

**Compliance line (small, mono):**
Desert Aire Heating & Cooling · Family-run in Mesa for 14 years · AZ ROC #329417

---

## Global chassis (defined once here; applies to all pages)

**Header:** wordmark "Desert Aire Heating & Cooling" (type-only) · nav: Services ·
Contact · right-aligned phone as text link: {{PHONE}} (aria-label "Call Desert Aire
Heating & Cooling"). No CTA-button styling on nav links; the phone number is the CTA.

**Sticky mobile call bar (every page, thumb-reachable, safe-area padding):**
Label: **Call now — same-day service** · `href="{{PHONE_TEL}}"`
(One action only. No competing form button in the bar.)

**Footer (byte-identical NAP on every page):**
Desert Aire Heating & Cooling
{{ADDRESS}}, Mesa, AZ 85213
{{PHONE}} · Open {{HOURS}}
Licensed, bonded & insured · AZ ROC #329417
Serving Mesa, Gilbert, Chandler & Tempe
Links: Home · Services · Contact

**404/utility tone (if needed):** "Wrong turn. The AC help is this way →" (link Home).

## Page microcopy (no form on this page)

- Quote form lives on /services and /contact; those decks carry the full field spec.
- All tel: links: aria-label "Call Desert Aire Heating & Cooling at {{PHONE}}".
- Skip link: "Skip to content".

---

## Voice check (against BRIEF.md) — PASS

- Plainspoken, short sentences; zero corporate filler ✓
- "We'll shoot you straight" — used once (final band) ✓
- Heat-country empathy — "We know what 115° feels like" in hero ✓
- No prices, no discount language ✓ · ROC #329417 in eyebrow, trust strip, FAQ, footer ✓
- No hype adjectives without proof; every claim traces to brief/research ✓
- No invented stats (reviews explicitly placeholdered) · no emoji ✓
- Dual journey: urgent path = phone everywhere; planned path = quote-form route + pledge ✓
