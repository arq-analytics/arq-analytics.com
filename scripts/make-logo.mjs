// Builds transparent PNGs of the real ARQ logo from assets/brand/arq-logo.jpeg.
// Run: npm run logo
//
// The JPEG is white and orange artwork on a near-black square. This removes the black
// (colour-to-alpha against the measured background), crops to the artwork, and writes:
//   ui/frontend/public/brand/arq-logo-on-dark.png   white and orange, for dark surfaces
//   ui/frontend/public/brand/arq-logo-on-light.png  ink and orange, for light surfaces
// Replace both with exports of a vector logo when one exists.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.resolve(import.meta.dirname, "../ui/frontend/package.json"));
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "assets/brand/arq-logo.jpeg");
const outDir = path.join(root, "ui/frontend/public/brand");
const INK = [11, 12, 15]; // --arq-ink
const WIDTH = 720; // about 3x the largest display width

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

// background: average of the four corner patches
const patch = 24;
const bg = [0, 0, 0];
let count = 0;
for (const [x0, y0] of [
  [0, 0],
  [w - patch, 0],
  [0, h - patch],
  [w - patch, h - patch],
]) {
  for (let y = y0; y < y0 + patch; y++)
    for (let x = x0; x < x0 + patch; x++) {
      const i = (y * w + x) * 3;
      bg[0] += data[i];
      bg[1] += data[i + 1];
      bg[2] += data[i + 2];
      count++;
    }
}
bg.forEach((v, c) => (bg[c] = v / count));

const dark = Buffer.alloc(w * h * 4);
const light = Buffer.alloc(w * h * 4);
let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;

for (let p = 0; p < w * h; p++) {
  const rgb = [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];
  // colour to alpha: the smallest alpha that explains this pixel over the background
  // (the artwork is only ever lighter than the background; darker pixels are JPEG noise)
  let a = 0;
  for (let c = 0; c < 3; c++) a = Math.max(a, (rgb[c] - bg[c]) / (255 - bg[c]));
  const FLOOR = 0.07;
  a = a <= FLOOR ? 0 : Math.min(1, (a - FLOOR) / (1 - FLOOR));
  const col = a > 0 ? rgb.map((v, c) => Math.max(0, Math.min(255, bg[c] + (v - bg[c]) / a))) : [0, 0, 0];

  // neutral (white or grey) pixels become ink on the light version; orange stays
  const max = Math.max(...col);
  const min = Math.min(...col);
  const sat = max === 0 ? 0 : (max - min) / max;
  // The orbit's flare sits above the letters (which start near y = 0.41 of the square);
  // keep it white so it does not turn into a dark spot on light surfaces.
  const aboveLetters = Math.floor(p / w) < h * 0.405;
  const neutral = aboveLetters ? 0 : Math.max(0, Math.min(1, 1 - sat / 0.35));
  const onLight = col.map((v, c) => v * (1 - neutral) + INK[c] * neutral);

  const alpha = Math.round(a * 255);
  dark.set([...col.map(Math.round), alpha], p * 4);
  light.set([...onLight.map(Math.round), alpha], p * 4);

  if (alpha > 60) {
    const x = p % w;
    const y = Math.floor(p / w);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const pad = 8;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(w, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(h, maxY + pad) - Math.max(0, minY - pad),
};

fs.mkdirSync(outDir, { recursive: true });
for (const [name, buf] of [
  ["arq-logo-on-dark.png", dark],
  ["arq-logo-on-light.png", light],
]) {
  const file = path.join(outDir, name);
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .extract(crop)
    .resize({ width: WIDTH })
    .png({ compressionLevel: 9, palette: false })
    .toFile(file);
  console.log("wrote", path.relative(root, file));
}
const ratio = crop.width / crop.height;
console.log(
  `crop ${crop.width}x${crop.height}, aspect ${ratio.toFixed(4)}, output ${WIDTH}x${Math.round(WIDTH / ratio)}`,
);
