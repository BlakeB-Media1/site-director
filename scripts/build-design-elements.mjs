#!/usr/bin/env node
/**
 * build-design-elements.mjs — materialize the unified `designElements` schema.
 * Usage: node build-design-elements.mjs [--uupm <dir>] [--dry-run] [--out <file>]
 *
 * Merges three sources into references/design-elements.json:
 *   UI/UX Pro Max  → data/colors.csv, data/typography.csv (+ pointer index for the rest)
 *   site-director  → reference-pack/{color,typography}-2026.md, registry-catalog.md
 *   Impeccable / TASTE → pointer index only (they carry RULES, not catalogs — see _index)
 *
 * Why a build step and not runtime reads: ui-ux-pro-max lives at an ephemeral
 * session-mounted plugin path, and the mounted copy is TRIMMED (colors.csv 96 rows
 * vs 161 upstream). This script snapshots the richest copy it can find into the
 * skill, so Phase 2 synthesis has stable data even when the mount is gone.
 * Re-run it when ui-ux-pro-max updates.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const skillDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const packDir = join(skillDir, "reference-pack");
const argv = process.argv.slice(2);
const arg = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : null);
const dryRun = argv.includes("--dry-run");
const outFile = arg("--out") || join(skillDir, "references", "design-elements.json");

// ── source resolution ───────────────────────────────────────────────────────
// Probe every known location, keep the RICHEST (largest colors.csv). The session
// mount and the upstream download both exist on this machine; the mount is trimmed.
function resolveUupm() {
  const cands = [];
  const explicit = arg("--uupm");
  if (explicit) cands.push(explicit);
  cands.push(join(homedir(), ".claude", "skills", "ui-ux-pro-max"));
  cands.push(join(homedir(), "Downloads", "ui-ux-pro-max-skill-main", "ui-ux-pro-max-skill-main", "src", "ui-ux-pro-max"));
  // session-mounted plugin: %APPDATA%/Claude/local-agent-mode-sessions/*/*/rpm/*/skills/ui-ux-pro-max
  const mounts = join(process.env.APPDATA || join(homedir(), "AppData", "Roaming"), "Claude", "local-agent-mode-sessions");
  const walk = (dir, depth) => {
    if (depth < 0 || !existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const p = join(dir, e.name);
      if (e.name === "ui-ux-pro-max") cands.push(p);
      else walk(p, depth - 1);
    }
  };
  try { walk(mounts, 5); } catch { /* mount dir absent or unreadable — non-fatal */ }

  const scored = cands
    .filter((d) => existsSync(join(d, "data", "colors.csv")))
    .map((d) => ({ dir: d, size: statSync(join(d, "data", "colors.csv")).size }))
    .sort((a, b) => b.size - a.size);
  if (!scored.length) {
    console.error("FATAL: no ui-ux-pro-max copy found with data/colors.csv.");
    console.error("Pass one explicitly:  node build-design-elements.mjs --uupm <dir>");
    process.exit(1);
  }
  return scored[0].dir;
}

// ── tiny RFC4180-ish CSV reader (fields contain commas, quotes, and #hex) ────
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length > 1 && r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}
const readCsv = (p) => (existsSync(p) ? parseCsv(readFileSync(p, "utf8")) : []);

// ── markdown block splitter: returns [{heading, body}] for a given heading level
function blocks(md, level) {
  const re = new RegExp(`^${"#".repeat(level)} (?!#)(.+)$`, "gm");
  const out = [];
  let m, prev = null;
  while ((m = re.exec(md))) {
    if (prev) out.push({ heading: prev.h, body: md.slice(prev.end, m.index).trim() });
    prev = { h: m[1].trim(), end: m.index + m[0].length };
  }
  if (prev) out.push({ heading: prev.h, body: md.slice(prev.end).trim() });
  return out;
}
const bullet = (body, key) => {
  const m = body.match(new RegExp(`^\\s*-?\\s*\\*?\\*?${key}\\*?\\*?:\\s*(.+)$`, "im"));
  return m ? m[1].trim() : undefined;
};

// ── palettes ────────────────────────────────────────────────────────────────
// Two header generations exist in the wild: the current upstream ships a full
// shadcn-style token set with paired on-colors; older/trimmed copies ship
// "Primary (Hex)"-style headers. Accept both so --uupm can point at either.
const ROLE_MAP = {
  primary: ["Primary", "Primary (Hex)"], onPrimary: ["On Primary"],
  secondary: ["Secondary", "Secondary (Hex)"], onSecondary: ["On Secondary"],
  accent: ["Accent", "CTA (Hex)"], onAccent: ["On Accent"],
  background: ["Background", "Background (Hex)"], foreground: ["Foreground", "Text (Hex)"],
  card: ["Card"], cardForeground: ["Card Foreground"],
  muted: ["Muted"], mutedForeground: ["Muted Foreground"],
  border: ["Border", "Border (Hex)"],
  destructive: ["Destructive"], onDestructive: ["On Destructive"], ring: ["Ring"],
};

function buildPalettes(uupm) {
  const out = [];
  for (const r of readCsv(join(uupm, "data", "colors.csv"))) {
    const roles = {};
    for (const [role, headers] of Object.entries(ROLE_MAP)) {
      const v = headers.map((h) => r[h]).find((x) => x);
      if (v) roles[role] = v;
    }
    out.push({
      id: `uupm-color-${r.No}`,
      source: "UI/UX Pro Max",
      name: r["Product Type"],
      productType: r["Product Type"],
      roles,
      colorSpace: "hex",
      notes: r.Notes || undefined,
    });
  }
  const md = join(packDir, "color-2026.md");
  if (existsSync(md)) {
    for (const b of blocks(readFileSync(md, "utf8"), 2)) {
      const n = b.heading.match(/^(\d+)\.\s*(.+)$/);
      if (!n) continue; // skip prose sections (Why OKLCH, Accessibility Guidance)
      out.push({
        id: `sd-palette-${n[1]}`,
        source: "site-director",
        name: n[2].replace(/\s*—.*$/, "").trim(),
        colorSpace: "oklch",
        swatches: [...b.body.matchAll(/#([0-9A-Fa-f]{6})\b/g)].map((m) => `#${m[1].toUpperCase()}`),
        oklch: [...b.body.matchAll(/oklch\(([^)]+)\)/g)].map((m) => `oklch(${m[1]})`),
        mood: bullet(b.body, "Mood"),
        sourceUrl: bullet(b.body, "Source"),
        raw: b.body,
      });
    }
  }
  return out;
}

// ── typography ──────────────────────────────────────────────────────────────
function buildTypography(uupm) {
  const out = [];
  for (const r of readCsv(join(uupm, "data", "typography.csv"))) {
    out.push({
      id: `uupm-type-${r.No}`,
      source: "UI/UX Pro Max",
      name: r["Font Pairing Name"],
      category: r.Category,
      headingFont: r["Heading Font"],
      bodyFont: r["Body Font"],
      keywords: (r["Mood/Style Keywords"] || "").split(",").map((s) => s.trim()).filter(Boolean),
      bestFor: r["Best For"],
      googleFontsUrl: r["Google Fonts URL"] || undefined,
      cssImport: r["CSS Import"] || undefined,
      notes: r.Notes || undefined,
    });
  }
  const md = join(packDir, "typography-2026.md");
  if (existsSync(md)) {
    for (const b of blocks(readFileSync(md, "utf8"), 3)) {
      const n = b.heading.match(/^(\d+)\.\s*(.+)$/);
      if (!n) continue;
      const [pairing, flag] = n[2].split(/\s+—\s+/);
      const fonts = pairing.split(/\s*\+\s*/).map((s) => s.replace(/\(.*?\)/g, "").trim());
      out.push({
        id: `sd-type-${n[1]}`,
        source: "site-director",
        name: pairing.trim(),
        headingFont: fonts[0],
        bodyFont: fonts[1],
        flag: (flag || "").trim() || undefined,
        googleFonts: bullet(b.body, "GF"),
        vibe: bullet(b.body, "Vibe"),
        inTheWild: bullet(b.body, "Wild"),
      });
    }
  }
  return out;
}

// ── components + registries ─────────────────────────────────────────────────
function buildComponents() {
  const md = join(packDir, "registry-catalog.md");
  if (!existsSync(md)) return { components: [], registries: [] };
  const text = readFileSync(md, "utf8");

  // Structure, not bullets, is the invariant: registries are the numbered `###`
  // blocks between `## Registries` and `## Curated Item Index`. Bullet-based
  // filters drop the odd ones out — HyperUI has no Install (copy-paste HTML) and
  // Origin UI → coss ui has no Base URL (it pivoted).
  const regStart = text.indexOf("## Registries");
  const regEnd = text.indexOf("## Curated Item Index");
  const registrySection = text.slice(regStart === -1 ? 0 : regStart, regEnd === -1 ? undefined : regEnd);
  const registries = blocks(registrySection, 3)
    .map((b) => ({ b, n: b.heading.match(/^(\d+)\.\s*(.+)$/) }))
    .filter(({ n }) => n)
    .map(({ b, n }) => {
      const baseLine = bullet(b.body, "Base URL") || "";
      return {
        id: `registry-${n[1]}`,
        source: "site-director",
        name: n[2].replace(/\s*\(.*?\)\s*$/, "").trim(),
        baseUrl: baseLine.split("·")[0].replace(/\*/g, "").trim() || (b.body.match(/https?:\/\/[^\s`*)]+/) || [])[0],
        install: bullet(b.body, "Install"),
        license: bullet(b.body, "License") || (baseLine.match(/License:\*?\*?\s*([^·]+)/) || [])[1]?.trim(),
        deps: bullet(b.body, "Deps"),
        caution: bullet(b.body, "Caution") || bullet(b.body, "Scope note"),
      };
    });

  // Curated Item Index: `### <Section>` blocks holding | Item | Registry | Add / URL | ... |
  const idx = text.indexOf("## Curated Item Index");
  const components = [];
  if (idx !== -1) {
    for (const b of blocks(text.slice(idx), 3)) {
      for (const line of b.body.split("\n")) {
        if (!line.startsWith("|")) continue;
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length < 5 || /^-+$/.test(cells[0]) || cells[0] === "Item") continue;
        components.push({
          id: `component-${components.length + 1}`,
          source: "site-director",
          section: b.heading,
          item: cells[0].replace(/\s*✓\s*$/, "").trim(),
          verified: cells[0].includes("✓"),
          registry: cells[1],
          add: cells[2].replace(/`/g, ""),
          whenToUse: cells[3],
          weight: cells[4],
        });
      }
    }
  }
  return { components, registries };
}

// ── pointer index: what is NOT copied, and why ──────────────────────────────
// design-elements.json is a COMMITTED artifact, so never bake an absolute path
// into it — that leaks the operator's username and machine layout to anyone who
// clones the repo. Collapse $HOME to "~" on the way out.
const HOME = homedir().replace(/\\/g, "/");
const redact = (p) => {
  const s = String(p).replace(/\\/g, "/");
  return s.startsWith(HOME) ? "~" + s.slice(HOME.length) : s;
};

function buildIndex(uupm) {
  const count = (f) => readCsv(join(uupm, "data", f)).length;
  const rel = (p) => redact(p);
  return {
    styles: { source: "UI/UX Pro Max", kind: "catalog", rows: count("styles.csv"), path: rel(join(uupm, "data/styles.csv")),
      query: 'python "<uupm>/scripts/search.py" "<q>" --domain style' },
    uxGuidelines: { source: "UI/UX Pro Max", kind: "catalog", rows: count("ux-guidelines.csv"), path: rel(join(uupm, "data/ux-guidelines.csv")),
      query: 'python "<uupm>/scripts/search.py" "<q>" --domain ux' },
    charts: { source: "UI/UX Pro Max", kind: "catalog", rows: count("charts.csv"), path: rel(join(uupm, "data/charts.csv")),
      query: 'python "<uupm>/scripts/search.py" "<q>" --domain chart' },
    impeccablePaletteEngine: { source: "Impeccable", kind: "generator",
      note: "Impeccable GENERATES palettes from a seed colour rather than shipping a catalogue; there are no rows to merge.",
      path: "~/.claude/skills/impeccable/scripts/palette.mjs",
      invoke: "node ~/.claude/skills/impeccable/scripts/palette.mjs" },
    impeccableAntipatterns: { source: "Impeccable", kind: "ruleset",
      note: "Slop/anti-pattern detector — rules, not design elements. Run it in Phase 4.",
      path: "~/.claude/skills/impeccable/scripts/detect.mjs" },
    tasteDials: { source: "TASTE", kind: "ruleset",
      note: "TASTE (design-taste-frontend) encodes three dials — DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY — plus motion skeletons and forbidden-animation rules. Rules, not a catalogue; nothing to enumerate.",
      dials: ["DESIGN_VARIANCE", "MOTION_INTENSITY", "VISUAL_DENSITY"],
      path: "~/.claude/skills/taste-skill/SKILL.md" },
  };
}

// ── main ────────────────────────────────────────────────────────────────────
const uupm = resolveUupm();
const palettes = buildPalettes(uupm);
const typography = buildTypography(uupm);
const { components, registries } = buildComponents();
const _index = buildIndex(uupm);

const bySource = (arr, s) => arr.filter((x) => x.source === s).length;
const doc = {
  $schema: "site-director/designElements@2.0",
  generatedAt: new Date().toISOString().slice(0, 10),
  sources: {
    "UI/UX Pro Max": { resolved: redact(uupm), files: ["data/colors.csv", "data/typography.csv"],
      license: "MIT — NextLevelBuilder, https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" },
    "site-director": { resolved: "reference-pack/", files: ["color-2026.md", "typography-2026.md", "registry-catalog.md"] },
    Impeccable: { resolved: "~/.claude/skills/impeccable", kind: "rules+generators — see _index" },
    TASTE: { resolved: "~/.claude/skills/taste-skill", kind: "rules — see _index" },
  },
  counts: {
    palettes: palettes.length, palettesUupm: bySource(palettes, "UI/UX Pro Max"), palettesSiteDirector: bySource(palettes, "site-director"),
    typography: typography.length, typographyUupm: bySource(typography, "UI/UX Pro Max"), typographySiteDirector: bySource(typography, "site-director"),
    components: components.length, registries: registries.length,
  },
  palettes, typography, components, registries, _index,
};

console.log(`ui-ux-pro-max → ${uupm}`);
for (const [k, v] of Object.entries(doc.counts)) console.log(`  ${k}: ${v}`);
for (const [k, v] of Object.entries(_index)) console.log(`  _index.${k}: ${v.rows ?? v.kind}`);

if (dryRun) { console.log("\n[dry-run] nothing written."); process.exit(0); }
writeFileSync(outFile, JSON.stringify(doc, null, 2));
console.log(`\nWrote ${outFile} (${(statSync(outFile).size / 1024).toFixed(0)} KB)`);
