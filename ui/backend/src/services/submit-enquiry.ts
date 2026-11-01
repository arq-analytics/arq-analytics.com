import { createHash, randomUUID } from "node:crypto";
import { MAX_BODY_BYTES, validateEnquiry, type Enquiry } from "../domain/enquiry.ts";
import { whatsappUrl } from "../domain/links.ts";
import type { Mailer } from "../providers/mailer.ts";
import type { RateLimiter } from "../providers/rate-limit.ts";

export interface EnquiryRequest {
  contentType: string | null;
  origin: string | null;
  host: string | null;
  rawBody: string;
  /** Client address. Hashed before use and never logged. */
  clientKey: string;
  path?: string;
}

export type EnquiryResult =
  | { status: 202; body: { ok: true; id: string } }
  | { status: 400; body: { ok: false; code: "invalid"; fieldErrors: Record<string, string | undefined> } }
  | { status: 400 | 413 | 429 | 502 | 503; body: { ok: false; code: string } };

export interface EnquiryDeps {
  mailer: Mailer | null;
  limiter: RateLimiter;
  /** WhatsApp number used for the link in the email body. */
  whatsappNumber: string;
  now?: () => number;
  newId?: () => string;
  log?: (line: string) => void;
}

const INTEREST_LABELS: Record<string, string> = {
  astra: "ARQ Astra",
  yantra: "ARQ Yantra",
  digitalTwin: "ARQ Digital Twin",
  dineastra: "ARQ DineAstra",
  dravya: "ARQ Dravya",
  custom: "Custom app",
  partner: "Partner",
  other: "General",
};

const fail = (status: 400 | 413 | 429 | 502 | 503, code: string): EnquiryResult => ({
  status,
  body: { ok: false, code },
});

function sameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function formatEnquiry(enquiry: Enquiry, id: string, path: string, whatsappNumber: string, at: Date) {
  const lines = [
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}  (${whatsappUrl(enquiry.phone.replace("+", ""))})`,
    `Email: ${enquiry.email ?? "-"}`,
    `Company: ${enquiry.company ?? "-"}`,
    `Location: ${enquiry.location ?? "-"}`,
    `Interested in: ${INTEREST_LABELS[enquiry.interest]}`,
    `Role: ${enquiry.role}`,
    `Intent: ${enquiry.intent ?? "-"}`,
    `Locale: ${enquiry.locale}`,
    `Page: ${path}`,
    `Received (UTC): ${at.toISOString()}`,
    `Reference: ${id}`,
    "",
    enquiry.message ?? "(no message)",
  ];
  return {
    subject: `[ARQ site] ${INTEREST_LABELS[enquiry.interest]} enquiry from ${enquiry.name}`,
    text: lines.join("\n"),
    replyTo: enquiry.email,
  };
}

/** Orchestrates one enquiry: request checks, spam checks, validation, rate limit, delivery. */
export async function submitEnquiry(req: EnquiryRequest, deps: EnquiryDeps): Promise<EnquiryResult> {
  const now = deps.now ?? Date.now;
  const log = deps.log ?? ((line: string) => console.info(line));
  const id = (deps.newId ?? randomUUID)();
  const done = (result: EnquiryResult, interest = "-", locale = "-") => {
    log(
      JSON.stringify({ enquiry: id, interest, locale, outcome: result.status === 202 ? "accepted" : result.body.code }),
    );
    return result;
  };

  if (!(req.contentType ?? "").toLowerCase().startsWith("application/json")) return done(fail(400, "rejected"));
  if (!sameOrigin(req.origin, req.host)) return done(fail(400, "rejected"));
  if (Buffer.byteLength(req.rawBody, "utf8") > MAX_BODY_BYTES) return done(fail(413, "too_large"));

  let parsed: unknown;
  try {
    parsed = JSON.parse(req.rawBody);
  } catch {
    return done(fail(400, "rejected"));
  }

  const validation = validateEnquiry(parsed, now());
  if (!validation.ok) {
    if (validation.code === "rejected") return done(fail(400, "rejected"));
    return done({ status: 400, body: { ok: false, code: "invalid", fieldErrors: validation.fieldErrors } });
  }
  const { enquiry } = validation;

  const key = createHash("sha256").update(req.clientKey).digest("hex");
  if (!deps.limiter.allow(key, now())) return done(fail(429, "rate_limited"), enquiry.interest, enquiry.locale);

  if (!deps.mailer) return done(fail(503, "not_configured"), enquiry.interest, enquiry.locale);

  const message = formatEnquiry(enquiry, id, req.path ?? "/contact", deps.whatsappNumber, new Date(now()));
  try {
    await deps.mailer.send({ id, ...message, meta: { interest: enquiry.interest, locale: enquiry.locale } });
  } catch {
    return done(fail(502, "delivery_failed"), enquiry.interest, enquiry.locale);
  }
  return done({ status: 202, body: { ok: true, id } }, enquiry.interest, enquiry.locale);
}
