# SEO · AEO · GEO — checklists + templates

The actionable layer. Evidence and background live in
`reference-pack/aeo-geo-playbook.md` (read it once per project, in Phase 2 or
before the seo pass). SEO gets you ranked, AEO gets you quoted as the answer,
GEO gets you cited by generative engines — the site ships all three because
by 2026 a local business's "search traffic" is split across all three
surfaces.

## Technical SEO checklist (sd-seo-engineer runs this)

- [ ] Unique title (≤60 chars) + meta description (≤155) per page, mapped
      from `research/keywords.md`
- [ ] Canonical URL per page (brief's domain)
- [ ] Sitemap generated from SITE.md routes (recipe-native: `sitemap.ts` /
      `@astrojs/sitemap`)
- [ ] robots.txt: allow all + AI-crawler section (below) + sitemap line
- [ ] One H1 per page, keyword-mapped; heading hierarchy never skips levels
- [ ] Internal links per SITE.md link plan (every page ≥2 in, ≥2 out;
      descriptive anchors, never "click here")
- [ ] OG + twitter card tags; OG image per page (1200×630)
- [ ] 404 page with route-back; no orphan pages
- [ ] Images: descriptive filenames + alt; explicit dimensions (CLS)
- [ ] HTTPS-only refs; security headers per stack recipe

## AEO checklist (answer engines: featured snippets, AI overviews)

- [ ] Every service/FAQ answer is **answer-first**: first sentence answers
      the question completely in ≤40 words; expansion follows
- [ ] FAQ blocks on money pages (3–6 Qs from keywords.md); FAQPage schema
      optional — Google removed FAQ rich results (May 2026), but the
      answer-first CONTENT format remains the primary AEO lever and other
      engines still parse the markup (see reference-pack/aeo-geo-playbook.md)
- [ ] Question-phrased H2/H3s matching real query language
- [ ] Definitions/steps formatted as lists or tables where the query implies
      them (engines lift structure)
- [ ] `llms.txt` + `llms-full.txt` at site root (templates below)
- [ ] NAP (name/address/phone) identical everywhere it appears — footer,
      contact, schema (entity consistency is how engines de-duplicate you)

## GEO checklist (generative engines citing you — evidence: KDD'24 +2026 followups)

- [ ] Quotable stat blocks: concrete numbers with visible sources
      ("312 reviews", "since 2009", "2-hour average response")
- [ ] Direct quotations with attribution (owner, customers-from-reviews)
- [ ] Authoritative phrasing on service pages (definitive, not hedged)
- [ ] Per-page one-paragraph summary near the top that an engine can lift
      whole (who/what/where/proof in ~60 words)
- [ ] robots.txt does NOT block the AI crawlers below (visibility requires
      being crawlable — the brief owner opted into AI visibility by hiring us)

## robots.txt AI-crawler section

Check `reference-pack/aeo-geo-playbook.md` for the current UA table (it's
dated — UAs change). Default for a business that wants AI visibility:

```
# Search engines
User-agent: *
Allow: /

# AI crawlers — allowed: citations are the new referrals
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://<domain>/sitemap.xml
```

## llms.txt template

```markdown
# <Business Name>

> <One-paragraph summary: who, what services, where, proof points.
> This is the paragraph an LLM will read first — write it like the
> answer to "who is <business>?">

## Services
- [<Service>](https://<domain>/services/<slug>): <one-line answer-first blurb>

## Key facts
- Serving: <areas>. Licensed: <license #>. Reviews: <rating>★ (<count>).
- Phone: <phone>. Hours: <hours>.

## Pages
- [About](https://<domain>/about): <one line>
- [Contact](https://<domain>/contact): <one line>
```

`llms-full.txt`: same header, then the full markdown content of every money
page concatenated (generate from built pages, not from copy decks — ship what
the site actually says).

## JSON-LD templates (values from brief/site.ts — NEVER invent facts)

Schema a page can't back with visible on-page content is spam; engines
penalize it. Every value below must appear somewhere on the rendered page.

### LocalBusiness (home; local-service preset mandatory)

```json
{
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "name": "<site.name>",
  "telephone": "<site.phone_e164>",
  "url": "https://<domain>",
  "address": {"@type": "PostalAddress", "streetAddress": "…", "addressLocality": "…", "addressRegion": "AZ", "postalCode": "…"},
  "geo": {"@type": "GeoCoordinates", "latitude": 0, "longitude": 0},
  "areaServed": ["<city>", "…"],
  "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday"], "opens": "07:00", "closes": "18:00"}],
  "aggregateRating": {"@type": "AggregateRating", "ratingValue": "<site.reviews.rating>", "reviewCount": "<site.reviews.count>"},
  "hasCredential": "<license #>",
  "sameAs": ["<gbp_url>", "<socials>"]
}
```

Type note: use the most specific @type that exists (HVACBusiness, Plumber,
Electrician, RoofingContractor, GeneralContractor …) — fall back to
LocalBusiness. Non-local businesses: Organization (name, url, logo, sameAs).

### Service (per service page)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "<service name>",
  "provider": {"@type": "HVACBusiness", "name": "<name>", "telephone": "<phone>"},
  "areaServed": ["<cities>"],
  "description": "<answer-first blurb — same text as the page>"
}
```

### FAQPage (any page with a FAQ block)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "<question exactly as on page>",
    "acceptedAnswer": {"@type": "Answer", "text": "<answer exactly as on page>"}
  }]
}
```

### BreadcrumbList (every page below root) · Article (blog posts)

Standard shapes — see schema.org; keep position integers correct and URLs
absolute. Article needs headline, datePublished, author (Organization is
fine), image.

## Page-type → schema map

| Page | Schema |
|---|---|
| Home | LocalBusiness/Organization (+ FAQPage optional) |
| Service | Service + BreadcrumbList (+ FAQPage optional) |
| Area/city | Service w/ areaServed narrowed + BreadcrumbList |
| About | AboutPage + Organization ref |
| Contact | ContactPage + LocalBusiness ref |
| Blog | Article + BreadcrumbList |

## Validation (gate-check.mjs runs the mechanical half)

- Every `application/ld+json` block parses; required types present per map
- llms.txt + robots.txt + sitemap exist and reference the right domain
- Manual spot-check: validator.schema.org / Google Rich Results test URLs
  go in quality-report.md for the user
