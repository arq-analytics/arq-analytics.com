"use client";

import { useSearchParams } from "next/navigation";
import { INTERESTS } from "@arq/backend/domain";
import { staticExport } from "@/lib/build";
import type { Ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { ContactCard } from "./ContactCard";
import { EnquiryForm } from "./EnquiryForm";

/** Reads ?product and ?intent to preselect the interest and the WhatsApp text. A static export has no endpoint, so no form. */
export function ContactView({ ui, locale }: { ui: Ui; locale: Locale }) {
  const params = useSearchParams();
  const product = params.get("product") ?? "";
  const intent = params.get("intent") ?? "";
  const known = (INTERESTS as readonly string[]).includes(product);
  const defaultInterest = known ? product : intent === "partner" ? "partner" : intent === "custom" ? "custom" : "";
  const prefillKey = known ? product : intent === "partner" ? "partner" : intent === "custom" ? "custom" : "default";
  if (staticExport) {
    return (
      <div className="contact-grid contact-grid--direct">
        <ContactCard ui={ui} locale={locale} prefillKey={prefillKey} />
      </div>
    );
  }
  return (
    <div className="contact-grid">
      <EnquiryForm ui={ui} locale={locale} defaultInterest={defaultInterest} intent={intent} />
      <ContactCard ui={ui} locale={locale} prefillKey={prefillKey} />
    </div>
  );
}
