# 001 Site architecture and pages

## Stack in one paragraph

Next.js App Router, TypeScript strict, plain CSS on the ARQ Astra token layer, content in JSON files at `content/`, a small framework-free backend package for enquiry handling, deployed on Vercel. Reasons are in `docs/decisions/ADR-0001-stack.md`.

## Repository layout

```text
arq-website/
├── README.md                     start here
├── AGENTS.md                     instructions for coding agents (CLAUDE.md points here)
├── .env.example
├── package.json                  npm workspaces: ui/frontend, ui/backend
├── content/                      all copy, per locale
│   ├── en/  site.json ui.json products.json pages.json legal.json showcase.json
│   └── hi/ mr/ gu/  ui.json
├── data/sample-mockups.json      fictional data for mockups
├── assets/brand/                 arq-logo.jpeg and brand notes
├── scripts/                      content gate, data and build checks, logo and OG image
├── docs/
│   ├── constitution.md  handoff.md  architecture.md  deploy.md
│   ├── specs/                    this folder
│   ├── decisions/                ADRs
│   ├── notes/                    claims register, open questions, product notes
│   ├── prompts/                  reviewer prompts
│   └── screenshots/
└── ui/
    ├── frontend/                 Next.js app
    │   ├── public/               og image, the logo cut-outs
    │   └── src/
    │       ├── app/              routes
    │       ├── components/       presentation only
    │       ├── lib/              content loader, i18n, links, seo, analytics
    │       └── styles/           theme.css (given), marketing.css, space.css
    └── backend/                  workspace package @arq/backend
        └── src/
            ├── domain/           enquiry rules, CTA resolution, status rules
            ├── services/         submit-enquiry
            ├── providers/        mailer (SMTP, log), rate limiter
            └── tests/
```

Boundary rules, from the ARQ constitution: route handlers parse and call one service; services orchestrate; domain has no framework or vendor imports; providers wrap SMTP. Components never compute a business fact. CTA resolution and sample totals come from `@arq/backend/domain`.

## Routes

All routes live under `/[locale]` where locale is `en`, `hi`, `mr` or `gu`.

| Route | Page | Source |
| --- | --- | --- |
| `/` | redirect to `/en` | `vercel.json` |
| `/{locale}` | Home | `ui.json`, `pages.json#home`, `products.json` |
| `/{locale}/products` | Products overview and comparison | `pages.json#productsPage` |
| `/{locale}/products/astra` | ARQ Astra | `products.json` |
| `/{locale}/products/yantra` | ARQ Yantra | `products.json` |
| `/{locale}/products/digital-twin` | ARQ Digital Twin | `products.json` |
| `/{locale}/products/dineastra` | ARQ DineAstra | `products.json` |
| `/{locale}/products/dravya` | ARQ Dravya | `products.json` |
| `/{locale}/custom-apps` | Custom apps | `pages.json#customApps` |
| `/{locale}/partners` | Selling partners | `pages.json#partners` |
| `/{locale}/about` | About | `pages.json#about` |
| `/{locale}/contact` | Contact and enquiry form | `ui.json#contact` |
| `/{locale}/privacy`, `/{locale}/terms` | Legal skeleton | `legal.json` |
| `/api/enquiry` | POST enquiry | `docs/specs/005` |
| `/sitemap.xml`, `/robots.txt` | SEO | code |
| not found | 404 page with links home and to WhatsApp | code |

Product routes are generated from `products.json` with `generateStaticParams`. Adding a product means adding a JSON entry and a card entry in each `ui.json`, nothing else.

Legacy redirects (301): `/index.html` to `/en`, `/portfolio-details.html` to `/en/products`.

## Global shell

Header (sticky ink band, `--arq-header` height):
- left: ARQ lockup (see design system), links home
- centre: Products, Custom apps, Partners, About, Contact
- right: language switcher (4 locales, native names), theme toggle, primary CTA "Start free trial" linking to contact with `intent=trial`
- below 900px: menu button opening a full-width sheet; focus trapped; Escape closes

Footer (ink band): lockup, tagline, nav columns (Products, Company, Contact), phone, email, LinkedIn, location line, language links, Privacy, Terms, copyright with current year computed at build.

Skip link first in tab order. Landmarks: header, nav, main, footer.

## Page specs

### Home

1. Hero on ink. Eyebrow, H1, sub, two CTAs (trial, WhatsApp), proof strip of four short facts. Right side: the Astra answer panel mockup (sample data) over the orbit motif. On mobile the panel sits below the CTAs.
2. Products. Heading and sub, then a responsive grid of five product cards plus a sixth card for Custom apps. Each card: domain label, name, status pill, tagline, one-liner, CTA by status, "See details" link. Live cards first, in catalogue order.
3. How it starts. Three numbered steps.
4. Honest by design. Four principles.
5. Reference strip, only if `referenceCustomer.enabled`. One line: label and name. No logo, no quote.
6. Custom apps band. Heading, text, CTA.
7. FAQ. Five questions using `details`/`summary`, no JS required.
8. Final CTA band on ink: WhatsApp button and trial button.

### Products overview

Heading and sub. Comparison table (Product, For, Status, Try it) with real table markup and a stacked layout under 700px. Then the same cards as home. Statuses use pill plus text.

### Product page (template, all five)

1. Breadcrumb: Products / name.
2. Header block: domain label, name, status pill, tagline, one-liner, CTA pair by status. Under a trial CTA show `products.trialNote`.
3. Problem: one paragraph, plain.
4. Mockup frame: sample or concept badge, built from `data/sample-mockups.json`. Absent when `mockup` is null.
5. If `featuresLive` is non-empty: "What works today" list. Otherwise "Planned scope" using `plannedNote` and `featuresNext`.
6. If live and `featuresNext` non-empty: "Coming next" list, visually quieter, with no dates.
7. Steps (when present).
8. Works with (when present).
9. `whyNotYet`, `notThis`, `disclaimer` as quiet notes (when present).
10. FAQ from the product.
11. Related products: two other cards.
12. CTA band.

Section headings come from `ui.json#productPage` (problem, whatWorks, comingNext, plannedScope, steps, worksWith, faq, related), so they translate with the rest of the core. The body text of each section is English in every locale in v1, with the English-only note shown.

### Custom apps, Partners, About

Straight renders of `pages.json` sections in the order of the JSON, ending with a CTA band. Partners CTA goes to contact with `intent=partner`. Custom apps CTA goes to contact with `intent=custom`.

### Contact

Two columns on desktop. Left: the form. Right: contact card with the WhatsApp button as the primary action, then phone (tel link), email (mailto link), LinkedIn, and the location line. Query parameters `product` and `intent` preselect the interest field and prefill the WhatsApp text from `site.json#whatsappPrefill`. Success and error states replace the form region and are announced with `role="status"` and `role="alert"`.

### Legal

Render `legal.json`. Show the `reviewStatus` line only in non-production builds.

## Components (presentation only)

`SiteHeader`, `SiteFooter`, `LanguageSwitcher`, `ThemeToggle`, `Lockup`, `OrbitMotif`, `Hero`, `ProofStrip`, `ProductCard`, `ProductGrid`, `StatusPill`, `CtaPair`, `StepList`, `PrincipleList`, `FaqList`, `ReferenceStrip`, `Band`, `MockupFrame`, `AstraAnswerPanel`, `YantraMachineList`, `YantraVoiceLog`, `TwinConcept`, `DravyaConcept`, `ContactCard`, `EnquiryForm`, `ComparisonTable`, `Breadcrumb`, `Icon`.

Each component takes already-resolved props. Content lookup, CTA resolution and totals happen in the page or in `lib/` and `@arq/backend/domain`.

## Data loading

`lib/content.ts` reads JSON from `content/` at build time with `fs` in server components. `getUi(locale)` deep-merges the locale over English so a missing key falls back to English. `getProducts()` reads English only; product card strings come from `ui.json` per locale. Long-form pages fall back to English and set a flag that renders the English-only note.

## Done means

Every route in the table builds, the sitemap lists all locale and page combinations, and, inside `content/` and `ui/`, `grep` finds the phone, email and LinkedIn strings only in `content/en/site.json` (the specs and notes may quote them).
