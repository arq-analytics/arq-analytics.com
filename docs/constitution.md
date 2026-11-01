# ARQ ONE AI Labs website constitution

Governing rules for this repository. Every rule is adopted and has one line of proof that can be checked. Created 2026-10-31. Baseline: ARQ engineering constitution, with one site-specific rule (XIII).

## I. The repository is the durable artifact

Copy, decisions, setup and continuation state live here, not in chat.

Proof: `content/` holds all copy, `docs/specs/` holds intent and decisions, `docs/handoff.md` holds verified state. `npm run setup` works from a clean clone.

## II. One fact has one authority

Phone, email, LinkedIn, domain, trial length, product names, statuses and the pricing mode have one canonical source and no second copy. UI displays facts, it does not recreate them.

Proof: `content/en/site.json` and `content/en/products.json` own them; `scripts/lint_content.py` fails on a changed or wrong value; CTA resolution lives only in `ui/backend/src/domain/cta.ts` with a unit test; sample totals are computed in `domain`, tested against `data/sample-mockups.json`.

## IV. Unsupported knowledge is explicit

Anything not live is labelled as not live. Sample and concept visuals say so on the visual.

Proof: every product has a `status`; `StatusPill` renders text for every status; `MockupFrame` requires a `kind` and renders its badge; a test asserts non-live products never resolve to a trial CTA.

## VI. Validation before commitment

An enquiry is validated on the server before anything is sent.

Proof: `ui/backend/src/domain/enquiry.ts` is the only validator; the validation table tests in `docs/specs/005` pass.

## X. Security and privacy are structural

No secrets in the repository, the browser, logs or responses. No personal data in logs or analytics. No cookies set.

Proof: `.env.example` lists names only; `config.ts` is the only reader of server secrets; a test asserts the logged line contains no personal fields; analytics events carry only `product`, `locale`, `page`.

## XI. Design serves comprehension

Answer first, readable in four languages, usable by keyboard, no meaning by colour alone.

Proof: the accessibility checks in `docs/specs/006` slice 6; focus ring from the theme token layer; Indic typography rules in `docs/specs/002`; reduced-motion media query present.

## XII. Completion is demonstrated

A slice is complete only when its acceptance criteria pass and known limits are written down. A check that was not run is reported as not run.

Proof: each slice in `docs/specs/006` lists its checks; `docs/handoff.md` records the commands run and their results.

## XIII. Claims are an allow-list

Public copy says only what `docs/notes/claims-register.md` allows. No invented customers, numbers, testimonials, logos, certifications, data-location promises or security guarantees. No pharma or regulated life-sciences content. No personal names. No AI vendor names.

Proof: `scripts/lint_content.py` rejects banned phrases, conflict-of-interest terms, confidential names, old wrong contact details and vendor names in `content/` and `ui/`; the claims register is reviewed by the owner before launch.

## Conflicts

Where a rule conflicts with a product requirement, record the conflict and its resolution in `docs/decisions/`.
