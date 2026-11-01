import { describe, expect, it } from "vitest";
import enUi from "../../../../content/en/ui.json";
import { deepMerge, getUi, isLocale, localePath, switchLocalePath } from "./i18n";

describe("getUi", () => {
  it("returns English as is", () => {
    expect(getUi("en")).toBe(enUi);
  });

  it("uses the translated string when the locale has one", () => {
    expect(getUi("hi").nav.contact).not.toBe(enUi.nav.contact);
    expect(getUi("hi").meta.htmlLang).toBe("hi");
  });

  it("falls back to English for a key the locale does not have", () => {
    // common.menu was added in English only and awaits native translation.
    expect(getUi("gu").common.menu).toBe(enUi.common.menu);
    expect(getUi("mr").contact.errors.phone).toBe(enUi.contact.errors.phone);
  });

  it("never returns an undefined string for any English key", () => {
    for (const locale of ["hi", "mr", "gu"] as const) {
      const ui = getUi(locale);
      expect(typeof ui.hero.title).toBe("string");
      expect(ui.products.cards.dravya.tagline.length).toBeGreaterThan(0);
      expect(ui.how.steps).toHaveLength(enUi.how.steps.length);
    }
  });
});

describe("deepMerge", () => {
  it("merges nested objects and ignores comment keys", () => {
    expect(deepMerge({ a: { b: "x", c: "y" } }, { a: { b: "z" }, _status: "draft" })).toEqual({
      a: { b: "z", c: "y" },
    });
  });

  it("replaces arrays instead of merging them", () => {
    expect(deepMerge({ list: ["a", "b"] }, { list: ["c"] })).toEqual({ list: ["c"] });
  });
});

describe("localePath", () => {
  it("prefixes the locale", () => {
    expect(localePath("hi", "/products")).toBe("/hi/products");
    expect(localePath("mr", "products")).toBe("/mr/products");
  });

  it("is the locale root for an empty path or a slash", () => {
    expect(localePath("gu")).toBe("/gu");
    expect(localePath("en", "/")).toBe("/en");
  });
});

describe("switchLocalePath", () => {
  it("keeps the current page in the new locale", () => {
    expect(switchLocalePath("/en/products/astra", "gu")).toBe("/gu/products/astra");
    expect(switchLocalePath("/hi/contact", "en")).toBe("/en/contact");
  });

  it("goes to the new locale home from a locale root", () => {
    expect(switchLocalePath("/en", "mr")).toBe("/mr");
  });
});

describe("isLocale", () => {
  it("accepts the four locales only", () => {
    expect(["en", "hi", "mr", "gu"].every(isLocale)).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
