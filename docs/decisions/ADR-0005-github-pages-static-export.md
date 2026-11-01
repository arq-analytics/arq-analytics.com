# ADR-0005 GitHub Pages, as a static export

Status: accepted. Date: 2026-11-01. Amends ADR-0004 decision 6.

## Context

The owner asked to put this site on `main` of `arq-analytics/arq-analytics.com`, the repository behind the live site, and to keep the old site on a backup branch. Checking the repository showed that `arqoneailabs.space` is served by GitHub Pages straight from the files on `main` (legacy build, custom domain, certificate approved). GitHub Pages serves plain files only. Pushing this repository's source as it was would have published the README in place of the site. Given the choice, the owner picked GitHub Pages with an automatic build.

## Decision

1. **The old site stays on `main_backup_2026-11-01`,** the commit that was on `main` before this change. The history on `main` is kept: this site is a new commit on top, not a force push.
2. **`npm run build:static` builds the site as files** into `ui/frontend/out` (`output: "export"`, `trailingSlash: true`, images unoptimised). The flag is `NEXT_PUBLIC_STATIC_EXPORT=1`, read in one place, `src/lib/build.ts`, and in `next.config.ts`. `npm run build` and `npm run start` are unchanged, so the own-server path in `docs/deploy.md` still works.
3. **No enquiry form on GitHub Pages.** Static files cannot send email. The build parks `src/app/api` outside the app while Next runs and always puts it back, and the contact page shows the WhatsApp, phone and email card with its own lead sentence (`contact.subDirect`). WhatsApp is already the primary action everywhere.
4. **Redirects become pages.** `/`, `/index.html`, `/inner-page.html` and `/portfolio-details.html` are small pages with a meta refresh, a script redirect, a canonical link and `noindex`. GitHub Pages cannot send a 308.
5. **URLs end in a slash.** Each page is a folder with an `index.html`. `pageUrl` in `src/lib/seo.ts` adds the slash to canonical, hreflang and sitemap URLs in the static build, so they match the address GitHub Pages serves without a redirect. `sitemap.ts` and `robots.ts` are marked `force-static`, which a static export requires.
6. **A branded 404.** Next exports only its default not-found page for this layout. The build writes `404.html` from `ui.notFound` and the classes of `app/[locale]/not-found.tsx`, linking the built stylesheets.
7. **GitHub Actions builds and publishes.** `.github/workflows/deploy-pages.yml` runs on every push to `main`: `npm ci`, `npm test`, `npm run build:static`, `npm run check:build`, then `upload-pages-artifact` and `deploy-pages`. The repository's Pages source was switched from "Deploy from a branch" to "GitHub Actions" for this.

## Consequences

- Enquiries on the live site go through WhatsApp, phone or email only. To bring the form back, host on a server (`docs/deploy.md`) or add a form service with its own privacy review.
- Built on Windows, Next 16.4.3 writes some segment prefetch files under a folder instead of a flat name (`path.relative` returns backslashes, and `convertSegmentPathToStaticExportFilename` only replaces `/`). The client then gets 404s on prefetch and falls back to loading the full page. GitHub builds on Linux, where the names are right. No workaround was added.
- `npm run build:static` overwrites `.next`, so run `npm run build` again before `npm run start` locally.
- Rolling back to the old site is a settings change: Pages source "Deploy from a branch", branch `main_backup_2026-11-01`.
