import type { Metadata } from "next";
import { Band, EnglishOnlyNote, PrincipleList, SectionHead, StepList } from "@/components/blocks";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { TrackedLink } from "@/components/TrackedLink";
import { pages } from "@/lib/content";
import { contactHref } from "@/lib/links";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const C = pages.customApps;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/custom-apps", title: C.seo.title, description: C.seo.description });
}

export default async function CustomAppsPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  const englishOnly = locale !== "en";
  return (
    <div lang={englishOnly ? "en" : undefined}>
      <PageHero eyebrow={ui.nav.customApps} title={C.heading} lead={C.intro} />
      <section className="section">
        <div className="container">
          {englishOnly && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
          <div style={{ marginTop: englishOnly ? 24 : 0 }}>
            <SectionHead title={C.patternsHeading} />
          </div>
          <PrincipleList items={C.patterns} />
        </div>
      </section>
      <section className="section section--tint">
        <div className="container">
          <SectionHead title={C.processHeading} />
          <StepList steps={C.process} wide />
          <p className="note" style={{ marginTop: 32 }} data-reveal>
            {C.honestNote}
          </p>
        </div>
      </section>
      <Band tone="light">
        <div className="band__inner" data-reveal>
          <h2>{C.heading}</h2>
          <TrackedLink
            className="arq-primary"
            href={contactHref(locale, { intent: "custom", product: "custom" })}
            locale={locale}
          >
            {C.cta}
            <Icon name="arrow-right" size={18} className="btn-icon" />
          </TrackedLink>
        </div>
      </Band>
    </div>
  );
}
