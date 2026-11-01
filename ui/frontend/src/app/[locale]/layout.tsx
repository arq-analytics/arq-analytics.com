import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import "@/styles/theme.css";
import "@/styles/marketing.css";
import "@/styles/space.css";
import { JsonLd } from "@/components/JsonLd";
import { RevealObserver } from "@/components/NavControls";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";
import { devanagari, gujarati, manrope } from "@/lib/fonts";
import { locales } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { organizationLd, siteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: site.brand.name,
};

/**
 * Runs before first paint. Marks the page as scripted so reveal animations can start
 * hidden. If scripts stall, everything is shown after four seconds.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");setTimeout(function(){d.classList.add("reveal-all")},4000)})();`;

export default async function LocaleLayout({ children, params }: { children: ReactNode } & LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  return (
    <html
      lang={ui.meta.htmlLang}
      dir={ui.meta.dir}
      className={`${manrope.variable} ${devanagari.variable} ${gujarati.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {ui.common.skipToContent}
        </a>
        <SiteHeader locale={locale} ui={ui} />
        <main id="main">{children}</main>
        <SiteFooter locale={locale} ui={ui} />
        <JsonLd data={[organizationLd()]} />
        <RevealObserver />
        {process.env.NEXT_PUBLIC_ANALYTICS === "on" && <Analytics />}
      </body>
    </html>
  );
}
