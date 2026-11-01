# 002 Design system

The site uses the ARQ Astra ink and orange system. Tokens are in `ui/frontend/src/styles/theme.css` (given, copied from the ARQ skill). Components reference variables. A hex value in a component is a bug.

The real logo (`assets/brand/arq-logo.jpeg`) is white geometric ARQ lettering on near-black with an orange orbit and an orange dot in the Q. The ink and orange system matches it. Do not introduce navy, gold, plum or any other palette.

## Character

Calm, precise, peer to peer. An engineering firm talking to business owners. Not a startup landing page, not a consultancy brochure.

Do: answer first, generous whitespace, one orange accent per view, real UI mockups built from data, short sentences.
Do not: stock photos, robot or brain or glowing-network imagery, gradients as decoration, glassmorphism, neon on black, emoji, icon in a circle on every card, counters that animate to invented numbers, testimonial carousels, "AI" in sparkles.

## Tokens

Use every token from `theme.css`. Add marketing tokens in `marketing.css`, scoped under `:root`:

```css
:root {
  --arq-content-w: 1160px;
  --arq-section-y: clamp(56px, 8vw, 104px);
  --arq-gutter: clamp(16px, 4vw, 32px);
  --arq-hero-size: clamp(32px, 5.2vw, 60px);
  --arq-h2-size: clamp(24px, 3.2vw, 36px);
  --arq-h3-size: 18px;
  --arq-body-size: 16px;
  --arq-lead-size: clamp(17px, 1.6vw, 20px);
  --arq-neutral: var(--arq-text-secondary);
  --arq-neutral-soft: rgba(91, 91, 84, .10);
}
```

Status mapping, always pill plus text label:

| Status | Tone | Pill style |
| --- | --- | --- |
| live | healthy | green via `.arq-status[data-tone="healthy"]` |
| earlyAccess | warning | amber |
| inDevelopment | warning | amber |
| planned | neutral | add `.arq-status[data-tone="neutral"]` using `--arq-neutral` and `--arq-neutral-soft` |

Orange is for actions, focus and the orbit motif only. Never as a large background.

## Typography

- Latin: Manrope, weights 400, 500, 600, 700, 800, self-hosted through `next/font`.
- Devanagari (hi, mr): Noto Sans Devanagari. Gujarati (gu): Noto Sans Gujarati. Self-hosted through `next/font`, loaded only on the relevant locale layout.
- Numerals and amounts: `--arq-font-num` with `font-variant-numeric: tabular-nums`.
- Body 16px minimum. For hi, mr and gu use 17px and `line-height: 1.7`; Latin uses 1.55.
- Headings: Latin weight 700 to 800, tight tracking (-0.01em). For Indic scripts use weight 600 to 700, tracking 0, never uppercase.
- `.arq-label` is uppercase with tracking in English only. Under `:lang(hi)`, `:lang(mr)`, `:lang(gu)` set `text-transform: none; letter-spacing: 0`.
- Never fake bold or italic on Indic scripts. Do not use italics for Indic text.
- Indian number formatting: `Intl.NumberFormat("en-IN")` for amounts, always through `lib/format.ts`, one place.

## Layout

- Content width `--arq-content-w`, centred, side padding `--arq-gutter`.
- 12-column grid on desktop for sections, single column below 900px.
- Section vertical rhythm `--arq-section-y`. Alternate surfaces: `--arq-page`, `--arq-surface-1` bands, ink bands for hero and final CTA.
- Cards: `.arq-card` recipe from the theme. Product cards equal height, CTA pinned to the bottom.
- Header and footer are always ink, in light and dark mode.

## The orbit motif

An SVG ellipse arc echoing the logo, drawn with `stroke: var(--arq-accent)`, 2px, partly transparent, one small filled dot on the arc. Used once in the hero and once in the final CTA band, positioned behind content, `aria-hidden`, clipped by the band. It must not overflow the viewport horizontally. No animation except an optional slow dot travel disabled under `prefers-reduced-motion`.

## Lockup

Build the header lockup in SVG and CSS, not from the JPEG: the word ARQ in a bold geometric style (use Manrope 800 with tight tracking), a small orange triangle under the A bar echoed from the logo, and "ONE AI LABS" in small tracked capitals beside or below. The JPEG has a near-black square background that does not match the ink header exactly, so use it only for the Open Graph image and as the favicon source crop. Ask the owner for a transparent SVG logo and swap it in `Lockup` when available (see `docs/notes/open-questions.md`).

## Components

### Buttons
`.arq-primary` for the one primary action per region, `.arq-outline` for the secondary. 44px minimum touch height on mobile. Hover, active and disabled states defined. The WhatsApp button uses `.arq-primary` and a generic chat-bubble icon, not the WhatsApp trademark glyph.

### Status pill
`.arq-status` with `data-tone`. Text label from `ui.json#products.status`. Never colour alone.

### Product card
Domain label (`.arq-label`), name (h3), pill, tagline in medium weight, one-liner in secondary text, CTA, "See details" link. Whole card is not a link; the name and the details link are.

### Mockup frame
A device-agnostic window frame: thin border, title bar with three neutral dots, content area on `--arq-surface-1`. Top-right badge: "Sample data" (healthy tone) or "Concept, not live" (warning tone). Caption below states the mockup is fictional. Content is built from `data/sample-mockups.json`:

- `AstraAnswerPanel`: uses the `.arq-answer` recipe. The question, then the key facts (count of parties over the threshold, total overdue amount, oldest invoice age), then a three-row table, then the reminder draft with a "Copy" affordance that is visibly a draft. Totals computed in code from `receivables`.
- `YantraMachineList`: machine rows with state pill (running, down) and next service in days, overdue shown with text and not only colour. Beside it `YantraVoiceLog`: three transcripts in Hindi, Marathi and Gujarati, each with the parsed fields beside it.
- `TwinConcept`: sections as columns with machine tiles by state. Labelled concept.
- `DravyaConcept`: reconciliation table with match status text and a computed "credit at risk" total. Labelled concept.

### Forms
Labels above inputs, always visible. Error text under the field with `aria-describedby`. Required marked in text, not only an asterisk. Inputs 44px high, 16px font so mobile browsers do not zoom. The consent checkbox is required. A hidden honeypot field is visually and semantically hidden (`aria-hidden`, `tabindex=-1`, off-screen).

### FAQ
Native `details` and `summary`. No JS. Focus ring on summary.

## Motion

Orientation and feedback only. 150 to 250ms ease-out transitions on hover and focus. Fade-up on scroll is optional and must be off under `prefers-reduced-motion`. No parallax, no autoplay, no marquee.

## Dark mode

Honour `prefers-color-scheme`; allow a manual toggle storing the choice in `localStorage` guarded by try/catch. Set `data-theme` with a tiny inline script in `<head>` so there is no flash. Semantic colours keep their meaning between modes.

## Accessibility

Visible focus using the theme outline, skip link, one `h1` per page, ordered headings, landmarks, `lang` attribute set per locale on `<html>`, `alt` on meaningful images and empty `alt` on decorative ones, icon-only buttons with accessible names, tables with `th scope`, contrast AA (check ink text on orange: use `--arq-accent-ink` white only at sizes and weights that pass, otherwise use ink text on orange), touch targets 44px, no content only on hover.

## Imagery and icons

No photography in v1. Icons are an inline SVG set on a 24px grid, 1.75px stroke, `currentColor`, through one `Icon` component: rupee, machine, layers, utensils, receipt, tools, check, arrow-right, chat, phone, mail, menu, close, globe, sun, moon, external-link. Decorative icons get `aria-hidden`.

## Open Graph

1200 by 630 PNG generated by `scripts/make-og.mjs` from `assets/brand/arq-logo.jpeg`, centred on `--arq-ink` (#0b0c0f). One default image for every page in v1.
