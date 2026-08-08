# Site Director

A [Claude Code](https://claude.com/claude-code) skill that builds a website end to end —
brief, research, creative direction, prototypes, copy, build, QA, package — with one
approval up front and one review at the end.

You give it a brief. It runs a Creative Director loop over a team of parallel agents,
generates prototype variants in Google Stitch, renders them as a gallery you pick from,
builds the site, and hands back a quality report. It never deploys.

**v2.0.0** adds three things to v1: a unified `designElements` corpus merging three design
skills, a Google Stitch connector, and a selectable prototype-variant gallery.

---

## Install

```bash
git clone https://github.com/BlakeB-Media1/site-director.git ~/.claude/skills/site-director
```

The directory name must be `site-director` — Claude Code resolves skills by folder.

Then invoke it in any Claude Code session:

```
run the site director — build a site for <client>
```

It also auto-triggers on "build me a site", "rebuild this client's website",
"new site for X", and similar.

### Prerequisites

| Requirement | Needed for | If missing |
|---|---|---|
| Node ≥ 18 | everything | hard requirement |
| Python 3 | `ui-ux-pro-max` search | design queries fall back to the bundled corpus |
| [Stitch MCP](https://stitch.withgoogle.com) | Phase 3.5 prototypes | phase skips; build proceeds from `DESIGN.md` |
| Firecrawl CLI | live competitor/trend research | research degrades to the baked reference pack |
| Playwright | QA screenshots | QA degrades to code-only review |

Every one of these except Node degrades instead of blocking. That is the design.

### Companion skills

Site Director composes rather than duplicates. It invokes these if present:
`ui-ux-pro-max`, `impeccable`, `design-taste-frontend`, `brand-voice`, `seo`,
`firecrawl-website-design-clone`. None are required — it degrades without them.

---

## What it produces

```
SITE.md, DESIGN.md                    # page map + token system
.site-director/
├── BRIEF.md            DIRECTION.md
├── research/           copy/          feedback/
├── prototypes/                        # Phase 3.5
│   ├── site-director-prototypes.html  # the variant gallery
│   ├── styles.css      prototypes.json  selection.json
│   └── <id>.png        <id>.html
├── build-log.md        next-task.md   queue.md
└── quality-report.md
```

---

## The phases

| Phase | What happens | Gate |
|---|---|---|
| 0 Intake | Draft and lock `BRIEF.md` | **the one user approval** |
| 1 Research | 5 agents in parallel: brand, competitors, trends, keywords, personas | all files present |
| 2 Synthesis | Creative Director writes `DIRECTION.md`, `SITE.md`, `DESIGN.md` | none |
| 3.5 Prototype | Stitch variants → gallery → selection | **optional, off by default** |
| 3 Build | copywriter ∥ builder, SEO tail pass | `npm run build` exits 0 |
| 4 QA | ≤3 iterations: mechanical gates → fresh evaluator → fixes | score ≥ 7.5, zero CRITICAL |
| 5 Package | quality report, preview URL, deploy instructions (not executed) | your final review |

Phase 3.5 is numbered out of order deliberately: it runs *between* Synthesis and Build,
and stays optional so v1's zero-mid-gate contract survives.

---

## `designElements`

One schema merging three design skills, built by a script rather than hand-maintained:

| Category | Count | From |
|---|---|---|
| Palettes | 172 | 161 UI/UX Pro Max token sets + 11 OKLCH directions |
| Typography | 93 | 73 UI/UX Pro Max pairings + 20 trend-led pairings |
| Components | 90 | curated index across 7 registries |
| Styles / UX rules / charts | 76 / 99 / 25 | indexed, resolved at query time |

```bash
node scripts/build-design-elements.mjs            # writes references/design-elements.json
node scripts/build-design-elements.mjs --dry-run  # counts only
node scripts/build-design-elements.mjs --uupm <dir>
```

The script probes every known UI/UX Pro Max location and picks the richest copy. It exists
because that skill often lives at an ephemeral session-mounted path — the JSON is a
durable snapshot so the corpus survives when the mount doesn't.

**Impeccable and TASTE are indexed, not enumerated.** Impeccable *generates* palettes from
a seed colour and TASTE encodes dials and motion rules; neither ships a catalogue, so the
schema records how to resolve them instead of inventing rows.

---

## Connector: `googleStitchConnector`

Turns `DESIGN.md` into prototype variants and returns a testing URL.

```bash
node connectors/google-stitch-connector.mjs plan --design-md DESIGN.md --variants 3
node connectors/google-stitch-connector.mjs normalize --screens <screens.json> \
  --local-dir prototypes --project <id> --out prototypes.json
```

**Two transports, one return shape.**

- `mcp` (default, works) — Google Stitch is reachable through the Stitch MCP server. MCP
  tools live on Claude's tool surface, not Node's, so the connector emits an executable
  call plan and Claude runs it.
- `http` (declared, unverified) — POSTs to `https://stitch.googleapis.com/v1/prototypes`
  with `YOUR_API_KEY`. **No public Google Stitch REST API is known to exist** and this
  endpoint has not been observed to respond. It is wired up because the skill's contract
  names it, and it refuses to fire with the placeholder key rather than sending a doomed
  request. Do not build on it without confirming the endpoint is real.

Stitch screenshot URLs are signed and expire — Phase 3.5 caches them locally so galleries
still render months later.

---

## The prototype gallery

```bash
node scripts/generate-prototype-html.mjs --sample --out ./preview   # 3 fixtures, no Stitch
node scripts/generate-prototype-html.mjs --in prototypes.json --out .site-director/prototypes
```

Produces a self-contained `site-director-prototypes.html` — inline CSS and JS, zero
external requests, renders from `file://`. Cards use `previewUrl` as the thumbnail;
**Select** stores the id in the hidden `selectedPrototype` field; **Finish Pass-Through**
calls `onFinish(selectedPrototype)`.

Keyboard-navigable radiogroup, dark/light aware, honours `prefers-reduced-motion`, and
falls back to a label instead of a broken image when a signed URL lapses.

Override the callback to wire it into your own flow:

```js
window.onFinish = (id) => fetch('/api/selection', { method: 'POST', body: id });
```

Programmatic use:

```js
import { generatePrototypeHTML } from './scripts/generate-prototype-html.mjs';
const { html, css } = generatePrototypeHTML(prototypes, { project: 'Acme' });
```

---

## Not included

`references/agency-preset.md` is operator-specific — it holds an agency's offer ladder and
upsell motion, so it is gitignored rather than published. The skill runs fine without it;
Phase 0 simply never turns the agency preset on. Write your own if you want that path.

## Layout

```
SKILL.md                  # what Claude Code loads
skill-definition.json     # descriptive manifest of the v2 contract (not a loader format)
connectors/               # googleStitchConnector
scripts/                  # design-elements build, gallery generator, QA gates, pack refresh
references/               # phase playbooks + the generated designElements corpus
reference-pack/           # baked colour/type/registry/trend research (staleness-checked at 90 days)
```

## License

MIT — see [LICENSE](LICENSE). This repo also bundles and indexes third-party material under
its own terms; see [NOTICE](NOTICE) for attributions.
