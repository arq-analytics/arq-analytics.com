import Link from "next/link";
import type { Ui } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { contactHref } from "@/lib/links";
import type { Locale } from "@/lib/types";
import { Lockup } from "./Lockup";
import { HeaderTone } from "./HeaderTone";
import { LanguageSwitcher, MobileNav, NavLinks, type NavItem } from "./NavControls";

export function SiteHeader({ locale, ui }: { locale: Locale; ui: Ui }) {
  const items: NavItem[] = [
    { href: localePath(locale, "/products"), label: ui.nav.products },
    { href: localePath(locale, "/custom-apps"), label: ui.nav.customApps },
    { href: localePath(locale, "/partners"), label: ui.nav.partners },
    { href: localePath(locale, "/about"), label: ui.nav.about },
    { href: localePath(locale, "/contact"), label: ui.nav.contact },
  ];
  const trialHref = contactHref(locale, { intent: "trial" });
  return (
    <header className="site-header" data-tone="dark">
      <div className="site-header__inner">
        <Link href={localePath(locale)} className="lockup" aria-label={ui.common.home}>
          <Lockup label={ui.hero.eyebrow} priority />
        </Link>
        <NavLinks items={items} label={ui.common.mainNav} />
        <div className="site-header__tools">
          <LanguageSwitcher locale={locale} label={ui.common.language} />
          <Link href={trialHref} className="arq-primary site-header__cta">
            {ui.nav.trial}
          </Link>
          <MobileNav
            items={items}
            locale={locale}
            ctaHref={trialHref}
            ctaLabel={ui.nav.trial}
            openLabel={ui.common.openMenu}
            closeLabel={ui.common.closeMenu}
            navLabel={ui.common.menu}
            languageLabel={ui.common.language}
          />
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <HeaderTone />
    </header>
  );
}
