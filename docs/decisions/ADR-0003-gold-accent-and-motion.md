# ADR-0003 Gold accent, motion, and other build deviations

Status: accepted by the owner's brief. Date: 2026-10-31.

## Context

`docs/specs/002-design-system.md` says to use the ARQ Astra ink and orange system and "do not introduce navy, gold, plum or any other palette". It also limits motion to orientation and feedback and bans gradients as decoration.

The owner's brief for the build asked for an orange, white and gold colour package with good visuals and good animations. The brief is newer than the spec and comes from the owner, so it wins. This ADR records what changed so the spec and the code agree.

## Decisions

1. **Gold is a second accent, added in `marketing.css` only.** Tokens: `--arq-gold`, `--arq-gold-deep`, `--arq-gold-bright`, `--arq-gold-soft`, `--arq-gold-line`, `--arq-sheen`, `--arq-hairline-gold`. Dark mode brightens them. `theme.css` is unchanged.
2. **Orange keeps its job**: actions, focus and the orbit. Gold is for hairlines, emphasis, labels and the ink-surface headline. Neither is used as a large flat background. Ink stays the header, hero, footer and final band.
3. **Gradients are allowed where they carry the accent**: the hero headline sheen, the orange to gold underline on active tabs, nav links and steps, and card hover borders. Not as page backgrounds.
4. **Text on orange is ink, not white.** White on `--arq-accent` is about 2.6:1, below WCAG AA. Ink on orange is well above 7:1. The theme's `.arq-primary` is overridden in `marketing.css`.
5. **Motion is richer but always optional.**
   - Scroll reveal with stagger, hero headline sheen, drifting glows, the orbit dot, a floating hero panel, card hover lift with a gold border sweep, tab underline slide, bar and ring draw-in on the app views, a scroll progress bar under the header.
   - All of it is off under `prefers-reduced-motion: reduce`. The orbit dot rests at a fixed point.
   - Reveal starts hidden only when the head script has run (`html.js`), and every element is shown after four seconds if scripts stall.
   - Still banned: counters that animate to numbers, marquees, scroll-jacking, autoplay media, carousels. Pointer parallax in the starfield is allowed (decision 7).
6. **App views showcase.** Home and the Astra and Yantra pages show the tabs of each live app (Astra: Money to collect, Sales and expenses, Astra Agents, Connector. Yantra: Dashboard, Morning brief, Machines, Voice log) built from fictional rows in `data/sample-mockups.json#showcase`. Labels live in `content/en/showcase.json`, English only like `pages.json`. Every view sits in a `MockupFrame` with the Sample data badge and computes its totals in `@arq/backend/domain`. No screenshot or data from a live customer tenant is used.

7. **Space layer (owner request, 2026-11-01).** The owner asked for a neat but far more striking site with space elements (universe, star systems, ships) and Motion-style animation, keeping the product pages strong. Added in `ui/frontend/src/styles/space.css` and these components:
   - `Starfield`: a canvas of twinkling stars in three depths with slow drift, slight pointer parallax and the odd shooting star. On every ink band: the home hero, the app views section, the final band, page heroes and product heroes.
   - `ParticleOrb`: an original canvas particle orb, not a copy of any example. Particles fly in, the orb breathes, tilts toward the pointer, can be dragged and thrown to spin, scatters around the cursor, and morphs between one shape per product (Astra sphere, Yantra torus, Digital Twin double helix, DineAstra spiral, Dravya cube). Live products get a tilted gold ring with three moons, echoing the logo orbit. A tap moves to the next shape. In the home hero it replaces the SVG `OrbitMotif` behind the Astra answer panel, so spec 001 ("panel over the orbit motif") still holds. Each product page hero shows its own shape. The final band shows a slow spiral.
   - `Spaceship`: an original ARQ scout ship in SVG that crosses the hero and product heroes every 24 to 30 seconds with an engine trail.
   - `ProductSystem`: on `/products`, each product is a planet on its own orbit around the ARQ core. Every planet is a real link with its status. Orbits pause on hover and focus, and the system is hidden below 640px, where the product grid below it does the job.
   - `TiltCard`: product cards get a spring 3D tilt and a pointer spotlight, using the `motion` library (pinned `14.2.0`, the only new dependency). Mouse only, off under reduced motion.
   - The home headline rises in word by word, and its last three words carry the orange-to-gold sheen. The app views section is now a dark space band, and the showcase rises in with a 3D tilt.
   - Colours come from CSS variables, read at run time by the canvases, so the hex rule still holds. Canvases run only while on screen and while the tab is visible, cap the pixel ratio at 2, and use fewer particles on small screens. Under `prefers-reduced-motion` each canvas draws one still frame, and the ship is hidden.

8. **Logo, open hero, product chapters, light theme (owner request, 2026-11-01).** The owner asked why the logo was not used, said the Astra panel in the hero covered the animations, asked for a window per product showing what it does next to where the product is described, and asked for light and dark to both look right.
   - **Logo.** The header and footer use the real logo, cut out of `assets/brand/arq-logo.jpeg` by `scripts/make-logo.mjs` (colour-to-alpha against the JPEG's own background, a light-surface variant with ink letters). This overrides spec 002's "draw the lockup in SVG, use the JPEG only for Open Graph". The SVG lockup is removed.
   - **Hero without a panel.** The Astra answer panel left the hero, so the orb is fully visible. Under it, a row of product chips steers the orb: pointing at or focusing one morphs it to that product and holds it, and each chip links to that product's chapter. This deviates from spec 001's "panel over the orbit motif". The answer panel is now the first tab, "Ask Astra", of the Astra window.
   - **Product chapters replace the product grid and the app views band on home.** One chapter per product: number, domain, status, name, tagline, three features, CTAs, and its window. A sticky bar of product links marks the chapter in view. The product page opens with the same window under "See it working" (live) or "What it is meant to look like" (not live).
   - **Every product has a window.** DineAstra gets a concept like Digital Twin and Dravya: one day of a fictional outlet (sales, purchases, wastage, vendor dues), labelled "Concept, not live". `products.json` and `sample-mockups.json#dineastra` carry it; a test asserts every product has a window and only live ones show sample tabs.
   - **Live windows autoplay.** This relaxes decision 5's "no carousels" for these two windows only, with limits: about five seconds a tab, a visible progress line, paused while pointed at or focused, stopped for good on any tab choice, a pause button, nothing off screen, nothing under reduced motion.
   - **Light theme for space bands and the header.** Replaced by decision 9. In light mode the hero, page heroes, final band and header switch to daylight tokens (`:root[data-theme="light"]` in `space.css`), and the canvases switch from additive glow to plain ink and gold dots through `--space-*` tokens. This replaces decision 2's "ink stays the header, hero and final band" for the light theme. The footer stays ink.

9. **One look instead of two themes, a connected product system, product tiles (owner request, 2026-11-01).** The owner asked to drop the light and dark switch for a combination: space where the animations are, light where the details are. They asked for the solar system to show that the products will connect around ARQ and share context, "not for now", and for the one-line product cards to become tiles with a cascading window, a short description and a details button.
   - **One theme, no toggle.** The theme toggle, its three `ui.json` keys, the stored choice and the theme script are gone. `<html>` is always `data-theme="light"`. Space bands (home hero, page heroes, the final band) stay deep ink, and every content section is light. `theme.css` is unchanged, including its unused dark block, because it is the given token file. This replaces spec 002's "Dark mode" section and decision 8's light theme.
   - **The horizon.** Each space band ends in a curved edge of the page colour with a gold and orange rim, so scrolling feels like coming out of space onto the surface. The final band opens with the same curve upside down. Under scroll-driven animation support the curve rises as it enters; otherwise it is static.
   - **The header follows the section under it.** `HeaderTone` sets `data-tone` on the header from whatever is directly below its bottom edge: ink over space, light over content, with the matching logo. This replaces spec 002's "Header and footer are always ink". The footer stays ink.
   - **Connected system, shown as direction.** `/products` keeps the solar system and adds a two-way switch, "Today" and "Where it is going". The second view gathers the planets onto one ring, joins each to the ARQ core and to each other with lines, sends small packets along them, and labels the core "Shared context". The caption says plainly that this is where ARQ is heading, not a live feature. The view switches by itself once, about four seconds after it comes into view, unless the visitor has used the switch or prefers reduced motion. Below 640px the system is hidden and the caption is shown as text. Claims register row: "Across products".
   - **Product tiles replace product cards.** On `/products` and in the related products on each product page, each product is a tile: planet dot, name, status, a cascade of three small windows (the front one shows one real detail computed from `sample-mockups.json`, the two behind are titled with other tabs or planned features), tagline, one sentence and a "See details" button. Custom apps gets a tile with an empty, dashed window. `ProductCard`, `ProductGrid` and `OrbitMotif` are deleted, with their CSS and unused icons.

## Smaller deviations from the specs

| Spec said | Built | Why |
| --- | --- | --- |
| `lib/content.ts` reads JSON with `fs` | Static `import` of the JSON files | Bundled at build time, so the API route and every page work on Vercel with no file tracing, and the monorepo root is not a runtime concern |
| Indic fonts loaded only on the relevant locale layout | All three font families declared on every locale, `preload: false` for the two Indic ones | Fonts are split by unicode-range, so a browser downloads Devanagari or Gujarati only when text in that script is shown. This also gives the Yantra voice log correct fonts on the English page |
| `/` redirect and legacy redirects in `vercel.json` | `redirects()` in `next.config.ts` | Same behaviour on Vercel and also works locally. Next emits 308 (permanent), not 301 |
| `ThemeToggle` in the header | No toggle | Decision 9: one look, space bands dark and content light |
| Five product cards plus a custom apps card on `/products` | Five product tiles plus a custom apps tile, then the comparison table | Decision 9 |
| `scripts/lint_content.py` invoked as `python3 -I` | `scripts/run-python.mjs` tries `python3`, `python`, then `py -3`, always with `-I` | Windows machines often have only `python` or `py` |
| Contact page query-string handling | Client `ContactView` in a `Suspense` boundary | Keeps `/contact` statically generated. The fallback is the static contact card, so WhatsApp works before scripts load |
| 404 page per locale | One English `not-found.tsx` inside the locale layout; an unknown locale gets Next's default 404 | `not-found` receives no params, and `global-not-found` is marked experimental |
| Trial CTA test renders every product page | `scripts/check-build.mjs` reads the built HTML | Asserts a non-live product page has no trial link to itself. Related-product tiles link to the other product's page, not to a trial |

## Consequences

- `docs/specs/002` is out of date on palette and motion. Treat this ADR as the override until the spec is revised.
- `docs/notes/claims-register.md` needs rows for the new views (see `docs/handoff.md`, "Claims to confirm").
- Reverting to pure orange and white means deleting the gold tokens and the references to them in `marketing.css`.
- Removing the space layer means deleting `space.css`, its import in `app/[locale]/layout.tsx`, and the `Starfield`, `ParticleOrb`, `HeroOrb`, `Spaceship`, `ProductSystem` and `TiltCard` uses. `OrbitMotif` was deleted in decision 9.
- `docs/specs/001` (home layout) and `docs/specs/002` (lockup) are out of date on the hero, the product section and the logo. Decision 8 is the override.
- `docs/specs/001` (header, products page, component list) and `docs/specs/002` (dark mode, header always ink, product card, orbit motif) are out of date on theme and tiles. Decision 9 is the override.
- Bringing a theme switch back means restoring the toggle in `NavControls`, the `common.theme`, `common.lightMode` and `common.darkMode` keys, and a dark block for content sections. The canvases already read their colours from tokens.
- The canvases add main-thread work. Lighthouse has not been run on this version, so measure it before launch, especially on a low-end Android phone.
