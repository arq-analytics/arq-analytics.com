# ARQ Dravya (tax)

Status on the site: in development. Early list only. No trial. No pricing.

## Naming conflict, read this first

The brief of 2026-10-31 says "ARQ Dravya for Tax". Earlier notes use Dravya differently:

- Oct 2026: Dravya IQ is the material-traceability module for recipe-based manufacturers (polymers, masterbatch), with a demo called Shade Ledger and a v1 spec written in a separate working session.
- Sep 2026: the tax module was drafted under the working name Kar IQ ("kar" means tax), with a note to rename freely.

The site follows the brief: Dravya is tax. The material module is parked in `products.json` under `parked` and is not rendered. If the owner meant the material module, or wants both, swap the entries: move `materialLedger` into `products` with real copy, rename the tax entry (for example back to Kar), and run the content gate. The note in `parked` says the same.

## What is known about the tax module

- Reframed in Sep 2026 from a billing app to reconciliation against GSTR-2B and input tax credit protection, because billing is a crowded category and Tally users already bill inside Tally.
- It reads the same Tally data as Astra, so it is cheap to build.
- It helps CAs rather than competing with them, so CAs become a channel.
- Earlier work on a GoGST replica was set aside by that reframing.

## What the site says

- Problem: input credit depends on suppliers filing correctly; finding out late is expensive.
- Planned scope, subject to change: GSTR-2B matching, a supplier risk list, a clean report for the CA.
- Not a billing app, does not replace your CA, does not file your returns. "ARQ is software, not a tax adviser."

## Do not say

Interest rates, penalties, deadlines or section numbers (needs a CA review first). That it files returns. That it is a billing app. Any competitor name. Any availability date. Any price.

## Open questions

Public name (Dravya or Kar IQ), and whether the scope is right. Legal wording of the credit-risk sentence should be reviewed by a CA before launch.
