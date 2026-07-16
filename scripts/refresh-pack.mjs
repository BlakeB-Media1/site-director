#!/usr/bin/env node
/**
 * refresh-pack.mjs — re-fetch raw sources for the site-director reference pack.
 * Usage: node refresh-pack.mjs [--only registry|trends|typography|aeo] [--dry-run]
 *
 * Fetching is mechanical (this script); DISTILLATION is not — after it runs,
 * load the site-director skill and ask Claude to re-distill reference-pack/*.md
 * from reference-pack/_raw/ (per references/research-protocol.md). The script
 * stamps PACK-MANIFEST.md so the staleness check sees the refresh started.
 * Cost note: ~100-150 firecrawl credits for a full refresh (galleries are JS-heavy).
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const packDir = join(dirname(fileURLToPath(import.meta.url)), "..", "reference-pack");
const rawDir = join(packDir, "_raw");
mkdirSync(rawDir, { recursive: true });

const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const dryRun = process.argv.includes("--dry-run");
// Node execSync on win32 shells out via cmd.exe → always use the .cmd shim there.
const FC = process.platform === "win32" ? "firecrawl.cmd" : "firecrawl";

// group → [slug, url, extraArgs]
const SOURCES = {
  registry: [
    ["aceternity", "https://ui.aceternity.com/components", ""],
    ["magicui", "https://magicui.design/docs/components", ""],
    ["reactbits", "https://reactbits.dev", ""],
    ["tailark", "https://tailark.com", ""],
    ["hyperui", "https://www.hyperui.dev", ""],
    ["originui", "https://originui.com", ""],
  ],
  trends: [
    ["figma-trends", "https://www.figma.com/resource-library/web-design-trends/", ""],
    ["landbook", "https://land-book.com", ""],
    ["recent-design", "https://recent.design", ""], // formerly godly.website
    ["siteinspire", "https://www.siteinspire.com", ""],
    ["onepagelove", "https://onepagelove.com", ""],
  ],
  typography: [
    ["typewolf", "https://www.typewolf.com/site-of-the-day", ""],
    ["typewolf-popular", "https://www.typewolf.com/popular", ""],
    ["fontsinuse", "https://fontsinuse.com", ""],
  ],
  aeo: [
    ["llmstxt", "https://llmstxt.org", ""],
    ["openai-bots", "https://developers.openai.com/bots", ""],
    ["anthropic-crawler", "https://support.claude.com/en/articles/8896518", ""],
  ],
};

let ran = 0, failed = [];
for (const [group, items] of Object.entries(SOURCES)) {
  if (only && group !== only) continue;
  for (const [slug, url] of items) {
    const out = join(rawDir, `${group}-${slug}.md`);
    const cmd = `${FC} scrape "${url}" --format markdown --only-main-content -o "${out}"`;
    console.log(dryRun ? `[dry] ${cmd}` : `→ ${group}/${slug}`);
    if (dryRun) continue;
    try { execSync(cmd, { stdio: "pipe", timeout: 120000 }); ran++; }
    catch (e) { failed.push(`${group}/${slug}: ${String(e.message).slice(0, 100)}`); }
  }
  // fresh trend-article search alongside the trends group
  if (group === "trends" && !dryRun) {
    try {
      execSync(`${FC} search "web design trends ${new Date().getFullYear()}" --scrape --limit 3 --json -o "${join(rawDir, "trends-search.json")}"`, { stdio: "pipe", timeout: 180000 });
      ran++;
    } catch (e) { failed.push(`trends/search: ${String(e.message).slice(0, 100)}`); }
  }
}

if (!dryRun) {
  const manifest = join(packDir, "PACK-MANIFEST.md");
  const stamp = `\n## Raw refresh ${new Date().toISOString().slice(0, 10)}\n- fetched: ${ran}, failed: ${failed.length}${failed.length ? "\n- failures: " + failed.join("; ") : ""}\n- NEXT STEP: distill _raw/ into the pack files (load site-director skill → research-protocol.md § refresh)\n`;
  writeFileSync(manifest, (existsSync(manifest) ? readFileSync(manifest, "utf8") : "# Pack Manifest\n") + stamp);
  console.log(`\nDone: ${ran} fetched, ${failed.length} failed. Raw → reference-pack/_raw/`);
  console.log("Distill next: ask Claude (site-director loaded) to re-distill the pack from _raw/.");
  if (failed.length) console.log("Failures:\n  " + failed.join("\n  "));
}
