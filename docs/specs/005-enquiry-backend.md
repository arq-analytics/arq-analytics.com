# 005 Enquiry backend

One endpoint. Its job is to accept a valid enquiry, make sure a human at ARQ receives it, and never lose the visitor: when anything fails, the browser offers WhatsApp with the enquiry prefilled.

## Where the code lives

- Route handler: `ui/frontend/src/app/api/enquiry/route.ts`. Parses JSON, calls `submitEnquiry`, serialises the result. No rules inside.
- `ui/backend/src/domain/enquiry.ts`: field limits, enums, phone normalisation, validation, error shape. Pure functions, no framework imports.
- `ui/backend/src/services/submit-enquiry.ts`: orchestrates spam checks, validation, rate limit, formatting, delivery.
- `ui/backend/src/providers/mailer.ts`: `Mailer` interface with `SmtpMailer` and `LogMailer`.
- `ui/backend/src/providers/rate-limit.ts`: in-memory limiter behind an interface, replaceable later.
- Tests in `ui/backend/src/tests/`.

## Request

`POST /api/enquiry`, `Content-Type: application/json`.

| Field | Type | Rule |
| --- | --- | --- |
| `name` | string | required, trimmed, 2 to 80 characters |
| `phone` | string | required; strip spaces, dashes and a leading `+91` or `0`; must then be 10 digits starting with 6, 7, 8 or 9; stored normalised as `+91XXXXXXXXXX` |
| `email` | string | optional; if present must be a valid address, at most 120 characters |
| `company` | string | optional, at most 120 |
| `location` | string | optional, at most 120 |
| `interest` | enum | required: `astra`, `yantra`, `digitalTwin`, `dineastra`, `dravya`, `custom`, `partner`, `other` |
| `role` | enum | required: `owner`, `accounts`, `tallyPartner`, `ca`, `other` |
| `intent` | enum | optional: `trial`, `earlyList`, `partner`, `custom`, `enquiry` |
| `message` | string | optional, at most 1000, control characters stripped |
| `consent` | boolean | required and `true` |
| `locale` | enum | `en`, `hi`, `mr`, `gu` |
| `website` | string | honeypot, must be empty |
| `startedAt` | number | client timestamp in ms when the form was rendered; reject if the request arrives less than 2 seconds later |

Unknown fields are ignored. Maximum request body 8 KB.

## Responses

| Status | Body | When |
| --- | --- | --- |
| 202 | `{ "ok": true, "id": "<opaque id>" }` | accepted and delivered to the mailer |
| 400 | `{ "ok": false, "code": "invalid", "fieldErrors": { "<field>": "<message key>" } }` | validation failed |
| 400 | `{ "ok": false, "code": "rejected" }` | honeypot filled or submitted too fast, with no further detail |
| 413 | `{ "ok": false, "code": "too_large" }` | body too large |
| 429 | `{ "ok": false, "code": "rate_limited" }` | limiter tripped |
| 503 | `{ "ok": false, "code": "not_configured" }` | production without mail configuration |
| 502 | `{ "ok": false, "code": "delivery_failed" }` | mailer threw |

Responses never contain stack traces, environment values, provider messages or the submitted data. Field error values are message keys the client maps to translated text, not prose.

## Delivery

- Mailer: SMTP with TLS through environment variables. Works with any provider; the owner's mailbox is Zoho, so use its India SMTP host.
- To: `ENQUIRY_TO` (default the official email from `site.json`). From: `ENQUIRY_FROM` on the same domain. Reply-To: the visitor's email when given.
- Subject: `[ARQ site] {interest label} enquiry from {name}`.
- Body: plain text with every field, the locale, the page path and a UTC timestamp. The phone is shown in normalised form with a `wa.me` link.
- If SMTP variables are missing in development, use `LogMailer`, which prints a redacted line (id, interest, locale) and never the personal fields.
- In production, missing SMTP variables make the route return 503 and the build logs a single clear warning.
- No database in v1. A lost email is mitigated by the WhatsApp fallback. Persistence (a managed Postgres table) is a documented future step.

## Spam and abuse

1. Honeypot field named `website`.
2. Minimum fill time of 2 seconds.
3. Per-IP limit of 5 requests per hour, best effort in memory (serverless instances do not share memory, so this only slows trivial abuse). The limiter sits behind an interface so a shared store or a bot-challenge service can replace it.
4. Body size limit.
5. Strict `Content-Type` check. Same-origin only (reject a mismatched `Origin` header when present).

## Privacy

- Log only: id, interest, locale, outcome code.
- Never log name, phone, email, message or the IP address in clear.
- The success message tells the visitor the enquiry is received and that ARQ will reply on WhatsApp or phone.
- No cookies are set by this endpoint.

## Client behaviour (`EnquiryForm`)

- Renders server-side with real labels; enhances with `fetch`.
- Disables the submit button while sending; shows field errors from `fieldErrors`; focuses the first invalid field.
- On 202: replace the form with the success message (`role="status"`), send `enquiry_submitted`.
- On any other failure: show `contact.error` (`role="alert"`) and a WhatsApp button whose prefilled text includes the visitor's name, interest and message, URL-encoded through `lib/links.ts`; send `enquiry_failed`.
- The WhatsApp link builder is the only place a `wa.me` URL is created. The number comes from `site.json`.

## Environment variables (`.env.example`, no values)

```text
# Email delivery for enquiries (required in production)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ENQUIRY_TO=
ENQUIRY_FROM=

# Public site URL used for canonical links and sitemap
NEXT_PUBLIC_SITE_URL=https://arqoneailabs.space

# Optional analytics switch (no cookies)
NEXT_PUBLIC_ANALYTICS=off
```

Only `NEXT_PUBLIC_*` values may reach the browser. SMTP values are read in one place, `ui/backend/src/config.ts`, validated at start, and passed inward.

## Tests (vitest, in `ui/backend`)

- validation table: each field with a valid, an invalid and a boundary case, including phone variants `9727067044`, `+91 97270 67044`, `097270 67044`, `12345`
- honeypot filled returns `rejected`
- submission under 2 seconds returns `rejected`
- consent false returns `invalid`
- sixth request from one key inside an hour returns `rate_limited`
- mailer throws returns `delivery_failed` and the response contains no provider text
- missing configuration in production mode returns `not_configured`
- the logged line never contains name, phone, email or message
- CTA resolution: a non-live product never resolves to a trial CTA
