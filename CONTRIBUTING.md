# Contributing

PRs welcome. The bar: changes must keep the skill's contract intact —
**one approval, zero mid-run questions, one final review, never deploys.**

## Good contributions

- **Registry catalog updates** (`reference-pack/registry-catalog.md`) —
  registries drift fast. Verify endpoints with a real `curl` (HTTP 200 on
  the registry JSON) before marking ✓, and note license + dependency
  weight. Include the verification date.
- **New vertical presets** (`references/<vertical>-preset.md`) — follow the
  "build your own preset" footer in `local-service-preset.md`: hard
  overrides, tier→page sets, market physics, proof pattern. Presets should
  be real (you've used it), not speculative.
- **New stack recipes** (`references/stack-recipes.md`) — a recipe needs:
  scaffold commands, structure, non-negotiables mapping to the QA gates,
  verify + deploy-instruction blocks. SvelteKit/Nuxt would be natural
  additions.
- **Gate improvements** (`scripts/gate-check.mjs`) — keep gates
  deterministic and dependency-free. If a check needs judgment, it belongs
  in the evaluator rubric, not the script. Document any known blind spot
  the way the contrast blind spot is documented in `qa-rubric.md`.
- **Reference-pack refreshes** — run `scripts/refresh-pack.mjs`, re-distill,
  update `PACK-MANIFEST.md` with date + method, and keep the honest
  framing (adoption caveats stay; hype doesn't get added).

## Ground rules

- Keep files under ~500 lines; SKILL.md stays a dispatcher — depth lives in
  `references/`.
- Every factual claim in pack files carries a source URL + access date.
- No hard dependencies on private/companion skills — everything must have
  the "without it" fallback path (see the composition table in SKILL.md).
- Test the blast radius: if you change a phase protocol, run at least a
  partial dry run and say so in the PR.

## Commit style

```
<type>: <description>     # feat, fix, docs, refactor, chore
```
