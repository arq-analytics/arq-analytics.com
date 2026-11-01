// `npm run check:build`: run after `npm run build`. Reads the built HTML and checks the spec's
// page-level rules. Exits 1 on any failure.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const appDir = path.join(root, "ui/frontend/.next/server/app");
const site = JSON.parse(fs.readFileSync(path.join(root, "content/en/site.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(root, "content/en/products.json"), "utf8")).products;

if (!fs.existsSync(appDir)) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) files.push(full);
  }
})(appDir);

const problems = [];
const fail = (page, message) => problems.push(`${page}: ${message}`);
const digits = (s) => s.replace(/\D/g, "");
const officialPhone = digits(site.contact.phoneDisplay);
const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
let checked = 0;

for (const file of files) {
  const rel = path.relative(appDir, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  checked += 1;

  // one h1, one canonical, hreflang for four locales plus x-default
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(rel, `expected 1 <h1>, found ${h1}`);
  const canonical = (html.match(/<link rel="canonical"/g) ?? []).length;
  if (canonical !== 1) fail(rel, `expected 1 canonical, found ${canonical}`);
  for (const l of ["en", "hi", "mr", "gu", "x-default"]) {
    if (!html.includes(`hrefLang="${l}"`) && !html.includes(`hreflang="${l}"`)) fail(rel, `missing hreflang ${l}`);
  }
  for (const tag of [
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'name="twitter:card"',
    'name="description"',
  ]) {
    if (!html.includes(tag)) fail(rel, `missing ${tag}`);
  }
  if (!/<html[^>]*\slang="(en|hi|mr|gu)"/.test(html)) fail(rel, "missing <html lang>");
  if (!html.includes("application/ld+json")) fail(rel, "missing JSON-LD");

  // only the official phone, email and LinkedIn
  for (const m of html.matchAll(/(?:tel:|wa\.me\/)\+?(\d{10,13})/g)) {
    if (!digits(m[1]).endsWith(officialPhone.slice(-10))) fail(rel, `unofficial number ${m[1]}`);
  }
  for (const m of html.matchAll(/mailto:([^"?\\]+)/g)) {
    if (m[1] !== site.contact.email) fail(rel, `unofficial email ${m[1]}`);
  }
  for (const m of html.matchAll(/https?:\/\/(?:www\.)?linkedin\.com[^"'\s<\\]*/g)) {
    if (m[0] !== site.contact.linkedin) fail(rel, `unofficial LinkedIn ${m[0]}`);
  }
  for (const m of html.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    if (m[0] !== site.contact.email && !m[0].endsWith("@2x.png")) fail(rel, `unexpected email-like text ${m[0]}`);
  }

  // product pages: a product that is not live never shows a trial CTA or live-only wording
  const slug = rel.match(/^(?:en|hi|mr|gu)\/products\/([^/.]+)\.html$/)?.[1];
  if (slug) {
    const product = productBySlug[slug];
    if (!product) {
      fail(rel, "no product for slug");
      continue;
    }
    const live = product.status === "live";
    // A trial link for this page's own product. Related cards may show another, live, product's trial.
    const ownTrial = new RegExp(`product=${product.id}(?:&amp;|&)intent=trial`).test(html);
    if (!live && ownTrial) fail(rel, "non-live product renders its own trial CTA");
    if (live && product.id !== "digitalTwin" && !ownTrial && site.trial.products.includes(product.id))
      fail(rel, "live trial product is missing its trial CTA");
    if (live && product.id !== "astra" && product.id !== "yantra") fail(rel, "unexpected live product");
    if (!live && /"@type":"SoftwareApplication"/.test(html)) fail(rel, "non-live product emits SoftwareApplication");
    if (live && !/"@type":"SoftwareApplication"/.test(html)) fail(rel, "live product is missing SoftwareApplication");
    const planned = html.includes(product.plannedNote ?? "\u0000");
    if (!live && !planned) fail(rel, "non-live product is missing the planned-scope note");
  }
}

// The home page may show trial CTAs for live products, and never an unofficial contact (checked above).
if (checked < 40) fail("build", `expected at least 40 pages, found ${checked}`);

if (problems.length > 0) {
  console.error(`FAIL: ${problems.length} problem(s) across ${checked} built pages`);
  problems.slice(0, 40).forEach((p) => console.error(" -", p));
  process.exit(1);
}
console.log(
  `PASS: ${checked} built pages: one h1, canonical, hreflang x5, Open Graph, JSON-LD, official contacts only, CTAs match status`,
);
