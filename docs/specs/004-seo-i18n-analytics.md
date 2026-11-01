# 004 SEO, i18n, analytics, performance

## Canonical and routing

- Canonical host: `https://arqoneailabs.space`. `www` redirects to it (Vercel domain setting).
- Locale prefix on every page: `/en`, `/hi`, `/mr`, `/gu`. `/` redirects to `/en` with a 308 in `vercel.json`. No automatic redirect by browser language in v1. The language switcher is explicit and preserves the current page.
- Trailing slashes: none. Pick one behaviour in `next.config` and keep it.
- Legacy: `/index.html` to `/en`, `/portfolio-details.html` to `/en/products` (301).

## Per-page metadata

Each page sets, from the `seo` object in content (English) with `ui.json` product card strings for non-English locales where available:

- `<title>`: from `seo.title`, at most 60 characters. Product pages end with `| ARQ ONE AI Labs`.
- `<meta name="description">`: from `seo.description`, at most 160 characters (the lint gate enforces 165).
- `<link rel="canonical">`: the page's own locale URL.
- `hreflang` alternates for `en`, `hi`, `mr`, `gu` and `x-default` pointing to `/en`.
- Open Graph: `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image` (default image), `og:locale` per language, `og:site_name`.
- Twitter card `summary_large_image`.
- `<html lang>` from `ui.json#meta.htmlLang`.
- Do not add `keywords` meta (ignored by search engines). Keep `seo.keywords` in content as an internal intent list used for headings and copy review.

Non-English pages whose body is English must keep `lang` of the locale on `<html>` but wrap English-only blocks in an element with `lang="en"`.

## Structured data (JSON-LD, server-rendered)

- Every page: `Organization` with `name`, `url`, `logo` (default OG image), `contactPoint` (telephone, email, `availableLanguage`: English, Hindi, Marathi, Gujarati), `sameAs` (LinkedIn).
- Product pages for `live` products only: `SoftwareApplication` with `name`, `applicationCategory: "BusinessApplication"`, `description`, `url`, `publisher`. No `aggregateRating`, no `review`, no `offers` with a price.
- FAQ pages: `FAQPage` only where the visible content matches exactly (home FAQ, product FAQs for live products).
- Do not emit structured data for products that are not live.

All values come from `site.json` and `products.json`.

## Sitemap and robots

`sitemap.xml` lists every locale and page, with `alternates.languages`. `robots.txt` allows all and points to the sitemap. Non-production deployments (preview) send `X-Robots-Tag: noindex`.

## Intent map (internal, for headings and copy review)

| Page | Search intent it should answer in plain words |
| --- | --- |
| Home | AI software for Indian factories, Tally analytics, MSME software |
| Astra | Tally dashboard, Tally receivables ageing report, MSME 45 day payment alert, dead stock report from Tally |
| Yantra | machine maintenance log app, breakdown logging by voice in Hindi, factory machine register |
| Dravya | GSTR-2B reconciliation with Tally, supplier not filed ITC risk |
| Digital Twin, DineAstra | low priority, early list pages, keep them honest and short |
| Custom apps | custom software for factory, paper register digitisation |
| Partners | Tally partner programme, referral partner for MSME software |

Write for people first. The headline of a page should name the problem in the visitor's words, not a keyword list.

## Internationalisation

- Locales: `en`, `hi`, `mr`, `gu`. Default `en`.
- No i18n library in v1. `lib/i18n.ts` exposes `locales`, `isLocale`, `getUi(locale)` (deep merge over English), `localePath(locale, path)` and `switchLocalePath`.
- Route segment `[locale]` validated by `generateStaticParams` and `notFound()` for anything else.
- Scope of translation in v1 is the `ui.json` core. Long-form pages fall back to English and show the English-only note. This is a deliberate, visible limit.
- Fonts: Noto Sans Devanagari for `hi` and `mr`, Noto Sans Gujarati for `gu`, self-hosted, loaded per locale layout only.
- Do not machine-translate additional strings silently. New strings are added in English first. Translations are added by a person or flagged `needs review` in the file's `_status`.
- `scripts/lint_content.py` fails on locale keys that do not exist in English and reports untranslated counts.
- Before launch, a native speaker for each of Gujarati, Marathi and Hindi reviews `content/{locale}/ui.json`. Change `_status` to `reviewed` with the reviewer and date only after that.

## Analytics

- Preferred: Vercel Web Analytics (no cookies), enabled by an environment flag. Alternative: Plausible. No Google Analytics in v1.
- Because no cookies or local identifiers are set for tracking, no cookie banner is shown. If that changes, add consent first.
- Events (names from `site.json#analytics.events`): `cta_whatsapp_click`, `cta_trial_click`, `cta_early_list_click`, `enquiry_submitted`, `enquiry_failed`, `language_switched`. Properties allowed: `product`, `locale`, `page`. Never send name, phone, email or message text.
- Analytics code lives in `lib/analytics.ts` and is a no-op when the flag is off.

## Performance and quality budgets

Targets, measured on a production build on a mid-range mobile profile. Report what was actually run.

| Measure | Target |
| --- | --- |
| Lighthouse mobile performance | 90 or more |
| Lighthouse accessibility | 95 or more |
| Lighthouse SEO | 95 or more |
| Largest Contentful Paint | under 2.5 s |
| Cumulative Layout Shift | under 0.1 |
| JavaScript per route | keep small; interactive islands only for the header menu, language and theme controls, copy button, and the form |
| Third-party scripts | analytics only |

Rules: server components by default; client components only where state or browser APIs are needed; fonts self-hosted with `display: swap` and size-adjust fallbacks; no layout shift from fonts; images, if any, through `next/image` with explicit sizes; no autoplaying media.
