/**
 * Content loader. JSON is imported statically so it is bundled at build time and
 * needs no file access at runtime. Product and page copy is English only in v1.
 */
import siteJson from "../../../../content/en/site.json";
import productsJson from "../../../../content/en/products.json";
import pagesJson from "../../../../content/en/pages.json";
import legalJson from "../../../../content/en/legal.json";
import showcaseJson from "../../../../content/en/showcase.json";
import sampleJson from "../../../../data/sample-mockups.json";
import type { Product, ProductId, SiteFacts } from "./types";

export { getUi, type Ui } from "./i18n";

export const site = siteJson as unknown as SiteFacts;
export const pages = pagesJson;
export const legal = legalJson;
export const showcase = showcaseJson;
export const sample = sampleJson;

const catalogue = productsJson.products as unknown as Product[];

export function getProducts(): Product[] {
  return catalogue;
}

export function getProduct(slug: string): Product | undefined {
  return catalogue.find((p) => p.slug === slug);
}

export function getProductById(id: ProductId): Product {
  const found = catalogue.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown product id: ${id}`);
  return found;
}
