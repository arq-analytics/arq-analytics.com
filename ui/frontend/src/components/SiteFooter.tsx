import Link from "next/link";
import { getProducts, site } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import { localePath, locales, localeNames } from "@/lib/i18n";
import { mailtoUrl, telUrl } from "@/lib/links";
import type { Locale } from "@/lib/types";
import { Lockup } from "./Lockup";

export function SiteFooter({ locale, ui }: { locale: Locale; ui: Ui }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <Link href={localePath(locale)} className="lockup" aria-label={ui.common.home}>
              <Lockup label={ui.hero.eyebrow} surface="dark" />
            </Link>
            <p className="site-footer__tagline">{ui.footer.tagline}</p>
            <p className="site-footer__loc">{site.brand.locationLine}</p>
          </div>
          <nav aria-label={ui.nav.products}>
            <h2>{ui.nav.products}</h2>
            <ul>
              {getProducts().map((p) => (
                <li key={p.id}>
                  <Link href={localePath(locale, `/products/${p.slug}`)}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={ui.footer.company}>
            <h2>{ui.footer.company}</h2>
            <ul>
              <li>
                <Link href={localePath(locale, "/custom-apps")}>{ui.nav.customApps}</Link>
              </li>
              <li>
                <Link href={localePath(locale, "/partners")}>{ui.nav.partners}</Link>
              </li>
              <li>
                <Link href={localePath(locale, "/about")}>{ui.nav.about}</Link>
              </li>
              <li>
                <Link href={localePath(locale, "/privacy")}>{ui.footer.privacy}</Link>
              </li>
              <li>
                <Link href={localePath(locale, "/terms")}>{ui.footer.terms}</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2>{ui.footer.contactHeading}</h2>
            <ul>
              <li>
                <a href={telUrl(site.contact.phoneE164)}>{site.contact.phoneDisplay}</a>
              </li>
              <li>
                <a href={mailtoUrl(site.contact.email)}>{site.contact.email}</a>
              </li>
              <li>
                <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  {ui.contact.linkedin}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__base">
          <span>
            &copy; {year} {site.brand.name}. {ui.footer.rights}
          </span>
          <nav aria-label={ui.footer.language}>
            <ul style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {locales.map((l) => (
                <li key={l}>
                  <a href={localePath(l)} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                    {localeNames[l]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
