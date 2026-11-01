import type { Locale, ProductId, Status } from "@arq/backend/domain";

export type { Locale, ProductId, Status };

export interface Feature {
  title: string;
  text: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface Step {
  title: string;
  text: string;
}
export interface Seo {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  domain: string;
  status: Status;
  tagline: string;
  oneLine: string;
  audience: string;
  problem: string;
  featuresLive: Feature[];
  featuresNext: Feature[];
  plannedNote?: string;
  whyNotYet?: string;
  notThis?: string;
  disclaimer?: string;
  steps: Step[];
  worksWith: string[];
  faq: Faq[];
  mockup: { kind: "sample" | "concept"; ref: "astra" | "yantra" | "digitalTwin" | "dineastra" | "dravya" } | null;
  seo: Seo;
}

export interface SiteFacts {
  brand: { name: string; short: string; domain: string; locationLine: string };
  contact: { phoneDisplay: string; phoneE164: string; whatsappNumber: string; email: string; linkedin: string };
  trial: { days: number; products: ProductId[] };
  pricing: { mode: "onEnquiry"; label: string };
  statusEnum: Status[];
  whatsappPrefill: Record<string, string>;
  referenceCustomer: { enabled: boolean; label: string; name: string };
  analytics: { events: string[] };
}

export interface TitledText {
  title: string;
  text: string;
}

export interface Section {
  heading: string;
  intro?: string;
  seo: Seo;
}
