# Stack Recipes

Two first-class build targets. The brief picks one; this file is the
scaffold-and-structure contract the builder follows. Both recipes obey the
hard rules encoded in `qa-rubric.md`'s gates (feature folders, OKLCH tokens,
compositor-only animation) — those rules are the law, this file is the map.

## Decision table

| Signal | Recipe |
|---|---|
| App-like interactivity, dashboards, auth, heavy client state | **A — Next.js** |
| Content/marketing site, local-service, speed-first, agency client | **B — Astro** |
| Local-service preset on | **B** unless brief overrides |
| Client team will edit in React later | **A** |
| Hundreds of programmatic pages (city×service) | **B** (static output shines) |

## Recipe A — Next.js 15 + Tailwind + shadcn + Motion

### Scaffold

```bash
npx create-next-app@latest <dir> --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd <dir>
npx shadcn@latest init          # style: default; base color: neutral; CSS vars: yes
npm i motion                    # the renamed framer-motion; import { motion } from "motion/react"
```

### Structure (feature folders)

```
app/
├── layout.tsx                  # fonts (next/font, max 2 families), metadata base
├── page.tsx                    # home
├── <route>/page.tsx            # one per SITE.md row
├── sitemap.ts                  # from SITE.md routes
├── robots.ts                   # incl. AI-crawler allowlist (seo-aeo-geo.md)
components/
├── nav/  footer/  hero/  …     # by feature, never by file type
├── ui/                         # shadcn + registry primitives only
lib/animation.ts                # shared Motion variants (stagger, reveal)
styles/tokens.css               # DESIGN.md tokens — the single source of truth
public/llms.txt  llms-full.txt
```

### Rules

- `tokens.css` holds every DESIGN.md value as CSS custom properties (OKLCH).
  Tailwind reads them via `var(--…)` theme mapping — never duplicate a hex
  into `tailwind.config`/`globals`.
- Metadata API per page: title (≤60 chars, keyword-mapped from
  `research/keywords.md`), description (≤155), canonical, OG image.
- JSON-LD via a `<script type="application/ld+json">` component per
  `seo-aeo-geo.md` templates.
- Security headers in `next.config.ts` `headers()` — HSTS, nosniff,
  X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin,
  Permissions-Policy, and a nonce-based CSP; adjust origins per project.
- Images: `next/image` always; hero gets `priority`, everything below the
  fold lazy. Explicit dimensions.
- Fonts: `next/font` with `display: "swap"`; preload only the critical weight.

### Verify + deploy instructions (packaged, never executed)

```bash
npm run build && npm run start   # build must exit 0
npx lighthouse http://localhost:3000 --output=json --output-path=.site-director/lighthouse.json
# Deploy (user runs after review): npx vercel deploy --prod   |   or connect repo in Vercel dashboard
```

## Recipe B — Astro + Tailwind (agency path)

Version note: commands below track "latest" — the v1 dry run scaffolded
Astro 7 + Tailwind v4 (vite plugin) + React 19 without friction. Don't pin
majors; do note the actual versions in build-log.md.

### Scaffold

If you keep your own client-site starter, treat it as a *config pattern*, not
a finished theme — the valuable part is the `site.ts` contract below. Clone
the pattern, build pages fresh.

```bash
npm create astro@latest <dir> -- --template minimal --typescript strict --no-install
cd <dir> && npm i
npx astro add tailwind react sitemap    # react = islands for registry components
npm i motion
# If local-service preset: create src/data/site.ts per the contract below
```

### The `site.ts` contract (local-service preset)

Every client fact lives here once; pages, schema, and copy read from it.
Shape (verify against the template before writing — it may have evolved):

```ts
export const site = {
  name, phone_e164, phone_display,
  address: { street, city, state, zip },
  geo: { lat, lng },
  service_areas: string[],            // drives areaServed + city pages
  hours: {..., opens_display},        // drives openingHoursSpecification; opens_display feeds {{OPEN_TIME}} copy tokens
  services: [{ slug, name, blurb }],  // drives service pages + Service schema
  reviews: { count, rating },         // drives proof blocks + AggregateRating
  license: string,                    // ROC number — trust block + schema
  domain, gbp_url,
}
```

### Structure

```
src/
├── data/site.ts
├── layouts/Base.astro              # head, fonts, tokens, header/footer slots
├── pages/index.astro  <route>.astro
├── pages/services/[slug].astro     # programmatic from site.ts services
├── pages/areas/[city].astro        # premium tier: city×service pages
├── components/                     # .astro by default; .tsx islands only when interactive
│   └── react/                      # registry components, client:visible
├── styles/tokens.css
public/llms.txt  llms-full.txt  _headers
```

### Rules

- Astro components by default; a React island (`client:visible`) ONLY where
  interactivity or a registry showpiece demands it. Every island costs JS —
  the microsite budget (≤80kb) is the agency default.
- JSON-LD inline in `Base.astro` head, values pulled from `site.ts`
  (LocalBusiness w/ geo, hours, areaServed; AggregateRating from reviews).
- `@astrojs/sitemap` + hand-written `robots.txt` with the AI-crawler
  allowlist.
- `_headers` file (Netlify/CF) from the security rule set.
- Sticky mobile call bar (`tel:` + phone_e164) on every page — local-service preset
  hard requirement.

### Verify + deploy instructions (packaged, never executed)

```bash
npm run build && npm run preview    # build must exit 0
npx lighthouse http://localhost:4321 --output=json --output-path=.site-director/lighthouse.json
# Deploy (user runs after review): netlify deploy --prod   |   or connect repo in Netlify/CF Pages
```

## Both recipes — non-negotiables

- OKLCH tokens from DESIGN.md; hex only as comments/fallbacks.
- Semantic HTML first; the div-ratio gate in `qa-rubric.md` enforces it.
- Animate only `transform`, `opacity`, `clip-path`, `filter`;
  `prefers-reduced-motion` fallback everywhere Motion is used.
- Two font families max, `font-display: swap`, preload critical weight only.
- Every form: ≤4 fields, inline validation, an accessible error state, and a
  non-JS fallback (`mailto:`/`tel:` link adjacent).
- Git: init if absent, commit per page + per QA iteration (builder
  discipline — history is the undo button for an autonomous run).
