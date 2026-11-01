# Brand assets

## Files

- `arq-logo.jpeg`: the ARQ ONE AI Labs logo, 1254 by 1254. White geometric ARQ lettering on near-black, an orange orbit arc, an orange triangle under the A bar, an orange dot in the Q, and "ONE AI LABS" in small tracked capitals (ONE in orange).

## Palette

Matches the ARQ Astra ink and orange system. Ink `#0b0c0f`, accent `#ee8b18`, accent dark `#cf7407`, off-white `#f4f5f1`. Tokens live in `ui/frontend/src/styles/theme.css`. Do not introduce other brand colours.

## Use

- Header and footer lockup: built in SVG and CSS as described in `docs/specs/002-design-system.md`, because the JPEG background does not match the ink band exactly.
- Open Graph image: generated from this JPEG, centred on ink, 1200 by 630.
- Favicon: crop of the A mark with the orange triangle, generated at build or by hand.
- Never stretch, recolour, add effects, or place the JPEG on a light background.

## Owner action

Provide a transparent SVG or PNG of the logo. When it exists, put it at `ui/frontend/public/brand/arq-logo.svg` and swap it into the `Lockup` component.
