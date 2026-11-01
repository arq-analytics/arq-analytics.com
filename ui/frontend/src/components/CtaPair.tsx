import { resolveCta } from "@arq/backend/domain";
import { site } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import { contactHref, whatsappPrefillLink } from "@/lib/links";
import type { Locale, Product } from "@/lib/types";
import { Icon } from "./Icon";
import { TrackedLink } from "./TrackedLink";

interface CtaPairProps {
  product: Pick<Product, "id" | "status">;
  locale: Locale;
  ui: Ui;
  /** Show only the primary button (used on cards). */
  primaryOnly?: boolean;
}

/** Primary CTA from the domain resolver, plus WhatsApp. A non-live product never gets a trial. */
export function CtaPair({ product, locale, ui, primaryOnly }: CtaPairProps) {
  const cta = resolveCta(product, site.trial.products);
  const event =
    cta.kind === "trial" ? "cta_trial_click" : cta.kind === "earlyList" ? "cta_early_list_click" : undefined;
  const primaryClass = primaryOnly && cta.kind !== "trial" ? "arq-outline" : "arq-primary";
  return (
    <div className="cta-block" data-cta={cta.kind}>
      <div className="cta-pair">
        <TrackedLink
          className={primaryClass}
          href={contactHref(locale, { product: cta.product, intent: cta.intent })}
          event={event}
          product={product.id}
          locale={locale}
        >
          {ui.products.cta[cta.labelKey]}
          <Icon name="arrow-right" size={18} className="btn-icon" />
        </TrackedLink>
        {!primaryOnly && (
          <TrackedLink
            className="arq-outline"
            href={whatsappPrefillLink(product.id)}
            event="cta_whatsapp_click"
            product={product.id}
            locale={locale}
            external
          >
            <Icon name="chat" size={18} />
            {ui.contact.labels.whatsapp}
          </TrackedLink>
        )}
      </div>
      {cta.showTrialNote && <p className="cta-note">{ui.products.trialNote}</p>}
    </div>
  );
}
