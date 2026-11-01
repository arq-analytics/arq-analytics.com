"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { locales, localeNames, switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { Icon } from "./Icon";

export interface NavItem {
  href: string;
  label: string;
}

/** Main navigation links. The current page is marked with aria-current. */
export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Plain links, so it works without JavaScript. Keeps the current page. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  return (
    <details className="lang">
      <summary aria-label={label}>
        <Icon name="globe" size={18} />
        <span>{localeNames[locale]}</span>
        <Icon name="chevron" size={16} />
      </summary>
      <ul>
        {locales.map((l) => (
          <li key={l}>
            <a
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => trackEvent("language_switched", { locale: l, page: pathname })}
            >
              {localeNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

interface MobileNavProps {
  items: NavItem[];
  locale: Locale;
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  languageLabel: string;
}

/** Full-width sheet below 900px. Focus is trapped while open and Escape closes it. */
export function MobileNav({
  items,
  locale,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
  navLabel,
  languageLabel,
}: MobileNavProps) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const sheet = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    sheet.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpenAt(null);
    button.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab" || !sheet.current) return;
    const focusable = [button.current, ...sheet.current.querySelectorAll<HTMLElement>("a[href]")].filter(
      (el): el is HTMLElement => !!el,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  return (
    <div onKeyDown={onKeyDown} style={{ display: "contents" }}>
      <button
        ref={button}
        type="button"
        className="icon-btn menu-btn"
        aria-expanded={open}
        aria-controls="mobile-sheet"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpenAt(open ? null : pathname)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open && (
        <div
          id="mobile-sheet"
          ref={sheet}
          className="mobile-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={navLabel}
        >
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <Link href={ctaHref} className="arq-primary">
            {ctaLabel}
          </Link>
          <div className="mobile-sheet__langs" role="group" aria-label={languageLabel}>
            {locales.map((l) => (
              <a
                key={l}
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? "true" : undefined}
              >
                {localeNames[l]}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Reveals [data-reveal] elements as they scroll into view, including after client navigation. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
