import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/content";
import { localePath, locales } from "@/lib/i18n";
import { pageUrl } from "@/lib/seo";

/** Built once, so it also works as a plain file in the static export. */
export const dynamic = "force-static";

const staticPaths = ["", "/products", "/custom-apps", "/partners", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...getProducts().map((p) => `/products/${p.slug}`)];
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: pageUrl(localePath(locale, path)),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, pageUrl(localePath(l, path))])),
      },
    })),
  );
}
