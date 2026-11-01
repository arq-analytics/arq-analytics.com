/** Totals for product mockups. Computed from the sample data, never typed in. */

export interface Receivable {
  party: string;
  invoice: string;
  amount: number;
  daysOverdue: number;
}

export interface AstraAnswer {
  rows: Receivable[];
  count: number;
  total: number;
  oldestDays: number;
}

export const totalOf = (amounts: number[]) => amounts.reduce((a, b) => a + b, 0);

/** Parties overdue by more than the threshold, oldest first. */
export function astraAnswer(receivables: Receivable[], thresholdDays: number): AstraAnswer {
  const rows = receivables.filter((r) => r.daysOverdue > thresholdDays).sort((a, b) => b.daysOverdue - a.daysOverdue);
  return {
    rows,
    count: rows.length,
    total: totalOf(rows.map((r) => r.amount)),
    oldestDays: rows.reduce((max, r) => Math.max(max, r.daysOverdue), 0),
  };
}

export interface AgeingBucket {
  key: "upTo30" | "d31to45" | "d46to60" | "over60";
  total: number;
  count: number;
}

/** Ageing buckets by days overdue: up to 30, 31 to 45, 46 to 60, over 60. */
export function ageingBuckets(receivables: Receivable[]): AgeingBucket[] {
  const defs: { key: AgeingBucket["key"]; test: (d: number) => boolean }[] = [
    { key: "upTo30", test: (d) => d <= 30 },
    { key: "d31to45", test: (d) => d > 30 && d <= 45 },
    { key: "d46to60", test: (d) => d > 45 && d <= 60 },
    { key: "over60", test: (d) => d > 60 },
  ];
  return defs.map(({ key, test }) => {
    const rows = receivables.filter((r) => test(r.daysOverdue));
    return { key, count: rows.length, total: totalOf(rows.map((r) => r.amount)) };
  });
}

export type ReconMatch = "matched" | "supplierNotFiled" | "mismatch" | "missingIn2B";

/** Credit that is not cleanly matched. */
export function creditAtRisk(rows: { itc: number; match: ReconMatch }[]): number {
  return totalOf(rows.filter((r) => r.match !== "matched").map((r) => r.itc));
}

export type MachineState = "running" | "down";

export interface Machine {
  id: string;
  name: string;
  state: MachineState;
  lastIssue: string | null;
  nextServiceInDays: number;
}

export interface FleetSummary {
  total: number;
  running: number;
  down: number;
  overdue: number;
  dueSoon: number;
}

/** Service is overdue when negative and due soon when within 7 days. */
export function fleetSummary(machines: Machine[]): FleetSummary {
  return {
    total: machines.length,
    running: machines.filter((m) => m.state === "running").length,
    down: machines.filter((m) => m.state === "down").length,
    overdue: machines.filter((m) => m.nextServiceInDays < 0).length,
    dueSoon: machines.filter((m) => m.nextServiceInDays >= 0 && m.nextServiceInDays <= 7).length,
  };
}

export interface MonthRow {
  month: string;
  sales: number;
  purchases: number;
  expenses: number;
}

export function monthTotals(rows: MonthRow[]) {
  return {
    sales: totalOf(rows.map((r) => r.sales)),
    purchases: totalOf(rows.map((r) => r.purchases)),
    expenses: totalOf(rows.map((r) => r.expenses)),
  };
}
