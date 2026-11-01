// Runs a Python script with the first interpreter that works: python3, python, then py -3.
// Windows often has only `python` or `py`, Linux and macOS usually have `python3`.
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const candidates = [
  ["python3", ["-I"]],
  ["python", ["-I"]],
  ["py", ["-3", "-I"]],
];

for (const [command, flags] of candidates) {
  const probe = spawnSync(command, [...flags, "-c", "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)"], {
    stdio: "ignore",
  });
  if (probe.status === 0) {
    const run = spawnSync(command, [...flags, ...args], { stdio: "inherit" });
    process.exit(run.status ?? 1);
  }
}

console.error("No working Python 3.9+ found (tried python3, python, py). Install Python to run the content gate.");
process.exit(1);
