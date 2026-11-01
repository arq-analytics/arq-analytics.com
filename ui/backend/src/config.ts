/** The only reader of server secrets. Values are validated here and passed inward. */

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
  from: string;
}

export interface ServerConfig {
  production: boolean;
  /** Null when SMTP is not configured. */
  mail: MailConfig | null;
  /** Public site URL, used to check the Origin header. */
  siteUrl: string;
}

export function readConfig(env: Record<string, string | undefined> = process.env, defaultTo = ""): ServerConfig {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ENQUIRY_FROM, ENQUIRY_TO } = env;
  const port = Number(SMTP_PORT);
  const complete = SMTP_HOST && SMTP_USER && SMTP_PASS && ENQUIRY_FROM && Number.isInteger(port) && port > 0;
  return {
    production: env.NODE_ENV === "production" && env.VERCEL_ENV !== "preview",
    mail: complete
      ? {
          host: SMTP_HOST as string,
          port,
          user: SMTP_USER as string,
          pass: SMTP_PASS as string,
          to: ENQUIRY_TO || defaultTo,
          from: ENQUIRY_FROM as string,
        }
      : null,
    siteUrl: env.NEXT_PUBLIC_SITE_URL ?? "",
  };
}
