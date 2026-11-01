import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCard } from "@/components/ContactCard";
import { ContactView } from "@/components/ContactView";
import { PageHero } from "@/components/PageHero";
import { staticExport } from "@/lib/build";
import { pages } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const seo = pages.contactPage.seo;
  return pageMetadata({ locale, path: "/contact", title: seo.title, description: seo.description });
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  return (
    <>
      <PageHero
        eyebrow={ui.nav.contact}
        title={ui.contact.heading}
        lead={staticExport ? ui.contact.subDirect : ui.contact.sub}
      />
      <section className="section">
        <div className="container">
          {/* The fallback is the static contact card, so WhatsApp works before scripts load or without them. */}
          <Suspense
            fallback={
              <div className={staticExport ? "contact-grid contact-grid--direct" : "contact-grid"}>
                {!staticExport && <div />}
                <ContactCard ui={ui} locale={locale} prefillKey="default" />
              </div>
            }
          >
            <ContactView ui={ui} locale={locale} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
