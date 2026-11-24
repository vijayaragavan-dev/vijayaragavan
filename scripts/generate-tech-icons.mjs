// Regenerates lib/tech-icons.ts from the simple-icons package.
// Run with: npm run icons:generate   (requires simple-icons in devDependencies)
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules/simple-icons/package.json"), "utf8"),
);
const meta = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules/simple-icons/data/simple-icons.json"), "utf8"),
);
const list = Array.isArray(meta) ? meta : meta.icons;
const bySlug = new Map(list.map((e) => [e.slug, e]));

// Brand marks required by the Skills detail panel.
const slugs = [
  "openjdk",
  "python",
  "javascript",
  "c",
  "cplusplus",
  "html5",
  "css",
  "springboot",
  "mysql",
  "postgresql",
  "mongodb",
  "numpy",
  "pandas",
  "scikitlearn",
  "langchain",
];

// Brand colours are injected at runtime through `hex`; gradients are opt-in
// per mark (Python is officially two-tone blue / yellow).
const overrides = {
  // simple-icons ships the OpenJDK mark (the Java coffee cup) with a black
  // hex, which is invisible on a dark panel. Use the Java brand orange-red
  // that simple-icons historically carried for the Java mark instead.
  openjdk: { hex: "#E76F00", title: "Java" },
  // Python is officially two-tone blue / yellow.
  python: { gradient: ["#3776AB", "#FFD43B"] },
};

const entries = [];

for (const slug of slugs) {
  const svgPath = path.join(root, "node_modules/simple-icons/icons", `${slug}.svg`);
  if (!fs.existsSync(svgPath)) throw new Error(`missing icon: ${slug}`);
  const svg = fs.readFileSync(svgPath, "utf8");
  const title = (svg.match(/<title>([^<]*)<\/title>/) || [])[1];
  const d = (svg.match(/<path d="([^"]+)"/) || [])[1];
  if (!d) throw new Error(`missing path: ${slug}`);
  const metaEntry = bySlug.get(slug);
  const hex = (metaEntry && metaEntry.hex) || "8E9BB0";
  const entry = { slug, title: title || slug, hex: `#${hex}`, path: d };
  if (overrides[slug]) Object.assign(entry, overrides[slug]);
  entries.push(entry);
}

// Oracle wordmark — vendored from Wikimedia Commons (Oracle_logo.svg).
entries.push({
  slug: "oracle",
  title: "Oracle",
  hex: "#C74634",
  viewBox: "0 0 231 30",
  wide: true,
  path:
    "M99.61,19.52h15.24l-8.05-13L92,30H85.27l18-28.17a4.29,4.29,0,0,1,7-.05L128.32,30h-6.73l-3.17-5.25H103l-3.36-5.23m69.93,5.23V0.28h-5.72V27.16a2.76,2.76,0,0,0,.85,2,2.89,2.89,0,0,0,2.08.87h26l3.39-5.25H169.54M75,20.38A10,10,0,0,0,75,.28H50V30h5.71V5.54H74.65a4.81,4.81,0,0,1,0,9.62H58.54L75.6,30h8.29L72.43,20.38H75M14.88,30H32.15a14.86,14.86,0,0,0,0-29.71H14.88a14.86,14.86,0,1,0,0,29.71m16.88-5.23H15.26a9.62,9.62,0,0,1,0-19.23h16.5a9.62,9.62,0,1,1,0,19.23M140.25,30h17.63l3.34-5.23H140.64a9.62,9.62,0,1,1,0-19.23h16.75l3.38-5.25H140.25a14.86,14.86,0,1,0,0,29.71m69.87-5.23a9.62,9.62,0,0,1-9.26-7h24.42l3.36-5.24H200.86a9.61,9.61,0,0,1,9.26-7h16.76l3.35-5.25h-20.5a14.86,14.86,0,0,0,0,29.71h17.63l3.35-5.23h-20.6",
});

const q = (v) => JSON.stringify(v);

const lines = [];
lines.push(`// Brand technology marks for the Skills detail panel.`);
lines.push(`//`);
lines.push(`// Path data vendored from simple-icons@${pkg.version} (CC0-1.0) so the`);
lines.push(`// bundle only ships the marks actually used. The Oracle wordmark comes`);
lines.push(`// from Wikimedia Commons (Oracle_logo.svg) because simple-icons no longer`);
lines.push(`// ships an Oracle mark.`);
lines.push(`//`);
lines.push(`// Brand colours (` + "`hex`" + `) stay true to each product; the surrounding tile`);
lines.push(`// follows the portfolio's dark emerald glass theme.`);
lines.push(``);
lines.push(`export type BrandIcon = {`);
lines.push(`  title: string;`);
lines.push(`  hex: string;`);
lines.push(`  path: string;`);
lines.push(`  viewBox?: string;`);
lines.push(`  gradient?: [string, string];`);
lines.push(`  wide?: boolean;`);
lines.push(`};`);
lines.push(``);
lines.push(`export const brandIcons: Record<string, BrandIcon> = {`);
for (const e of entries) {
  lines.push(`  ${q(e.slug)}: {`);
  lines.push(`    title: ${q(e.title)},`);
  lines.push(`    hex: ${q(e.hex)},`);
  if (e.viewBox) lines.push(`    viewBox: ${q(e.viewBox)},`);
  if (e.gradient) lines.push(`    gradient: [${q(e.gradient[0])}, ${q(e.gradient[1])}] as [string, string],`);
  if (e.wide) lines.push(`    wide: true,`);
  lines.push(`    path: ${q(e.path)},`);
  lines.push(`  },`);
}
lines.push(`};`);
lines.push(``);

const out = path.join(root, "lib/tech-icons.ts");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`wrote ${out} (${entries.length} marks)`);
