#!/usr/bin/env node
/**
 * generate-prototype-html.mjs — implements generatePrototypeHTML().
 * Usage:
 *   node generate-prototype-html.mjs --in prototypes.json --out <dir>
 *   node generate-prototype-html.mjs --sample --out <dir>     # 3 fixtures, no Stitch needed
 *
 * Input: array of { id?, name, previewUrl, metadata }  (id defaults to a slug of name)
 * Output: <dir>/site-director-prototypes.html  +  <dir>/styles.css
 *
 * The HTML is fully self-contained (inline <style>, inline <script>, zero external
 * requests) so it renders from file:// years later. styles.css is emitted alongside
 * as the overridable auxiliary asset — the page does NOT link it.
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CSS = `
/* site-director prototype gallery — editorial dark/light, no external assets */
:root{
  --bg:oklch(96.6% 0.008 73.7); --surface:oklch(99% 0.004 88);
  --ink:oklch(22.2% 0.006 91.6); --muted:oklch(48% 0.012 91);
  --line:oklch(88% 0.008 88); --accent:oklch(48% 0.13 33.8);
  --accent-ink:oklch(99% 0 0); --ring:oklch(65.3% 0.179 33.8);
  --shadow:0 1px 2px oklch(22% 0.01 90 / .06), 0 8px 24px oklch(22% 0.01 90 / .08);
  --serif:ui-serif,"Iowan Old Style",Georgia,Cambria,"Times New Roman",serif;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,SFMono-Regular,"Cascadia Mono",Consolas,monospace;
  --step:clamp(.5rem,.4rem + .5vw,.9rem);
}
@media (prefers-color-scheme:dark){
  :root{--bg:oklch(15.8% 0.007 258.4);--surface:oklch(21.6% 0.016 256.8);
    --ink:oklch(94.7% 0.011 256.7);--muted:oklch(72% 0.02 257);
    --line:oklch(31.1% 0.03 258.3);--accent:oklch(83.9% 0.134 214);
    --accent-ink:oklch(15.8% 0.007 258.4);--ring:oklch(83.9% 0.134 214);
    --shadow:0 1px 2px oklch(0% 0 0 / .4), 0 10px 30px oklch(0% 0 0 / .35);}
}
:root[data-theme="dark"]{--bg:oklch(15.8% 0.007 258.4);--surface:oklch(21.6% 0.016 256.8);
  --ink:oklch(94.7% 0.011 256.7);--muted:oklch(72% 0.02 257);--line:oklch(31.1% 0.03 258.3);
  --accent:oklch(83.9% 0.134 214);--accent-ink:oklch(15.8% 0.007 258.4);--ring:oklch(83.9% 0.134 214);
  --shadow:0 1px 2px oklch(0% 0 0 / .4), 0 10px 30px oklch(0% 0 0 / .35);}
:root[data-theme="light"]{--bg:oklch(96.6% 0.008 73.7);--surface:oklch(99% 0.004 88);
  --ink:oklch(22.2% 0.006 91.6);--muted:oklch(48% 0.012 91);--line:oklch(88% 0.008 88);
  --accent:oklch(48% 0.13 33.8);--accent-ink:oklch(99% 0 0);--ring:oklch(65.3% 0.179 33.8);
  --shadow:0 1px 2px oklch(22% 0.01 90 / .06), 0 8px 24px oklch(22% 0.01 90 / .08);}

*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);
  line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:76rem;margin:0 auto;padding:clamp(1.5rem,1rem + 3vw,4rem) clamp(1rem,.5rem + 2vw,2rem) 8rem}
.eyebrow{font-family:var(--mono);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);margin:0 0 .5rem}
h1{font-family:var(--serif);font-weight:500;font-size:clamp(1.9rem,1.4rem + 2.4vw,3.25rem);
  line-height:1.05;letter-spacing:-.02em;margin:0 0 .6rem}
.lede{color:var(--muted);max-width:56ch;margin:0 0 clamp(1.5rem,1rem + 2vw,2.5rem)}

.grid{display:grid;gap:clamp(1rem,.6rem + 1.4vw,1.75rem);
  grid-template-columns:repeat(auto-fill,minmax(min(20rem,100%),1fr))}
.card{position:relative;display:flex;flex-direction:column;background:var(--surface);
  border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:var(--shadow);
  transition:transform .18s cubic-bezier(.16,1,.3,1),border-color .18s,box-shadow .18s}
.card:hover{transform:translateY(-3px)}
.card:focus-within{outline:2px solid var(--ring);outline-offset:3px}
.card[aria-selected="true"]{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent),var(--shadow)}
.card[aria-selected="true"] .badge{opacity:1;transform:none}

.thumb{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:
  repeating-linear-gradient(45deg,var(--line) 0 10px,transparent 10px 20px);border-bottom:1px solid var(--line)}
.badge{position:absolute;top:.75rem;right:.75rem;font-family:var(--mono);font-size:.7rem;
  letter-spacing:.08em;text-transform:uppercase;background:var(--accent);color:var(--accent-ink);
  padding:.3rem .55rem;border-radius:999px;opacity:0;transform:translateY(-4px);transition:.18s}
.body{padding:1.1rem 1.15rem 1.25rem;display:flex;flex-direction:column;gap:.75rem;flex:1}
.name{font-family:var(--serif);font-size:1.2rem;font-weight:500;letter-spacing:-.01em;margin:0}
dl{display:grid;grid-template-columns:auto 1fr;gap:.25rem .75rem;margin:0;font-size:.82rem}
dt{font-family:var(--mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;
  color:var(--muted);align-self:baseline}
dd{margin:0;color:var(--ink);overflow-wrap:anywhere}
.actions{margin-top:auto;display:flex;gap:.5rem;align-items:center;padding-top:.25rem}
.link{font-size:.8rem;color:var(--muted);text-decoration:underline;text-underline-offset:3px}
.link:hover,.link:focus-visible{color:var(--ink)}

button{font:inherit;cursor:pointer;border-radius:9px;border:1px solid var(--line);
  background:transparent;color:var(--ink);padding:.5rem .9rem;
  transition:background .15s,border-color .15s,color .15s,transform .1s}
button:hover{border-color:var(--ink)}
button:active{transform:translateY(1px)}
button:focus-visible{outline:2px solid var(--ring);outline-offset:2px}
.btn-select[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}

.bar{position:fixed;inset:auto 0 0 0;background:var(--surface);border-top:1px solid var(--line);
  padding:.85rem clamp(1rem,.5rem + 2vw,2rem);display:flex;gap:1rem;align-items:center;
  justify-content:space-between;flex-wrap:wrap;box-shadow:0 -8px 24px oklch(0% 0 0 / .07)}
.status{font-family:var(--mono);font-size:.78rem;color:var(--muted)}
.status strong{color:var(--ink);font-weight:600}
.btn-finish{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
.btn-finish[disabled]{opacity:.4;cursor:not-allowed;background:transparent;color:var(--muted);
  border-color:var(--line)}
.empty{border:1px dashed var(--line);border-radius:14px;padding:3rem 1.5rem;text-align:center;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}
  .card:hover{transform:none}}
`.trim();

/**
 * generatePrototypeHTML(prototypes, options) -> { html, css, filename }
 * @param {Array<{id?:string,name:string,previewUrl:string,metadata?:object}>} prototypes
 */
export function generatePrototypeHTML(prototypes, options = {}) {
  const { title = "Prototype variants", project = "", metaKeys = 6 } = options;
  const list = (Array.isArray(prototypes) ? prototypes : []).map((p, i) => ({
    id: p.id || slug(p.name) || `prototype-${i + 1}`,
    name: p.name || `Prototype ${i + 1}`,
    previewUrl: p.previewUrl || "",
    testingUrl: p.testingUrl || "",
    metadata: p.metadata && typeof p.metadata === "object" ? p.metadata : {},
  }));

  const cards = list.map((p, i) => {
    // dt is uppercased by CSS, so split camelCase first or "creativeRange" reads CREATIVERANGE.
    const label = (k) => String(k).replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
    const meta = Object.entries(p.metadata).slice(0, metaKeys)
      .map(([k, v]) => `<dt>${esc(label(k))}</dt><dd>${esc(typeof v === "object" ? JSON.stringify(v) : v)}</dd>`)
      .join("");
    // previewUrl is the image source per spec; onerror keeps the card usable if a
    // signed Stitch URL has expired rather than showing a broken-image glyph.
    const img = p.previewUrl
      ? `<img class="thumb" src="${esc(p.previewUrl)}" alt="Preview of ${esc(p.name)}" loading="${i < 2 ? "eager" : "lazy"}" onerror="this.removeAttribute('src');this.alt='Preview unavailable — ${esc(p.name)}'">`
      : `<div class="thumb" role="img" aria-label="No preview available for ${esc(p.name)}"></div>`;
    return `      <article class="card" role="radio" aria-checked="false" aria-selected="false" tabindex="${i === 0 ? "0" : "-1"}" data-id="${esc(p.id)}">
        ${img}
        <span class="badge" aria-hidden="true">Selected</span>
        <div class="body">
          <h2 class="name">${esc(p.name)}</h2>
          ${meta ? `<dl>${meta}</dl>` : ""}
          <div class="actions">
            <button type="button" class="btn-select" aria-pressed="false" data-id="${esc(p.id)}">Select</button>
            ${p.testingUrl ? `<a class="link" href="${esc(p.testingUrl)}" target="_blank" rel="noopener noreferrer">Open in Stitch</a>` : ""}
          </div>
        </div>
      </article>`;
  }).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}${project ? ` — ${esc(project)}` : ""}</title>
<style>
${CSS}
</style>
</head>
<body>
<main class="wrap">
  <p class="eyebrow">Site Director${project ? ` · ${esc(project)}` : ""}</p>
  <h1>${esc(title)}</h1>
  <p class="lede">Pick the direction to carry into the build. One choice moves forward; the
  rest are archived with the run. Nothing is built until you finish the pass-through.</p>

  <input type="hidden" id="selectedPrototype" name="selectedPrototype" value="">

  ${list.length
      ? `<div class="grid" role="radiogroup" aria-label="Prototype variants">\n${cards}\n  </div>`
      : `<p class="empty">No prototypes were generated. Check <code>quality-report.md</code> for the logged degradation, then build from <code>DESIGN.md</code> directly.</p>`}
</main>

<div class="bar">
  <p class="status" id="status">No prototype selected</p>
  <button type="button" id="finish" class="btn-finish" disabled>Finish Pass-Through</button>
</div>

<script>
(function () {
  "use strict";
  var hidden = document.getElementById("selectedPrototype");
  var status = document.getElementById("status");
  var finish = document.getElementById("finish");
  var cards  = Array.prototype.slice.call(document.querySelectorAll(".card"));

  function select(id) {
    hidden.value = id;                                   // spec: store chosen id here
    cards.forEach(function (c) {
      var on = c.dataset.id === id;
      c.setAttribute("aria-selected", on ? "true" : "false");
      c.setAttribute("aria-checked", on ? "true" : "false");
      c.tabIndex = on ? 0 : -1;
      c.querySelector(".btn-select").setAttribute("aria-pressed", on ? "true" : "false");
    });
    status.innerHTML = "Selected: <strong>" + id.replace(/[&<>]/g, "") + "</strong>";
    finish.disabled = false;
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-select");
    if (btn) { select(btn.dataset.id); return; }
    if (e.target.closest("a")) return;                   // let real links through
    var card = e.target.closest(".card");
    if (card) select(card.dataset.id);
  });

  // Roving-tabindex keyboard support for the radiogroup.
  document.addEventListener("keydown", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var i = cards.indexOf(card), next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = cards[(i + 1) % cards.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = cards[(i - 1 + cards.length) % cards.length];
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); select(card.dataset.id); return; }
    if (next) { e.preventDefault(); next.focus(); select(next.dataset.id); }
  });

  // Default onFinish. Override by defining window.onFinish before this runs, or
  // reassign it from the console/host page: window.onFinish = function (id) {...}
  if (typeof window.onFinish !== "function") {
    window.onFinish = function (selectedPrototype) {
      var payload = {
        selectedPrototype: selectedPrototype,
        selectedAt: new Date().toISOString(),
        source: "site-director-prototypes.html"
      };
      console.log("onFinish", selectedPrototype, payload);
      try { localStorage.setItem("siteDirector.selectedPrototype", selectedPrototype); } catch (err) {}
      // The page cannot write to the project directory, so hand back a real file.
      try {
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "selection.json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      } catch (err) {}
      status.innerHTML = "Handed off: <strong>" + selectedPrototype.replace(/[&<>]/g, "") +
        "</strong> — save selection.json to .site-director/prototypes/";
      finish.disabled = true;
      return payload;
    };
  }

  finish.addEventListener("click", function () {
    var id = hidden.value;
    if (!id) return;
    window.onFinish(id);                                  // spec: onFinish(selectedPrototype)
  });
})();
</script>
</body>
</html>
`;
  return { html, css: CSS, filename: "site-director-prototypes.html" };
}

// ── CLI ─────────────────────────────────────────────────────────────────────
const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isCli) {
  const argv = process.argv.slice(2);
  const arg = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : null);
  const outDir = arg("--out") || join(dirname(fileURLToPath(import.meta.url)), "..", ".preview");

  // Two fixtures carry inline-SVG data URIs so --sample renders visually with zero
  // network; the third points at a missing file on purpose, to exercise the
  // expired-signed-URL fallback path in the card markup.
  const mock = (bg, ink, label) => "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="${bg}"/>` +
    `<rect x="24" y="24" width="120" height="10" rx="5" fill="${ink}" opacity=".85"/>` +
    `<rect x="24" y="46" width="210" height="22" rx="4" fill="${ink}" opacity=".6"/>` +
    `<rect x="24" y="78" width="170" height="8" rx="4" fill="${ink}" opacity=".35"/>` +
    `<rect x="24" y="94" width="140" height="8" rx="4" fill="${ink}" opacity=".35"/>` +
    `<rect x="24" y="120" width="86" height="26" rx="13" fill="${ink}" opacity=".9"/>` +
    `<text x="296" y="188" text-anchor="end" font-family="monospace" font-size="11" fill="${ink}" opacity=".5">${label}</text></svg>`);

  const SAMPLE = [
    { id: "proto-editorial-01", name: "Editorial Serif", previewUrl: mock("#F7F3EE", "#1C1B18", "01"),
      metadata: { direction: "Editorial", palette: "Cloud Dancer Reset", type: "Instrument Serif + Geist", device: "DESKTOP", creativeRange: "EXPLORE" } },
    { id: "proto-moodmode-02", name: "Mood-Mode Dark", previewUrl: mock("#0B0D10", "#40E0FF", "02"),
      metadata: { direction: "Dark luxury", palette: "Mood-Mode Dark", type: "Archivo + Source Sans 3", device: "DESKTOP", creativeRange: "EXPLORE" } },
    { id: "proto-bento-03", name: "Bento Utility", previewUrl: "prototypes/missing-on-purpose.png",
      metadata: { direction: "Bento", palette: "Transformative Teal & Earth", type: "Fraunces + Archivo", device: "DESKTOP", creativeRange: "REIMAGINE" } },
  ];

  let protos = SAMPLE, project = "Sample run";
  if (!argv.includes("--sample")) {
    const inFile = arg("--in");
    if (!inFile || !existsSync(inFile)) {
      console.error("Provide --in <prototypes.json> or --sample. See --help in the file header.");
      process.exit(1);
    }
    const parsed = JSON.parse(readFileSync(inFile, "utf8"));
    protos = Array.isArray(parsed) ? parsed : parsed.prototypes || [];
    project = parsed.project || "";
  }

  const { html, css, filename } = generatePrototypeHTML(protos, { project });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, filename), html);
  writeFileSync(join(outDir, "styles.css"), css + "\n");
  console.log(`Wrote ${join(outDir, filename)} (${protos.length} prototypes)`);
  console.log(`Wrote ${join(outDir, "styles.css")}`);
}
