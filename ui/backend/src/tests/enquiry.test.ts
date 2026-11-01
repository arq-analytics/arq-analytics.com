import { describe, expect, it } from "vitest";
import { normalisePhone, validateEnquiry } from "../domain/enquiry.ts";
import { MemoryRateLimiter } from "../providers/rate-limit.ts";
import { LogMailer, type Mailer } from "../providers/mailer.ts";
import { submitEnquiry, type EnquiryDeps, type EnquiryRequest } from "../services/submit-enquiry.ts";

const NOW = 1_800_000_000_000;

const valid = () => ({
  name: "Test Person",
  phone: "9727067044",
  email: "owner@example.com",
  company: "Sample Industries",
  location: "Vapi",
  interest: "astra",
  role: "owner",
  intent: "trial",
  message: "Hello",
  consent: true,
  locale: "en",
  website: "",
  startedAt: NOW - 10_000,
});

describe("normalisePhone", () => {
  it.each([
    ["9727067044", "+919727067044"],
    ["+91 97270 67044", "+919727067044"],
    ["097270 67044", "+919727067044"],
    ["97270-67044", "+919727067044"],
  ])("accepts %s", (input, expected) => expect(normalisePhone(input)).toBe(expected));

  it.each(["12345", "5727067044", "97270670441", "", "abcdefghij"])("rejects %s", (input) =>
    expect(normalisePhone(input)).toBeNull(),
  );
});

describe("validateEnquiry", () => {
  const errorsFor = (patch: Record<string, unknown>) => {
    const result = validateEnquiry({ ...valid(), ...patch }, NOW);
    return result.ok || result.code !== "invalid" ? null : result.fieldErrors;
  };

  it("accepts a valid enquiry and normalises the phone", () => {
    const result = validateEnquiry(valid(), NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.enquiry.phone).toBe("+919727067044");
  });

  it("name: 2 to 80 characters", () => {
    expect(errorsFor({ name: "A" })).toHaveProperty("name");
    expect(errorsFor({ name: "Ab" })).toBeNull();
    expect(errorsFor({ name: "x".repeat(80) })).toBeNull();
    expect(errorsFor({ name: "x".repeat(81) })).toHaveProperty("name");
  });

  it("phone: invalid numbers fail", () => {
    expect(errorsFor({ phone: "12345" })).toHaveProperty("phone");
    expect(errorsFor({ phone: "+91 97270 67044" })).toBeNull();
    expect(errorsFor({ phone: "097270 67044" })).toBeNull();
  });

  it("email: optional, validated when present, at most 120", () => {
    expect(errorsFor({ email: "" })).toBeNull();
    expect(errorsFor({ email: "not-an-email" })).toHaveProperty("email");
    expect(errorsFor({ email: `${"a".repeat(115)}@b.co` })).toBeNull();
    expect(errorsFor({ email: `${"a".repeat(116)}@b.co` })).toHaveProperty("email");
  });

  it("company and location: at most 120", () => {
    expect(errorsFor({ company: "x".repeat(120) })).toBeNull();
    expect(errorsFor({ company: "x".repeat(121) })).toHaveProperty("company");
    expect(errorsFor({ location: "x".repeat(121) })).toHaveProperty("location");
  });

  it("interest and role must be known values", () => {
    expect(errorsFor({ interest: "unknown" })).toHaveProperty("interest");
    expect(errorsFor({ role: "" })).toHaveProperty("role");
    expect(errorsFor({ intent: "bogus" })).toHaveProperty("intent");
  });

  it("message: at most 1000, control characters stripped", () => {
    expect(errorsFor({ message: "x".repeat(1000) })).toBeNull();
    expect(errorsFor({ message: "x".repeat(1001) })).toHaveProperty("message");
    const result = validateEnquiry({ ...valid(), message: "Hi\u0000\u0007 there" }, NOW);
    expect(result.ok && result.enquiry.message).toBe("Hi there");
  });

  it("consent false returns invalid", () => {
    expect(errorsFor({ consent: false })).toHaveProperty("consent");
    expect(errorsFor({ consent: "true" })).toHaveProperty("consent");
  });

  it("honeypot filled returns rejected", () => {
    expect(validateEnquiry({ ...valid(), website: "http://spam" }, NOW)).toEqual({ ok: false, code: "rejected" });
  });

  it("submission under 2 seconds returns rejected", () => {
    expect(validateEnquiry({ ...valid(), startedAt: NOW - 1_000 }, NOW)).toEqual({ ok: false, code: "rejected" });
    expect(validateEnquiry({ ...valid(), startedAt: undefined }, NOW)).toEqual({ ok: false, code: "rejected" });
  });
});

describe("submitEnquiry", () => {
  const request = (body: unknown = valid(), patch: Partial<EnquiryRequest> = {}): EnquiryRequest => ({
    contentType: "application/json",
    origin: null,
    host: "localhost:3000",
    rawBody: JSON.stringify(body),
    clientKey: "203.0.113.9",
    ...patch,
  });

  const deps = (patch: Partial<EnquiryDeps> = {}) => {
    const logs: string[] = [];
    const sent: string[] = [];
    const mailer: Mailer = { send: async (m) => void sent.push(m.text) };
    const value: EnquiryDeps = {
      mailer,
      limiter: new MemoryRateLimiter(),
      whatsappNumber: "919727067044",
      now: () => NOW,
      newId: () => "id-1",
      log: (line) => void logs.push(line),
      ...patch,
    };
    return { value, logs, sent };
  };

  it("accepts a valid enquiry with 202", async () => {
    const d = deps();
    const result = await submitEnquiry(request(), d.value);
    expect(result).toEqual({ status: 202, body: { ok: true, id: "id-1" } });
    expect(d.sent).toHaveLength(1);
  });

  it("sixth request from one key inside an hour is rate limited", async () => {
    const d = deps();
    for (let i = 0; i < 5; i++) expect((await submitEnquiry(request(), d.value)).status).toBe(202);
    const sixth = await submitEnquiry(request(), d.value);
    expect(sixth.status).toBe(429);
    expect(sixth.body).toEqual({ ok: false, code: "rate_limited" });
  });

  it("mailer throwing returns delivery_failed without provider text", async () => {
    const d = deps({
      mailer: {
        send: async () => {
          throw new Error("smtp.provider.example refused: secret-token-123");
        },
      },
    });
    const result = await submitEnquiry(request(), d.value);
    expect(result.status).toBe(502);
    expect(JSON.stringify(result)).not.toMatch(/secret|provider|refused/);
  });

  it("missing configuration returns not_configured", async () => {
    const result = await submitEnquiry(request(), deps({ mailer: null }).value);
    expect(result).toEqual({ status: 503, body: { ok: false, code: "not_configured" } });
  });

  it("rejects wrong content type, foreign origin, oversize and malformed bodies", async () => {
    const d = deps().value;
    expect((await submitEnquiry(request(valid(), { contentType: "text/plain" }), d)).status).toBe(400);
    expect((await submitEnquiry(request(valid(), { origin: "https://evil.example" }), d)).status).toBe(400);
    expect((await submitEnquiry(request(valid(), { origin: "http://localhost:3000" }), d)).status).toBe(202);
    expect((await submitEnquiry(request({ ...valid(), message: "x".repeat(9000) }), d)).status).toBe(413);
    expect((await submitEnquiry(request(valid(), { rawBody: "{nope" }), d)).status).toBe(400);
  });

  it("returns field errors as message keys", async () => {
    const result = await submitEnquiry(request({ ...valid(), phone: "123" }), deps().value);
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ code: "invalid", fieldErrors: { phone: "phone" } });
  });

  it("the logged lines never contain personal fields", async () => {
    const d = deps();
    await submitEnquiry(request({ ...valid(), message: "my secret message" }), d.value);
    await submitEnquiry(request({ ...valid(), phone: "bad" }), d.value);
    const log = d.logs.join("\n");
    for (const personal of ["Test Person", "9727067044", "owner@example.com", "my secret message", "203.0.113.9"]) {
      expect(log).not.toContain(personal);
    }
    expect(log).toContain("id-1");
  });

  it("LogMailer prints only the redacted line", async () => {
    const lines: string[] = [];
    await new LogMailer((l) => lines.push(l)).send({
      id: "x1",
      subject: "Test Person enquiry",
      text: "Phone 9727067044",
      meta: { interest: "astra", locale: "en" },
    });
    expect(lines.join()).not.toMatch(/Test Person|9727067044/);
    expect(lines.join()).toContain("astra");
  });
});
