#!/usr/bin/env node
/**
 * googleStitchConnector — prototype generation + testing-URL resolution for Site Director v2.
 *
 * TWO TRANSPORTS, ONE RETURN SHAPE.
 *
 *   transport "mcp"  (DEFAULT, and the only one verified to work)
 *     Google Stitch is reachable through the connected `stitch` MCP server
 *     (mcp__stitch__*). MCP tools live on Claude's tool surface, not Node's, so a
 *     script cannot call them. This module therefore emits the exact call plan and
 *     Claude executes it — see references/prototype-gate.md. `planMcp()` below is
 *     the single source of truth for that sequence.
 *
 *   transport "http"  (DECLARED, UNVERIFIED)
 *     POSTs to https://stitch.googleapis.com/v1/prototypes with an API key.
 *     No public Google Stitch REST API is known to exist and this endpoint has not
 *     been observed to respond. It is wired up because the Site Director v2 contract
 *     names it. Do not build on it without confirming the endpoint is real.
 *
 * Usage:
 *   node google-stitch-connector.mjs plan   --design-md <path> [--variants 3] [--project <id>]
 *   node google-stitch-connector.mjs submit --payload <file.json> --transport http
 *   node google-stitch-connector.mjs normalize --screens <screens.json> [--out <file>]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

export const config = {
  name: "googleStitchConnector",
  endpoint: "https://stitch.googleapis.com/v1/prototypes",
  apiKey: process.env.STITCH_API_KEY || "YOUR_API_KEY",
  transport: process.env.STITCH_TRANSPORT || "mcp", // "mcp" | "http"
  timeoutMs: 120000,
  poll: { everyMs: 30000, maxAttempts: 10 }, // Stitch generation runs for minutes
};

/** Default variant strategy. 1-5 per the MCP schema; 3 balances spread against wait time. */
export const defaultVariantOptions = {
  variantCount: 3,
  creativeRange: "EXPLORE",                    // REFINE | EXPLORE | REIMAGINE
  aspects: ["LAYOUT", "COLOR_SCHEME", "TEXT_FONT"], // omit IMAGES unless AI-image consent was given
};

/**
 * Build the MCP call plan. Claude executes these in order; each `tool` is a real
 * mcp__stitch__* tool and each `args` matches its schema.
 */
export function planMcp(payload = {}) {
  const {
    designMdPath = "DESIGN.md",
    projectId = "<projectId>",
    prompt = "<page prompt from SITE.md + DIRECTION.md>",
    deviceType = "DESKTOP",
    variantOptions = defaultVariantOptions,
  } = payload;

  return [
    { step: 1, tool: "mcp__stitch__create_project", args: { title: payload.title || "site-director run" },
      note: "Skip if projectId already known. Returns the bare numeric project id." },
    { step: 2, tool: "mcp__stitch__upload_design_md", args: { projectId, path: designMdPath },
      note: "Required before create_design_system_from_design_md. DESIGN.md is the Phase 2 artifact." },
    { step: 3, tool: "mcp__stitch__generate_screen_from_text", args: { projectId, prompt, deviceType },
      note: "Baseline screen. Runs for minutes — DO NOT RETRY; poll get_screen instead." },
    { step: 4, tool: "mcp__stitch__create_design_system_from_design_md",
      args: { projectId, selectedScreenInstance: { id: "<screen INSTANCE id>", sourceScreen: "projects/<projectId>/screens/<screenId>" } },
      note: "instance id is NOT the source screen id — read both off the step-3 result." },
    { step: 5, tool: "mcp__stitch__generate_variants",
      args: { projectId, selectedScreenIds: ["<baselineScreenId>"], prompt, variantOptions },
      note: "Variants land as new screens; fetch each one for its URLs." },
    { step: 6, tool: "mcp__stitch__list_screens", args: { projectId },
      note: "Enumerate the variant screen ids produced by step 5." },
    { step: 7, tool: "mcp__stitch__get_screen", args: { name: "projects/<projectId>/screens/<screenId>", projectId, screenId: "<screenId>" },
      note: "Once per variant. Yields screenshot.downloadUrl + htmlCode.downloadUrl.",
      repeat: "per variant screen" },
  ];
}

/**
 * Normalize raw get_screen results into the prototype array the gallery consumes
 * and the testing URL the calling agent expects.
 *
 * IMPORTANT: screenshot.downloadUrl is a signed, expiring URL. Download each to
 * .site-director/prototypes/<id>.png and pass localPath so the gallery keeps
 * rendering after the signature lapses; previewUrl then points at the local file.
 */
export function normalize(screens = [], opts = {}) {
  const { projectId = "", localDir = "" } = opts;
  const prototypes = (screens || []).map((s, i) => {
    const id = s.id || s.screenId || (s.name || "").split("/").pop() || `prototype-${i + 1}`;
    const remote = s.screenshot?.downloadUrl || s.screenshotUrl || "";
    return {
      id,
      name: s.title || s.displayName || `Variant ${i + 1}`,
      previewUrl: s.localPath || (localDir ? `${localDir}/${id}.png` : remote),
      remotePreviewUrl: remote || undefined,
      htmlUrl: s.htmlCode?.downloadUrl || undefined,
      testingUrl: s.name ? `https://stitch.withgoogle.com/${s.name}` : undefined,
      metadata: {
        device: s.deviceType || "UNSPECIFIED",
        width: s.width, height: s.height,
        creativeRange: s.creativeRange || opts.creativeRange,
        designTheme: s.designTheme?.name || s.designTheme,
        screen: s.name,
      },
    };
  });
  // "Returns the testing URL to the calling agent" — project-level when resolvable.
  const testingUrl = projectId ? `https://stitch.withgoogle.com/projects/${projectId}` : prototypes[0]?.testingUrl;
  return { prototypes, testingUrl, count: prototypes.length };
}

/**
 * Declared HTTP transport. Unverified — see the header note.
 * Refuses to run with the placeholder key rather than firing a doomed request.
 */
export async function submitHttp(payload, cfg = config) {
  if (!cfg.apiKey || cfg.apiKey === "YOUR_API_KEY") {
    throw new Error(
      "googleStitchConnector: transport 'http' needs a real key in STITCH_API_KEY. " +
      "The configured endpoint (" + cfg.endpoint + ") is a declared placeholder — no public " +
      "Google Stitch REST API is known to exist. Use transport 'mcp' (the default)."
    );
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), cfg.timeoutMs);
  try {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": cfg.apiKey },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    if (!res.ok) throw new Error(`googleStitchConnector: HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    return normalize(data.screens || data.prototypes || [], { projectId: data.projectId });
  } finally {
    clearTimeout(timer);
  }
}

/** Unified entry point. Returns { prototypes, testingUrl } or an executable MCP plan. */
export async function googleStitchConnector(payload = {}, cfg = config) {
  if (cfg.transport === "http") return submitHttp(payload, cfg);
  return { transport: "mcp", plan: planMcp(payload), executedBy: "Claude via mcp__stitch__* tools" };
}

// ── CLI ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : null);
const cmd = argv[0];

if (cmd === "plan") {
  const payload = {
    designMdPath: arg("--design-md") || "DESIGN.md",
    projectId: arg("--project") || "<projectId>",
    variantOptions: { ...defaultVariantOptions, variantCount: Number(arg("--variants") || 3) },
  };
  console.log(JSON.stringify(planMcp(payload), null, 2));
} else if (cmd === "submit") {
  const f = arg("--payload");
  if (!f || !existsSync(f)) { console.error("submit needs --payload <file.json>"); process.exit(1); }
  const cfg = { ...config, transport: arg("--transport") || config.transport };
  googleStitchConnector(JSON.parse(readFileSync(f, "utf8")), cfg)
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => { console.error(String(e.message)); process.exit(2); });
} else if (cmd === "normalize") {
  const f = arg("--screens");
  if (!f || !existsSync(f)) { console.error("normalize needs --screens <screens.json>"); process.exit(1); }
  const raw = JSON.parse(readFileSync(f, "utf8"));
  const out = normalize(Array.isArray(raw) ? raw : raw.screens || [], {
    projectId: arg("--project") || raw.projectId || "",
    localDir: arg("--local-dir") || "",
  });
  const dest = arg("--out");
  if (dest) { writeFileSync(dest, JSON.stringify(out.prototypes, null, 2)); console.log(`Wrote ${dest} (${out.count})`); }
  else console.log(JSON.stringify(out, null, 2));
  console.log(`testingUrl: ${out.testingUrl || "(unresolved)"}`);
} else if (cmd) {
  console.error(`Unknown command "${cmd}". Use: plan | submit | normalize`);
  process.exit(1);
}
