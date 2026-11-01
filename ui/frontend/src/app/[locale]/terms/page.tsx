import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const description = "Terms of use for the ARQ ONE AI Labs website.";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/terms", title: `${legal.terms.heading} | ARQ ONE AI Labs`, description });
}

export default async function TermsPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  return <LegalPage doc={legal.terms} locale={locale} ui={ui} />;
}
