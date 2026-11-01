import type { Status } from "./types.ts";

export type CtaKind = "trial" | "earlyList" | "learnMore";
export type CtaIntent = "trial" | "earlyList" | "enquiry";

export interface ResolvedCta {
  kind: CtaKind;
  /** Key under `ui.products.cta`. */
  labelKey: CtaKind;
  intent: CtaIntent;
  product: string;
  /** True only when the trial note must be shown under the button. */
  showTrialNote: boolean;
}

/**
 * The one place that decides which call to action a product gets.
 * A product that is not live never resolves to a trial.
 */
export function resolveCta(product: { id: string; status: Status }, trialProducts: readonly string[]): ResolvedCta {
  if (product.status !== "live") {
    return { kind: "earlyList", labelKey: "earlyList", intent: "earlyList", product: product.id, showTrialNote: false };
  }
  if (trialProducts.includes(product.id)) {
    return { kind: "trial", labelKey: "trial", intent: "trial", product: product.id, showTrialNote: true };
  }
  return { kind: "learnMore", labelKey: "learnMore", intent: "enquiry", product: product.id, showTrialNote: false };
}
