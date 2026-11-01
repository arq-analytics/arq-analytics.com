# 006 Build slices and acceptance

Build in this order. Do not start a slice while the previous slice's acceptance checks fail. After each slice run the checks, update `docs/handoff.md`, and commit with the slice name.

Commands the repository must have (documented in `README.md`):

```bash
npm run setup    # install dependencies and run the content gate once
npm run dev      # run the site locally on http://localhost:3000
npm test         # backend tests, frontend unit tests, content gate, typecheck, lint
npm run seed     # validate data/sample-mockups.json and content (no database exists)
npm run build    # production build; must pass before handoff
```

## Slice 0: scaffold and gates

Build: root `package.json` with npm workspaces (`ui/frontend`, `ui/backend`), TypeScript strict in both, ESLint and Prettier, vitest, `.gitignore`, `.env.example`, the given `theme.css` imported once from the app root, `scripts/lint_content.py` wired into `npm test` as `python3 -I scripts/lint_content.py .`.

Accept:
- `npm run setup` and `npm test` pass on a clean clone with no placeholder tests that assert nothing.
- The folder layout matches `docs/specs/001`.
- No hex colour appears under `ui/frontend/src/components` or `app` (grep check in `npm test`).

## Slice 1: shell, routing, i18n, content loader

Build: `[locale]` routing for `en`, `hi`, `mr`, `gu`, root redirect, `lib/content.ts`, `lib/i18n.ts`, `lib/links.ts` (WhatsApp, tel, mailto builders), `lib/format.ts`, header, footer, language switcher, theme toggle with no flash, skip link, fonts, 404 page, a minimal Home that renders the hero from `ui.json`.

Accept:
- `/` redirects to `/en`. Each locale's home renders its own hero text and correct `<html lang>`.
- The language switcher keeps the current page and works without JavaScript as plain links.
- Phone, email and LinkedIn appear in the footer from `site.json` only.
- Keyboard: skip link, menu, language and theme controls all reachable with visible focus.
- Unit tests for `getUi` fallback, `localePath`, the WhatsApp link builder.

## Slice 2: Home complete and mockups

Build: all home sections from `docs/specs/001`, `ProductCard`, `StatusPill`, `CtaPair` using the domain CTA resolver, `MockupFrame`, `AstraAnswerPanel` with totals computed from `data/sample-mockups.json`, orbit motif, proof strip, FAQ with `details`.

Accept:
- Five product cards plus the custom apps card; live cards show the trial CTA, others the early-list CTA.
- The Astra panel shows a visible "Sample data" badge and its totals equal the sum computed by a unit test against the fixture.
- No horizontal scroll at 320px width.
- Reduced-motion media query disables the orbit dot animation.

## Slice 3: product pages and overview

Build: `/products`, five product pages from `products.json`, `ComparisonTable`, `YantraMachineList`, `YantraVoiceLog`, `TwinConcept`, `DravyaConcept`, related products, product JSON-LD for live products only.

Accept:
- Each product page matches the template in `docs/specs/001`; non-live pages show "Planned scope", never "What works today".
- A test renders every product and asserts that no non-live page contains a trial CTA.
- The Yantra voice log shows Hindi, Marathi and Gujarati transcripts with correct fonts.
- The comparison table is a real table and stacks cleanly under 700px.

## Slice 4: Custom apps, Partners, About, Legal

Build: those four pages from `pages.json` and `legal.json`, CTA bands, the English-only note for non-English locales.

Accept:
- Partner and custom CTAs open the contact page with the right `intent` and `product` preselected.
- The legal pages show the review-status line only outside production.

## Slice 5: Contact and enquiry

Build: `/contact`, `ContactCard`, `EnquiryForm`, `/api/enquiry`, the backend package per `docs/specs/005`.

Accept:
- All tests in `docs/specs/005` pass.
- With SMTP unset in development the form succeeds through `LogMailer` and the console shows no personal data.
- With the API forced to fail, the error state appears with a working prefilled WhatsApp button.
- Query parameters `?product=astra&intent=trial` preselect the interest and prefill the WhatsApp text.
- Screen reader: errors announced, success announced, labels associated.

## Slice 6: SEO, accessibility, performance, locale review

Build: metadata, canonical, hreflang, Open Graph image through `scripts/make-og.mjs`, JSON-LD, sitemap, robots, redirects in `vercel.json`, preview `noindex`, analytics switch, final copy pass.

Accept:
- Every page emits the metadata in `docs/specs/004`. A test or script asserts one `h1`, a canonical and hreflang set per built page.
- Built HTML contains the official phone, email and LinkedIn only.
- Lighthouse numbers recorded if a browser is available; if not, state "not run" in `docs/handoff.md`.
- axe or equivalent automated accessibility check on Home, one product page and Contact if tooling is available; otherwise state "not run".
- `npm run build` and `npm test` pass.
- `docs/handoff.md` lists: verified, not built, owner actions (native review of three locales, transparent logo, SMTP credentials, DNS and domain, legal review, confirmations from `docs/notes/open-questions.md`).

## Out of scope for every slice

Anything in the non-goals of `docs/specs/000`. If a slice seems to need one of them, stop and record it in `docs/handoff.md` rather than building it.
