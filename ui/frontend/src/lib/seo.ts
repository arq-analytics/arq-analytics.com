import type { Metadata } from "next";
import { localePath, locales, ogLocale } from "./i18n";
import { staticExport } from "./build";
import { site } from "./content";
import type { Faq, Locale, Product } from "./types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.brand.domain).replace(/\/$/, "");
export const absoluteUrl = (path: string) => `${siteUrl}${path}`;
/** A page's absolute URL. A static export serves each page from a folder, so its URL ends in a slash. */
export const pageUrl = (path: string) => absoluteUrl(staticExport ? `${path}/` : path);
export const ogImagePath = "/og.png";

interface PageMeta {
  locale: Locale;
  /** Path without locale, for example "/products/astra". Empty for the home page. */
  path?: string;
  title: string;
  description: string;
}

/** Title, description, canonical, hreflang, Open Graph and Twitter for one page. */
export function pageMetadata({ locale, path = "", title, description }: PageMeta): Metadata {
  const url = pageUrl(localePath(locale, path));
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, pageUrl(localePath(l, path))]));
  languages["x-default"] = pageUrl(localePath("en", path));
  const image = absoluteUrl(ogImagePath);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: site.brand.name,
      type: "website",
      locale: ogLocale[locale],
      images: [{ url: image, width: 1200, height: 630, alt: site.brand.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

type JsonLdValue = Record<string, unknown>;

export function organizationLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    url: siteUrl,
    logo: absoluteUrl(ogImagePath),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.contact.phoneE164,
      email: site.contact.email,
      contactType: "sales",
      availableLanguage: ["English", "Hindi", "Marathi", "Gujarati"],
    },
    sameAs: [site.contact.linkedin],
  };
}

/** Only for live products. Never includes ratings, reviews or prices. */
export function softwareLd(product: Product, locale: Locale): JsonLdValue | null {
  if (product.status !== "live") return null;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "BusinessApplication",
    description: product.seo.description,
    url: absoluteUrl(localePath(locale, `/products/${product.slug}`)),
    publisher: { "@type": "Organization", name: site.brand.name, url: siteUrl },
  };
}

/** The visible FAQ must match these questions exactly. */
export function faqLd(faqs: Faq[]): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Serialises JSON-LD safely for a script tag. */
export const jsonLdString = (value: JsonLdValue): string => JSON.stringify(value).replace(/</g, "\\u003c");
