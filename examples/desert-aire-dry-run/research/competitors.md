# Competitive Teardown — Mesa / East Valley Residential HVAC
Client: Desert Aire Heating & Cooling (fictional, dry run) · Date: 2026-07-15
Method: `firecrawl search "residential hvac repair mesa az"` → 3 real competitors → map + scrape home & 1 service page each.
Competitors selected for spread: national-brand (Goettl), family-local (John's — closest analog to Desert Aire), Valley-wide mid-major (Precision).

## Comparison table

| | Goettl | John's Heating, Cooling & Plumbing | Precision Air & Plumbing |
|---|---|---|---|
| **Base / footprint** | National multi-state (Phoenix, Vegas, Austin, San Antonio); Mesa = one location page ([map](https://www.goettl.com/locations)) | Mesa-born, family-owned; also Chandler/Gilbert/Scottsdale pages ([home](https://www.justcalljohns.com)) | Chandler HQ, 15-city Valley footprint incl. Mesa ([home](https://www.precisionairandplumbing.com)) |
| **Positioning** | Heritage scale: "served Arizona homeowners since 1939," neighborhood name-drops (Dobson Ranch, Superstition Springs) ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/)) | "Mesa's homeowners have trusted since 1970… Same Company. Same Family. Same Values." ([home](https://www.justcalljohns.com)) | "Make the Precision Decision™ … Voted Arizona's #1 AC Company for More Than A Decade" ([home](https://www.precisionairandplumbing.com)) |
| **Offer** | Promos, AC Rejuuuvination® branded tune-up, GoodLeap financing "Get Pre-Approved Now" ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/)) | "7am–7pm Same Low Rate 7 days a week," free 2nd opinion on installs, Peak Performance plan, 1-yr money-back guarantee ([home](https://www.justcalljohns.com), [2nd opinion](https://www.justcalljohns.com/free-2nd-opinion), [Mesa page](https://www.justcalljohns.com/hvac-repair-replacement-mesa-az)) | Coupon-led: $59.95 35-pt AC inspection (Mesa), $159.95 tune-ups, $39.95 drains; "Valley's ONLY 10-year parts & workmanship warranty" ([Mesa page](https://www.precisionairandplumbing.com/ac-repair/mesa-az/), [home](https://www.precisionairandplumbing.com)) |
| **Proof** | 4.7★ / 14,215 Google reviews badge at top ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/)) | 2,397+ Google reviews, A+ BBB, Best of Mesa 9 yrs running, Trane Comfort Specialist, NATE/EPA certs, written guarantees, install case studies w/ street names ([home](https://www.justcalljohns.com), [Mesa page](https://www.justcalljohns.com/hvac-repair-replacement-mesa-az)) | BBB Torch Award for Ethics 2021, Ranking Arizona #1, "2 Million Happy Arizona Homeowners," "licensed, bonded, insured" text claim ([Mesa page](https://www.precisionairandplumbing.com/ac-repair/mesa-az/)) |
| **License (ROC #) shown** | Not in scraped main content | Not in scraped main content | Claimed ("fully licensed, bonded, insured") but no ROC number in main content ([Mesa page](https://www.precisionairandplumbing.com/ac-repair/mesa-az/)) |
| **CTA pattern** | Dual: phone top + "Book Online" (ServiceTitan Scheduling Pro); financing CTA mid-page ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/)) | Schedule-first: "SCHEDULE SERVICE" → /schedule; phone secondary; two different tracking numbers on one page (480.649.1000 / 480.648.2400) ([home](https://www.justcalljohns.com)) | Form-first: "Schedule an Appointment" + 24-hr phone; long multi-field form with reason dropdown + SMS legalese ([home](https://www.precisionairandplumbing.com)) |
| **Design read** | Corporate WP template, heavy page (embedded map junk), stock family photo | Dated hvacwebsites.com template: duplicate review carousels, wall-of-text city pages | Coupon-mall layout, trademark-slathered copy, JS-dependent lazy images, typos ("We'll be their fast!") |

## Exploitable gaps (ranked)

1. **Nobody displays an AZ ROC license number in page content.** All three claim trust; none show the number. Desert Aire's ROC #329417 in header/footer + LocalBusiness schema is instant, verifiable differentiation. (Sources: all six scraped pages above.)
2. **The "being upsold" objection is unanswered on-page.** Goettl pushes GoodLeap financing/replacement; Precision funnels coupons toward replacement; John's has a free-2nd-opinion page but buries it. A hero-level "repair-first: we'll tell you when a fix is enough" pledge owns the brief's #2 customer objection.
3. **Speed promises are vague.** "24/7" and "fast" everywhere, but no one commits to a concrete window. Desert Aire's "quote today, fixed tomorrow" is a falsifiable promise none of the three makes.
4. **No on-time guarantee surfaced.** No-show/late-tech anxiety (brief objection #3) is untouched in all scraped heroes; John's guarantees exist but live on a subpage. An explicit arrival-window promise near the phone number is open territory.
5. **Visual field is 100% cluttered contractor template.** Corporate-blue (Goettl), dated-red (John's), coupon-red (Precision). The brief's light-luxury / desert-warmth editorial design will look like nothing else in the Mesa SERP.
6. **Hyper-local Mesa focus is available.** Goettl is national, Precision covers 15 cities from Chandler, John's spreads across 5+ city pages. "Mesa + East Valley only" positioning out-locals all three; Goettl's neighborhood name-drops show the tactic works — do it authentically.
7. **Phone-first urgency flow is uncontested.** Precision and John's lead with forms/scheduling; Goettl splits attention with financing. For the homeowner-urgent persona, a sticky click-to-call bar with a "human answers" promise matches Desert Aire's primary conversion and no one owns it.
8. **Price anxiety is handled with coupons or silence.** Precision teases $59.95/$159.95; others hide everything. Desert Aire (no prices per brief) can counter with "no pricing games — free quote, in writing, today" language.

## Per-competitor notes

### Goettl — goettl.com
- Scale is the moat: 14,215 reviews at 4.7★ and a 1939 heritage claim are unbeatable head-on — don't compete on volume, compete on local + honesty ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/)).
- Replacement-led economics: GoodLeap financing pre-approval CTA and branded upsell products (AC Rejuuuvination®, Smart Sadie plan) sit mid-page — reinforces the upsell fear Desert Aire can position against ([Mesa AC page](https://www.goettl.com/location/mesa-arizona/air-conditioning/), [plan](https://www.goettl.com/smart-sadie-maintenance-plan)).
- Templated localness: Mesa page is a national template with neighborhood tokens swapped in; identical structure exists for San Antonio/Austin/Vegas ([site map](https://www.goettl.com/locations)). Genuine Mesa voice beats token localization.
- *Note: home page (goettl.com) refused scraping twice ("Connection Reset" — bot protection); analysis is from the Mesa AC location page + site map. Cut accepted per budget.*

### John's Heating, Cooling & Plumbing — justcalljohns.com
- The direct analog and proof ceiling: family since 1970, Best of Mesa 9 years, 2,397+ reviews, written money-back guarantees — Desert Aire (14 yrs) must out-design and out-message, not out-tenure ([home](https://www.justcalljohns.com)).
- Best assets are buried: free 2nd opinion, "Installed Right" guarantee, and install case studies with real street names are strong trust plays lost in a dated template with duplicate carousels and trivia-padded city pages ([Mesa page](https://www.justcalljohns.com/hvac-repair-replacement-mesa-az), [2nd opinion](https://www.justcalljohns.com/free-2nd-opinion)).
- Conversion friction: schedule-form-first flow, two different phone numbers on the home page, and "Comfort Questions?" widget dilute the urgent-call path ([home](https://www.justcalljohns.com)).

### Precision Air & Plumbing — precisionairandplumbing.com
- Discount-brand playbook: $59.95 inspection, $159.95 tune-up, $39.95 drain coupons lead the pitch — exactly the positioning Desert Aire's brief forbids, which makes contrast easy ([Mesa page](https://www.precisionairandplumbing.com/ac-repair/mesa-az/), [specials](https://www.precisionairandplumbing.com/arizona-ac-heating-services-coupons/)).
- One real weapon: "Valley's ONLY 10-year parts and workmanship warranty" is their strongest claim and the one to neutralize with Desert Aire's own written guarantee language ([home](https://www.precisionairandplumbing.com)).
- Thin programmatic local SEO: Mesa page is a city-token template with copy errors ("We'll be their fast!") and Chandler HQ — no authentic Mesa presence ([Mesa page](https://www.precisionairandplumbing.com/ac-repair/mesa-az/)).

## Biggest single gap
No competitor pairs a concrete same-day promise with repair-first honesty — "quote today, fixed tomorrow, and we'll tell you when a repair is enough (ROC #329417)" is an uncontested hero.

## Credit log
| Call | Credits |
|---|---|
| search "residential hvac repair mesa az" (limit 5) | 2 (reported by API) |
| map ×4 (goettl, justcalljohns, precision ×2) | ~4 (est. 1/call) |
| scrape ×5 successful (Goettl Mesa AC, John's home, John's Mesa, Precision home, Precision Mesa) | 5 |
| scrape ×2 failed (goettl.com home, Connection Reset — typically not billed) | 0 (est.) |
| **Total** | **~11 of 15 budget** (worst case ~13 if failures billed) |

Cut due to failures, not budget: Goettl home page (2 failed attempts) — covered via its Mesa AC location page instead.
