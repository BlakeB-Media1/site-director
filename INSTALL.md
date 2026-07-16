# Install

## 1. Clone into your Claude Code skills directory

```bash
# macOS / Linux / Git Bash
git clone https://github.com/BlakeB-Media1/site-director.git ~/.claude/skills/site-director
```

```powershell
# Windows PowerShell
git clone https://github.com/BlakeB-Media1/site-director.git "$env:USERPROFILE\.claude\skills\site-director"
```

Claude Code discovers skills in `~/.claude/skills/<name>/SKILL.md`
automatically — start (or restart) a session and `site-director` appears in
the skill list. No build step.

## 2. Prerequisites

| What | Check | Why |
|---|---|---|
| Node.js ≥ 18 | `node --version` | scaffolds + gate scripts. **Required.** |
| Firecrawl CLI, authed | `firecrawl --status` | live research (competitors, trends). **Optional** — set the brief's research budget to `offline` to skip; the baked reference pack + free web search carry the run. |
| Playwright | `npx playwright --version` | live-browser QA. **Optional** — the evaluator degrades to fetch/DOM mode. |
| git | `git --version` | the builder commits per page (its undo button). Strongly recommended. |

Firecrawl setup (if you want live research): `npm i -g firecrawl-cli`, then
`firecrawl login`. Typical spend: ~25–40 credits per site on the default
`lite` budget; `full` runs ~60–90.

### Windows notes

- From **PowerShell**, the firecrawl shim is `firecrawl.cmd` (execution
  policy blocks the `.ps1`). From **Git Bash** (Claude Code's Bash tool),
  plain `firecrawl` works. The skill's docs handle this; nothing to
  configure.
- Everything else is cross-platform Node.

## 3. One-time: permission pre-flight (recommended)

Autonomous runs die on permission prompts. In each project where you'll run
builds, pre-allowlist the harmless build commands in
`.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm *)", "Bash(npx *)", "Bash(node *)",
      "Bash(git *)", "Bash(firecrawl *)"
    ]
  }
}
```

Skip this and the run still works — it just pauses for approval whenever
the builder needs the shell. The skill never bypasses your permission
system; this is you deciding once instead of forty times.

## 4. Keep the reference pack fresh

The 2026 research pack (`reference-pack/`) was baked on the date in
`reference-pack/PACK-MANIFEST.md`. The skill warns when it's >90 days old.
To refresh (needs Firecrawl, ~100–150 credits):

```bash
node ~/.claude/skills/site-director/scripts/refresh-pack.mjs
```

That re-fetches raw sources into `reference-pack/_raw/`; then ask Claude
(with the skill loaded) to re-distill the pack files from `_raw/` — the
distillation is editorial work, deliberately not automated.

## 5. First run

```
Run the site director for Acme Plumbing. New 5-page site, light theme,
primary conversion = phone call, style direction: editorial warmth,
research budget: lite. Brief details: <...>
```

See `references/creative-brief.md` for the full brief template — the more
complete the brief, the fewer questions you get (a complete brief + "go"
means zero).
