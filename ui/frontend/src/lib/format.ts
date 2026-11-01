const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Indian digit grouping with the rupee sign. The one place amounts are formatted. */
export function formatINR(amount: number): string {
  return `₹${inr.format(Math.round(amount))}`;
}

/** Short lakh form for chart labels, for example 31.1 L. */
export function formatLakh(amount: number): string {
  return `₹${(amount / 100000).toFixed(1)} L`;
}

/** Fills {name} placeholders in a content string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}
