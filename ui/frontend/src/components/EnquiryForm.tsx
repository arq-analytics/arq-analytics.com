"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { INTERESTS, ROLES } from "@arq/backend/domain";
import { trackEvent } from "@/lib/analytics";
import { fill } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import { whatsappLink } from "@/lib/links";
import type { Locale } from "@/lib/types";
import { Icon } from "./Icon";

interface EnquiryFormProps {
  ui: Ui;
  locale: Locale;
  defaultInterest: string;
  intent: string;
}

type Phase = "idle" | "sending" | "ok" | "error";
type Errors = Record<string, string | undefined>;

const FIELD_ORDER = ["name", "phone", "email", "company", "location", "interest", "role", "message", "consent"];

export function EnquiryForm({ ui, locale, defaultInterest, intent }: EnquiryFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt] = useState(() => Date.now());
  const [phase, setPhase] = useState<Phase>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [fallback, setFallback] = useState("");
  const L = ui.contact.labels;
  const id = (name: string) => `${uid}-${name}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "");
    const payload = {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      company: get("company"),
      location: get("location"),
      interest: get("interest"),
      role: get("role"),
      intent: intent || undefined,
      message: get("message"),
      consent: form.get("consent") === "on",
      locale,
      website: get("website"),
      startedAt,
    };
    const interestLabel = (ui.contact.interests as Record<string, string>)[payload.interest] ?? payload.interest;
    const fallbackText = fill(ui.contact.fallbackMessage, {
      name: payload.name,
      interest: interestLabel,
      message: payload.message,
    }).trim();

    setPhase("sending");
    setErrors({});
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 202) {
        trackEvent("enquiry_submitted", { product: payload.interest, locale });
        setPhase("ok");
        return;
      }
      const body = (await res.json().catch(() => null)) as { code?: string; fieldErrors?: Errors } | null;
      if (res.status === 400 && body?.code === "invalid" && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setPhase("idle");
        const first = FIELD_ORDER.find((f) => body.fieldErrors?.[f]);
        if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      throw new Error("not accepted");
    } catch {
      trackEvent("enquiry_failed", { product: payload.interest, locale });
      setFallback(fallbackText);
      setPhase("error");
    }
  }

  if (phase === "ok") {
    return (
      <div className="form-state form-state--ok" role="status">
        <h2>{ui.contact.successHeading}</h2>
        <p>{ui.contact.success}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="form-state form-state--error" role="alert">
        <h2>{ui.contact.errorHeading}</h2>
        <p>{ui.contact.error}</p>
        <a
          className="arq-primary"
          href={whatsappLink(fallback)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("cta_whatsapp_click", { locale })}
        >
          <Icon name="chat" size={18} />
          {ui.contact.whatsappFallback}
        </a>
      </div>
    );
  }

  const error = (name: string) =>
    errors[name] ? (ui.contact.errors as Record<string, string>)[errors[name] as string] : undefined;
  const field = (name: string, label: string, required: boolean, input: React.ReactNode) => (
    <div className="field" data-invalid={error(name) ? "true" : undefined}>
      <label htmlFor={id(name)}>
        {label}
        <span className="hint">{required ? ui.contact.required : ui.contact.optional}</span>
      </label>
      {input}
      {error(name) && (
        <span className="field__error" id={`${id(name)}-error`}>
          {error(name)}
        </span>
      )}
    </div>
  );
  const aria = (name: string) => ({
    id: id(name),
    name,
    "aria-invalid": error(name) ? true : undefined,
    "aria-describedby": error(name) ? `${id(name)}-error` : undefined,
  });

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      {field("name", L.name, true, <input type="text" autoComplete="name" required {...aria("name")} />)}
      <div className="form__row">
        {field(
          "phone",
          L.phone,
          true,
          <input type="tel" inputMode="tel" autoComplete="tel" required {...aria("phone")} />,
        )}
        {field("email", L.email, false, <input type="email" autoComplete="email" {...aria("email")} />)}
      </div>
      <div className="form__row">
        {field("company", L.company, false, <input type="text" autoComplete="organization" {...aria("company")} />)}
        {field(
          "location",
          L.location,
          false,
          <input type="text" autoComplete="address-level2" {...aria("location")} />,
        )}
      </div>
      <div className="form__row">
        {field(
          "interest",
          L.interest,
          true,
          <select required defaultValue={defaultInterest} {...aria("interest")}>
            <option value="" disabled>
              {ui.contact.choose}
            </option>
            {INTERESTS.map((v) => (
              <option key={v} value={v}>
                {ui.contact.interests[v]}
              </option>
            ))}
          </select>,
        )}
        {field(
          "role",
          L.role,
          true,
          <select required defaultValue="" {...aria("role")}>
            <option value="" disabled>
              {ui.contact.choose}
            </option>
            {ROLES.map((v) => (
              <option key={v} value={v}>
                {ui.contact.roles[v]}
              </option>
            ))}
          </select>,
        )}
      </div>
      {field("message", L.message, false, <textarea rows={4} maxLength={1000} {...aria("message")} />)}
      <div className="field field--check" data-invalid={error("consent") ? "true" : undefined}>
        <input type="checkbox" {...aria("consent")} />
        <div>
          <label htmlFor={id("consent")}>
            {L.consent}
            <span className="hint">{ui.contact.required}</span>
          </label>
          {error("consent") && (
            <div className="field__error" id={`${id("consent")}-error`}>
              {error("consent")}
            </div>
          )}
        </div>
      </div>
      {/* Honeypot: hidden from people and assistive technology. Bots fill it. */}
      <div className="hp" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div>
        <button type="submit" className="arq-primary" disabled={phase === "sending"}>
          {phase === "sending" ? ui.contact.sending : L.submit}
          <Icon name="arrow-right" size={18} className="btn-icon" />
        </button>
      </div>
    </form>
  );
}
