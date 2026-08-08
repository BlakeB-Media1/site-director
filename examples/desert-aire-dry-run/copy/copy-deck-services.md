# Copy Deck — Services (`/services`)

Desert Aire Heating & Cooling · Dry-run fictional client
Conversion goal: **quote form submit** (primary) · phone call (fallback)
Primary keyword: `ac repair, replacement and maintenance mesa az` · Persona lead:
#2 "Repair or Replace?" homeowner · Persona 3 (property manager) gets a real block here.

## Deck-wide rules & tokens

- Tokens from `site.ts`: `{{PHONE}}`, `{{PHONE_TEL}}`, `{{HOURS}}`, `{{ADDRESS}}`,
  `{{OPEN_TIME}}` (= site.hours.opens_display, e.g. "7am" — used where the full
  hours string reads clunky; approved builder deviation 2026-07-15).
- Anchor IDs the builder must wire (Home links depend on them):
  `#repair` · `#replace` · `#maintenance` · `#quote-form`.
- Cost FAQs (Q4, Q5, Q9): answered candidly, **zero dollar figures** — "firm number
  after a free look, not a phone guess."
- Lifespan/duration figures in FAQs are industry facts from keywords.md research
  sources (Trane, AZ contractor guides) — not business claims. No invented business stats.
- Pledge wording is *proposed* language per personas.md — confirm with client before
  a real launch. Hints render as helper text, never input `placeholder` attributes.

---

## Meta

- **Title (47):** AC Repair, Replacement & Maintenance | Mesa, AZ
- **Description (141):** AC repair, replacement, and maintenance for Mesa, Gilbert, Chandler & Tempe homes. Straight answers on repair vs. replace, then a free quote.

---

## 01 · Header + intro

**Eyebrow (mono):** SERVICES · EAST VALLEY · ROC #329417

**H1:** AC Repair, Replacement & Maintenance in Mesa, AZ

**Subhead:** Three services, one rule: we'll shoot you straight about which one you
actually need. Most systems we look at can be repaired — and when yours can't, we
show you why before we quote you anything new.

**Intro body (price-uncertainty proof — required here per objection map):**
Every visit starts the same way. We look, we diagnose, we hand you a free quote in
writing — before any work, every time. The number you approve is the number you pay.
It's why we don't quote prices over the phone: a phone guess isn't worth the paper
it's not written on.

**Inline CTA (jump link):** Skip ahead — get your free quote → `#quote-form`

---

## 02 · AC Repair block (`#repair`)

**Eyebrow (mono):** AC REPAIR — SAME-DAY

**Headline:** Most cooling problems have a fix. Let's find yours.

**Body:**
Blowing warm. Running nonstop and losing ground. Tripping the breaker. Iced-up
lines, weak airflow, a unit that won't wake up at all. We see every one of these
across Mesa all summer, and most of them end in a repair — not a replacement.

**How a repair visit works (3 steps, render as list):**
1. **We diagnose.** You get plain English, not scare talk — and we show you the
   failed part.
2. **You get a written quote.** Free, firm, before any work. Approve it or don't.
3. **We fix it.** Same-day when a truck can reach you, with a text when your tech
   is on the way.

**Honesty line:** If the fix is small, we say so. That's the whole pledge.

**CTA:** Get a Repair Quote → `#quote-form`
**Fallback (two links — labels stay honest):** "No cool air right now?" → `/contact`
· "Call {{PHONE}}" → `{{PHONE_TEL}}`

---

## 03 · AC Replacement block (`#replace`) — repair-vs-replace candor

**Eyebrow (mono):** AC REPLACEMENT — WHEN IT'S ACTUALLY TIME

**Headline:** We'll tell you when it's time. Not before.

**Body:**
Nobody should hear "you need a whole new unit" from someone whose paycheck depends
on selling one. So here's our position, in writing: if your system can be repaired,
we repair it. Replacement only earns a recommendation when the math stops working
in your favor.

**Honest signs a system really is at the end (render as list):**
- Repairs stacking up season after season — you're paying for the same summer twice.
- A failed compressor out of warranty on a system already deep into its years.
- Refrigerant that's been phased out, making every future fix harder and dearer.
- Cooling that never catches up, and power bills climbing while comfort drops.

**Close:**
If replacement genuinely is the right call, we show you the failed part and the
math, put the options in a written quote, and get out of your way. Compare us.
Sleep on it. It's your house — we just work on it.

**CTA:** Get a Straight Answer → `#quote-form`
**Fallback (two links — labels stay honest):** "Rather talk it through?" → `/contact`
· "Call {{PHONE}}" → `{{PHONE_TEL}}`

---

## 04 · Maintenance block (`#maintenance`)

**Eyebrow (mono):** MAINTENANCE & TUNE-UPS

**Headline:** The desert is hard on machines. Maintenance is how you fight back.

**Body:**
A Mesa summer works a cooling system harder than almost anywhere in the country.
A seasonal tune-up is a small visit that catches small problems — a weakening
capacitor, a clogged drain line, a coil choked with dust — before July turns them
into big ones.

**What a tune-up covers (render as list):**
- Coils cleaned and inspected, indoor and out
- Refrigerant charge checked
- Electrical connections, capacitors, and contactors tested
- Condensate drain cleared — the quiet cause of summer water damage
- Filters, airflow, and thermostat operation verified

**Timing line:** Book it in spring, before the heat arrives. If a heat pump also
heats your home in winter, make it twice a year — spring and fall.

**CTA:** Book a Tune-Up → `#quote-form`
**Fallback (two links — labels stay honest):** "Questions first?" → `/contact`
· "Call {{PHONE}}" → `{{PHONE_TEL}}`

---

## 05 · Quote form (`#quote-form`) — the page's primary conversion

**Eyebrow (mono):** FREE QUOTE · WRITTEN · NO PRESSURE

**Form headline:** Get your free quote

**Form intro:** Tell us what's going on. We'll call you back same-day, look at the
system in person, and hand you a firm written number — free, no obligation.

**Property-manager line (persona 3, render beneath intro):**
Property managers: drop the property address and tenant contact in the note. We
coordinate the visit with the tenant and send the written quote and job summary to
you — no on-site sales pitch to people who can't authorize work.

### Fields (4 — nothing more; ask the rest on the phone)

| Field | Label | Hint (helper text, not placeholder) | Required |
|---|---|---|---|
| name | Your name | First name is fine. | yes |
| phone | Phone | We call this number back — double-check the digits. | yes |
| service | What do you need? | Not sure is a fine answer — that's what the free look is for. | yes |
| note | Anything we should know? | Optional. Symptoms, system age, gate code, property address, tenant contact — whatever helps. | no |

**Service select options (exact order):**
1. AC repair
2. AC replacement
3. Maintenance / tune-up
4. Heating repair
5. Not sure — something's wrong

**Submit button:** Send My Quote Request

**tel: fallback (adjacent to button):** Prefer to talk? Call {{PHONE}}.

### Validation & states

- Validate on blur; error text says how to fix, never scolds.
- **name empty:** "Add a name so we know who to ask for."
- **phone empty:** "We need a phone number to call you back."
- **phone malformed:** "That number looks short — check the digits and try again."
- **service unselected:** "Pick the closest fit — 'Not sure' works too."
- **Submit failure (network/server):** "That didn't go through. Try once more —
  or just call us at {{PHONE}}."
- **Success state (sets the callback expectation):**
  **Headline:** Got it. Your request is in.
  **Body:** We'll call you back same-day — usually within the hour during open
  hours. Sent it after hours? You're first on the list when we open at {{OPEN_TIME}}.
  **Sub-line:** Faster still: call {{PHONE}} now and skip the queue.
- **Anti-spam:** honeypot field (visually hidden, ignored by screen readers via
  aria-hidden + tabindex=-1). No CAPTCHA on this form.

---

## 06 · FAQ (9 questions — Services set from keywords.md §3)

**Eyebrow (mono):** FAQ
**Section heading (all pages use this line):** Quick answers, no runaround.

Answer-first: first sentence answers completely. 40–80 words each. FAQPage schema.

**Q1: Why is my AC blowing warm air instead of cold?**
Usual suspects: a thermostat switched to "on" instead of "auto" (the fan runs
without cooling), a tripped breaker, a filter so clogged it's choking airflow, low
refrigerant from a leak, or a failed capacitor or compressor. Check the thermostat
and the filter first — those are free. Still warm? Shut the system off and call;
running it broken can turn a small repair into a big one.

**Q2: Why is my air conditioner running constantly but the house still isn't cooling down?**
Some of that is desert physics — on 110°+ days a healthy system runs long cycles
and that's normal. But if the house is losing ground while it runs, suspect a dirty
filter, a dust-choked outdoor coil, low refrigerant, or leaking ducts. That's worth
a same-day look before it cooks the compressor. We'll diagnose it, show you the
cause, and quote the fix in writing.

**Q3: Why does my AC keep tripping the breaker or won't turn on at all?**
A breaker that trips once might be a fluke; one that keeps tripping is protecting
you from a real electrical fault — commonly a failing capacitor, a shorted
compressor, a seized fan motor, or damaged wiring. Stop resetting it. Every restart
shoves more current through whatever's failing. Leave the breaker off and call us —
electrical faults are exactly the repair to leave alone.

**Q4: How much does AC repair cost in Arizona?**
It depends entirely on what failed — a capacitor is a different job than a
compressor, and anyone quoting a number before looking is guessing. Here's how we
handle it instead: we come out, diagnose it, and hand you a firm number after a
free look — in writing, before any work starts. The number you approve is the
number you pay. No phone guesses, no surprises when the truck leaves.

**Q5: How much does it cost to replace an AC unit in Arizona?**
Replacement varies more than any other job we do — home size, system type, ductwork
condition, and efficiency rating all move the number, which is why we won't throw a
figure at you over the phone. We measure your home, quote it free and in writing,
and you decide on your own schedule. And if a repair would honestly do the job,
we tell you that first.

**Q6: Should I repair or replace a 10-year-old AC unit?**
At 10 years, repair is usually still on the table — most systems we see at that age
can be fixed. Replacement starts making sense when repairs stack up season after
season, a compressor fails out of warranty, or the system runs on phased-out
refrigerant. Either way, our pledge holds: we show you the failed part and the
math, and you make the call.

**Q7: How long do air conditioners typically last in Arizona's heat?**
Figure roughly 10 to 15 years here, against the 15 to 20 you'll read nationally —
a Mesa system runs harder, longer, and hotter than almost anywhere in the country.
Regular maintenance is usually the difference between the short end of that range
and the long end. Past the 12-year mark, it's worth having honest repair-vs-replace
math in your back pocket. We'll run it with you.

**Q8: How long does AC replacement or installation take?**
Most straightforward residential replacements are done in a single day — you lose
an afternoon, not a week. It runs longer when ductwork needs repair or the new
system is a different configuration than the old one. Your written quote includes
the expected timeline, and in summer we schedule the work so you're without cooling
for as short a stretch as we can manage.

**Q9: How often should I get AC maintenance, and what does a tune-up cost?**
Once a year at minimum — in spring, before the heat arrives. If a heat pump also
heats your home, make it twice: spring and fall. On cost: we don't publish menu
prices, because we'd rather quote you straight after seeing your system — but a
tune-up is the smallest job we do, and its whole purpose is keeping you off the
July emergency schedule.

---

## 07 · Call fallback band

**Eyebrow (mono):** SAME-DAY · MESA, AZ · ROC #329417

**Headline:** Rather just talk it through?

**Body:** Five minutes on the phone beats any form. Call and we'll tell you
straight — including whether it even needs a visit.

**Primary CTA:** Call {{PHONE}}

**Compliance line (small, mono):**
Desert Aire Heating & Cooling · Family-run in Mesa for 14 years · AZ ROC #329417

---

## Voice check (against BRIEF.md) — PASS

- Plainspoken desert-local, short sentences, zero filler ✓
- "We'll shoot you straight" — once (H1 subhead); candor carried by pledge language elsewhere ✓
- Heat empathy — desert physics, "before July finds them for you" register ✓
- No prices anywhere: cost FAQs answer with free-look framing, no dollar figures ✓
- No discount positioning; free quote sold as speed + honesty, not cheapness ✓
- ROC #329417 — eyebrow, fallback band, compliance line ✓
- No hype adjectives, no invented business stats (lifespan/install figures are cited
  industry facts) · no emoji ✓
- Form: 4 fields max, hints not placeholders, tel: fallback, honeypot, success state
  sets same-day callback expectation without over-promise ✓
