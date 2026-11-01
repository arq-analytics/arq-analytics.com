# Architecture

Durable notes about how the site is put together. The detailed specs are in `docs/specs/`.

```text
 content/*.json  data/sample-mockups.json
        |                 |
        v                 v
  ui/frontend (Next.js, static pages per locale)
        |  imports domain rules
        v
  ui/backend  (@arq/backend)
     domain/     CTA resolution, enquiry validation, sample totals
     services/   submit-enquiry
     providers/  SMTP mailer, log mailer, rate limiter
        ^
        |  called by
  ui/frontend/src/app/api/enquiry/route.ts  (only runtime endpoint)
```

## Data flow for the primary journey

1. Visitor opens `/{locale}/products/astra`. The page is static HTML built from `products.json` and `ui.json`.
2. The CTA target is produced by the CTA resolver from the product status and `site.json`.
3. On the contact page the form posts JSON to `/api/enquiry`.
4. The route handler calls `submitEnquiry`. It checks the honeypot and fill time, rate limits, validates, formats the email and sends it through the mailer.
5. On success the visitor sees a confirmation. On any failure the visitor sees a WhatsApp button prefilled with their enquiry.

## What is not here

No database, no authentication, no CMS, no queue, no cache layer. Each can be added when a real constraint appears, with an ADR.

## Where each fact lives

| Fact | Single source |
| --- | --- |
| Phone, email, LinkedIn, domain, location line | `content/en/site.json` |
| Product names, statuses, copy | `content/en/products.json` |
| Trial length and which products have a trial | `content/en/site.json` |
| Translated interface strings | `content/{en,hi,mr,gu}/ui.json` |
| Colours, spacing, radii | `ui/frontend/src/styles/theme.css` and `marketing.css` |
| CTA by status | `ui/backend/src/domain/cta.ts` |
| Enquiry rules | `ui/backend/src/domain/enquiry.ts` |
| Sample figures in mockups | `data/sample-mockups.json`, totals computed in `domain` |
