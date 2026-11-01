# Handoff

Continuation state, filled in by the building agent. Last updated 2026-11-01. Do not write a second description of the codebase here; the layout is in `README.md` and `docs/specs/001`.

## State

| Slice | Name | Status | Date |
| --- | --- | --- | --- |
| 0 | Scaffold and gates | done | 2026-10-31 |
| 1 | Shell, routing, i18n, content loader | done | 2026-10-31 |
| 2 | Home complete and mockups | done | 2026-10-31 |
| 3 | Product pages and overview | done | 2026-10-31 |
| 4 | Custom apps, Partners, About, Legal | done | 2026-10-31 |
| 5 | Contact and enquiry | done, SMTP delivery not exercised | 2026-10-31 |
| 6 | SEO, accessibility, performance, locale review | partly done, see "Not built or not run" | 2026-10-31 |
| + | Space layer: starfield, particle orb, ship, product system, card tilt (ADR-0003, decision 7) | done | 2026-11-01 |
| + | Real logo, open hero with product chips, product chapters with a demo window each, DineAstra concept, designed light theme (ADR-0003, decision 8) | done | 2026-11-01 |
| + | One look without a theme switch, horizon, header that follows the section, connected product system, product tiles (ADR-0003, decision 9) | done | 2026-11-01 |
| + | Clean-up: repository lifted to `arq-website/`, documents under `docs/`, inputs moved to `../archive/`, hosting guide `docs/deploy.md` (ADR-0004) | done | 2026-11-01 |
| + | Live on GitHub Pages: old site kept on `main_backup_2026-11-01`, static build, Actions workflow on `main` (ADR-0005) | see Verified | 2026-11-01 |

The folder is a clone of `arq-analytics/arq-analytics.com`. `main` publishes to `arqoneailabs.space` through GitHub Actions.

## Versions used

| Package | Version | Verified against |
| --- | --- | --- |
| Node.js | 24.14.0 | local |
| next | 16.4.3 | docs bundled in `node_modules/next/dist/docs` |
| react, react-dom | 19.3.1 | npm registry |
| typescript | 5.9.3 | chosen for compatibility. TypeScript 7.0.2 is current and was not tried |
| eslint, eslint-config-next | 9.39.1, 16.4.3 | chosen for compatibility. ESLint 10.x is current and was not tried |
| vitest | 5.0.5 | npm registry |
| nodemailer | 10.3.1 | typechecks; SMTP not exercised |
| @vercel/analytics | 2.0.1 | `/next` entry exists in the package |
| prettier | 3.9.10 | npm registry |
| motion | 14.2.0 | npm registry, published 2026-10-13. Used only by `TiltCard` (`motion/react`) |

Next.js APIs were read from the bundled docs before use: async `params` in layouts and pages, `generateStaticParams`, `dynamicParams`, `MetadataRoute.Sitemap` with `alternates.languages`, `next/font/google` options, `not-found` and `global-not-found` (experimental, not used), workspace packages needing no `transpilePackages`.

## Verified

Run on 2026-10-31 on Windows 11, Node 24.

| Check | Result |
| --- | --- |
| `npm test` (content gate, sample-data check, hex check, typecheck, lint, unit tests) | pass |
| Backend tests | 36 pass: every row of the `docs/specs/005` table, CTA rule, mockup totals against the fixture, WhatsApp link |
| Frontend tests | 22 pass: `getUi` fallback, `localePath`, `switchLocalePath`, link builders; every product has its own orb shape and a window, only live products show sample tabs, DineAstra rows are marked sample |
| `npm run build` | pass: 58 static pages plus `/api/enquiry` |
| `npm run check:build` | pass on 52 built pages: one `h1`, one canonical, hreflang for en, hi, mr, gu and x-default, Open Graph, Twitter card, `html lang`, JSON-LD, only the official phone, email and LinkedIn, no non-live product with its own trial link, `SoftwareApplication` for live products only |
| Production server | `/` and `/index.html` redirect (308), `/portfolio-details.html` redirects to `/en/products`, unknown locale and unknown page return 404, `robots.txt` and `sitemap.xml` correct |
| API on the production build, SMTP unset | 503 `not_configured`; wrong content type and foreign origin return 400 `rejected` |
| Journey in a browser, development server | Home to contact with `?product=astra&intent=trial`: interest preselected, WhatsApp text prefilled. Submit returned 202 and the success state showed. The log line held only id, interest, locale and outcome |
| Failure path | With the API forced to 502, the error state showed with a WhatsApp button prefilled with name, interest and message |
| 320px width | No horizontal scroll on 14 pages, measured in a 320px iframe, including Hindi and Gujarati |
| Mobile menu at 320px | Opens as a dialog, focus moves in, Tab wraps inside, Escape closes and returns focus, body scroll lock released |
| Locales | Gujarati page: `lang="gu"`, translated chrome, English-only note, Devanagari and Gujarati fonts applied to the right transcripts |
| Console | No errors or warnings on the pages opened |
| Space layer, 2026-11-01 | `npm test` and `npm run build` pass. `check:build` passes on 52 pages, still one `h1` per page. No horizontal scroll at 320px on 14 pages, including `/gu` and `/hi/products/astra`. Viewed at 1440x900 and 390x844: hero orb morphing with its caption, the spiral in the final band, the product system on `/products`, torus on Yantra, helix on Digital Twin, the ship in flight, app views on the dark band. Fixed during the check: an orb that mounted off screen kept all particles at the centre, and the hero panel overflowed on phones |

| Logo, chapters and light theme, 2026-11-01 | `npm test` and `npm run build` pass, `check:build` passes on 52 pages. Viewed at 1440x900 (development server, then the production build) and 390x844 (development server), in dark and light: real logo in header and footer in both themes, hero orb fully visible, chips steer and hold the orb (focus held it 8 seconds; blur let it cycle again), all five chapters with their windows, autoplay advanced Yantra from one tab to the next by itself, pause button and tab click stop it, sticky product bar marks the chapter in view and scrolls itself on phones, product page "See it working" section. No horizontal scroll at 320px on the 13 English pages in the sitemap, in both themes. No console errors. Fixed during the check: the rising windows widened the page at 320px before revealing (clipped), flipped chapters put the window in the narrow column, the tab strip showed a scrollbar |
| One look, connected system, tiles, clean-up, 2026-11-01 | From the new location `arq-website/`: `npm install` (to relink the workspaces), `npm test` (36 backend and 22 frontend tests), `npm run build` (58 routes), `npm run check:build` (52 pages) all pass. `npm audit --omit=dev` finds 0 vulnerabilities. Viewed at 1440x900 on the development server, then the production build: the hero is space, the horizon curves into the light chapters, the header turns light over content and back to ink over the final band. `/products`: the system switched itself to "Where it is going" after a few seconds; choosing "Today" put the orbits back and it stayed there for 6 seconds; the links faded in again on "Where it is going". Tiles at 1440 and 390, the related tiles on a product page. No horizontal scroll at 320px on the 13 English pages, `/hi/products` and `/gu`, each with one `h1` and no theme button. No console errors on `/products`. The exact `next start` command in `docs/deploy.md` was run on port 3005 against the build: `/en` and `/sitemap.xml` 200, `/` 308 to `/en`, an empty enquiry rejected. Fixed during the check: the header kept its old tone when a section started exactly at its edge, and the back windows of the tile cascade overlapped each other's titles |

Credentials the owner pasted in chat were not written into any file, the code or the content. The two live apps were opened in an existing signed-in browser session only to learn their tab structure.

## Not built or not run

| Item | Reason |
| --- | --- |
| Lighthouse (performance, accessibility, SEO) | Not run. No Lighthouse tooling was set up. Targets in `docs/specs/004` are unmeasured |
| axe or any automated accessibility scan | Not run. No tooling added, and injecting a third-party script into pages was not done |
| Screen reader pass | Not run. Labels, `aria-describedby` on errors, `role="status"` and `role="alert"` are in place but unheard |
| Full keyboard-only walk | Partly run: mobile menu, focus trap and Escape. Skip link, tab arrow keys and the language menu were not walked by hand |
| Real email delivery through SMTP | Not run. No credentials. The `SmtpMailer` is untested against a real server |
| Enquiry form on the live site | Not available on GitHub Pages by design (ADR-0005). The contact page offers WhatsApp, phone and email |
| Hosting on a real server | Not run. `docs/deploy.md` is written from the commands that were run locally; systemd, Caddy, nginx and certbot were not exercised |
| Vercel deployment, ADR-0002 "Verified" section | Not run, and now the second choice (ADR-0004). The four items in ADR-0002 still need checking against current Vercel documentation if it is used |
| Real phone, real 3G, a second browser | Not run. Chrome on a desktop only |
| Reduced motion | The CSS and the still-frame code paths in the canvases are in place and reviewed. Not toggled in a browser, including the demo autoplay and the system's automatic switch, neither of which should run under it |
| Chip hover on a real mouse | Tested by focus, which runs the same handler. Synthetic pointer events in the test harness did not reach React |
| The header tone and tiles on the hi, mr, gu pages | Measured at 320px on `/hi/products` and `/gu` only (no overflow, header starts ink). Not looked at by eye. The styles are locale-independent |
| Performance of the canvases | Not measured. Lighthouse not run on the space layer, no low-end phone test. Particle counts drop on small screens and canvases pause off screen |
| Orb drag, throw and tap on a touch screen | Written with pointer events and `touch-action: pan-y`. Not tried on a real phone |
| Per-locale 404 | One English 404. An unknown locale gets Next's default 404 |
| Hindi, Marathi, Gujarati for the strings added in this build | 90 keys per locale fall back to English until a person translates them. Listed by `python scripts/lint_content.py .` |
| Translated showcase labels | `content/en/showcase.json` is English only, like `pages.json` |

## Placeholders left in the code or content

| Where | What |
| --- | --- |
| `content/en/legal.json` privacy "How long we keep it" | `RETENTION_PERIOD_TO_BE_CONFIRMED`, visible on the page |
| `ui/frontend/public/brand/arq-logo-on-{dark,light}.png` | Cut out of the JPEG by `npm run logo` until a transparent SVG exists |
| `ui/frontend/public/og.png` | Built from the JPEG logo on ink by `npm run og` |
| `.env.example` | Names only, no values |
| `content/{hi,mr,gu}/ui.json` | Drafts. `_status` still says needs native review |

## Claims to confirm

The app views show things the claims register does not yet list. They are labelled Sample data and were taken from the tab structure of the two live apps. Add each to `docs/notes/claims-register.md` as ALLOWED or remove it.

| Shown on the site | Source | Note |
| --- | --- | --- |
| Astra "Sales and expenses" view (monthly sales, purchases, expenses) | live app tab | Not in the register |
| Astra "Astra Agents" view (priorities, customer search, supplier search) | live app tab | Not in the register |
| Astra "Connector" view | live app tab | Same steps as the Astra product page |
| Yantra "Dashboard" (fleet ring, downtime hours by machine) | live app dashboard | Downtime hours are fictional. Register lists a daily brief and a maintenance list, not a dashboard |
| Yantra "Machines" and "Voice log" | register | Already ALLOWED |
| DineAstra concept window (daily sales, purchases, wastage, vendor dues) | `products.json` planned features | Labelled "Concept, not live". Fictional outlet and vendors. Shows planned scope only |
| Product tiles on `/products` and the product pages | the views above, cut down | Each front window is one of the views above on the same sample data. The windows behind are titled with tab names or planned features from `products.json`. Nothing new is claimed |
| Astra "Ask Astra" tab | the earlier hero answer panel | Same panel, now inside the Astra window |
| Yantra "Morning brief" | register ("Daily brief") | Already ALLOWED |

Left off the site on purpose, and for the owner to decide: in the live Yantra app, the Material tabs (GRN Register, Dispatch, Suppliers, Products), Data Load, Ask AI, and a production and rejection dashboard. That app also calls itself YantraIQ and describes die-tool production and dispatch, which is wider than the machine register and voice log on the Yantra page. `docs/notes/open-questions.md` item 4 (the "IQ" name) and item 1 (Dravya as the material module) may be connected.

## Owner actions

1. Decide or accept the defaults in `docs/notes/open-questions.md`.
2. Confirm the rows under "Claims to confirm" and each CONFIRM row in `docs/notes/claims-register.md`.
3. Native review of `content/hi/ui.json`, `content/mr/ui.json`, `content/gu/ui.json`, and translate the 90 English-only keys in each.
4. Supply a transparent SVG logo and swap it into `Lockup` (it shows the PNG cut-outs today).
5. Set the SMTP variables and the domain on the server (`docs/deploy.md`) and send a real test enquiry.
6. Review Privacy and Terms and fill the retention period.
7. Consider changing the passwords of the two test accounts, since they were pasted into a chat.
8. Consider turning on "Enforce HTTPS" in the repository's Settings > Pages.
9. Send the proper product details when ready. They go into `content/en/products.json`, and each tile's window into `windowFor` in `ui/frontend/src/components/ProductTiles.tsx`.
10. Keep or delete `../archive/`. Nothing in the repository reads from it.

## Next

Review the live site on a phone in all four languages, and submit `https://arqoneailabs.space/sitemap.xml` in the search console. Then run Lighthouse and an accessibility scan against the live site, which have never been run. If the enquiry form is wanted, host on a server per `docs/deploy.md`.
