# Agent instructions: ARQ ONE AI Labs website

Authoritative instructions for any coding agent working in this repository. Other agent files point here.

## Read first, in this order

1. `docs/constitution.md`
2. `docs/specs/000-product-brief.md`
3. `docs/specs/001-site-architecture-and-pages.md`, `docs/specs/002-design-system.md`, `docs/specs/003-content-contract.md`
4. `docs/specs/004-seo-i18n-analytics.md`, `docs/specs/005-enquiry-backend.md`
5. `docs/specs/006-build-slices.md` (the build order and the acceptance checks)
6. `docs/decisions/` before changing anything structural
7. `docs/notes/claims-register.md` before writing or changing any public sentence
8. `docs/handoff.md` for current state

## Non-negotiables

- One fact, one authority. Brand facts come from `content/en/site.json`. Product facts come from `content/en/products.json`. Never type a phone number, email, URL, price or status into a component.
- Copy lives in `content/`. Components render strings they are given. A user-visible sentence in a `.tsx` file is a bug, except decorative punctuation and `aria` helper text that is also in `ui.json`.
- Colours come from `ui/frontend/src/styles/theme.css` variables. A hex value in a component or page CSS module is a bug.
- Nothing is shown as live that is not live. Status drives CTAs through `ui/backend/src/domain/cta.ts`.
- No invented proof: no testimonials, customer counts, percentages, savings, uptime, certifications or logos. No pricing numbers.
- No pharma, GxP, clinical or life-sciences content. No personal names or personal contacts. No AI vendor or model names.
- No em dashes in any file you write.
- Mockups use `data/sample-mockups.json`, carry their badge, and compute totals in code.
- Server components by default. Client components only for state or browser APIs.
- Secrets never enter source control, logs, client bundles or responses.
- Accessibility is structural: visible focus, labels, landmarks, reduced motion, contrast, no meaning by colour alone, 44px targets.
- Completion is demonstrated. Never report a check that was not run.

## Boundaries

```text
route handlers and pages  ->  services  ->  domain  ->  providers
```

Route handlers parse, call one service, serialise. Domain code imports no framework and no vendor SDK. Components do not compute business facts.

## Working rules

- Make the smallest coherent change. Inspect the working tree first and preserve unrelated changes.
- Build in the slice order of `docs/specs/006`. Do not start a slice while the previous one fails its checks.
- Verify library APIs and versions against current official documentation at build time. Record versions in `docs/handoff.md`. Do not write framework API calls from memory.
- If a string you need is missing, add it to `content/en/` (and the four `ui.json` files if it belongs to the core), run `python3 scripts/lint_content.py .`, and note it in `docs/handoff.md`. Do not invent facts to fill a gap: put a clearly marked placeholder and list it under owner actions.
- Do not add dependencies, tools or folders that the specs do not call for. Record any addition and its reason in `docs/decisions/`.
- Update `docs/handoff.md` after each slice. Do not write a second description of the codebase.

## Commands

```bash
npm run setup
npm run dev
npm test
npm run seed
npm run build
python3 -I scripts/lint_content.py .
```

## Report format

Delivered, then Verified, then Not built, then Next. Lead with the outcome. State deviations once, plainly.

## Handling gaps in the brief

`docs/notes/open-questions.md` lists decisions the owner has not made. Where the specs choose a default, follow the spec. Where a gap has no default, do not guess: leave a placeholder, list it in `docs/handoff.md`, and continue with the rest.
