import path from "node:path";
import type { NextConfig } from "next";

const preview = process.env.VERCEL_ENV === "preview";
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Served by `next start`: clean URLs, real redirects and headers. */
const server: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      { source: "/index.html", destination: "/en", permanent: true },
      { source: "/portfolio-details.html", destination: "/en/products", permanent: true },
    ];
  },
  async headers() {
    // Preview deployments must not be indexed.
    return preview ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }] : [];
  },
};

/**
 * Plain files for GitHub Pages: each page is a folder with an index.html, and images are served as they are
 * (there is no server to resize them). scripts/build-static.mjs writes the redirect pages.
 */
const files: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

const config: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  turbopack: { root: path.join(import.meta.dirname, "../..") },
  ...(staticExport ? files : server),
};

export default config;
