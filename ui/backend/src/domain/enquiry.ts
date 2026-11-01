import type { Locale } from "./types.ts";

export const INTERESTS = [
  "astra",
  "yantra",
  "digitalTwin",
  "dineastra",
  "dravya",
  "custom",
  "partner",
  "other",
] as const;
export const ROLES = ["owner", "accounts", "tallyPartner", "ca", "other"] as const;
export const INTENTS = ["trial", "earlyList", "partner", "custom", "enquiry"] as const;
export const LOCALES: Locale[] = ["en", "hi", "mr", "gu"];

export type Interest = (typeof INTERESTS)[number];
export type Role = (typeof ROLES)[number];
export type Intent = (typeof INTENTS)[number];

export const MAX_BODY_BYTES = 8 * 1024;
export const MIN_FILL_MS = 2000;

export interface Enquiry {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  location?: string;
  interest: Interest;
  role: Role;
  intent?: Intent;
  message?: string;
  locale: Locale;
}

export type FieldErrors = Partial<Record<string, string>>;

export type Validation =
  | { ok: true; enquiry: Enquiry }
  | { ok: false; code: "rejected" }
  | { ok: false; code: "invalid"; fieldErrors: FieldErrors };

/** Strips spaces, dashes and a leading +91 or 0. Returns +91XXXXXXXXXX or null. */
export function normalisePhone(raw: string): string | null {
  let digits = raw.replace(/[\s-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === "string" && (list as readonly string[]).includes(v);

/** The only validator for enquiries. Error values are message keys, not prose. */
export function validateEnquiry(input: unknown, now: number): Validation {
  if (typeof input !== "object" || input === null) return { ok: false, code: "rejected" };
  const body = input as Record<string, unknown>;

  if (text(body.website) !== "") return { ok: false, code: "rejected" };
  const startedAt = body.startedAt;
  if (typeof startedAt !== "number" || now - startedAt < MIN_FILL_MS) return { ok: false, code: "rejected" };

  const errors: FieldErrors = {};
  const name = text(body.name);
  if (name.length < 2 || name.length > 80) errors.name = "name";

  const phone = normalisePhone(text(body.phone));
  if (!phone) errors.phone = "phone";

  const email = text(body.email);
  if (email && (email.length > 120 || !EMAIL.test(email))) errors.email = "email";

  const company = text(body.company);
  if (company.length > 120) errors.company = "company";
  const location = text(body.location);
  if (location.length > 120) errors.location = "location";

  if (!oneOf(INTERESTS, body.interest)) errors.interest = "interest";
  if (!oneOf(ROLES, body.role)) errors.role = "role";
  if (body.intent !== undefined && body.intent !== "" && !oneOf(INTENTS, body.intent)) errors.intent = "intent";

  const message = text(body.message).replace(CONTROL_CHARS, "");
  if (message.length > 1000) errors.message = "message";

  if (body.consent !== true) errors.consent = "consent";
  const locale = oneOf(LOCALES, body.locale) ? body.locale : "en";

  if (Object.keys(errors).length > 0) return { ok: false, code: "invalid", fieldErrors: errors };

  return {
    ok: true,
    enquiry: {
      name,
      phone: phone as string,
      email: email || undefined,
      company: company || undefined,
      location: location || undefined,
      interest: body.interest as Interest,
      role: body.role as Role,
      intent: oneOf(INTENTS, body.intent) ? body.intent : undefined,
      message: message || undefined,
      locale,
    },
  };
}
