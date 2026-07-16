/**
 * Contrast math for the Desert Aire token pairs (qa-iter-2, item 1 + 6).
 * OKLCH → OKLab → LMS → linear sRGB → WCAG relative luminance → ratio.
 * Run: node scripts/contrast-check.mjs
 */

function oklchToLinearSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

// WCAG relative luminance takes linear-light channels directly.
const luminance = ([r, g, b]) =>
  0.2126 * Math.max(0, Math.min(1, r)) +
  0.7152 * Math.max(0, Math.min(1, g)) +
  0.0722 * Math.max(0, Math.min(1, b));

const ratio = (l1, l2) => {
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

const lum = (L, C, h) => luminance(oklchToLinearSrgb(L, C, h));

// tokens.css values (DESIGN.md verbatim)
const ink = lum(0.222, 0.006, 91.6);
const inkSoft = lum(0.4, 0.008, 85);
const bg = lum(0.966, 0.008, 73.7);
const surface = lum(0.949, 0.007, 88.6);
const heat = lum(0.653, 0.179, 33.8);
const clay = lum(0.62, 0.122, 40.3);

const report = (name, a, b, need) => {
  const r = ratio(a, b);
  console.log(
    `${r >= need ? "PASS" : "FAIL"}  ${name}: ${r.toFixed(2)}:1 (needs ≥${need})`,
  );
  return r;
};

console.log("— flagged pairs —");
report("heat text on surface (old step numbers)", heat, surface, 4.5);
report("ink text on surface (new step numbers)", ink, surface, 4.5);
console.log("— CTA fill labels —");
report("ink label on heat (btn base)", ink, heat, 4.5);

// Item 6: darkest hover L (step .001) keeping ink-on-fill ≥ 4.5 with margin
let chosen = null;
for (let L = 0.653; L >= 0.58; L -= 0.001) {
  const r = ratio(ink, lum(L, 0.179, 33.8));
  if (r >= 4.55) chosen = { L, r }; // 4.55 = safety margin over 4.5
  else break;
}
console.log(
  `hover pick: oklch(${(chosen.L * 100).toFixed(1)}% 0.179 33.8) → ` +
    `${chosen.r.toFixed(2)}:1 vs ink (darkest L holding ≥4.55)`,
);
report(
  "ink label on chosen hover fill",
  ink,
  lum(chosen.L, 0.179, 33.8),
  4.5,
);

console.log("— sanity (unchanged tokens) —");
report("ink on bg (body text)", ink, bg, 4.5);
report("ink-soft on bg (muted text)", inkSoft, bg, 4.5);
report("heat on bg (focus ring, non-text)", heat, bg, 3);
report("clay on surface (non-text accents)", clay, surface, 3);
