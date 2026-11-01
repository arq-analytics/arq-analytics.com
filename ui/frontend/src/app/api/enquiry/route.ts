import { readConfig } from "@arq/backend/config";
import { LogMailer, MemoryRateLimiter, SmtpMailer, submitEnquiry } from "@arq/backend/services";
import { site } from "@/lib/content";

// Module scope so the limiter survives between requests on a warm instance.
const limiter = new MemoryRateLimiter();

/** Parses the request, calls one service, serialises the result. No rules live here. */
export async function POST(request: Request) {
  const config = readConfig(process.env, site.contact.email);
  const mailer = config.mail ? new SmtpMailer(config.mail) : config.production ? null : new LogMailer();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const referer = request.headers.get("referer");

  const result = await submitEnquiry(
    {
      contentType: request.headers.get("content-type"),
      origin: request.headers.get("origin"),
      host: request.headers.get("host"),
      rawBody: await request.text(),
      clientKey: forwarded || request.headers.get("x-real-ip") || "unknown",
      path: referer ? new URL(referer).pathname : undefined,
    },
    { mailer, limiter, whatsappNumber: site.contact.whatsappNumber },
  );

  return Response.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
