import type { Metadata } from "next";
import Link from "next/link";
import { Band, FaqList, PrincipleList, ReferenceStrip, StepList } from "@/components/blocks";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ParticleOrb } from "@/components/ParticleOrb";
import { ProductChapters } from "@/components/ProductChapters";
import { Spaceship } from "@/components/Spaceship";
import { Starfield } from "@/components/Starfield";
import { TrackedLink } from "@/components/TrackedLink";
import { getProducts, pages, site } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { contactHref, whatsappPrefillLink } from "@/lib/links";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { faqLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, title: pages.home.seo.title, description: pages.home.seo.description });
}

export default async function HomePage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  const products = getProducts();
  return (
    <>
      <JsonLd data={[faqLd(pages.home.faq)]} />
      <Hero ui={ui} locale={locale} />

      <ProductChapters products={products} locale={locale} ui={ui} />

      <Band tone="light">
        <div className="band__inner" data-reveal>
          <h2>{ui.customApps.heading}</h2>
          <p>{ui.customApps.text}</p>
          <TrackedLink className="arq-primary" href={contactHref(locale, { intent: "custom" })} locale={locale}>
            {ui.customApps.cta}
            <Icon name="arrow-right" size={18} className="btn-icon" />
          </TrackedLink>
        </div>
      </Band>

      <section className="section" aria-labelledby="how-h">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="eyebrow">01 &rarr; 03</span>
            <h2 id="how-h">{ui.how.heading}</h2>
          </div>
          <StepList steps={ui.how.steps} />
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="honest-h">
        <div className="container" lang="en">
          <div className="section-head" data-reveal>
            <span className="eyebrow">ARQ</span>
            <h2 id="honest-h">{pages.home.principlesHeading}</h2>
          </div>
          <PrincipleList items={pages.home.principles} />
        </div>
      </section>

      {site.referenceCustomer.enabled && (
        <ReferenceStrip label={site.referenceCustomer.label} name={site.referenceCustomer.name} />
      )}

      <section className="section" aria-labelledby="faq-h">
        <div className="container" lang="en">
          <div className="section-head" data-reveal>
            <h2 id="faq-h">{pages.home.faqHeading}</h2>
          </div>
          <FaqList items={pages.home.faq} />
        </div>
      </section>

      <section className="band on-ink band--launch space">
        <Starfield />
        <span className="nebula" aria-hidden="true" />
        <Spaceship path="cross" delay={1} />
        <span className="horizon horizon--top" aria-hidden="true" />
        <div className="container launch__grid">
          <div className="band__inner" data-reveal>
            <h2>{ui.finalCta.heading}</h2>
            <p>{ui.finalCta.text}</p>
            <div className="cta-pair">
              <TrackedLink
                className="arq-primary"
                href={whatsappPrefillLink("default")}
                event="cta_whatsapp_click"
                locale={locale}
                external
              >
                <Icon name="chat" size={18} />
                {ui.contact.labels.whatsapp}
              </TrackedLink>
              <TrackedLink
                className="arq-outline"
                href={contactHref(locale, { intent: "trial" })}
                event="cta_trial_click"
                locale={locale}
              >
                {ui.hero.ctaTrial}
              </TrackedLink>
            </div>
            <Link
              className="link-arrow"
              href={localePath(locale, "/products")}
              style={{ color: "var(--arq-on-ink-dim)" }}
            >
              <span>{ui.products.heading}</span>
              <Icon name="arrow-right" size={16} className="btn-icon" />
            </Link>
          </div>
          <ParticleOrb className="orb--band" shapes={["spiral"]} />
        </div>
      </section>
    </>
  );
}
