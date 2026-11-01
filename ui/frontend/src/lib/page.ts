import { notFound } from "next/navigation";
import { getUi, isLocale, type Ui } from "./i18n";
import type { Locale } from "./types";

export interface LocaleParams {
  params: Promise<{ locale: string }>;
}

/** Validates the [locale] segment and returns the locale with its UI strings. */
export async function resolveLocale(params: LocaleParams["params"]): Promise<{ locale: Locale; ui: Ui }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, ui: getUi(locale) };
}
