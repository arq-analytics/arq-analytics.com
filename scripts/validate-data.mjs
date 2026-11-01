// `npm run seed`: there is no database, so this validates the sample data and the content files
// the mockups read. It fails if a row the mockups compute from is missing or malformed.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const problems = [];
const check = (condition, message) => {
  if (!condition) problems.push(message);
};

const sample = read("data/sample-mockups.json");
const products = read("content/en/products.json").products;

const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

check(typeof sample.company === "string", "company must be a string");
check(
  Array.isArray(sample.astra?.receivables) && sample.astra.receivables.length >= 3,
  "astra.receivables needs at least 3 rows",
);
for (const r of sample.astra?.receivables ?? []) {
  check(
    isNumber(r.amount) && isNumber(r.daysOverdue),
    `receivable ${r.invoice}: amount and daysOverdue must be numbers`,
  );
  check(/\(sample\)/.test(r.party), `receivable ${r.invoice}: party must be marked (sample)`);
}
check(isNumber(sample.astra?.overdueThresholdDays), "astra.overdueThresholdDays must be a number");
check(
  sample.astra.receivables.filter((r) => r.daysOverdue > sample.astra.overdueThresholdDays).length >= 3,
  "at least 3 receivables must exceed the threshold, the answer panel shows three rows",
);
for (const m of sample.yantra?.machines ?? []) {
  check(["running", "down"].includes(m.state), `machine ${m.id}: state must be running or down`);
  check(Number.isInteger(m.nextServiceInDays), `machine ${m.id}: nextServiceInDays must be an integer`);
}
check(
  (sample.yantra?.voiceLog ?? [])
    .map((v) => v.lang)
    .sort()
    .join() === "gu,hi,mr",
  "voiceLog needs exactly hi, mr and gu",
);
for (const row of sample.dravya?.reconciliation ?? []) {
  check(
    ["matched", "supplierNotFiled", "mismatch", "missingIn2B"].includes(row.match),
    `reconciliation ${row.invoice}: unknown match`,
  );
}
const dine = sample.dineastra;
check(/\(sample\)/.test(dine?.outlet ?? ""), "dineastra.outlet must be marked (sample)");
check([dine?.day?.sales, dine?.day?.purchases, dine?.day?.wastage].every(isNumber), "dineastra.day: numbers required");
for (const v of dine?.vendorDues ?? []) {
  check(/\(sample\)/.test(v.vendor), `vendor due ${v.vendor}: must be marked (sample)`);
  check(isNumber(v.amount) && Number.isInteger(v.dueInDays), `vendor due ${v.vendor}: amount and dueInDays required`);
}
for (const m of sample.showcase?.astra?.months ?? []) {
  check([m.sales, m.purchases, m.expenses].every(isNumber), `month ${m.month}: numbers required`);
}
check(sample.showcase?.astra?.months?.length >= 3, "showcase.astra.months needs at least 3 months");
check(
  sample.astra.receivables.some((r) => r.party === sample.showcase.astra.customerSearch.query),
  "showcase customerSearch.query must match a receivable party",
);
check(
  sample.astra.msmeAlerts.some((a) => a.supplier === sample.showcase.astra.supplierSearch.query),
  "showcase supplierSearch.query must match an MSME alert supplier",
);
for (const p of products) {
  if (p.mockup)
    check(sample[p.mockup.ref] !== undefined, `product ${p.id}: mockup ref ${p.mockup.ref} has no sample data`);
}

if (problems.length > 0) {
  console.error(`FAIL: ${problems.length} problem(s) in sample data`);
  for (const p of problems) console.error(" -", p);
  process.exit(1);
}
console.log("PASS: sample data and mockup references valid");
