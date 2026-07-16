# SEO / AEO / GEO Pass — Notes

Commit: `74af10a "seo pass"` · Build: **green** (`npm run build` exits 0) ·
Gate: **41/41 checks pass** (`npm run validate:seo`)
Authored by sd-seo-engineer, 2026-07-15.

## What shipped

### 1. JSON-LD (per SITE.md schema map, values only from `src/data/site.ts`)

| Page | Blocks emitted | Verified in dist |
|---|---|---|
| `/` | `HVACBusiness` (geo, hours, areaServed, `hasCredential` license, `@id` anchor) + `FAQPage` (3 Qs) | 2/2 parse |
| `/services` | `Service` ×3 (serviceType/blurb/anchor-URL from site.ts, provider ref by `@id`) + `BreadcrumbList` (Home → Services) + `FAQPage` (9 Qs) | 5/5 parse |
| `/contact` | `ContactPage` (mainEntity = compact `HVACBusiness` ref, same `@id`) + `BreadcrumbList` (Home → Contact) + `FAQPage` (2 Qs) | 3/3 parse |

Plumbing: `src/data/schema.ts` (builders — every fact imports from site.ts)
→ `src/components/JsonLd.astro` (single `<script type="application/ld+json">`
via `JSON.stringify` + `<` escaping; no template-literal interpolation)
→ `Base.astro` `schema` prop. FAQPage text is the page's own accordion items
with `{{PHONE}}` → `site.phone_display` — the exact transform the island
renders, and the validator proves every schema q/a string appears verbatim
in the rendered page text.

FAQPage note: shipped despite Google dropping FAQ rich results (2026-05),
per the reference — content already matches and other engines still parse it.

### 2. llms.txt + llms-full.txt

- `src/pages/llms.txt.ts` — Astro text endpoint per the reference template
  (who/what/where/proof paragraph, Services with anchor links + blurbs, Key
  facts NAP line, Pages). Endpoint (not a static file) so every fact
  interpolates from site.ts.
- `scripts/generate-llms-full.mjs` — runs inside `npm run build` (chained
  after `astro build`); prepends the built llms.txt header, then extracts
  each BUILT page's `<main>` to markdown-ish text (h1–h3/li mapping, forms +
  svg/script/style stripped, entities decoded). Output `dist/llms-full.txt`,
  16,967 chars, 3 pages — ships what the site actually says.

### 3. robots.txt

`src/pages/robots.txt.ts` — allow-all + explicit AI-crawler allowlist
(structure from references/seo-aeo-geo.md; current 9-UA list from
reference-pack/aeo-geo-playbook.md §5: GPTBot, OAI-SearchBot, ClaudeBot,
Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, CCBot,
meta-externalagent) + `Sitemap: https://desertairemesa.com/sitemap-index.xml`.
**Sitemap filename verified against actual @astrojs/sitemap output**
(`sitemap-index.xml` + `sitemap-0.xml`; endpoints/PNGs don't pollute it —
checked, only the 3 page URLs listed).

### 4. Canonicals + OG/twitter + OG images

- Canonicals were already correct (trailing-slash form, match sitemap URLs
  exactly) — verified, untouched.
- Added to `Base.astro`: `og:locale`, `og:image` (+width/height/alt),
  `twitter:card summary_large_image`, `twitter:title/description/image`.
- OG cards: **shipped** (sharp SVG→PNG was trivial — sharp already vendored
  as Astro's dep, now an explicit devDependency). `src/pages/og/[slug].png.ts`
  renders three typographic 1200×630 cards at build time (paper/ink/heat
  DESIGN.md hex values, Georgia/Consolas system fonts — same fallback stance
  as the favicon). Visually inspected all three; contact card footer
  shortened to stay inside the right margin.

### 5. Security headers

`public/_headers` (Netlify/CF format): HSTS+preload, nosniff, X-Frame DENY,
Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy
(camera/mic/geo off), CSP. CSP origins adjusted to this stack: Google Fonts
(style/font src), `img-src data:` (paper-grain data URI), `form-action
'self'` (Netlify form posts to `/`). `script-src` carries `'unsafe-inline'`
because Astro island hydration emits inline module scripts and a static host
runs no nonce infrastructure — documented in the file header.

### 6. Link plan + titles/metas

- Titles + meta descriptions match keywords.md §4 **character-for-character**
  on all 3 pages (validator checks presence/length; uniqueness confirmed).
- Internal links audited against SITE.md plan — all present: home trio →
  `/services#{repair,replace,maintenance}`, hero secondary + CTA band →
  `/services#quote-form`, home area section → `/contact`, each services
  block → `/contact` + on-page form, contact → `/services`, header/footer
  everywhere. No changes needed.

### 7. Validation evidence

`npm run validate:seo` (scripts/validate-seo.mjs) — 41 checks green:
- every ld+json block `JSON.parse`s; per-page type multiset == SITE.md map
- all 14 FAQ schema q/a strings found verbatim in rendered page text
- title/description/canonical/OG/twitter present per page; titles unique;
  canonical == sitemap `<loc>`
- robots.txt allowlist complete; sitemap line matches emitted filename
- llms.txt facts present; llms-full.txt = header + 3 pages
- `_headers` full security set; OG PNGs valid (magic bytes + size)
- final `npm run build` exit 0 (llms-full generation included in the chain)

## Decisions (the ones the seo pass owned)

1. **AggregateRating withheld.** site.ts marks `reviews` (312 / 4.9) as
   fictional placeholders that "must NOT be printed in UI" and delegates the
   ship call to this pass. The reference rule is hard: schema values must
   appear on the rendered page — they don't (deck uses a neutral placeholder
   treatment), and Google additionally ignores self-serving LocalBusiness
   review markup. Shipping it would be markup for invisible, unverifiable
   numbers. Re-add is one line in `src/data/schema.ts` → `hvacBusiness()`
   (exact snippet in the function's doc comment) **when real GBP data
   replaces site.reviews AND the numbers render on-page.**
2. Same reasoning: the llms.txt "Key facts" line omits the reviews clause
   from the reference template (validator asserts no `4.9`/`312` leaks).
3. `sameAs` omitted — `site.gbp_url` is empty; never invent profile URLs.
4. Service schema `description` uses the site.ts blurbs (canonical service
   one-liners, rendered verbatim on the home cards) rather than paraphrasing
   the /services block copy.

## Couldn't do / open items

- **404 page** — technical checklist wants one; SITE.md doesn't list it and
  the builder deliberately skipped it. Needs a SITE.md/copy decision first.
- **CSP nonce hardening** — `'unsafe-inline'` in script-src is the static-
  host ceiling; revisit only if the host gains edge functions.
- **Live-URL checks** — validator.schema.org / Google Rich Results / real
  header verification need the deployed site (fictional domain, no deploy in
  scope). Markup is parse-clean and template-exact; flag for quality-report.
- **Font self-hosting** — pre-existing note in builder-state.md, unchanged
  by this pass.

## Regeneration commands

```bash
npm run build          # astro build + dist/llms-full.txt (always in sync)
npm run validate:seo   # 41-check gate over dist/
```
