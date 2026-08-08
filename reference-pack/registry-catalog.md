# Registry Catalog — Curated Component-Registry Index

**Baked:** 2026-07-15 · **For:** site-director autonomous website builder
**Verification:** every item marked ✓ had its registry JSON endpoint curl-checked (HTTP 200) on the bake date. ~115 endpoints probed, 100+ live. Unmarked items are page-URL references (copy-paste) or noted as gated.

## How the builder agent uses this file

1. Map the page section you are building (hero, pricing, footer...) to a table in the **Curated Item Index** below.
2. Prefer ✓ items — their add-URLs resolved live on the bake date. Run the add command from the project root (where `components.json` lives).
3. Check the **Weight/deps** column before pulling. Anything tagged `WebGL`/`three`/`gsap` is one-per-page at most; never stack two heavy canvas backgrounds.
4. If a pull fails twice or you are offline, go to **§ Fallbacks**. Do not retry-loop the CLI.
5. In Astro projects, every React component from these registries is an island: `npx astro add react`, then `<Component client:visible />` (`client:load` only for above-the-fold motion). HyperUI is plain HTML — paste directly into `.astro` files, zero JS shipped.

## Global install mechanics

- Universal form (works for any registry): `npx shadcn@latest add <registry-item-JSON-URL>`
- Namespace form (shadcn CLI ≥3.x resolves public registries by name): `npx shadcn@latest add @react-bits/SplitText-TS-TW`. If a namespace fails to resolve, add it to `components.json` → `"registries": { "@tailark": "https://tailark.com/r/{name}.json" }` or fall back to the full URL.
- Flags: `-y` skip confirm, `-o` overwrite, `--dry-run` preview. Init a fresh project first: `npx shadcn@latest init`.
- **motion v12 swap:** framer-motion was renamed to `motion`. Registry payloads from Magic UI and Aceternity already declare `"motion"` and import `from "motion/react"` (verified in live JSON). If any pasted snippet still imports `"framer-motion"`, install `motion` and rewrite the import to `motion/react`. Never install both packages.

---

## Registries

### 1. shadcn/ui (base primitives + app blocks)
- **Base URL:** https://ui.shadcn.com · **License:** MIT
- **Install:** `npx shadcn@latest add button card dialog accordion` (name-based). Blocks: `npx shadcn@latest add login-03 dashboard-01 sidebar-07`.
- **Registry JSON:** `https://ui.shadcn.com/r/styles/new-york-v4/{name}.json` ✓ (button, dashboard-01, login-03 verified; bare `/r/{name}.json` 404s — always use the styles path when hitting JSON directly).
- **Deps:** Radix UI + Tailwind. No motion. This is the foundation layer every other registry composes on.
- **Scope note:** official blocks are app-shell only (dashboards, sidebars, login/signup). No marketing heroes/pricing — use Tailark or Aceternity for those; shadcnblocks.com (paid, 1429+ blocks) is the commercial escape hatch.
- **Astro:** supported project type in shadcn docs; components render as React islands via @astrojs/react + `client:visible`.

### 2. Aceternity UI (signature motion + hero-grade set pieces)
- **Base URL:** https://ui.aceternity.com · ~120 free components
- **Install:** `npx shadcn@latest add https://ui.aceternity.com/registry/{slug}.json` (path is `/registry/`, NOT `/r/` — verified both ways).
- **License:** free for personal & commercial use per site; no OSS LICENSE file, so treat as source-available — use in client sites freely, do not redistribute as a library. Pro templates/blocks are paid.
- **Gated items:** a few registry JSONs return **401** (login-gated) — `lamp-effect`, `signup-form` confirmed. For those, copy code from the component page instead.
- **Deps:** `motion` (motion/react) throughout; `@tabler/icons-react` on several; `github-globe` registry JSON is a 0-file stub — build that one from its docs page (needs three.js).
- **Astro:** React islands; scroll-driven pieces (macbook-scroll, sticky-scroll-reveal) need `client:load` to bind scroll listeners early.

### 3. Magic UI (polished micro-interactions + landing-page garnish)
- **Base URL:** https://magicui.design · **License:** MIT
- **Install:** `npx shadcn@latest add "https://magicui.design/r/{slug}.json"` ✓ (35 items verified, zero failures — most reliable registry probed).
- **Categories:** components, special effects, text animations, buttons, backgrounds, device mocks (Safari/iPhone/Android frames). Pro templates paid.
- **Deps:** `motion` (motion/react); `cobe` for globe. Marquee is pure CSS (no deps) — cheapest logo strip available.
- **MCP:** magicui.design/docs/mcp exposes the registry to agents; useful if the CLI is unavailable.

### 4. React Bits (creative/WebGL backgrounds + text FX, 4 variants each)
- **Base URL:** https://reactbits.dev · 140+ components · **License:** MIT + Commons Clause (free in client/commercial work; cannot resell the components themselves as a product)
- **Install:** `npx shadcn@latest add @react-bits/{Name}-{TS|JS}-{TW|CSS}` (namespace shown on their homepage) or JSON: `https://reactbits.dev/r/{Name}-TS-TW.json` ✓. jsrepo also supported. Default to `-TS-TW` variants.
- **Deps vary per item — check before pulling:** SplitText → `gsap + @gsap/react`; Aurora → `ogl` (WebGL); Ballpit → `three + gsap` (verified in JSON). Heaviest registry here; budget one WebGL piece per page.
- **Categories:** text-animations, animations, backgrounds, components. Site URL pattern: `reactbits.dev/{category}/{slug}`.

### 5. Tailark (full marketing blocks — the workhorse for site-director)
- **Base URL:** https://tailark.com · **License:** MIT (github.com/tailark/blocks, verified via GitHub API)
- **Kits:** `dusk` (default), `mist` (minimal), `veil` (dark/glass) free; `quartz` is paid (pro.tailark.com).
- **Install:** `npx shadcn@latest add @tailark/{block}` (dusk) or `@tailark/mist-{block}` / `@tailark/veil-{block}`. JSON: `https://tailark.com/r/{block}.json` ✓ (19/20 probes live). Numbered `-1`, `-2`, ... per category.
- **Free categories (count):** hero-section (36), features (40), testimonials (23), team (22), integrations (21), content (21), stats (20), footer (20), sign-up (18), logo-cloud (17), faqs (17), pricing (15), contact (15), call-to-action (13), comparator (12), login (7). (`bento`, `secondary-hero`, `features-carousel` exist in the UI but their `/r/` JSONs 404 — pro-kit only; don't script against them.)
- **Deps:** blocks declare registryDependencies on `@shadcn/*` primitives and `@motion-primitives/text-effect` / `animated-group` → pulls `motion` transitively. Blocks arrive as full sections (3+ files).

### 6. HyperUI (zero-JS copy-paste Tailwind HTML)
- **Base URL:** https://www.hyperui.dev · **License:** MIT · **No CLI/registry — copy-paste only**
- **Collections:** `hyperui.dev/components/{marketing|application|neobrutalism}/{collection}` — marketing: announcements (12), banners (6), blog-cards (13), buttons (10), cards (9), contact-forms (10), ctas (8), sections ✓, pricing ✓, footers ✓, headers ✓, faqs ✓; application: charts (22), accordions, badges, breadcrumbs, dropdowns...; plus a full neobrutalism set (differentiated style lever).
- **Why it matters:** plain HTML = the only registry here that ships zero JS. First choice for Astro static pages, footers, and anything below the fold that doesn't need motion. Note: `.../marketing/testimonials` 404s — testimonial content lives under cards/sections.

### 7. Origin UI → coss ui (form-heavy app UI; PIVOTED)
- **Live finding (2026-07-15):** originui.com **301-redirects to https://coss.com/ui**. The project rebranded to "coss ui", rebuilt on **Base UI** (`@base-ui/react`), not Radix. "496 particles" (example variants) + ~55 component families (accordion → tooltip, incl. autocomplete, combobox, command, date-picker, OTP field).
- **Install:** `npx shadcn@latest add https://coss.com/ui/r/{name}.json` ✓ (button verified; deps: `@base-ui/react`). Legacy URLs like `https://originui.com/r/comp-01.json` still resolve through the redirect ✓ — but write new code against coss.com/ui.
- **License:** MIT for the component apps (`apps/origin`, `apps/ui`); repo remainder AGPLv3 (github.com/origin-space/originui). Component usage in client sites is MIT-safe.
- **Caution:** mixing Base-UI-based coss components with Radix-based shadcn primitives means shipping two headless libraries. Use coss for form-dense pages (booking forms, quote calculators) or standardize on shadcn primitives and skip coss.

---

## Curated Item Index

Add column shorthand: `A:/registry/x.json` = `https://ui.aceternity.com/registry/x.json` · `M:/r/x.json` = `https://magicui.design/r/x.json` · `T:@tailark/x` (JSON at `https://tailark.com/r/x.json`) · `RB:@react-bits/X-TS-TW` (JSON at `https://reactbits.dev/r/X-TS-TW.json`) · `H:` = hyperui.dev page (copy-paste).

### Hero sections

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| hero-section-1 ✓ | Tailark | `T:@tailark/hero-section-1` | default SaaS/service hero, animated text entrance | motion-primitives (light) |
| mist-hero-section-1 ✓ | Tailark | `T:@tailark/mist-hero-section-1` | quiet/minimal brands, text-led | light |
| veil-hero-section-2 ✓ | Tailark | `T:@tailark/veil-hero-section-2` | dark glassy premium look | light |
| hero-parallax ✓ | Aceternity | `A:/registry/hero-parallax.json` | portfolio/product-gallery hero; needs ~15 images | motion; image-heavy, lazy the images |
| hero-highlight ✓ | Aceternity | `A:/registry/hero-highlight.json` | headline-only hero with highlight sweep | light |
| container-scroll-animation ✓ | Aceternity | `A:/registry/container-scroll-animation.json` | screenshot tilts up on scroll (SaaS demo) | motion scroll; client:load in Astro |
| macbook-scroll ✓ | Aceternity | `A:/registry/macbook-scroll.json` | device-showcase hero for web apps | tall section, big image |
| hero-video-dialog ✓ | Magic UI | `M:/r/hero-video-dialog.json` | thumbnail → lightbox video in hero | light; video stays off main thread |
| lamp-effect (gated) | Aceternity | copy from ui.aceternity.com/components/lamp-effect | dramatic dark section header glow | registry 401s — paste from page |
| marketing sections | HyperUI | `H:/components/marketing/sections` | zero-JS static hero for Astro/local-SEO pages | none — plain HTML |

### Feature & bento grids (+ stats)

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| bento-grid ✓ | Magic UI | `M:/r/bento-grid.json` | feature bento with hover CTA per cell | light |
| bento-grid ✓ | Aceternity | `A:/registry/bento-grid.json` | image-forward bento (visual products) | motion |
| features-1 ✓ | Tailark | `T:@tailark/features-1` | icon + copy feature grid, fastest path | light |
| content-1 ✓ | Tailark | `T:@tailark/content-1` | prose/image about-section | light |
| stats-1 ✓ | Tailark | `T:@tailark/stats-1` | numbers band (jobs done, years, reviews) | light |
| number-ticker ✓ | Magic UI | `M:/r/number-ticker.json` | animate the stat numbers on scroll-in | motion (light) |
| CountUp ✓ | React Bits | `RB:@react-bits/CountUp-TS-TW` | gsap count-up alternative | gsap |
| magic-card ✓ | Magic UI | `M:/r/magic-card.json` | pointer-tracking spotlight feature card | motion |
| glowing-effect ✓ | Aceternity | `A:/registry/glowing-effect.json` | glow border that follows cursor on cards | motion |
| card-hover-effect ✓ | Aceternity | `A:/registry/card-hover-effect.json` | service-list hover cards (grid of links) | motion |
| wobble-card ✓ | Aceternity | `A:/registry/wobble-card.json` | playful oversized feature tiles | motion |
| focus-cards ✓ | Aceternity | `A:/registry/focus-cards.json` | image grid, siblings blur on hover (galleries) | light |

### Testimonials & social proof

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| animated-testimonials ✓ | Aceternity | `A:/registry/animated-testimonials.json` | photo + quote rotator, premium feel | motion + @tabler/icons-react |
| infinite-moving-cards ✓ | Aceternity | `A:/registry/infinite-moving-cards.json` | auto-scrolling review marquee | light (CSS anim) |
| testimonials-1 ✓ | Tailark | `T:@tailark/testimonials-1` | static grid, SEO-visible review text | none beyond shadcn |
| tweet-card ✓ | Magic UI | `M:/r/tweet-card.json` | render real tweets as proof | fetches tweet data — build-time only |
| avatar-circles ✓ | Magic UI | `M:/r/avatar-circles.json` | "+1,200 customers" avatar stack | light |
| animated-list ✓ | Magic UI | `M:/r/animated-list.json` | live activity feed (bookings, signups) | motion |
| team-1 ✓ | Tailark | `T:@tailark/team-1` | team/crew grid for local-service trust | light |

### Pricing & FAQ

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| pricing-1 ✓ | Tailark | `T:@tailark/pricing-1` | 2–3 tier pricing cards | light |
| comparator-1 ✓ | Tailark | `T:@tailark/comparator-1` | plan-comparison table | light |
| faqs-1 ✓ | Tailark | `T:@tailark/faqs-1` | FAQ section (pair with FAQPage schema for AEO) | light |
| accordion | shadcn/ui | `npx shadcn@latest add accordion` | roll-your-own FAQ on brand | Radix |
| pricing ✓ | HyperUI | `H:/components/marketing/pricing` | zero-JS static pricing | none |
| faqs ✓ | HyperUI | `H:/components/marketing/faqs` | zero-JS FAQ (native `<details>`) | none |

### Navbars & docks

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| resizable-navbar ✓ | Aceternity | `A:/registry/resizable-navbar.json` | navbar shrinks on scroll — default pick | motion |
| navbar-menu ✓ | Aceternity | `A:/registry/navbar-menu.json` | hover mega-menu for multi-service sites | motion |
| floating-navbar ✓ | Aceternity | `A:/registry/floating-navbar.json` | hide-on-scroll-down pill nav | motion |
| floating-dock ✓ | Aceternity | `A:/registry/floating-dock.json` | macOS-dock action bar (mobile bottom nav) | motion |
| dock ✓ | Magic UI | `M:/r/dock.json` | dock-style icon nav, lighter variant | motion |
| sidebar ✓ | Aceternity | `A:/registry/sidebar.json` | expand-on-hover app sidebar | motion |
| sidebar-07 ✓ | shadcn/ui | `npx shadcn@latest add sidebar-07` | collapses-to-icons app shell (dashboards) | Radix |
| headers ✓ | HyperUI | `H:/components/marketing/headers` | zero-JS static header | none |

### Footers & page furniture

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| footer-1 ✓ | Tailark | `T:@tailark/footer-1` | link-column footer (variants -1…-20) | light |
| footers ✓ | HyperUI | `H:/components/marketing/footers` | zero-JS footer; add NAP block for local SEO | none |
| sticky-banner | Aceternity | ui.aceternity.com/components/sticky-banner | announcement/offer bar | motion; page link (unprobed) |
| scroll-progress ✓ | Magic UI | `M:/r/scroll-progress.json` | top progress bar on long content pages | light |
| announcements | HyperUI | `H:/components/marketing/announcements` | 12 static announcement bars | none |

### Forms & CTA

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| call-to-action-1 ✓ | Tailark | `T:@tailark/call-to-action-1` | end-of-page CTA band | light |
| contact-1 ✓ | Tailark | `T:@tailark/contact-1` | contact/quote form section | shadcn form primitives |
| login-1 ✓ / sign-up-1 ✓ | Tailark | `T:@tailark/login-1`, `T:@tailark/sign-up-1` | auth pages matching marketing kit | light |
| login-03 ✓ | shadcn/ui | `npx shadcn@latest add login-03` | muted login page (app side) | Radix |
| file-upload ✓ | Aceternity | `A:/registry/file-upload.json` | drag-drop upload (job photos, documents) | motion |
| placeholders-and-vanish-input ✓ | Aceternity | `A:/registry/placeholders-and-vanish-input.json` | animated rotating-placeholder input (search/lead) | motion canvas trick |
| signup-form (gated) | Aceternity | copy from ui.aceternity.com/components/signup-form | styled shadcn signup | registry 401s — paste from page |
| shimmer-button ✓ | Magic UI | `M:/r/shimmer-button.json` | primary CTA with shine sweep | light |
| rainbow-button ✓ | Magic UI | `M:/r/rainbow-button.json` | maximum-attention CTA (use once/page) | light |
| contact-forms | HyperUI | `H:/components/marketing/contact-forms` | zero-JS form markup (wire your own action) | none |

### Text effects

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| text-animate ✓ | Magic UI | `M:/r/text-animate.json` | word/char reveals (blurInUp) — default pick | motion |
| SplitText ✓ | React Bits | `RB:@react-bits/SplitText-TS-TW` | premium char-split headline entrance | gsap + @gsap/react |
| BlurText ✓ | React Bits | `RB:@react-bits/BlurText-TS-TW` | soft blur-in headline | motion |
| text-generate-effect ✓ | Aceternity | `A:/registry/text-generate-effect.json` | LLM-style word-by-word fade | motion |
| flip-words ✓ | Aceternity | `A:/registry/flip-words.json` | rotating word in headline ("AC repair / heating / plumbing") | motion |
| word-rotate ✓ | Magic UI | `M:/r/word-rotate.json` | lighter rotating-word variant | motion |
| typewriter-effect ✓ | Aceternity | `A:/registry/typewriter-effect.json` | typed headline | motion |
| typing-animation ✓ | Magic UI | `M:/r/typing-animation.json` | typed text, simpler API | motion |
| DecryptedText ✓ | React Bits | `RB:@react-bits/DecryptedText-TS-TW` | scramble-reveal (tech brands) | light |
| RotatingText ✓ | React Bits | `RB:@react-bits/RotatingText-TS-TW` | stacked rotating text | motion |
| aurora-text ✓ | Magic UI | `M:/r/aurora-text.json` | animated gradient on a key word | light |
| animated-shiny-text ✓ | Magic UI | `M:/r/animated-shiny-text.json` | "✨ New" announcement pill shimmer | light |

One text-effect entrance per viewport; respect `prefers-reduced-motion` (motion's `useReducedMotion`).

### Backgrounds & atmosphere

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| aurora-background ✓ | Aceternity | `A:/registry/aurora-background.json` | soft aurora hero backdrop — safe default | CSS anim, light |
| background-beams ✓ | Aceternity | `A:/registry/background-beams.json` | SVG beam paths behind CTA/hero | motion, medium |
| background-beams-with-collision ✓ | Aceternity | `A:/registry/background-beams-with-collision.json` | beams + explode effect (launch pages) | motion, medium-heavy |
| wavy-background ✓ | Aceternity | `A:/registry/wavy-background.json` | canvas simplex waves | canvas CPU — hero only |
| spotlight-new ✓ | Aceternity | `A:/registry/spotlight-new.json` | dark-hero spotlight sweep | light |
| sparkles ✓ | Aceternity | `A:/registry/sparkles.json` | particle sparkle accents | particles engine, medium |
| particles ✓ | Magic UI | `M:/r/particles.json` | subtle interactive dots | canvas, light-medium |
| flickering-grid ✓ | Magic UI | `M:/r/flickering-grid.json` | animated grid backdrop (tech) | canvas, medium |
| dot-pattern ✓ | Magic UI | `M:/r/dot-pattern.json` | static SVG dots — near-zero cost | none |
| Aurora ✓ | React Bits | `RB:@react-bits/Aurora-TS-TW` | WebGL aurora, premium dark heroes | ogl (WebGL) — one per page |
| Grainient ✓ | React Bits | `RB:@react-bits/Grainient-TS-TW` | grainy gradient wash (editorial) | WebGL |
| SplashCursor ✓ | React Bits | `RB:@react-bits/SplashCursor-TS-TW` | fluid cursor effect (awwwards feel) | heavy — one per SITE, desktop only |
| DotField ✓ | React Bits | `RB:@react-bits/DotField-TS-TW` | interactive dot field | canvas, medium |

Also live-verified but heavier: `vortex`, `meteors`, `warp-background`, `retro-grid` (Magic UI ✓), `Ballpit` (React Bits ✓ — three+gsap, showpiece only). Static SVG (dot/grid patterns) beats canvas beats WebGL for CWV; pick the cheapest that sells the mood.

### Marquees, logos & orbits

| Item | Registry | Add / URL | When to use | Weight/deps |
|---|---|---|---|---|
| marquee ✓ | Magic UI | `M:/r/marquee.json` | logo strip / review ticker — default pick | zero deps, CSS anim |
| logo-cloud-1 ✓ | Tailark | `T:@tailark/logo-cloud-1` | static "trusted by" logo grid | light |
| integrations-1 ✓ | Tailark | `T:@tailark/integrations-1` | integrations/partners grid | light |
| infinite-moving-cards ✓ | Aceternity | `A:/registry/infinite-moving-cards.json` | marquee of cards (quotes, badges) | light |
| 3d-marquee ✓ | Aceternity | `A:/registry/3d-marquee.json` | angled 3D image wall (portfolio hero bg) | image-heavy |
| icon-cloud ✓ | Magic UI | `M:/r/icon-cloud.json` | rotating 3D sphere of tech logos | canvas, medium |
| orbiting-circles ✓ | Magic UI | `M:/r/orbiting-circles.json` | logos orbiting a hub (integrations viz) | motion, light |

---

## Fallbacks — offline or failed pulls

1. **Retry policy:** one retry per add-URL, then substitute. Never loop. Log the substitution in the build notes.
2. **Substitution ladder:** same category table, next ✓ row, preferring the lighter-deps column entry (e.g. Aurora fails → aurora-background; SplitText fails → text-animate).
3. **Gated/401 items (Aceternity lamp-effect, signup-form):** open the component page URL and copy source manually — the page ships full code even when the registry JSON is gated.
4. **Registry totally unreachable:** hand-write with motion primitives — the pattern behind most of these components is small:
   - Entrance: `motion.div` + `initial={{ opacity: 0, y: 24 }}` `whileInView={{ opacity: 1, y: 0 }}` `viewport={{ once: true, margin: "-80px" }}`.
   - Staggered text: split string into words, map to `motion.span` with `transition={{ delay: i * 0.04 }}`.
   - Marquee: duplicated flex row + CSS `@keyframes` translateX(-50%) loop, `animation-play-state: paused` on hover.
   - Spotlight/glow: radial-gradient pseudo-element tracking `onPointerMove` via CSS vars.
   - Backgrounds: static SVG dot/grid pattern (copy Magic UI dot-pattern idea by hand) — never hand-roll WebGL under deadline.
5. **Zero-JS fallback:** HyperUI markup is copy-paste HTML; when JS budget or hydration is the problem, rebuild the section from `hyperui.dev/components/marketing/*` and keep the page static.
6. **Motion import errors after a pull:** ensure `npm i motion` and imports read `from "motion/react"`; remove any stray `framer-motion` install (see § Global install mechanics).

---

## Sources

All accessed 2026-07-15.

**WebFetch (free):**
- https://raw.githubusercontent.com/shadcn-ui/ui/main/README.md
- https://raw.githubusercontent.com/magicuidesign/magicui/main/README.md
- https://raw.githubusercontent.com/DavidHDev/react-bits/main/README.md
- https://raw.githubusercontent.com/markmead/hyperui/main/README.md
- https://raw.githubusercontent.com/origin-space/originui/main/README.md (coss ui pivot + MIT/AGPLv3 split)
- https://raw.githubusercontent.com/birobirobiro/awesome-shadcn-ui/main/README.md (adjacent registries: shadcnblocks.com, cult-ui, animata, kokonutui, launch-ui, 21st.dev)
- https://raw.githubusercontent.com/nordicgiant2/awesome-landing-page/master/README.md (template collections; mostly Bootstrap-era — low value for this stack)
- https://ui.shadcn.com/docs/cli · https://ui.shadcn.com/blocks
- FAILED (403 bot-wall, expected): direct WebFetch of hyperui.dev and originui.com — rerouted to Firecrawl.

**Firecrawl CLI (8 scrapes ≈ 8 credits, all `--format markdown --only-main-content`):**
- `firecrawl scrape "https://ui.aceternity.com/components"` (120-item slug inventory)
- `firecrawl scrape "https://magicui.design/docs/components"` (full component list)
- `firecrawl scrape "https://reactbits.dev/"` (namespace install command, categories)
- `firecrawl scrape "https://tailark.com/"` + `".../blocks"` + `".../dusk/hero-section/one"` (kits, category counts, `@tailark` command, `/r/{name}.json` pattern)
- `firecrawl scrape "https://originui.com/"` (redirected content = coss.com/ui component families)
- `firecrawl scrape "https://www.hyperui.dev/"` (collections + counts)

**Verification (curl, free):** ~115 registry endpoints probed across ui.shadcn.com `/r/styles/new-york-v4/`, magicui.design `/r/`, ui.aceternity.com `/registry/`, reactbits.dev `/r/`, tailark.com `/r/`, coss.com/ui `/r/`, plus HyperUI page URLs and https://api.github.com/repos/tailark/blocks/license (MIT). 100+ returned 200; failures recorded inline: Aceternity `lamp-effect`/`signup-form` (401 gated), Tailark `bento-1`/`secondary-hero-1`/`features-carousel-1`/`header-1` (404, pro-kit), shadcn bare `/r/{name}.json` (404 — styles path required), HyperUI `marketing/testimonials` and `marketing/steps` (404).
