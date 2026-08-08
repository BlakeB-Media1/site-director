#!/usr/bin/env node
/**
 * gate-check.mjs — deterministic QA gates for site-director (Phase 4, layer 1).
 * Usage: node gate-check.mjs <project-dir> [--budget-kb 150] [--json]
 * Exit 0 = all gates pass/skip; exit 1 = >=1 CRITICAL failure.
 * Grep-based by design: fast, zero deps, no false authority — the LLM
 * evaluator handles everything that needs judgment.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { gzipSync } from "node:zlib";

const projectDir = process.argv[2];
if (!projectDir || !existsSync(projectDir)) {
  console.error("usage: node gate-check.mjs <project-dir> [--budget-kb 150] [--json]");
  process.exit(2);
}
const budgetKb = Number(process.argv[process.argv.indexOf("--budget-kb") + 1]) || 150;

const SRC_EXT = new Set([".tsx", ".jsx", ".astro", ".html", ".css", ".ts", ".js", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", ".astro", ".firecrawl", ".site-director", "build"]);
const BUILT_DIRS = ["dist", ".next", "build", "out"]; // first that exists wins

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, files);
    } else files.push(p);
  }
  return files;
}
function walkAll(dir, files = []) { // includes built output
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name !== "node_modules" && name !== ".git") walkAll(p, files);
    } else files.push(p);
  }
  return files;
}

const srcFiles = walk(projectDir).filter((f) => SRC_EXT.has(extname(f)));
const read = (f) => { try { return readFileSync(f, "utf8"); } catch { return ""; } };
const gates = [];
const gate = (id, status, detail) => gates.push({ id, status, detail });

// ── 1. Animation properties (CRITICAL) ──────────────────────────────────────
// Bans transitions/animations on layout properties. Two nets: CSS transition/
// animation shorthand lines, and Motion/JS animate objects.
{
  // Layout-bound properties only. border-color / border-radius / outline-color
  // are paint-level and legal — `border(?!-color|-radius)` keeps the shorthand
  // and border-width banned without flagging them.
  const banned = "(width|height|top|left|margin[a-z-]*|padding[a-z-]*|border(?!-color|-radius)[a-z-]*|font-size)";
  const cssRe = new RegExp(`(transition|animation)[^;{}]*\\b${banned}\\b`, "gi");
  // ponytail: line-based JS net — catches `animate={{ height:` / `width:` in the
  // same line as animate/initial/variants; multi-line objects escape it, the
  // LLM evaluator is the backstop.
  const jsRe = new RegExp(`(animate|initial|exit|variants)\\s*=?\\s*\\{\\{?[^}]*\\b(width|height|top|left|marginTop|marginLeft|padding|fontSize)\\s*:`, "gi");
  const isComment = (l) => /^\s*(\*|\/\/|\/\*|<!--)/.test(l) || /^\s*#/.test(l);
  const hits = [];
  for (const f of srcFiles) {
    const t = read(f);
    for (const line of t.split("\n").map((l, i) => ({ l, i }))) {
      if (isComment(line.l)) continue;
      if (cssRe.test(line.l) || jsRe.test(line.l)) hits.push(`${f.replace(projectDir, "")}:${line.i + 1}`);
      cssRe.lastIndex = 0; jsRe.lastIndex = 0;
    }
  }
  gate("animation-properties", hits.length ? "FAIL" : "PASS",
    hits.length ? `layout-property animation at: ${hits.slice(0, 10).join(", ")}` : "compositor-only ✓");
}

// ── 2. Reduced motion (CRITICAL when motion is used) ────────────────────────
{
  const usesMotion = srcFiles.some((f) => /from ["']motion\/react["']|framer-motion|@keyframes|animation:/i.test(read(f)));
  const hasFallback = srcFiles.some((f) => /prefers-reduced-motion|useReducedMotion/i.test(read(f)));
  gate("reduced-motion", !usesMotion ? "SKIP" : hasFallback ? "PASS" : "FAIL",
    !usesMotion ? "no motion detected" : hasFallback ? "fallback present ✓" : "motion used but no prefers-reduced-motion/useReducedMotion found");
}

// ── 3. Semantic HTML ratio (CRITICAL, stitch 8b rule: div <= 5x semantic) ───
{
  let divs = 0, sem = 0;
  const semRe = /<(header|nav|main|section|article|aside|footer)\b/gi;
  for (const f of srcFiles.filter((f) => [".tsx", ".jsx", ".astro", ".html"].includes(extname(f)))) {
    const t = read(f);
    divs += (t.match(/<div\b/gi) || []).length;
    sem += (t.match(semRe) || []).length;
  }
  const ok = sem > 0 && divs <= 5 * sem;
  gate("semantic-html", ok ? "PASS" : "FAIL", `div=${divs}, semantic=${sem} (limit ${5 * sem})`);
}

// ── 4. JSON-LD parses (CRITICAL) ────────────────────────────────────────────
{
  const blocks = [];
  const all = walkAll(projectDir).filter((f) => [".html", ".astro", ".tsx", ".jsx"].includes(extname(f)));
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let bad = [], types = new Set();
  for (const f of all) {
    const t = read(f);
    let m;
    while ((m = ldRe.exec(t))) {
      blocks.push(f);
      const raw = m[1].trim();
      if (/[{[][\s\S]*[}\]]/.test(raw) && !/[`$]\{/.test(raw)) { // skip template-literal JSX blocks — built HTML covers them
        try { const j = JSON.parse(raw); types.add(j["@type"] || "?"); }
        catch { bad.push(f.replace(projectDir, "")); }
      }
    }
  }
  gate("json-ld", blocks.length === 0 ? "FAIL" : bad.length ? "FAIL" : "PASS",
    blocks.length === 0 ? "no JSON-LD found anywhere" : bad.length ? `unparseable in: ${[...new Set(bad)].join(", ")}` : `types: ${[...types].join(", ")}`);
}

// ── 5. AEO files present (CRITICAL) ─────────────────────────────────────────
{
  const roots = [projectDir, join(projectDir, "public"), ...BUILT_DIRS.map((d) => join(projectDir, d))];
  const find = (name) => roots.some((r) => existsSync(join(r, name)));
  const missing = ["llms.txt", "robots.txt"].filter((n) => !find(n));
  const sitemap = find("sitemap.xml") ||
    srcFiles.some((f) => /sitemap\.(ts|js)$/.test(f)) ||
    read(join(projectDir, "astro.config.mjs")).includes("sitemap") ||
    read(join(projectDir, "astro.config.ts")).includes("sitemap");
  if (!sitemap) missing.push("sitemap");
  gate("aeo-files", missing.length ? "FAIL" : "PASS", missing.length ? `missing: ${missing.join(", ")}` : "llms.txt + robots.txt + sitemap ✓");
}

// ── 6. Robots AI-crawler section (HIGH) ─────────────────────────────────────
{
  const roots = [projectDir, join(projectDir, "public"), ...BUILT_DIRS.map((d) => join(projectDir, d))];
  const robots = roots.map((r) => read(join(r, "robots.txt"))).find((t) => t) || "";
  const hasAi = /GPTBot|ClaudeBot|PerplexityBot/i.test(robots) || srcFiles.some((f) => /robots\.(ts|js)$/.test(f) && /GPTBot|ClaudeBot/i.test(read(f)));
  gate("robots-ai-allowlist", hasAi ? "PASS" : "FAIL", hasAi ? "AI crawler section ✓" : "no AI-crawler entries in robots");
}

// ── 7. Image alt attributes (CRITICAL, a11y floor) ──────────────────────────
{
  let missing = 0, total = 0;
  for (const f of srcFiles.filter((f) => [".tsx", ".jsx", ".astro", ".html"].includes(extname(f)))) {
    for (const m of read(f).matchAll(/<(img|Image)\b[^>]*>/gi)) {
      total++;
      if (!/\balt\s*=/.test(m[0])) missing++;
    }
  }
  gate("img-alt", total === 0 ? "SKIP" : missing ? "FAIL" : "PASS", `${total - missing}/${total} imgs have alt`);
}

// ── 8. Bundle size (CRITICAL vs budget) ─────────────────────────────────────
{
  const builtRoot = BUILT_DIRS.map((d) => join(projectDir, d)).find((d) => existsSync(d));
  if (!builtRoot) gate("bundle-size", "SKIP", "no build output found — run the recipe build first");
  else {
    const js = walkAll(builtRoot).filter((f) => f.endsWith(".js") && !f.includes("node_modules"));
    const gz = js.reduce((n, f) => { try { return n + gzipSync(readFileSync(f)).length; } catch { return n; } }, 0);
    const kb = Math.round(gz / 1024);
    gate("bundle-size", kb <= budgetKb ? "PASS" : "FAIL", `${kb}kb gz JS (budget ${budgetKb}kb, ${js.length} files)`);
  }
}

// ── 9. Focus visibility not destroyed (HIGH) ────────────────────────────────
{
  const bad = srcFiles.filter((f) => /outline:\s*none|outline-none/.test(read(f)) && !/focus-visible|:focus\s*\{[^}]*(ring|outline|box-shadow)/.test(read(f)));
  gate("focus-visible", bad.length ? "FAIL" : "PASS", bad.length ? `outline removed without replacement in ${bad.length} file(s)` : "✓");
}

// ── Report ──────────────────────────────────────────────────────────────────
const CRITICAL = new Set(["animation-properties", "reduced-motion", "semantic-html", "json-ld", "aeo-files", "img-alt", "bundle-size"]);
const failures = gates.filter((g) => g.status === "FAIL");
const critical = failures.filter((g) => CRITICAL.has(g.id));
const result = { project: projectDir, budgetKb, gates, critical_failures: critical.length, high_failures: failures.length - critical.length, verdict: critical.length ? "FAIL" : "PASS" };

if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
else {
  for (const g of gates) console.log(`${g.status === "PASS" ? "✓" : g.status === "SKIP" ? "-" : "✗"} [${g.status}] ${g.id}: ${g.detail}`);
  console.log(`\nVERDICT: ${result.verdict} (${critical.length} critical, ${result.high_failures} high)`);
}
process.exit(critical.length ? 1 : 0);
