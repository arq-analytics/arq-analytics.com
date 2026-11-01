import type { Metadata } from "next";
import { Band, EnglishOnlyNote, SectionHead, StepList } from "@/components/blocks";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { TrackedLink } from "@/components/TrackedLink";
import { pages } from "@/lib/content";
import { contactHref } from "@/lib/links";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const P = pages.partners;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/partners", title: P.seo.title, description: P.seo.description });
}

export default async function PartnersPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  const englishOnly = locale !== "en";
  return (
    <div lang={englishOnly ? "en" : undefined}>
      <PageHero eyebrow={ui.nav.partners} title={P.heading} lead={P.intro} />
      <section className="section">
        <div className="container">
          {englishOnly && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
          <div style={{ marginTop: englishOnly ? 24 : 0 }}>
            <SectionHead title={P.whoHeading} />
          </div>
          <ul className="chips" data-reveal>
            {P.who.map((w) => (
              <li key={w} className="chip">
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container">
          <SectionHead title={P.howHeading} />
          <StepList steps={P.how} />
          <p className="note" style={{ marginTop: 32 }} data-reveal>
            {P.termsNote}
          </p>
        </div>
      </section>
      <Band tone="light">
        <div className="band__inner" data-reveal>
          <h2>{P.heading}</h2>
          <TrackedLink
            className="arq-primary"
            href={contactHref(locale, { intent: "partner", product: "partner" })}
            locale={locale}
          >
            {P.cta}
            <Icon name="arrow-right" size={18} className="btn-icon" />
          </TrackedLink>
        </div>
      </Band>
    </div>
  );
}
