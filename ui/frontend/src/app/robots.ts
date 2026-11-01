import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Built once, so it also works as a plain file in the static export. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
