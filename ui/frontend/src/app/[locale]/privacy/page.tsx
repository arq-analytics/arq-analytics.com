import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const description = "How ARQ ONE AI Labs handles the details you send in an enquiry.";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/privacy", title: `${legal.privacy.heading} | ARQ ONE AI Labs`, description });
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  return <LegalPage doc={legal.privacy} locale={locale} ui={ui} />;
}
