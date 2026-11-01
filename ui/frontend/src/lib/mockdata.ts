/** Typed views of data/sample-mockups.json. Totals are computed in @arq/backend/domain. */
import type { Machine, MonthRow, Receivable, ReconMatch } from "@arq/backend/domain";
import { sample } from "./content";

export const company = sample.company;
export const threshold = sample.astra.overdueThresholdDays;
export const question = sample.astra.question;
export const reminderDraft = sample.astra.reminderDraft;
export const receivables: Receivable[] = sample.astra.receivables;
export const msmeAlerts = sample.astra.msmeAlerts;
export const deadStock = sample.astra.deadStock;
export const months: MonthRow[] = sample.showcase.astra.months;
export const customerQuery = sample.showcase.astra.customerSearch.query;
export const supplierQuery = sample.showcase.astra.supplierSearch.query;

export const machines = sample.yantra.machines as Machine[];
export const voiceLog = sample.yantra.voiceLog as {
  lang: "hi" | "mr" | "gu";
  transcript: string;
  parsed: { machine: string; issue: string; stoppedAt: string };
}[];
export const downtimeHours = sample.showcase.yantra.downtimeHours;

export const twinSections = sample.digitalTwin.sections as {
  name: string;
  machines: { name: string; state: "running" | "down" }[];
}[];
export const reconciliation = sample.dravya.reconciliation as {
  supplier: string;
  invoice: string;
  itc: number;
  match: ReconMatch;
}[];

export const dine = sample.dineastra as {
  outlet: string;
  day: { sales: number; purchases: number; wastage: number };
  wastage: { item: string; qty: string; value: number }[];
  vendorDues: { vendor: string; amount: number; dueInDays: number }[];
};
