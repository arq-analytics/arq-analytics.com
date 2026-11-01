# Audit of the current site (https://arqoneailabs.space/)

Read on 2026-10-31 from the rendered home page text. The portfolio details page and the visual rendering were not inspected, so this covers copy, structure and facts only.

## Verdict

The current site describes a different company. It sells generic RAG copilots, agents and workflow automation for "regulated workflows". The real business sells ARQ Astra and ARQ Yantra to Indian factories and MSMEs, with more products coming. A visitor cannot learn that from the site, and cannot reach ARQ reliably.

## Facts that are wrong (fix first)

| Item on the old site | Official value |
| --- | --- |
| Phone +91 97248 06960 (shown in Contact and in the footer) | +91 97270 67044 |
| Email contact@arq-analytics.com (Contact and footer) | contact@arqoneailabs.space |
| Social links point to `#` | LinkedIn: linkedin.com/company/arq-one-ai-labs |
| "Remote-first team based in India" | Vapi, Gujarat (confirm) |
| Hours "Mon to Fri, 9:00 AM to 6:00 PM IST" and "response within 24 business hours" | Never confirmed. Not published in the new site |

A prospect who calls the number on the old site does not reach ARQ. This alone justifies replacing the site quickly.

## Positioning and content problems

- Headline "Evidence-first AI for regulated workflows": regulated and life-sciences style wording, which is outside ARQ's scope by the owner's own rule. "Authoring Agent" and "QC / Review Agent" read as pharma authoring tools.
- None of ARQ Astra, ARQ Yantra, Tally, MSME, factories, GIDC or MIDC appear anywhere.
- A logo strip of AI vendors and frameworks (LangChain, OpenAI GPT-4, Pinecone, Weaviate, and others) that has no connection to what ARQ sells, and which ages quickly.
- "Build Examples: real systems, real architecture" lists six generic patterns while the same page says "we do not invent case studies". The reader cannot tell which are real.
- The demo section is a template placeholder ("ready for a live walkthrough or embedded product video").
- A newsletter form and "Loading... your message has been sent" strings that look like unedited template text. Unknown whether the form delivers anywhere.
- Eight-step enterprise engagement flow. Too heavy for the actual buyer, a factory owner.
- English only.
- Footer line "Designed with: First principles with Agentic AI" reads as filler.

## What is worth keeping

- The "no inflated claims" stance. The new site turns it into a visible feature: every product shows its true status.
- The first-principles philosophy, shortened to three lines on the About page.
- A short FAQ, rewritten around the questions owners actually ask.
- An engagement flow, cut from eight steps to five and used for Custom apps only.

## What the new site changes

| Old | New |
| --- | --- |
| Generic AI engineering lab | Products for Indian factories and MSMEs, in four languages |
| No product names | Five named products with live, in development and planned status |
| No trial, no pricing stance | 14-day free trial for the two live products, pricing on enquiry |
| Broken contact details | Official contact details from one source file |
| Vendor logos, invented-looking examples | Fictional sample data, always labelled |
| English only | English, Hindi, Marathi, Gujarati core |

## Before cutover

Keep a copy of the old site's files outside the repository. Redirect `/index.html` and `/portfolio-details.html` as in `docs/specs/004`.
