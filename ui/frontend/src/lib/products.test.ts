import { describe, expect, it } from "vitest";
import { getProducts, sample, showcase } from "./content";
import { productShapes } from "./shapes";

describe("product chapters", () => {
  const products = getProducts();

  it("gives every product its own orb shape", () => {
    const shapes = products.map((p) => productShapes[p.id]);
    expect(shapes.every(Boolean)).toBe(true);
    expect(new Set(shapes).size).toBe(products.length);
  });

  it("gives every product a demo window", () => {
    for (const p of products) expect(p.mockup, p.id).toBeDefined();
  });

  it("shows sample tabs only for live products, and a labelled concept for the rest", () => {
    for (const p of products) {
      expect(p.mockup?.kind, p.id).toBe(p.status === "live" ? "sample" : "concept");
    }
  });
});

describe("DineAstra concept", () => {
  const dine = sample.dineastra;

  it("marks the outlet and every vendor as sample data", () => {
    expect(dine.outlet).toMatch(/\(sample\)/);
    for (const v of dine.vendorDues) expect(v.vendor).toMatch(/\(sample\)/);
  });

  it("has a label for each due state the window can show", () => {
    expect(showcase.dineastra.dueIn).toContain("{n}");
    expect(showcase.dineastra.overdue).toContain("{n}");
    expect(showcase.dineastra.dueToday).toBeTruthy();
  });
});
