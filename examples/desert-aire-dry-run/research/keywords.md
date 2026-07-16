# Desert Aire Heating & Cooling — Keyword & Answer-Engine Map

*Dry-run fictional client (site-director skill validation). Site: 3 pages — `/` (Home, conv: call), `/services` (Services overview, conv: quote form), `/contact` (Contact, conv: call or form). Market: Mesa, AZ (primary) + Gilbert, Chandler, Tempe (secondary), per BRIEF.md.*
*(Authored by sd-research-keywords/seo-specialist; persisted by Creative Director — agent base has no write tool.)*

## 1. Per-Page Keyword Map

### `/` — Home (conversion: phone call)

- **Primary keyword:** `ac repair mesa az`
- **Secondary keywords:** `emergency ac repair mesa az` · `hvac company mesa az` · `same-day ac repair east valley`
- **Search intent:** Transactional, local-urgent. The system is failing (or the homeowner strongly suspects it's about to) and they want a company to call right now — not research, not compare.
- **Why this page owns this term:** Home has the most authority and the brief's primary conversion is a phone call, so it should hold the single highest-volume, broadest local-service query rather than a specific service sub-topic. That keeps it distinct from `/services`, which owns the comparison-stage breadth below.

### `/services` — Services overview (conversion: quote form)

- **Primary keyword:** `ac repair, replacement and maintenance mesa az`
- **Secondary keywords:** `ac installation cost mesa az` · `air conditioner maintenance plan mesa az` · `furnace repair mesa az`
- **Search intent:** Commercial investigation. Past "something's wrong," into "what are my options and what's this going to cost me" — weighing repair vs. replace vs. a maintenance plan. Matches the quote-form conversion goal.
- **Why this page owns this term:** It's the only services page in this build (no per-service subpages), so it needs to absorb the technical-diagnostic and cost questions a homeowner would otherwise search individually — see Section 3.

### `/contact` — Contact (conversion: call or form)

- **Primary keyword:** `desert aire heating and cooling mesa az phone number`
- **Secondary keywords:** `hvac contractor near me mesa az` · `schedule ac repair mesa az`
- **Search intent:** Navigational / branded-transactional. Visitor has already decided (or is one click from it) and wants hours, phone, address, or the fastest way to submit a request.
- **Why this page owns this term:** Keeps Contact from competing with Home for the same head term. Contact should win branded/navigational queries, not re-chase `ac repair mesa az`.

**Cannibalization check:** each page owns one intent stage — urgent/local (Home), comparison/cost (Services), branded/logistics (Contact). Don't let `ac repair mesa az` become the H1/title focus on more than one page.

## 2. Local Pack Terms — Service × City Matrix

City order follows the brief: Mesa is the primary market (HQ); Gilbert, Chandler, Tempe are secondary. No keyword-volume tool was used for this pass (out of research budget/scope) — treat this matrix as a coverage map for Google Business Profile categories, `areaServed` schema, and footer/location links, not a bid-priority list.

| Service | Mesa, AZ | Gilbert, AZ | Chandler, AZ | Tempe, AZ |
|---|---|---|---|---|
| AC repair | ac repair mesa az | ac repair gilbert az | ac repair chandler az | ac repair tempe az |
| AC replacement / installation | ac replacement mesa az | ac installation gilbert az | ac replacement chandler az | ac installation tempe az |
| AC maintenance / tune-up | ac tune-up mesa az | ac maintenance gilbert az | ac maintenance chandler az | ac tune-up tempe az |
| Emergency / same-day AC repair | emergency ac repair mesa az | same-day ac repair gilbert az | 24/7 ac repair chandler az | emergency ac repair tempe az |
| HVAC repair (general) | hvac repair mesa az | hvac repair gilbert az | hvac repair chandler az | hvac repair tempe az |
| Furnace / heating repair | furnace repair mesa az | heating repair gilbert az | furnace repair chandler az | heating repair tempe az |
| HVAC company "near me" | hvac company near me | ac company near me | hvac contractor near me | ac repair near me |

Implementation notes:
- These terms belong in GBP service categories/posts and `LocalBusiness.areaServed` schema — not as separate landing pages; the brief scopes this build to 3 pages only.
- "Near me" queries resolve mostly on proximity + GBP signals, not on-page copy. Keep NAP (name/address/phone) identical across the Home footer, `/contact`, and the Google Business Profile.
- If the site ever grows past 3 pages, dedicated city-service pages (e.g., a Gilbert AC repair page) are the next logical SEO investment — flag for a future phase, not this build.

## 3. AEO / FAQ Question Set (14 questions, mapped to pages)

Sourced from PAA-style patterns confirmed via WebSearch against HVAC manufacturer sites (Carrier, Lennox, Trane), Arizona HVAC contractor blogs, and cost-guide aggregators — see Section 5.

### Mapped to `/services` — technical diagnosis, cost, decision-stage (9)
1. Why is my AC blowing warm air instead of cold?
2. Why is my air conditioner running constantly but the house still isn't cooling down?
3. Why does my AC keep tripping the breaker or won't turn on at all?
4. How much does AC repair cost in Arizona?
5. How much does it cost to replace an AC unit in Arizona?
6. Should I repair or replace a 10-year-old AC unit?
7. How long do air conditioners typically last in Arizona's heat?
8. How long does AC replacement or installation take?
9. How often should I get AC maintenance, and what does a tune-up cost?

### Mapped to `/` Home — urgency and trust hooks (3)
10. Do you offer same-day or emergency AC repair in Mesa, AZ?
11. Is Desert Aire Heating & Cooling licensed and insured in Arizona?
12. What areas do you serve besides Mesa? (Gilbert, Chandler, Tempe)

### Mapped to `/contact` — logistics, ready-to-convert (2)
13. What's the fastest way to reach Desert Aire Heating & Cooling — phone or the quote form?
14. Do you offer free quotes, or is there a charge just to come out and look?

**Compliance flag for the copywriter:** BRIEF.md states "no prices on site" and "never promise pricing over the phone." Questions 4, 5, 9, and 14 are real, high-intent queries and should stay as FAQ entries, but answers need to give ranges/framing ("it depends on what's actually failing — we'll give you a firm number after a free look, not a phone guess") instead of published dollar figures.

**Schema note:** one `FAQPage` block per page, containing only that page's questions above. Don't repeat a question across two pages — that creates duplicate/competing FAQ rich-result signals for the same query.

## 4. Title & Meta Description Patterns

**Formula:**
- Title: `Primary Service Keyword | Brand or Modifier` — target ≤60 characters
- Meta description: `Action + local proof point + value proposition + soft CTA` — target ≤155 characters

### `/` — Home
- **Title (49 chars):** AC Repair Mesa AZ | Desert Aire Heating & Cooling
- **Meta description (153 chars):** Same-day AC repair in Mesa, AZ from a family-run crew serving the East Valley for 14 years. Free quotes, honest diagnosis, no surprise upsells. Call now.

### `/services` — Services overview
- **Title (47 chars):** AC Repair, Replacement & Maintenance | Mesa, AZ
- **Meta description (141 chars):** AC repair, replacement, and maintenance for Mesa, Gilbert, Chandler & Tempe homes. Straight answers on repair vs. replace, then a free quote.

### `/contact` — Contact
- **Title (48 chars):** Contact Desert Aire Heating & Cooling | Mesa, AZ
- **Meta description (153 chars):** Call or send a quote request to Desert Aire Heating & Cooling, serving Mesa, Gilbert, Chandler & Tempe. AZ ROC #329417. Same-day scheduling, no pressure.

Notes:
- Each title carries a distinct primary keyword — no duplicate `<title>` across the 3 pages.
- ROC #329417 appears in the Contact meta to satisfy the brief's trust non-negotiable; it should also appear on-page (footer) and in `LocalBusiness` schema, not just in the meta tag.
- No dollar amounts in any title or meta, consistent with "no prices on site."
- Meta copy is written to pre-answer the brief's stated objections: "no surprise upsells" (upsell fear), "free quote"/"straight answers" (price uncertainty), "same-day scheduling" (no-show/late-tech fear).

## 5. Research Sources

- [Carrier — Why Is My AC Blowing Hot Air?](https://www.carrier.com/us/en/residential/hvac-resources/air-conditioners/why-is-my-ac-blowing-hot-air/)
- [Lennox — Why is My AC Blowing Hot Air?](https://www.lennox.com/residential/lennox-life/consumer/why-is-my-ac-blowing-hot-air)
- [NeighborPrices — Arizona AC Repair Cost (10 Real Reports, 2026)](https://neighborprices.com/costs/ac-repair/state/az)
- [A/C & Plumbing Doctors — AC Replacement Cost in Arizona, 2026 Guide](https://theacdoctors.com/ac-replacement-cost-arizona/)
- [Covenant Aire Solutions — Average Cost to Replace AC Unit in Arizona: 2026 Guide](https://www.covenantairesolutions.com/post/average-cost-to-replace-ac-unit-in-arizona)
- [One Nation — Should You Repair or Replace a 10-Year-Old AC Unit?](https://onenationco.com/should-you-repair-or-replace-a-10-year-old-ac-unit/)
- [Trane — AC Replacement or AC Repair: What's Right for You?](https://www.trane.com/residential/en/resources/blog/trane-topics-should-you-repair-or-replace-your-heating-and-cooling-system/)
- [Trane — How Long Does It Take to Install an AC Unit?](https://www.trane.com/residential/en/resources/blog/how-long-does-it-take-to-install-an-ac-unit/)
- [Rite Way — Signs Your AC Needs Attention This Arizona Summer](https://ritewayac.com/blog/stay-cool-common-signs-your-ac-system-needs-attention-this-arizona-summer/)
- [Island Breeze — 7 Signs Your AC Needs Replacement in Phoenix (2026)](https://islandbreeze-ac.com/blog/signs-ac-needs-replacement-phoenix)
- [Cielo WiGle — Air Conditioner Circuit Breaker Keeps Tripping?](https://cielowigle.com/blog/air-conditioner-circuit-breaker-keeps-tripping/)
- [Paschal — AC Running But Not Cooling?](https://gopaschal.com/resources/ac-running-but-not-cooling/)
- [Rusty's Air — When and How Often to Get AC Maintenance in Arizona](https://rustysairaz.com/help-guides/when-how-often-ac-maintaince-arizona/)
- [Comfort Experts — AC Tune-Up Cost in Mesa, AZ (2025)](https://azcomfortexperts.com/blog/ac-tune-up-cost/)
- [Emergency Air — AC Repair Service Mesa](https://www.emergencyair.com/service-area/ac-repair-mesa/) (competitor local-pack pattern reference)
- [Goettl — Mesa AC Repair & Maintenance Experts, 24/7 Service](https://www.goettl.com/location/mesa-arizona/air-conditioning/) (competitor local-pack pattern reference)
- [Chandler Air — service-area URL pattern for Gilbert/Chandler/Tempe](https://www.chandlerair.com/service-area/air-conditioning-heating-gilbert-az) (local pack structure reference)
