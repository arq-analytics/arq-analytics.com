import { describe, expect, it } from "vitest";
import { site } from "./content";
import { contactHref, mailtoUrl, telUrl, whatsappLink, whatsappPrefillLink } from "./links";

describe("whatsappLink", () => {
  it("uses the official number from site.json", () => {
    expect(whatsappLink()).toBe(`https://wa.me/${site.contact.whatsappNumber}`);
  });

  it("encodes the message", () => {
    expect(whatsappLink("Hi & bye")).toContain("?text=Hi%20%26%20bye");
  });

  it("uses the prefilled text for a product and falls back to the default", () => {
    expect(decodeURIComponent(whatsappPrefillLink("astra"))).toContain(site.whatsappPrefill.astra);
    expect(decodeURIComponent(whatsappPrefillLink("unknown-key"))).toContain(site.whatsappPrefill.default);
  });
});

describe("contactHref", () => {
  it("preselects product and intent", () => {
    expect(contactHref("en", { product: "astra", intent: "trial" })).toBe("/en/contact?product=astra&intent=trial");
  });

  it("has no query string when nothing is preselected", () => {
    expect(contactHref("gu")).toBe("/gu/contact");
  });
});

describe("tel and mailto", () => {
  it("build from site.json values", () => {
    expect(telUrl(site.contact.phoneE164)).toBe(`tel:${site.contact.phoneE164}`);
    expect(mailtoUrl(site.contact.email)).toBe(`mailto:${site.contact.email}`);
  });
});
