# Motion & Registry Integration

How the builder gets "Framer-grade" motion without Framer: shadcn-style
registry components for the showpieces, the Motion library for everything
custom. The curated per-item index (verified add-URLs by category) is in
`reference-pack/registry-catalog.md` — this file is the mechanics and the
rules.

## The library: Motion (the renamed framer-motion)

```bash
npm i motion
```

```tsx
import { motion, useReducedMotion, useScroll } from "motion/react"
```

MIT, v12+, independent project (spun out of Framer). If a registry component
imports `framer-motion`, swap the dependency and the import path to
`motion/react` — API-compatible for everything these components use. Never
ship both packages.

**Size ladder (v1 dry-run lesson):** `motion/react`'s component layer costs
~26kb gz — on Recipe B that's a third of the whole budget. Climb: CSS
keyframes/transitions → `motion/mini` (WAAPI, ~2.5kb — handles entrance
choreography fine) → `motion` vanilla → `motion/react` only when you need
its React features (variants trees, AnimatePresence, useScroll bindings).

**Astro hydration:** above-fold islands `client:load`; below-fold
`client:idle={{ timeout: 2000 }}` — prefer it over `client:visible` for
anything that must also work in headless/hidden-tab testing (IO never fires
in hidden panes; idle callbacks do).

## Registry pulls

| Registry | Mechanic | Notes |
|---|---|---|
| shadcn/ui | `npx shadcn@latest add <component>` | primitives (button, form, accordion) |
| Aceternity | `npx shadcn@latest add <their registry JSON URL>` | spectacle heroes/backgrounds — heavy, budget them |
| Magic UI | `npx shadcn@latest add <registry URL>` | animated marketing components |
| React Bits | copy from site / registry URL where offered | interactive text + micro-interactions |
| Tailark | registry URL blocks | full marketing sections (shadcn-compatible) |
| HyperUI | copy-paste HTML/JSX | free Tailwind blocks, no deps — great for Astro |
| Origin UI | copy-paste / registry | advanced form/input primitives — now coss.com/ui on Base UI (old originui.com URLs 301) |

Exact per-registry endpoint shapes (Aceternity `/registry/{slug}.json`,
shadcn `/r/styles/new-york-v4/{name}.json`, Tailark `@tailark/{block}`, …)
plus ~93 verified item URLs live in `reference-pack/registry-catalog.md` —
check there before pulling. Pull into `components/ui/` (Recipe A) or
`src/components/react/` (Recipe B — mounted as islands with `client:visible`). After every pull: run the build.
A component that breaks the build gets fixed or removed within the same
work block — never left red for the next agent.

## The budget rule: ≤2 showpieces per page

A showpiece = any registry component whose job is spectacle (animated hero
background, 3D card, particle field, marquee). One per hero, at most one
more per page. Why: three spectacle components on one page stop being
impressive and start being a template collage — the exact AI-slop the
anti-template gate exists to catch. Structural pulls (accordion, form,
pricing table) don't count against the budget.

Weight discipline: every showpiece must survive the bundle gate (150kb
landing / 80kb microsite). Check the item's dependency note in
registry-catalog.md before pulling; prefer CSS-only or IntersectionObserver
patterns on Recipe B.

## Custom motion idioms (when no registry item fits)

Compositor-only properties (transform/opacity/clip-path/filter), always with
a reduced-motion path:

```tsx
const prefersReduced = useReducedMotion()

// Reveal-on-scroll (the workhorse)
<motion.section
  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>

// Stagger children
<motion.ul initial="hidden" whileInView="show" viewport={{ once: true }}
  variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
  <motion.li variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} />

// Scroll-linked (sticky narrative sections)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
// map scrollYProgress → transform via useTransform; never top/left
```

Durations/easings come from DESIGN.md tokens (`--duration-*`, `--ease-*`) —
motion is part of the design system, not per-component improvisation. For
richer skeletons (sticky-stack, horizontal pan, hero choreography) consult
the `design-taste-frontend` skill's motion section rather than inventing.

Astro note: static sections animate with CSS (`@keyframes` +
`animation-timeline: view()` where supported, IntersectionObserver fallback)
before reaching for a React island — islands are for interactivity, not for
what CSS can do.

## Motion language rules (DIRECTION.md defines, builder obeys)

- Motion clarifies flow (enter, guide, respond) — never decorates idle.
- Hover/focus/active states on EVERY interactive element are part of motion
  design (the rubric's craft axis checks).
- Page-load: one hero entrance choreography max; below-fold reveals on
  scroll.
- Nothing loops infinitely in the user's periphery except deliberate
  ambient atmosphere (and then subtle).

## Failure ladder

0. Check the item's animation mechanics BEFORE pulling: several registry
   accordions/collapsibles (incl. shadcn/Radix) animate `height` — banned by
   the mechanical gate. Hand-write those with grid-template-rows 0fr→1fr or
   clip-path instead (v1 dry-run lesson).
1. Registry pull 404s/breaks → try the alternate item in registry-catalog.md
   (same category).
2. No alternate / offline → hand-write with the idioms above. Log the
   substitution in build-log.md.
3. Never: block the build waiting on a registry, or ship a broken import.
