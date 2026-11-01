import type { Metadata } from "next";
import { Band, EnglishOnlyNote, PrincipleList, SectionHead } from "@/components/blocks";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { TrackedLink } from "@/components/TrackedLink";
import { pages } from "@/lib/content";
import { contactHref } from "@/lib/links";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const A = pages.about;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/about", title: A.seo.title, description: A.seo.description });
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  const englishOnly = locale !== "en";
  return (
    <div lang={englishOnly ? "en" : undefined}>
      <PageHero eyebrow={ui.nav.about} title={A.heading} />
      <section className="section">
        <div className="container">
          {englishOnly && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
          <div className="prose" style={{ marginTop: englishOnly ? 24 : 0 }}>
            {A.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container">
          <SectionHead title={A.principlesHeading} />
          <PrincipleList items={A.principles} />
        </div>
      </section>
      <Band tone="light">
        <div className="band__inner" data-reveal>
          <h2>{ui.finalCta.heading}</h2>
          <p>{ui.finalCta.text}</p>
          <TrackedLink className="arq-primary" href={contactHref(locale)} locale={locale}>
            {ui.nav.contact}
            <Icon name="arrow-right" size={18} className="btn-icon" />
          </TrackedLink>
        </div>
      </Band>
    </div>
  );
}
