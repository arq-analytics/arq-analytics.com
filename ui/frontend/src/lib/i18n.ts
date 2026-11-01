import enUi from "../../../../content/en/ui.json";
import hiUi from "../../../../content/hi/ui.json";
import mrUi from "../../../../content/mr/ui.json";
import guUi from "../../../../content/gu/ui.json";
import type { Locale } from "./types";

export const locales: readonly Locale[] = ["en", "hi", "mr", "gu"];
export const defaultLocale: Locale = "en";

export type Ui = typeof enUi;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const files: Record<Locale, DeepPartial<Ui>> = {
  en: enUi,
  hi: hiUi as DeepPartial<Ui>,
  mr: mrUi as DeepPartial<Ui>,
  gu: guUi as DeepPartial<Ui>,
};

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Deep merge of a locale over English, so a missing key falls back to English. */
export function deepMerge<T>(base: T, over: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(over)) return (over === undefined ? base : over) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(over)) {
    if (key.startsWith("_")) continue;
    out[key] = key in base ? deepMerge((base as Record<string, unknown>)[key], value) : value;
  }
  return out as T;
}

export function getUi(locale: Locale): Ui {
  return locale === "en" ? enUi : deepMerge(enUi, files[locale]);
}

/** Path with a locale prefix. `localePath("hi", "/products")` is `/hi/products`; an empty path is the home. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  if (!clean) return `/${locale}`;
  return `/${locale}${clean.startsWith("/") ? clean : `/${clean}`}`;
}

/** The same page in another locale. Keeps the rest of the path and the query string. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  const tail = first && isLocale(first) ? rest : first ? [first, ...rest] : [];
  return localePath(to, tail.length ? `/${tail.join("/")}` : "");
}

export const localeNames: Record<Locale, string> = {
  en: enUi.meta.nativeName,
  hi: hiUi.meta.nativeName,
  mr: mrUi.meta.nativeName,
  gu: guUi.meta.nativeName,
};

export const ogLocale: Record<Locale, string> = { en: "en_IN", hi: "hi_IN", mr: "mr_IN", gu: "gu_IN" };
