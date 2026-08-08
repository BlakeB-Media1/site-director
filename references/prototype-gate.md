# Prototype Gate (Phase 3.5)

Turn the locked `DESIGN.md` into 3–5 Google Stitch prototype variants, render them as a
selectable gallery, carry ONE forward into Phase 3 build.

**Read this before running Phase 3.5 the first time in a run.**

## The contract this phase must not break

Site Director's promise is *one approval up front, zero mid-phase gates, one review at the
end*. A selection gate sits in the middle of that. So:

| `prototypeGate` | Behaviour |
|---|---|
| `off` (**default**) | Generate variants, score them, **auto-select** the winner, log the rationale in `DIRECTION.md`. Gallery is still written as a review artifact. Run never pauses. |
| `on` | Generate variants, write the gallery, **stop** and hand the user the file. Resume when they report the selection. Enabled only if the user chose it in the Phase 0 batch. |
| `skip` | Phase 3.5 does not run. Build straight from `DESIGN.md`. |

Turning the gate `on` is the user choosing to break their own zero-gate rule — never
enable it yourself. If the brief is silent, it is `off`.

## Preconditions

| Check | If missing |
|---|---|
| `DESIGN.md` exists (Phase 2 exit) | Phase 3.5 cannot run — go to Phase 3 |
| Stitch MCP authed (`mcp__stitch__list_projects` returns) | **degrade → `skip`**, log in `quality-report.md` |
| Brief's AI-image consent | if withheld, drop `IMAGES` from `variantOptions.aspects` |

**Phase 3.5 must never block a run.** Any Stitch failure degrades to `skip` and the build
proceeds from `DESIGN.md`. Log every degradation.

## MCP call sequence

The connector emits this plan — `node connectors/google-stitch-connector.mjs plan --variants 3`
— and you execute it with the `mcp__stitch__*` tools. The connector is the source of truth;
this table is the readable version.

| # | Tool | Notes |
|---|---|---|
| 1 | `create_project` | Skip if reusing a project. Returns a **bare numeric** id — no `projects/` prefix. |
| 2 | `upload_design_md` | Required before step 4. Upload the Phase 2 `DESIGN.md`. |
| 3 | `generate_screen_from_text` | Baseline screen from the home-page prompt (SITE.md purpose + DIRECTION.md style). |
| 4 | `create_design_system_from_design_md` | `selectedScreenInstance.id` is the screen **instance** id, **not** the source screen id. Both come off step 3. |
| 5 | `generate_variants` | The actual variant fan-out. See options below. |
| 6 | `list_screens` | Enumerate the new variant screens. |
| 7 | `get_screen` × N | Per variant. Yields `screenshot.downloadUrl` + `htmlCode.downloadUrl`. |

**Timeouts:** generation runs for minutes. The tools say so explicitly — **do not retry**.
On timeout, poll `get_screen` every 30s, max 10 attempts, then degrade.

**`get_screen` quirk:** its schema marks `projectId` and `screenId` deprecated but still
lists them in `required`. Pass all three (`name`, `projectId`, `screenId`) or the call fails.

## Variant options

```js
{ variantCount: 3,                                  // 1–5; 3 balances spread vs wait
  creativeRange: "EXPLORE",                         // REFINE | EXPLORE | REIMAGINE
  aspects: ["LAYOUT", "COLOR_SCHEME", "TEXT_FONT"] } // + IMAGES only with consent
```

Pick `creativeRange` from how settled the direction is:

- `REFINE` — brief named a specific style and DIRECTION.md is confident. Variants differ in execution only.
- `EXPLORE` — **default.** Direction chosen but worth pressure-testing.
- `REIMAGINE` — rebuild with weak brand constraints, or the user asked for something surprising.

Never vary `TEXT_CONTENT` — copy is `sd-copywriter`'s job and comes from the VOICE PROFILE.
Letting Stitch rewrite copy produces off-brand text that then has to be undone.

## Screenshot durability (do not skip)

`screenshot.downloadUrl` is a **signed, expiring URL**. A gallery pointing at it renders
today and breaks later.

1. Download each variant's screenshot to `.site-director/prototypes/<screenId>.png`.
2. Set `previewUrl` to that relative path; keep the signed URL as `remotePreviewUrl`.
3. `normalize()` in the connector does this when given `--local-dir prototypes`.

The gallery card degrades to an "Preview unavailable" label if an image 404s, so a lapsed
URL never shows a broken-image glyph — but the local copy is what makes the artifact durable.

## Building the gallery

```bash
node connectors/google-stitch-connector.mjs normalize \
  --screens .site-director/prototypes/screens.json \
  --local-dir prototypes --project <projectId> \
  --out .site-director/prototypes/prototypes.json

node scripts/generate-prototype-html.mjs \
  --in .site-director/prototypes/prototypes.json \
  --out .site-director/prototypes
```

Writes `site-director-prototypes.html` (self-contained) + `styles.css`. Each card carries
name, thumbnail, and metadata; **Select** stores the id in the hidden `selectedPrototype`
field; **Finish Pass-Through** fires `onFinish(selectedPrototype)` and offers a
`selection.json` download. Save that file to `.site-director/prototypes/selection.json` —
artifacts are memory, the transcript is not.

## Selection rubric (gate `off`)

Score each variant 1–10, weighted. Highest total wins; ties go to the lower-risk build.

| Weight | Axis | Ask |
|---|---|---|
| 0.30 | Brief fidelity | Does it serve the page's conversion goal in `SITE.md`? |
| 0.25 | Direction match | Does it read as the style locked in `DIRECTION.md`? |
| 0.20 | Token fidelity | Does it use `DESIGN.md`'s palette and type pairing, not Stitch defaults? |
| 0.15 | Buildability | Can the chosen stack build this without a heavy canvas/WebGL detour? |
| 0.10 | Distinctiveness | Would this survive the anti-template rule, or is it stock? |

Record the winner, its score, and the runners-up in `DIRECTION.md` § Prototype selection.
**Never let a variant override the brief** — an attractive prototype that drifts off-brand
loses to a plainer one that holds. Same arbitration rule as Phase 4.

## Handoff to Phase 3

The selected variant becomes build reference, not build output:

- `htmlCode.downloadUrl` → `.site-director/prototypes/<id>.html`, given to `sd-builder` as
  **layout reference only**. Stitch HTML is not production code — do not ship it.
- Non-selected variants stay in `.site-director/prototypes/` for the final review.
- If the winner contradicts `DESIGN.md` tokens, `DESIGN.md` wins; note the delta in `build-log.md`.

## Failure modes

| Symptom | Response |
|---|---|
| MCP unauthed / tool errors | degrade → `skip`, log, continue to Phase 3 |
| Generation times out twice | keep whatever variants exist; if zero, `skip` |
| `create_design_system_from_design_md` rejects the instance id | re-read step 3's result — instance id ≠ screen id |
| Variants all look identical | `creativeRange` was `REFINE`; re-run once at `EXPLORE`, then accept |
| Gate `on` and user never responds | run stays parked at 3.5; `next-task.md` says `phase-3.5-awaiting-selection` |
| Screenshots 404 in the gallery | signed URLs lapsed and local copies were skipped — re-run step 7 + download |
