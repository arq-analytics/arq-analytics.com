# 000 Product brief: ARQ ONE AI Labs website v1

## Outcome

A visitor who owns or runs a factory or MSME in India understands within ten seconds what ARQ does, sees which products are live and which are not, and reaches a person at ARQ in one tap.

The site replaces https://arqoneailabs.space/. The current site sells generic "evidence-first AI for regulated workflows" with RAG, agent and vendor-logo language, and carries a wrong phone number and a wrong email address. It does not describe the real products. See `docs/notes/old-site-audit.md`.

## Who it is for

| Audience | What they want | Language |
| --- | --- | --- |
| Factory or business owner (malik), GIDC and MIDC estates | Know what is stuck, who owes, what is about to break, in my language | Gujarati, Marathi, Hindi, English |
| Accounts or finance person | Which report, from which Tally data, and does it change my books | Hindi and English |
| Tally partner, reseller, CA, consultant | Is this worth introducing, how do I get paid | English and Hindi |
| Restaurant or hotel owner | Is there something for me yet | English and Hindi |

The site is a trust page and a routing page. It is not a documentation site and not a self-serve checkout.

## Primary journey

A visitor lands on the home page, reads the hero, picks a product card, reads the product page, and taps either "Start 14-day free trial" or "Join the early list". They end on the contact page with the product pre-selected, and either the WhatsApp chat opens with a prefilled message or the enquiry is accepted and a confirmation is shown.

Observable end: `POST /api/enquiry` returns 202 and the success message is visible, or the WhatsApp link opens with the prefilled text.

## Products on the site

| Product | Domain | Status | Try it |
| --- | --- | --- | --- |
| ARQ Astra | Money (Tally) | live | 14-day free trial |
| ARQ Yantra | Machines | live | 14-day free trial |
| ARQ Digital Twin | Plant | in development | early list |
| ARQ DineAstra | Restaurants and hotels | planned | early list |
| ARQ Dravya | Tax (GST reconciliation) | in development | early list |
| Custom apps | Services | available | discuss |

Status is data, not copy. Every CTA, badge and claim derives from `status` in `content/en/products.json`.

## Invariants

1. One fact, one authority. Phone, email, LinkedIn, domain, trial length, product names, statuses and prices live only in `content/en/site.json` and `content/en/products.json`.
2. Nothing is presented as live that is not live. A product that is not `live` never gets a trial CTA, a "works today" list, or present-tense capability verbs in its one-liner.
3. No invented proof. No testimonials, customer counts, percentages, savings figures, logos or certifications. The single named reference is in `site.json` and can be switched off.
4. No pricing numbers. Pricing is on enquiry.
5. No pharma, GxP, clinical or regulated-life-sciences content. ARQ scope is industrial and MSME.
6. No personal names or personal contact details. Only the official ARQ contacts.
7. No AI vendor or model names anywhere on the public site.
8. Mockups use fictional data from `data/sample-mockups.json`, always carry a visible "Sample data" or "Concept, not live" badge, and compute every total in code.
9. The site works with JavaScript slow or failing: content is server-rendered, links are real links, and the WhatsApp CTA works without the form.
10. Secrets never reach the browser, the logs or the repo.

## Assumptions (recorded, revisit in `docs/notes/open-questions.md`)

- A1. Dravya means the tax module, per the brief. The material-traceability module is parked in `products.json` under `parked`.
- A2. Digital Twin and DineAstra copy is proposed, not confirmed. It is deliberately modest and labelled as planned scope.
- A3. Trial is 14 days for Astra and Yantra, set up with the customer, not self-serve.
- A4. The trial CTA leads to an enquiry and WhatsApp, not to a signup, because there is no self-serve onboarding yet.
- A5. Hindi, Marathi and Gujarati strings are drafts and need native review before launch.
- A6. English is the default locale. `/` redirects to `/en`.
- A7. The location line "Based in Vapi, Gujarat" is correct for public use.

## Acceptance criteria

1. `npm run setup && npm run dev` serves the site locally from a clean clone.
2. `npm test` passes, including `python3 scripts/lint_content.py`.
3. All routes in `docs/specs/001` build and render in `en`; `hi`, `mr`, `gu` render the translated core and fall back to English for long-form pages with the visible English-only note.
4. Each of the five products renders a page whose CTAs match its status.
5. The contact form validates on the server, returns the contract in `docs/specs/005`, and the WhatsApp fallback works when the API fails.
6. The only phone number, email and LinkedIn URL in the built HTML are the official ones.
7. Keyboard-only use works end to end, focus is visible, reduced motion is respected, contrast meets WCAG AA, and no meaning is carried by colour alone.
8. Built pages emit title, description, canonical, hreflang, Open Graph and JSON-LD per `docs/specs/004`.
9. `docs/handoff.md` states what was run and what was not.

## Non-goals for v1

Blog or resources, case studies, pricing page, self-serve signup or login, customer portal, live chat widget, cookie banner (no cookies are set), CMS, search, video, animated 3D, AI chatbot on the site, testimonials, comparison against named competitors.
