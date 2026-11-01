import Link from "next/link";
import { showcase } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { EnglishOnlyNote } from "./blocks";
import { ChapterNav } from "./ChapterNav";
import { CtaPair } from "./CtaPair";
import { Icon } from "./Icon";
import { ProductDemo } from "./Showcase";
import { StatusPill } from "./StatusPill";

/**
 * The products on the home page, one chapter each: what it is on one side, and a window
 * showing what it does on the other. Live products play through their real tabs on sample
 * data; the others show a labelled concept. Sides alternate down the page.
 */
export function ProductChapters({ products, locale, ui }: { products: Product[]; locale: Locale; ui: Ui }) {
  return (
    <section className="chapters" id="products" aria-labelledby="products-h">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">{ui.nav.products}</span>
          <h2 id="products-h">{ui.products.heading}</h2>
          <p>{ui.products.sub}</p>
        </div>
        {locale !== "en" && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
      </div>

      <ChapterNav
        label={showcase.demo.chaptersLabel}
        items={products.map((p) => ({
          id: `p-${p.slug}`,
          name: p.name.replace(/^ARQ\s+/, ""),
          planet: p.id,
        }))}
      />

      {products.map((p, i) => {
        const card = ui.products.cards[p.id];
        const live = p.status === "live";
        const features = (live ? p.featuresLive : p.featuresNext).slice(0, 3);
        const href = localePath(locale, `/products/${p.slug}`);
        return (
          <article
            key={p.id}
            id={`p-${p.slug}`}
            className={`chapter${i % 2 ? " chapter--flip" : ""}`}
            aria-labelledby={`p-${p.slug}-h`}
          >
            <div className="container chapter__grid">
              <div className="chapter__copy" data-reveal>
                <div className="chapter__meta">
                  <span className={`chapter__planet planet--${p.id}${live ? " is-live" : ""}`} aria-hidden="true" />
                  <span className="chapter__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="arq-label">{card.domain}</span>
                  <StatusPill status={p.status} label={ui.products.status[p.status]} />
                </div>
                <h3 id={`p-${p.slug}-h`} className="chapter__name">
                  <Link href={href}>{p.name}</Link>
                </h3>
                <p className="chapter__tagline">{card.tagline}</p>
                <p className="chapter__text">{card.oneLine}</p>
                {features.length > 0 && (
                  <ul className={`chapter__features${live ? "" : " chapter__features--planned"}`} lang="en">
                    {features.map((f) => (
                      <li key={f.title}>
                        <Icon name="check" size={16} />
                        <span>
                          <strong>{f.title}.</strong> {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="chapter__actions">
                  <CtaPair product={p} locale={locale} ui={ui} />
                  <Link className="link-arrow" href={href}>
                    <span>{ui.common.seeDetails}</span>
                    <Icon name="arrow-right" size={16} className="btn-icon" />
                  </Link>
                </div>
              </div>
              <div className="chapter__demo rise" data-reveal>
                <ProductDemo product={p} ui={ui} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
