import nodemailer from "nodemailer";
import type { MailConfig } from "../config.ts";

export interface MailMessage {
  id: string;
  subject: string;
  text: string;
  replyTo?: string;
  /** Non-personal fields for the redacted development log. */
  meta: { interest: string; locale: string };
}

export interface Mailer {
  send(message: MailMessage): Promise<void>;
}

export class SmtpMailer implements Mailer {
  private transport;

  constructor(private config: MailConfig) {
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  }

  async send(message: MailMessage): Promise<void> {
    await this.transport.sendMail({
      from: this.config.from,
      to: this.config.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });
  }
}

/** Development mailer. Prints a redacted line and never the personal fields. */
export class LogMailer implements Mailer {
  constructor(private log: (line: string) => void = (line) => console.info(line)) {}

  async send(message: MailMessage): Promise<void> {
    this.log(
      JSON.stringify({ mailer: "log", id: message.id, interest: message.meta.interest, locale: message.meta.locale }),
    );
  }
}
