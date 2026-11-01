# Claims register

The allow-list for public copy. If a sentence is not allowed here and is not a plain description of what is on screen, it does not go on the site. Sources are the owner's own statements in project memory (dated) unless marked otherwise. Re-check anything marked CONFIRM before launch.

Legend: ALLOWED = true as of 2026-10-31 per the owner's own statements. CONFIRM = probably true or proposed, the owner must confirm before launch. BLOCKED = do not publish.

## ARQ Astra

| Claim | Status | Basis and notes |
| --- | --- | --- |
| Connects to TallyPrime through a small Windows app on the PC where Tally runs | ALLOWED | Product README shared Sep 2026 |
| The connection only reads from Tally | ALLOWED | README: read-only access through Tally's XML gateway |
| Receivables ageing from Tally or Excel | ALLOWED | Oct 2026: live for new customers |
| Reminder drafts that the user copies into WhatsApp; no auto-send | ALLOWED | Oct 2026: live, copy only |
| MSME 45-day payment alert | ALLOWED | Oct 2026: live |
| Dead stock detection | ALLOWED | Oct 2026: live |
| Owner daily brief | ALLOWED | Oct 2026: live. Delivery channel not stated, so do not say WhatsApp |
| English, Hindi, Marathi and Gujarati | ALLOWED | Multilingual UI and copilot |
| Ask questions in your own language | ALLOWED | AI copilot, multilingual |
| 14-day free trial | ALLOWED | Oct 2026 |
| Pricing on enquiry | ALLOWED | Oct 2026 public collateral |
| Trial is set up with the customer on WhatsApp or a call | CONFIRM | Inferred from the Windows connector step and no self-serve onboarding |
| Statutory calendar, daily brief on WhatsApp, Marg ERP | CONFIRM | Listed under "Coming next". Roadmap items create expectations. Keep without dates |
| Data is synced to ARQ's cloud | ALLOWED | Architecture is cloud SaaS |
| Where the data is hosted | BLOCKED until decided | Database region is Singapore per Sep 2026 notes. The site says "ask us" and promises a written answer |
| Data stays in India, stays on your premises, or never leaves the PC | BLOCKED | False for this architecture |
| Numbers are calculated in code and the AI only explains them | BLOCKED | Deterministic grounding of financial figures is a listed open risk (Sep 2026). Publish only after it ships and is tested |
| Secure, bank-grade, encrypted, isolated per customer, certified | BLOCKED | Open gaps recorded Sep 2026: no row-level security, no token revocation. No certification held |
| Sends messages to your customers automatically | BLOCKED | Not true, and the opposite is a selling point |
| Works with Marg or any ERP other than Tally | BLOCKED | Marg is in progress |

## ARQ Yantra

| Claim | Status | Basis and notes |
| --- | --- | --- |
| Add machines from Excel, a nameplate photo, or by voice | ALLOWED | Oct 2026: live |
| Voice breakdown and downtime log | ALLOWED | Oct 2026: live |
| Maintenance due list | ALLOWED | Oct 2026: live |
| Daily brief | ALLOWED | Oct 2026: live |
| Works in Indian languages including Hindi, Marathi and Gujarati | CONFIRM | Voice uses an Indian-language speech service. Confirm the exact supported list before naming languages in the FAQ |
| No sensors needed | ALLOWED | Machines are logged by people, by voice or from a sheet |
| 14-day free trial | ALLOWED | Oct 2026 |
| Real-time machine monitoring, IoT, automatic downtime detection | BLOCKED | Not built |
| Any uptime, OEE or cost-saving figure | BLOCKED | No measured data |

## ARQ Digital Twin

| Claim | Status | Basis and notes |
| --- | --- | --- |
| It exists and is in development | CONFIRM | The owner listed it as a product line. No scope was in notes |
| Planned scope (plant view, money beside machines, one place for questions) | CONFIRM | Proposed by the website author from the shared-data design. Replace with the owner's real scope |
| No new hardware needed | BLOCKED | Not stated by the owner. The FAQ says "we will say so plainly" |
| Any live feature, screenshot or demo presented as real | BLOCKED | The mockup is labelled concept |

## ARQ DineAstra

| Claim | Status | Basis and notes |
| --- | --- | --- |
| It is planned | CONFIRM | The owner parked it in Oct 2026 and now wants it listed |
| Planned scope (daily summary, stock and wastage, vendor dues) | CONFIRM | Proposed |
| Any named hotel, restaurant or incumbent | BLOCKED | Client and competitor are confidential |
| Live, in pilot, or "with customers" | BLOCKED | Not true |

## ARQ Dravya (tax)

| Claim | Status | Basis and notes |
| --- | --- | --- |
| It is in development | CONFIRM | The owner described a GST product and, in a Sep 2026 working session, a reconciliation-first scope |
| Matches purchases against GSTR-2B; supplier risk list; report for the CA | CONFIRM | Reconciliation scope from the Sep and Oct 2026 sessions |
| Credit can be at risk when a supplier does not file | ALLOWED | General GST mechanism, stated without numbers |
| Interest rate on wrongly availed credit, penalties, deadlines | BLOCKED | Do not state numbers or law without a CA review |
| Files returns for you | BLOCKED | Not the product |
| A billing or invoicing app | BLOCKED | Not the product |

## Company

| Claim | Status | Basis and notes |
| --- | --- | --- |
| Official phone, email, LinkedIn, domain | ALLOWED | `content/en/site.json` |
| Based in Vapi, Gujarat; working with factories across GIDC and MIDC estates | CONFIRM | ARQ is described as Vapi-based; confirm the public location line |
| A small team | CONFIRM | The owner runs ARQ largely alone and adds people. "Small" is true, but avoid implying a large bench |
| Reference customer: Pawan Engineering (Infinity Die Tools) | ALLOWED to name | The owner approved naming it in collateral. Do not attribute any product, outcome, quote or number to it without written approval |
| Customer counts, logos, testimonials, case studies | BLOCKED | None approved |
| Savings, ROI, hours saved | BLOCKED | Internal ROI models are estimates and are not public |
| Prices | BLOCKED | Pricing on enquiry |
| Partner commission percentage | BLOCKED | Set in a signed agreement |
| Named competitors, prospects, channel partners, people | BLOCKED | Confidential |
| AI vendor or model names | BLOCKED | Models change and some are being deprecated. Say "AI" and what it does |
| Pharma, GxP, clinical, life sciences, any employer | BLOCKED | Outside ARQ scope by the owner's own rule |
| Certifications, awards, press, "trusted by" | BLOCKED | None |
| Response-time or office-hours promise | BLOCKED until decided | The old site published hours that were never confirmed |

## Custom apps

| Claim | Status | Basis and notes |
| --- | --- | --- |
| We build small custom apps for one process at a time | CONFIRM | Service line named by the owner |
| Paper to record pattern, built as a prototype | ALLOWED | Prototype exists (Sep to Oct 2026). The word "prototype" must stay |
| People and wages tracking, in progress as a parallel project | ALLOWED | Contractor and employee tracking project |
| A working demo on sample data first | ALLOWED | The owner's stated approach |
| Fixed timelines or prices | BLOCKED | None approved |

## Across products

| Claim | Status | Basis and notes |
| --- | --- | --- |
| Over time the products will connect through the ARQ core and share context | ALLOWED as direction | The owner, in chat on 2026-11-01: the products "will be connected and will have each other's context", with ARQ at the centre. Shown only under "Where it is going" on `/products`, with "not a live feature yet". Never state it as working today, and never give a date |
| Each product works on its own today | ALLOWED | Plain description of the current state |

## How to change this register

Move a row from CONFIRM to ALLOWED only on the owner's written confirmation. Record the date in the Basis column. When copy changes, run `python3 scripts/lint_content.py .` and the claims reviewer prompt in `docs/prompts/claims-reviewer.md`.
