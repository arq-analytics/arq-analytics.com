// Builds the 1200x630 Open Graph image from the logo, centred on ink. Run: node scripts/make-og.mjs
// Uses sharp, which Next.js already installs for image optimisation.
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.resolve(import.meta.dirname, "../ui/frontend/package.json"));
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const logo = path.join(root, "assets/brand/arq-logo.jpeg");
const out = path.join(root, "ui/frontend/public/og.png");
const INK = { r: 11, g: 12, b: 15 }; // --arq-ink

const size = 520;
const mark = await sharp(logo).resize(size, size, { fit: "cover" }).toBuffer();

await sharp({ create: { width: 1200, height: 630, channels: 3, background: INK } })
  .composite([{ input: mark, left: Math.round((1200 - size) / 2), top: Math.round((630 - size) / 2) }])
  .png()
  .toFile(out);

console.log("wrote", path.relative(root, out));
