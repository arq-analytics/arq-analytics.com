import { mailtoUrl, telUrl, whatsappUrl } from "@arq/backend/domain";
import { localePath } from "./i18n";
import { site } from "./content";
import type { Locale } from "./types";

export { mailtoUrl, telUrl, whatsappUrl };

/** WhatsApp link for the official number. The number comes from site.json only. */
export const whatsappLink = (text?: string) => whatsappUrl(site.contact.whatsappNumber, text);

/** WhatsApp link using the prefilled message for a product or intent key. */
export function whatsappPrefillLink(key: string): string {
  return whatsappLink(site.whatsappPrefill[key] ?? site.whatsappPrefill.default);
}

/** Contact page link with the product and intent preselected. */
export function contactHref(locale: Locale, params: { product?: string; intent?: string } = {}): string {
  const query = new URLSearchParams();
  if (params.product) query.set("product", params.product);
  if (params.intent) query.set("intent", params.intent);
  const qs = query.toString();
  return `${localePath(locale, "/contact")}${qs ? `?${qs}` : ""}`;
}
