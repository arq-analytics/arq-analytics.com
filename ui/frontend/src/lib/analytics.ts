"use client";

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "cta_whatsapp_click"
  | "cta_trial_click"
  | "cta_early_list_click"
  | "enquiry_submitted"
  | "enquiry_failed"
  | "language_switched";

export interface AnalyticsProps {
  product?: string;
  locale?: string;
  page?: string;
}

/** Cookie-free analytics. A no-op unless NEXT_PUBLIC_ANALYTICS is "on". Never send personal data. */
export function trackEvent(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS !== "on") return;
  const clean: Record<string, string> = {};
  if (props.product) clean.product = props.product;
  if (props.locale) clean.locale = props.locale;
  if (props.page) clean.page = props.page;
  track(event, clean);
}
