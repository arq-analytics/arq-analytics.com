# Open questions for the owner

Each item lists the default the specs took, so the builder is never blocked. Answer these before launch. None needs an answer to start building.

| # | Question | Default taken in the package | Where it matters |
| --- | --- | --- | --- |
| 1 | Dravya: is it the tax module (as in the brief) or the material-traceability module (Dravya IQ, Shade Ledger) from the Oct 2026 spec? Earlier the tax module was drafted as Kar IQ. | Dravya is tax. Material is parked, not rendered. | `content/en/products.json`, `docs/notes/product-notes/dravya-tax.md` |
| 2 | Digital Twin: what is it, and does it need hardware? | Modest planned scope from the shared-data design, status in development, early list only, no hardware claim | `docs/notes/product-notes/digital-twin.md` |
| 3 | DineAstra was parked in Oct 2026. Show it as planned, or hide it? | Shown as planned with early list. To hide it, delete its entry from `products.json` and its card and interest keys from the four `ui.json` files | `docs/notes/product-notes/dineastra.md` |
| 4 | Product names: "ARQ Yantra" or "ARQ Yantra IQ"? Same for Dravya. | Names as written in the brief, without "IQ" | `products.json`, `ui.json` |
| 5 | Trial length and start: the 14-day trial is from Oct 2026. An earlier Sep 2026 note said 21 days starting at first sync. When does the 14 days start? | 14 days, start not stated publicly | `site.json#trial` |
| 6 | Is the trial set up with the customer (WhatsApp or call)? | Yes, stated in `products.trialNote` | claims register |
| 7 | Reference customer: place (notes say both Daman and Vapi), product used, and permission to say anything beyond the name | Name only, no place, no product | `site.json#referenceCustomer` |
| 8 | Public location line and team wording | "Based in Vapi, Gujarat", "a small team" | `site.json`, `pages.json#about` |
| 9 | Transparent SVG of the ARQ logo | Lockup built in code, JPEG used only for the Open Graph image | `assets/brand/README.md` |
| 10 | Wording for "Where is my data kept?" once hosting is settled | "Ask us, we will share it in writing" | Astra FAQ |
| 11 | Response time and office hours | None published | contact page |
| 12 | Native review of Hindi, Marathi and Gujarati | Drafts marked `_status` | `content/{hi,mr,gu}/ui.json` |
| 13 | Roman-script Hindi (Hinglish) as a fifth option for owners who read it that way | Not included. Hindi is in Devanagari | `docs/specs/004` |
| 14 | Analytics choice | Vercel Web Analytics, off by default | `.env.example` |
| 15 | SMTP credentials, sender address, DNS and domain switch | Placeholders in `.env.example` | ADR-0002 |
| 16 | Legal review of Privacy and Terms, retention period | Skeleton with a visible placeholder | `content/en/legal.json` |
| 17 | Publish roadmap items (statutory calendar, WhatsApp brief, Marg)? | Published as "Coming next" with no dates | Astra page |
| 18 | The early product Vault (document assurance for ASME fabricators) | Excluded from the site | `products.json` |
| 19 | Localise WhatsApp prefilled messages per language | English only | `site.json#whatsappPrefill` |
| 20 | Partner commission terms | Not published. Page says terms are in a signed agreement | `pages.json#partners` |
