import type { Ui } from "@/lib/i18n";
import { contactHref, whatsappPrefillLink } from "@/lib/links";
import { getProducts } from "@/lib/content";
import { productShapes } from "@/lib/shapes";
import type { Locale } from "@/lib/types";
import { HeroOrb } from "./HeroOrb";
import { Icon } from "./Icon";
import { Spaceship } from "./Spaceship";
import { Starfield } from "./Starfield";
import { TrackedLink } from "./TrackedLink";

export function ProofStrip({ items }: { items: string[] }) {
  return (
    <ul className="proof">
      {items.map((item) => (
        <li key={item} data-reveal>
          <Icon name="check" size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Splits a heading into words that rise in one after another. The last three words carry
 * the gold gradient. Screen readers read the words as one sentence.
 */
export function SplitWords({ text, gold = 3 }: { text: string; gold?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span
            className={`word${i >= words.length - gold ? " word--gold" : ""}`}
            style={{ "--w": i } as React.CSSProperties}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export function Hero({ ui, locale }: { ui: Ui; locale: Locale }) {
  const products = getProducts();
  return (
    <section className="hero on-ink space">
      <Starfield />
      <span className="nebula" aria-hidden="true" />
      <span className="glow glow--orange" aria-hidden="true" />
      <span className="glow glow--gold" aria-hidden="true" />
      <Spaceship path="rise" delay={2.5} />
      <span className="horizon" aria-hidden="true" />
      <div className="container">
        <div className="hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">{ui.hero.eyebrow}</span>
            <h1 className="hero__title">
              <SplitWords text={ui.hero.title} />
            </h1>
            <p className="hero__sub">{ui.hero.sub}</p>
            <div className="cta-pair">
              <TrackedLink
                className="arq-primary"
                href={contactHref(locale, { intent: "trial" })}
                event="cta_trial_click"
                locale={locale}
              >
                {ui.hero.ctaTrial}
                <Icon name="arrow-right" size={18} className="btn-icon" />
              </TrackedLink>
              <TrackedLink
                className="arq-outline"
                href={whatsappPrefillLink("default")}
                event="cta_whatsapp_click"
                locale={locale}
                external
              >
                <Icon name="chat" size={18} />
                {ui.hero.ctaWhatsapp}
              </TrackedLink>
            </div>
          </div>
          <div className="hero__visual">
            <HeroOrb
              label={ui.nav.products}
              items={products.map((p) => ({
                id: p.id,
                name: p.name,
                href: `#p-${p.slug}`,
                shape: productShapes[p.id] ?? "sphere",
                live: p.status === "live",
              }))}
            />
          </div>
        </div>
        <ProofStrip items={ui.proof} />
      </div>
    </section>
  );
}
