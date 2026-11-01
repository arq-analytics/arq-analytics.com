# ARQ DineAstra

Status on the site: planned. Early list only. No trial. No pricing.

Concept window: added on 2026-11-01 at the owner's request, so every product shows what it does.
It is labelled "Concept, not live", uses a fictional outlet ("Sample Kitchen (sample)") and
fictional vendors from `data/sample-mockups.json`, and claims nothing about a working product.

## What is known

- Opened in Sep 2026 by an inbound ask from a hotel owner in Vapi, routed through a channel contact.
- An incumbent had already pitched the same client. The owner wanted to build something stronger and keep ARQ's own IP.
- Approach: a working demo on dummy data first, shipped to the client, then infrastructure and pricing once they engage.
- Oct 2026: the owner parked DineAstra by his own decision. On 2026-10-31 he listed it again as a product on the website.

## What the site says, and why

Planned, and honest about it:

- Problem: sales, purchases, wastage and vendor dues spread across billing, notebooks and WhatsApp.
- Planned scope, subject to change: daily sales and purchase summary, stock and wastage, vendor dues with reminder drafts.
- "We are shaping this with the first few owners."

The scope list is a proposal from the website author. It mirrors the ARQ pattern (daily brief, stuck money, reminders as drafts) and is not a spec.

## Do not say

Any client or hotel name. Any incumbent name. "Pilot", "in use", "trusted by hoteliers". Any feature as available. Any price.

## Decisions needed from the owner

Whether to show it at all while it is parked. Default is to show it as planned so that restaurant and hotel owners have a place to leave details, which is how the first demo conversation happened. To hide it, remove its entry in `products.json` and its keys in the four `ui.json` files.
