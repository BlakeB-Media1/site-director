# Copy Deck — Contact (`/contact`)

Desert Aire Heating & Cooling · Dry-run fictional client
Conversion goal: **call or form** (dual — call presented first)
Primary keyword: `desert aire heating and cooling mesa az phone number` (branded /
navigational) · Personas: #1 ready-to-call, #3 property manager (real block here).

## Deck-wide rules & tokens

- Tokens from `site.ts`: `{{PHONE}}`, `{{PHONE_TEL}}`, `{{HOURS}}`, `{{ADDRESS}}`,
  `{{OPEN_TIME}}` (= site.hours.opens_display, e.g. "7am"). NAP block byte-identical
  to Home footer and Google Business Profile, and includes zip 85213 from site.ts
  (approved builder deviations, 2026-07-15).
- No 24/7 or after-hours-answering claim — the brief doesn't back one. After-hours
  expectation is "first on tomorrow's list," never "we answer at 2am."
- Form spec below repeats the /services component in full so this deck stands alone;
  builder should implement once and reuse. Hints are helper text, never input
  `placeholder` attributes. No prices anywhere.

---

## Meta

- **Title (48):** Contact Desert Aire Heating & Cooling | Mesa, AZ
- **Description (153):** Call or send a quote request to Desert Aire Heating & Cooling, serving Mesa, Gilbert, Chandler & Tempe. AZ ROC #329417. Same-day scheduling, no pressure.

---

## 01 · Header

**Eyebrow (mono):** CONTACT · MESA, AZ · ROC #329417

**H1:** Contact Desert Aire Heating & Cooling — Mesa, AZ

**Subhead:** Call and talk to a person, or send the form — either way, you get a
same-day response and a straight answer.

---

## 02 · Call-first block (phone, hours, response promise)

**Eyebrow (mono):** FASTEST: PICK UP THE PHONE

**Headline:** Same-day slots go to callers first.

**Phone (rendered huge, as text, tap-to-call):** {{PHONE}}

**Hours line:** Open {{HOURS}} · Mesa, AZ

**Response promise (body):**
Call during open hours and you talk to a person, not a phone tree. Tell us what's
happening. If a truck can reach you today, it will — you get an arrival window when
you book and a text when your tech is on the way.

**After-hours microline:**
After hours? Leave a message or send the form below — you're first on the list when
we open.

**Trust microline (adjacent to number):**
Free written quote before any work · Family-run in Mesa for 14 years · AZ ROC #329417

**Primary CTA (mobile duplicate of the big number):** Call {{PHONE}}

---

## 03 · Quote form (`#quote-form`)

**Eyebrow (mono):** OR SEND IT IN WRITING

**Form headline:** Can't talk right now? Send it.

**Form intro:** Stuck at work, on hold with a home warranty company, tenant blowing
up your phone — we get it. Two minutes here and we take it from there. We'll call
you back same-day.

**Property-manager block (persona 3 — full weight on this page):**
**Managing rentals in the East Valley?** Put the property address and tenant
contact in the note. We coordinate the visit with the tenant, then send the written
quote and job summary to you — findings come to your desk, not a sales pitch to
someone who can't authorize work. One dispatch, handled once. Licensed AZ ROC
#329417, family-run, 14 years across Mesa, Gilbert, Chandler, and Tempe.

### Fields (4 — same component as /services)

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
- **Anti-spam:** honeypot field (visually hidden, aria-hidden + tabindex=-1).
  No CAPTCHA.

---

## 04 · Service area + NAP

**Eyebrow (mono):** MESA · GILBERT · CHANDLER · TEMPE

**Headline:** Where we work

**Body:** Four East Valley cities, close enough that the arrival window we give you
means something. Mesa is home base; Gilbert, Chandler, and Tempe round out the list.

**NAP block (byte-identical to footer and GBP):**
Desert Aire Heating & Cooling
{{ADDRESS}}, Mesa, AZ 85213
{{PHONE}} · Open {{HOURS}}
Licensed, bonded & insured · AZ ROC #329417
Serving Mesa, Gilbert, Chandler & Tempe

**Cross-link (per internal link plan):**
Not sure what you need? See how we work → `/services`

---

## 05 · FAQ (2 questions — Contact set from keywords.md §3)

**Eyebrow (mono):** FAQ
**Section heading (all pages use this line):** Quick answers, no runaround.

Answer-first: first sentence answers completely. 40–80 words each. FAQPage schema.

**Q1: What's the fastest way to reach Desert Aire Heating & Cooling — phone or the quote form?**
Phone — {{PHONE}} — every time. You talk to a person, we triage on the spot, and
same-day slots go to callers first. The quote form is the right move when you can't
talk: stuck at work, on hold with a home warranty company, juggling a tenant. Send
it and we call you back same-day, usually within the hour during open hours.

**Q2: Do you offer free quotes, or is there a charge just to come out and look?**
Quotes are free, and they're written. We look at your system in person, tell you
what's actually wrong, and hand you a firm number before any work starts — no
obligation, no pressure to decide on the spot. That's the whole reason we don't
quote over the phone: a guess isn't a commitment, and you deserve a number that
won't move once the panel comes off.

---

## Voice check (against BRIEF.md) — PASS

- Plainspoken, short sentences, warm; zero corporate filler ✓
- Heat-country empathy carried by situational specifics (hot house, tenant calls) ✓
- Candor register without repeating "shoot you straight" (used on Home + Services;
  "straight answer" echo in subhead keeps the thread) ✓
- No prices; free quote framed as honesty + speed, not discount ✓
- ROC #329417 — eyebrow, call block, PM block, NAP ✓ · NAP byte-identical spec ✓
- No 24/7 or after-hours over-promise; success state matches same-day positioning ✓
- No hype adjectives, no invented stats, no emoji ✓
- Dual journey honored: call visually first, form fully specced for the
  can't-talk-now homeowner and the property manager ✓
