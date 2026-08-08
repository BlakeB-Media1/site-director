# Color 2026 — Palette Directions (OKLCH-first)

11 palette directions distilled from 2026 color-trend reports (Lounge Lizard, Davey & Krista, Pantone COY, Wix/Webflow/Muzli) with hex evidence from sources and OKLCH computed via Ottosson sRGB→OKLab conversion (script-verified, not eyeballed). Contrast ratios are computed WCAG values. Compiled 2026-07-15.

## Why OKLCH
- **Perceptual uniformity:** equal L = equal perceived brightness across hues; palette ramps become arithmetic (evenly space L). Contrast heuristic: text/bg pairs need ΔL ≳ 0.40 — then *verify* with a WCAG ratio (heuristic ≠ guarantee).
- **Wide gamut:** OKLCH addresses Display-P3; hex fallbacks below clamp to sRGB. Ship `color: #hex; color: oklch(...);` (cascade fallback) or `@supports (color: oklch(0% 0 0))`.
- **Ecosystem default:** Tailwind v4 ships its entire palette in OKLCH; browser support ~93% (caniuse via Muzli/UX-Collective coverage). Interpolating gradients in OKLCH kills the grey dead-zone.
- Source: https://medium.muz.li/color-systems-for-the-web-in-ai-guide-to-palettes-tokens-and-perceptual-consistency-2da8940f2bc3, https://uxdesign.cc/oklch-explained-for-designers-dc6af4433611

## Accessibility Guidance (applies to every palette)
- Body text: ≥4.5:1 (AA). Large text ≥24px/19px-bold: ≥3:1. UI borders/icons: ≥3:1.
- Every palette below lists computed AA-safe pairs. Accents failing 4.5:1 are marked **large/UI-only** — use for headings ≥24px, buttons with compliant label contrast, badges, glows; never body text.
- Buttons: check label-on-fill, not fill-on-page (e.g., #11 navy-on-orange 4.38:1 passes; white-on-orange 3.05:1 fails).
- Dark palettes: avoid pure black/white; sources use tinted charcoals (#0B0D10) + off-whites (#E9EEF5) to cut halation.

Format per palette: role — hex — oklch(L% C H).

---

## 1. Cloud Dancer Reset (airy warm neutral) — THE 2026 default light mode
Pantone COY 2026 "Cloud Dancer" direction: soft white canvas, imagery breathes.
- bg #F7F3EE oklch(96.6% 0.008 73.7) | surface #F0EEE9 oklch(94.9% 0.007 88.6)
- text #1C1B18 oklch(22.2% 0.006 91.6) — **15.6:1 on bg (AAA)**
- accent Persimmon #E85D3F oklch(65.3% 0.179 33.8) — 3.0:1 → **large/UI-only**; pair w/ #1C1B18 labels
- semantic: success #2E7D4F oklch(52.9% 0.106 154.6) 4.6:1 | error #B42318 oklch(50.0% 0.182 29.5) 6.0:1
- Mood: calm, premium, reset. Fits: wellness, luxury/real-estate, DTC, refined local service.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#1), https://www.wix.com/blog/web-design-trends (trend 01)

## 2. Mineral Mist (cool airy + light-based texture)
Layered breathable neutrals w/ limewash/plaster/frosted-glass texture — "flat whites are giving way to layered surfaces."
- bg #F2F2EE oklch(96.0% 0.005 106.5) | surface #E6E8E7 oklch(92.9% 0.003 165.1) | wash #D6E3EA oklch(90.8% 0.017 230.9)
- text #16141A oklch(19.6% 0.012 300.5) 16.3:1 | muted #3E4C59 oklch(41.0% 0.028 246.6) — **7.9:1 bg / 7.2:1 surface (AA)**
- accent Soft Stone #C9C3B8 oklch(81.9% 0.017 82.8) borders-only | deep accent from #10
- Mood: gallery-quiet, editorial, "signal quality". Fits: education, long-scroll editorial, refined services, portfolios.
- Source: https://daveyandkrista.com/2026-brand-color-trends/ (trend 1)

## 3. Mood-Mode Dark (designed dark, not inverted)
Dark as brand expression; tinted charcoal stack + one electric accent; AA baked in.
- bg #0B0D10 oklch(15.8% 0.007 258.4) | surface #151A21 oklch(21.6% 0.016 256.8) | border #273140 oklch(31.1% 0.03 258.3)
- text #E9EEF5 oklch(94.7% 0.011 256.7) — **16.7:1 bg / 15.0:1 surface (AAA)**
- accent Electric Cyan #40E0FF oklch(83.9% 0.134 214.0) — **12.4:1 (AA even for body)**
- semantic: reuse #B6FF3B success-glow (16.4:1) / #FF6A3D error 5.8:1-class on bg
- Mood: precision, cinematic, technical. Fits: fintech, cybersecurity, dev/AI tools, SaaS dashboards, streaming.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#3)

## 4. Transformative Teal & Earth
Teal ("Transformative Teal" across 2026 forecasts) + olive/cocoa/clay earth tones replacing cool grey.
- bg Warm Cream #EFE7DB oklch(93.1% 0.018 78.2) | surface Sand #E7D8C6 oklch(89.0% 0.029 72.4)
- text Deep Ink #101417 oklch(18.8% 0.009 240.4) — **13.3:1 on surface (AAA)**
- primary Teal #1F5C63 oklch(43.9% 0.062 205.8) — **6.2:1 on bg (AA)** | alt #316263 oklch(46.2% 0.053 197.2)
- support Moss #3E5C47 oklch(44.5% 0.05 153.5) | accent Clay #C36A4A oklch(62.0% 0.122 40.3) large/UI-only
- semantic: success = Moss | error #B42318 (5.98:1 class)
- Mood: trustworthy, grounded, eco-premium. Fits: sustainable brands, outdoor, wellness, climate-tech, **trades/landscaping/HVAC wanting warmth**.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#6), https://daveyandkrista.com/2026-brand-color-trends/ (trend 2)

## 5. Warm Mahogany Premium (PPG 2026 COY direction)
Deep premium red = "serious warmth"; less aggressive than bright red.
- bg Cream #F5EFE7 oklch(95.5% 0.012 75.4) | text Espresso #221A18 oklch(22.7% 0.013 34.4) — **15.0:1 (AAA)**
- primary Mahogany #7A2E2A oklch(41.0% 0.107 25.9) — 8.2:1 as bg w/ cream text (**AA**, hero/CTA blocks)
- support Dusty Rose #D7A3A1 oklch(76.3% 0.062 21.1) surfaces | Brass #C9A46B oklch(73.9% 0.086 77.6) — 7.3:1 on espresso, detail/dividers
- Mood: confident warmth, heritage, hospitality-luxury. Fits: restaurants, hotels, premium e-comm, established contractors (est.-1960s energy), law.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#7)

## 6. Soft-Glow Dusk (cinematic gradient)
Ambient layered gradients as lighting, not decoration; smoky, not rainbow.
- bg Night Plum #2B1538 oklch(24.5% 0.069 311.4) | mid Dusk Violet #5A4B8A oklch(45.7% 0.101 292.9) | glow Haze Blue #88A3D6 oklch(71.4% 0.081 262.8)
- text Cloud Fade #EDE7E3 oklch(93.2% 0.008 56.3) — **13.5:1 on bg (AAA)**
- accent Ember #FF6A3D oklch(70.4% 0.192 37.1) — **5.8:1 (AA)**
- Gradient rule: interpolate bg→mid→glow **in OKLCH** to avoid grey dead-zone; hero + section dividers only.
- Mood: cinematic, dreamy, evening. Fits: events/music, creative agencies, storytelling brands, hero sections of otherwise-neutral sites.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#2)

## 7. Neon Minimal (Black Glass + micro-glow)
Neon as micro-accent (focus rings, badges, "New" tags, outline glows) on near-black — never full backgrounds.
- bg Black Glass #070A0F oklch(14.4% 0.012 258.4) | text quartz-white #F3F0FF-class 17.9:1
- accents: Neon Lime #B6FF3B oklch(91.9% 0.224 128.6) **16.4:1** | Laser Pink #FF3BD4 oklch(69.9% 0.269 338.8) **6.5:1 (AA)** | Signal Blue #3B7BFF oklch(61.5% 0.208 262.5) ~5:1 UI-accent
- Discipline: ≤2 neons visible per viewport; glow via low-alpha box-shadow of the same OKLCH hue.
- Mood: electric, precise, after-hours. Fits: dev tools, Gen-Z product drops, gaming-adjacent SaaS, portfolio dark modes.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#4)

## 8. AI Iridescence (guardrailed)
Computational metallic/"impossible" colors — the source itself warns it demands strict brand constraints. **AI-slop adjacency risk: never combine with purple-gradient-blob layouts (see trends-2026.md anti-trends).**
- bg Void #07070A oklch(13.0% 0.007 285.3) | text Quartz #F3F0FF oklch(96.2% 0.02 295.2) — **17.9:1**
- accents: Holo Lilac #B9A7FF oklch(77.7% 0.125 292.7) **9.6:1** | Plasma Teal #00F5D4 oklch(86.8% 0.16 178.2) **14.4:1** | Ion Gold #FFD66B oklch(89.1% 0.133 88.5) **14.5:1**
- Use as: iridescent text-gradient on ONE hero word; conic-gradient borders; nothing else.
- Mood: frontier, launch-day. Fits: AI/tech launches, innovation reports, web3.
- Source: https://www.loungelizard.com/blog/web-design-color-trends/ (#5)

## 9. Dopamine Pop (light-mode maximal)
Hyper-saturated multi-hue *system* on white — "everything saturated... open their eyes wide" (Wix); full color systems over single accents (Webflow trend 5).
- bg #FFFFFF | text #16141A oklch(19.6% 0.012 300.5) — **18.3:1**
- accents: Hot Pink #FF69B4 oklch(72.8% 0.197 352.0) large-only | Electric Blue #3B7BFF 3.8:1 large/UI | Neon Green #39FF14 oklch(87.1% 0.286 141.5) decorative-only | red CTA #B42318 for AA-safe urgency
- Rule: rotate section accent hue; keep text ink constant; every CTA label re-checked.
- Mood: joyful, loud, youthful. Fits: youth e-comm, creators, food/bev, campaign microsites. Avoid: trust-first categories.
- Source: https://www.wix.com/blog/web-design-trends (trend 06), https://webflow.com/blog/web-design-trends-2026 (trend 5)

## 10. Museumcore Jewel
Jewel tones on antique neutrals — burgundy/navy/emerald + cream/taupe (Wix names these exactly); ornament-friendly.
- bg Antique White #F5EFE2 oklch(95.3% 0.018 86.1) | border Taupe #B8AFA3 oklch(75.8% 0.02 75.3)
- text Navy #1F2A44 oklch(28.8% 0.05 265.9) — **12.4:1 (AAA)**
- primary Burgundy #6D1F2C oklch(36.7% 0.11 14.8) — 9.7:1 as fill w/ antique text | accent Emerald #1F6F50 oklch(48.5% 0.092 163.1) — **5.3:1 (AA)**
- Mood: opulent, scholarly, heritage. Fits: galleries/museums, wine/spirits, boutique legal-finance, luxury hospitality, perfume.
- Source: https://www.wix.com/blog/web-design-trends (trend 05)

## 11. Contractor Trust (synthesized safe default — evidence-derived, not a single source)
Navy-warmth-orange baseline for local-service/trades: combines 2026 warm-neutral bases (#1) with earned conventions (navy=reliability, safety-orange=action). Use when client has no brand equity.
- bg Warm Paper #F6F4EF oklch(96.7% 0.007 88.6) | text Navy #0F2A43 oklch(27.8% 0.057 249.1) — **13.3:1 (AAA)**
- secondary Steel #38546B oklch(43.4% 0.051 244.1) 7:1-class | CTA Safety Orange #E8641B oklch(65.9% 0.181 44.1) — fill w/ **navy label 4.4:1 (AA)**; never white-on-orange (3.05:1 fails)
- semantic: success #2E7D4F **4.6:1** | error #B42318 **6.0:1** | warn #B54708 oklch(53.9% 0.156 43.0)
- Mood: dependable, licensed-and-insured, prompt. Fits: HVAC, plumbing, roofing, electrical, GC. Upgrade paths: #4 (eco/landscape), #5 (heritage premium).
- Evidence: warm-neutral shift (loungelizard #1, daveyandkrista 1-2); accent discipline per loungelizard #4.

---

## Token Emission Rules (site-director)
1. Emit CSS custom props in OKLCH with hex fallback line above; name by role (`--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-contrast`, `--success`, `--error`).
2. Derive hover/active states by shifting L ±0.06-0.10 in OKLCH at constant C/H (never opacity-fade brand fills).
3. Dark-mode variant: invert the L ramp, drop C slightly (≈-15%) to prevent neon-on-dark vibration; re-verify every AA pair.
4. Gradients: `in oklch` interpolation (`linear-gradient(in oklch, ...)`) with sRGB fallback.
5. Never ship a palette without running the contrast pairs; the ΔL≥0.4 heuristic is a pre-filter only.

---

## Sources
Accessed 2026-07-15.
- https://www.loungelizard.com/blog/web-design-color-trends/ — WebFetch (palettes 1-8 hex evidence)
- https://daveyandkrista.com/2026-brand-color-trends/ — WebFetch (palettes 2, 4; "flat color is fading")
- https://www.wix.com/blog/web-design-trends — `firecrawl scrape "https://www.wix.com/blog/web-design-trends" --format markdown --only-main-content` (dopamine, museumcore, dial-up hexes #39FF14/#FF69B4)
- https://webflow.com/blog/web-design-trends-2026 — `firecrawl scrape` (color-system-over-accent thesis)
- https://muz.li/blog/web-design-trends-2026/ — `firecrawl scrape` ("Goodbye Beige"); https://medium.muz.li/color-systems-for-the-web-in-ai-guide-to-palettes-tokens-and-perceptual-consistency-2da8940f2bc3 + https://uxdesign.cc/oklch-explained-for-designers-dc6af4433611 — WebSearch summaries (OKLCH workflow, Tailwind v4, ΔL heuristic, ~93% support)
- Pantone Cloud Dancer 11-4201 (COY 2026) via the above color reports
- OKLCH values + WCAG ratios: computed locally (Ottosson sRGB→OKLab; scratchpad `oklch.js`), not transcribed from sources
