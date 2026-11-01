import Link from "next/link";
import { resolveCta } from "@arq/backend/domain";
import { pages, site } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { contactHref } from "@/lib/links";
import type { Locale, Product } from "@/lib/types";
import { StatusPill } from "./StatusPill";

/** A real table, stacked under 700px with data-label on each cell. */
export function ComparisonTable({ products, locale, ui }: { products: Product[]; locale: Locale; ui: Ui }) {
  const [colProduct, colFor, colStatus, colTry] = pages.productsPage.compareColumns;
  return (
    <table className="compare">
      <caption className="sr-only">{pages.productsPage.compareHeading}</caption>
      <thead>
        <tr>
          <th scope="col">{colProduct}</th>
          <th scope="col">{colFor}</th>
          <th scope="col">{colStatus}</th>
          <th scope="col">{colTry}</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          const cta = resolveCta(p, site.trial.products);
          return (
            <tr key={p.id}>
              <th scope="row">
                <Link href={localePath(locale, `/products/${p.slug}`)}>{p.name}</Link>
              </th>
              <td data-label={colFor}>{p.audience}</td>
              <td data-label={colStatus}>
                <StatusPill status={p.status} label={ui.products.status[p.status]} />
              </td>
              <td data-label={colTry}>
                <Link className="link-arrow" href={contactHref(locale, { product: p.id, intent: cta.intent })}>
                  <span>{ui.products.cta[cta.labelKey]}</span>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
