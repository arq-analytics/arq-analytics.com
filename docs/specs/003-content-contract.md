# 003 Content contract

Copy is data. Components render it. Editing a sentence means editing a JSON file, never a component.

## Files and owners

| File | Holds | Locales |
| --- | --- | --- |
| `content/en/site.json` | brand, contact, trial, pricing mode, status enum, WhatsApp prefill text, reference customer, analytics events | en only |
| `content/en/products.json` | product catalogue and parked entries | en only |
| `content/en/pages.json` | home principles and FAQ, products page, custom apps, partners, about, contact SEO | en only in v1 |
| `content/en/legal.json` | privacy and terms skeleton | en only |
| `content/{en,hi,mr,gu}/ui.json` | the translated core: nav, hero, proof, product cards, how it starts, custom apps band, contact form, footer, common strings | all four |

Keys starting with `_` are comments and are ignored by loaders and by `lint_content.py`.

## Fallback rule

`getUi(locale)` merges the locale file over English. A missing key renders the English string. Long-form pages (`pages.json`, `products.json` detail sections, `legal.json`) render English in every locale and show `common.englishOnlyNote` near the top in non-English locales.

## TypeScript types (put in `ui/frontend/src/lib/types.ts`)

```ts
export type Locale = "en" | "hi" | "mr" | "gu";
export type Status = "live" | "earlyAccess" | "inDevelopment" | "planned";
export type ProductId = "astra" | "yantra" | "digitalTwin" | "dineastra" | "dravya";

export interface Feature { title: string; text: string }
export interface Faq { q: string; a: string }
export interface Step { title: string; text: string }
export interface Seo { title: string; description: string; keywords: string[] }

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
  mockup: { kind: "sample" | "concept"; ref: "astra" | "yantra" | "digitalTwin" | "dravya" } | null;
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
}
```

## CTA resolution (domain, one authority)

Implemented once in `@arq/backend/src/domain/cta.ts` and used by every page and card.

| Product status | In `trial.products` | Primary CTA | Target | Secondary |
| --- | --- | --- | --- | --- |
| live | yes | `products.cta.trial` | `/{locale}/contact?product={id}&intent=trial` | WhatsApp with `whatsappPrefill[id]` |
| live | no | `products.cta.learnMore` | contact with `intent=enquiry` | WhatsApp |
| earlyAccess, inDevelopment, planned | not allowed | `products.cta.earlyList` | `/{locale}/contact?product={id}&intent=earlyList` | WhatsApp with `whatsappPrefill[id]` |

Under any trial CTA render `products.trialNote`. Under any early-list CTA render nothing extra.

A unit test must fail if a non-live product resolves to a trial CTA.

## Writing rules

1. Short sentences. Lead with what the reader gets, then how.
2. Present tense only for things that work today. Planned scope uses "will", "planned", "in development".
3. Say "Tally" and "TallyPrime" as written. Say "MSME", "GST", "GSTR-2B", "GIDC", "MIDC" as written. No unexplained acronyms beyond these.
4. No em dashes anywhere. Use full stops, commas or colons.
5. No banned phrases (see `scripts/lint_content.py`): bank-grade, guaranteed, seamless, cutting-edge, world-class, revolutionary, trusted by, certifications we do not hold, data residency promises.
6. No AI vendor or model names. Say "AI" where needed, and say what it does ("reads", "explains", "drafts"), not that it is "powered by" anything.
7. Never write a number about customers, savings, accuracy, time saved or uptime.
8. Money in samples is formatted in Indian digit grouping with the rupee sign, through `lib/format.ts`.
9. Hindi, Marathi, Gujarati: keep product names and terms such as Tally, GST, MSME, WhatsApp, GSTR-2B in Latin script. Address the reader respectfully (aap, tumhi, tame). Short sentences. These are drafts until a native speaker reviews them.

## Adding a product

1. Add an entry to `products.json` with a valid status.
2. Add `products.cards.{id}` to all four `ui.json` files and `contact.interests.{id}`.
3. Add `whatsappPrefill.{id}` in `site.json`.
4. Run `python3 scripts/lint_content.py`. It fails if cards and products disagree.

## Changing a product's status

Edit `status` in `products.json`. When a product goes live: move items from `featuresNext` to `featuresLive` only for things that work for new customers today, add the id to `site.json#trial.products` if it has a trial, and update the card one-liner in all four `ui.json` files so it no longer says "in development".
