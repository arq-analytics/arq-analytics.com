// `npm run build:static`: builds the site as plain files for GitHub Pages into ui/frontend/out.
// A static export has no server, so:
// - the enquiry endpoint is parked outside the app while Next builds, and always put back;
// - the contact page shows WhatsApp, phone and email instead of the form (see src/lib/build.ts);
// - the bare domain and the old site's pages get small redirect pages instead of server redirects.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const frontend = path.join(root, "ui/frontend");
const api = path.join(frontend, "src/app/api");
const parked = path.join(frontend, ".api-parked");
const out = path.join(frontend, "out");
const site = JSON.parse(fs.readFileSync(path.join(root, "content/en/site.json"), "utf8"));
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.brand.domain).replace(/\/$/, "");

// A run that was stopped half way leaves the endpoint parked. Put it back before anything else.
if (fs.existsSync(parked) && !fs.existsSync(api)) fs.renameSync(parked, api);

fs.rmSync(out, { recursive: true, force: true });
fs.renameSync(api, parked);
let status = 1;
try {
  const next = path.join(root, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [next, "build"], {
    cwd: frontend,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_ANALYTICS: "off" },
  });
  status = result.status ?? 1;
} finally {
  fs.renameSync(parked, api);
}
if (status !== 0) process.exit(status);

/** Where the old site's pages and the bare domain now live. Mirrors the redirects in next.config.ts. */
const redirects = {
  "index.html": "/en/",
  "portfolio-details.html": "/en/products/",
  "inner-page.html": "/en/",
};

const page = (to) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${site.brand.name}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${siteUrl}${to}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
</head>
<body><a href="${to}">${site.brand.name}</a></body>
</html>
`;

for (const [file, to] of Object.entries(redirects)) fs.writeFileSync(path.join(out, file), page(to));

// GitHub Pages shows 404.html for any unknown address, such as an old link to the previous site. Next cannot
// export the styled not-found page on its own, so it is written here from the same copy and classes as
// app/[locale]/not-found.tsx, with the stylesheets and font classes of the built home page.
const ui = JSON.parse(fs.readFileSync(path.join(root, "content/en/ui.json"), "utf8"));
const home = fs.readFileSync(path.join(out, "en/index.html"), "utf8");
const htmlTag = home.match(/<html[^>]*>/)?.[0] ?? '<html lang="en">';
const styles = (home.match(/<link rel="stylesheet"[^>]*>/g) ?? []).join("\n");
fs.writeFileSync(
  path.join(out, "404.html"),
  `<!doctype html>
${htmlTag}
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${ui.notFound.title} | ${site.brand.name}</title>
${styles}
</head>
<body>
<main class="section">
<div class="container not-found">
<span class="eyebrow">404</span>
<h1>${ui.notFound.title}</h1>
<p>${ui.notFound.text}</p>
<div class="cta-pair"><a class="arq-primary" href="/en/">${ui.notFound.home}</a></div>
</div>
</main>
</body>
</html>
`,
);

const pages = fs.readdirSync(out, { recursive: true }).filter((f) => String(f).endsWith(".html")).length;
console.log(
  `PASS: static site in ui/frontend/out, ${pages} HTML files including ${Object.keys(redirects).length} redirects`,
);
