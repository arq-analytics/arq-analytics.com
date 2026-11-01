import { site } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import { mailtoUrl, telUrl, whatsappLink } from "@/lib/links";
import type { Locale } from "@/lib/types";
import { Icon } from "./Icon";
import { TrackedLink } from "./TrackedLink";

/** WhatsApp is the primary action. Phone, email and LinkedIn come from site.json. */
export function ContactCard({ ui, locale, prefillKey }: { ui: Ui; locale: Locale; prefillKey: string }) {
  const text = site.whatsappPrefill[prefillKey] ?? site.whatsappPrefill.default;
  return (
    <aside className="contact-card" aria-label={ui.contact.cardHeading}>
      <h2 style={{ fontSize: 20 }}>{ui.contact.cardHeading}</h2>
      <TrackedLink
        className="arq-primary"
        href={whatsappLink(text)}
        event="cta_whatsapp_click"
        locale={locale}
        external
      >
        <Icon name="chat" size={18} />
        {ui.contact.labels.whatsapp}
      </TrackedLink>
      <ul>
        <li>
          <a href={telUrl(site.contact.phoneE164)}>
            <Icon name="phone" />
            <span>
              <span className="sr-only">{ui.contact.phone}: </span>
              {site.contact.phoneDisplay}
            </span>
          </a>
        </li>
        <li>
          <a href={mailtoUrl(site.contact.email)}>
            <Icon name="mail" />
            <span>
              <span className="sr-only">{ui.contact.email}: </span>
              {site.contact.email}
            </span>
          </a>
        </li>
        <li>
          <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Icon name="external-link" />
            <span>{ui.contact.linkedin}</span>
          </a>
        </li>
      </ul>
      <p className="loc">{site.brand.locationLine}</p>
    </aside>
  );
}
