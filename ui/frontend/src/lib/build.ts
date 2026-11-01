/**
 * True when the site is built as plain files for GitHub Pages (`npm run build:static`).
 * There is no server then: no enquiry endpoint, no redirects, and pages live in folders.
 */
export const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
