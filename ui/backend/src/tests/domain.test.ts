import { describe, expect, it } from "vitest";
import products from "../../../../content/en/products.json";
import site from "../../../../content/en/site.json";
import sample from "../../../../data/sample-mockups.json";
import {
  ageingBuckets,
  astraAnswer,
  creditAtRisk,
  fleetSummary,
  resolveCta,
  totalOf,
  whatsappUrl,
} from "../domain/index.ts";
import type { ReconMatch, Status } from "../domain/index.ts";

describe("resolveCta", () => {
  const trial = site.trial.products;

  it("a non-live product never resolves to a trial CTA", () => {
    for (const status of ["earlyAccess", "inDevelopment", "planned"] as Status[]) {
      // Even if a non-live product were wrongly listed in the trial list.
      const cta = resolveCta({ id: "astra", status }, ["astra"]);
      expect(cta.kind).toBe("earlyList");
      expect(cta.showTrialNote).toBe(false);
    }
  });

  it("every product in the catalogue gets the CTA its status allows", () => {
    for (const product of products.products) {
      const cta = resolveCta({ id: product.id, status: product.status as Status }, trial);
      if (product.status !== "live") expect(cta.kind).toBe("earlyList");
      else if (trial.includes(product.id))
        expect(cta).toMatchObject({ kind: "trial", intent: "trial", showTrialNote: true });
    }
  });

  it("a live product without a trial gets learn more", () => {
    expect(resolveCta({ id: "x", status: "live" }, [])).toMatchObject({ kind: "learnMore", intent: "enquiry" });
  });
});

describe("mockup totals match the fixture", () => {
  const { receivables, overdueThresholdDays } = sample.astra;

  it("Astra answer is computed from the receivables", () => {
    const answer = astraAnswer(receivables, overdueThresholdDays);
    const expectedRows = receivables.filter((r) => r.daysOverdue > overdueThresholdDays);
    expect(answer.count).toBe(expectedRows.length);
    expect(answer.total).toBe(expectedRows.reduce((s, r) => s + r.amount, 0));
    expect(answer.oldestDays).toBe(Math.max(...expectedRows.map((r) => r.daysOverdue)));
    expect(answer.rows[0]?.daysOverdue).toBe(answer.oldestDays);
  });

  it("ageing buckets cover every receivable once", () => {
    const buckets = ageingBuckets(receivables);
    expect(buckets.reduce((s, b) => s + b.count, 0)).toBe(receivables.length);
    expect(totalOf(buckets.map((b) => b.total))).toBe(totalOf(receivables.map((r) => r.amount)));
  });

  it("credit at risk excludes matched rows", () => {
    const rows = sample.dravya.reconciliation.map((r) => ({ itc: r.itc, match: r.match as ReconMatch }));
    expect(creditAtRisk(rows)).toBe(rows.filter((r) => r.match !== "matched").reduce((s, r) => s + r.itc, 0));
  });

  it("fleet summary counts states and service due", () => {
    const machines = sample.yantra.machines.map((m) => ({ ...m, state: m.state as "running" | "down" }));
    const fleet = fleetSummary(machines);
    expect(fleet.running + fleet.down).toBe(fleet.total);
    expect(fleet.overdue).toBe(machines.filter((m) => m.nextServiceInDays < 0).length);
  });
});

describe("whatsappUrl", () => {
  it("builds a wa.me link with encoded text", () => {
    expect(whatsappUrl(site.contact.whatsappNumber, "Hello ARQ & team")).toBe(
      `https://wa.me/${site.contact.whatsappNumber}?text=Hello%20ARQ%20%26%20team`,
    );
  });
  it("strips non digits and omits an empty text", () => {
    expect(whatsappUrl("+91 97270 67044")).toBe("https://wa.me/919727067044");
  });
});
