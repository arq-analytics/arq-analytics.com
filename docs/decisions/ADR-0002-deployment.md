# ADR-0002 Deployment

Status: accepted as intent, details to be verified at build time. Date: 2026-10-31. Amended 2026-11-01 by ADR-0004: the owner will host on their own server first, following `docs/deploy.md`. This record still applies if the site goes to Vercel.

## Decision

Deploy on Vercel as one project. Production domain `arqoneailabs.space`, with `www` redirecting to the apex. Preview deployments are `noindex`.

## What the builder must verify against current Vercel documentation, then record here

1. How to deploy a monorepo whose Next.js app is in `ui/frontend` and which imports the workspace package in `ui/backend` (root directory setting and the option that includes source files outside the root directory).
2. Where `vercel.json` must live for the redirects in `docs/specs/004`.
3. The request body size limit and the default function timeout for route handlers, recorded as ceilings. The enquiry body is under 8 KB so neither is a risk, but they decide later upload paths.
4. How environment variables are scoped between Production and Preview.

Write the verified answers under a "Verified" heading below this one, with the date and the documentation page. Do not state them from memory.

## Environment

Production variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ENQUIRY_TO`, `ENQUIRY_FROM`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ANALYTICS`. Preview may use `LogMailer` by leaving SMTP unset.

## DNS

Owner action. Point the domain to Vercel per its instructions. Keep the existing mail DNS records for `contact@arqoneailabs.space` untouched.

## Rollback

Vercel keeps previous deployments. Roll back by promoting the previous deployment. The old site is replaced entirely; keep a copy of the old static files out of the repository before cutover.

## Cutover checklist

1. Preview build passes `npm test` and `npm run build`.
2. Owner reviews preview on a phone in English, Hindi, Marathi and Gujarati.
3. SMTP credentials set in Production; a real test enquiry arrives in the inbox.
4. Legal pages reviewed or removed from the footer until reviewed.
5. Domain switched; `www` redirect and legacy redirects checked.
6. Submit sitemap in the search console owned by the business.

## Verified

Not yet verified, 2026-10-31. The build was done and tested locally only. These four items still need checking against current Vercel documentation before the first deployment, and the answers written here with the date and page:

1. Root directory and source-outside-root setting for the `ui/frontend` app that imports `ui/backend`.
2. Whether `vercel.json` is needed at all, since the redirects are in `ui/frontend/next.config.ts` (ADR-0003).
3. Body size limit and default function timeout for route handlers.
4. Environment variable scoping between Production and Preview.
