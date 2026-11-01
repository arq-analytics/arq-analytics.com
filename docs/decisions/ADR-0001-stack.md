# ADR-0001 Stack

Status: accepted. Date: 2026-10-31.

## Decision

Next.js (App Router) with TypeScript strict, plain CSS on the ARQ Astra token layer, JSON content files, a small TypeScript workspace package `@arq/backend` for enquiry rules, vitest for tests, deployed on Vercel.

## Why

- The site is a public marketing surface where SEO, static rendering and per-locale routes matter. The ARQ stack defaults name Next.js for exactly this case. The product default of React with Vite and FastAPI is kept for the products themselves.
- Static generation for every page keeps the site fast on mid-range phones and on slow factory-estate connections. Only `/api/enquiry` runs as a function.
- A single deployable avoids a second Python deployment for one form handler.
- Plain CSS with tokens keeps the code readable for a human who edits it directly. No CSS-in-JS, no Tailwind, no component library.
- Content in JSON at the repository root lets the owner change copy without touching components, and lets a script enforce claims.

## Consequences

- The ARQ convention `ui/frontend` and `ui/backend` is preserved. For this stack the backend is not an HTTP service; `ui/backend` is an npm workspace package of plain TypeScript modules (`domain`, `services`, `providers`) imported by the route handler. This follows the ARQ project-structure note for the Next.js variant: the boundaries survive the framework change.
- Domain code (CTA resolution, enquiry validation, sample totals) is shared by pages and the route handler from one place.
- Library choices not fixed here: pick the current stable versions at build time, verify against the official documentation, and record names and versions in `docs/handoff.md`. Do not rely on memory for APIs that change between major versions (the Next.js App Router metadata and font APIs, `next/font`, route handler signatures).

## Rejected

- Vite single-page app: weak first-load SEO and no route-level metadata without extra tooling.
- Tailwind or a component library: not needed for about twenty components, adds a dependency surface and hides the token layer.
- i18n library: four locales and a flat JSON core do not justify one in v1. Revisit if long-form pages get translated.
- Headless CMS: the owner edits JSON in the repository. Revisit only if non-technical editors appear.
- FastAPI for the form: adds a second runtime and deployment for one endpoint.

## Review trigger

Revisit when the site needs authenticated areas, a blog with many authors, or server-persisted enquiries.
