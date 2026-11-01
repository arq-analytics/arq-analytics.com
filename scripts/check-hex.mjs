// Fails if a hex colour appears in a component or route file. Colours come from CSS variables.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "ui/frontend/src");
const dirs = ["components", "app"].map((d) => path.join(root, d));
const hex = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|css)$/.test(entry.name)) {
      fs.readFileSync(full, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (hex.test(line)) hits.push(`${path.relative(root, full)}:${i + 1}: ${line.trim()}`);
          hex.lastIndex = 0;
        });
    }
  }
}

dirs.forEach((d) => fs.existsSync(d) && walk(d));

if (hits.length > 0) {
  console.error(`FAIL: ${hits.length} hex colour(s) in components or app. Use a CSS variable.`);
  hits.forEach((h) => console.error(" -", h));
  process.exit(1);
}
console.log("PASS: no hex colours in components or app");
