import type { Metadata } from "next";
import { Band, EnglishOnlyNote, SectionHead } from "@/components/blocks";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Icon } from "@/components/Icon";
import { ProductSystem } from "@/components/ProductSystem";
import { ProductTiles } from "@/components/ProductTiles";
import { Starfield } from "@/components/Starfield";
import { TrackedLink } from "@/components/TrackedLink";
import { getProducts, pages, site } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { contactHref } from "@/lib/links";
import { resolveLocale, type LocaleParams } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";

const P = pages.productsPage;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/products", title: P.seo.title, description: P.seo.description });
}

export default async function ProductsPage({ params }: LocaleParams) {
  const { locale, ui } = await resolveLocale(params);
  const products = getProducts();
  return (
    <>
      <section className="page-hero page-hero--system on-ink space">
        <Starfield />
        <span className="nebula" aria-hidden="true" />
        <span className="glow glow--orange" aria-hidden="true" />
        <span className="horizon" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__grid" lang="en">
            <span className="eyebrow">{ui.nav.products}</span>
            <h1 className="plain">{P.heading}</h1>
            <p className="lead">{P.sub}</p>
          </div>
          <ProductSystem
            core={site.brand.name.split(" ")[0] ?? "ARQ"}
            planets={products.map((p) => ({
              id: p.id,
              name: p.name,
              href: localePath(locale, `/products/${p.slug}`),
              status: ui.products.status[p.status],
              live: p.status === "live",
            }))}
            labels={P.system}
          />
        </div>
      </section>

      <section className="section" aria-labelledby="tiles-h">
        <div className="container">
          {locale !== "en" && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
          <div className="section-head section-head--center" data-reveal lang="en">
            <h2 id="tiles-h">{P.tilesHeading}</h2>
            <p>{P.tilesSub}</p>
          </div>
          <ProductTiles products={products} locale={locale} ui={ui} withCustom />
        </div>
      </section>

      <section className="section section--tint" aria-label={P.compareHeading}>
        <div className="container" lang="en">
          <SectionHead title={P.compareHeading} />
          <div data-reveal>
            <ComparisonTable products={products} locale={locale} ui={ui} />
          </div>
        </div>
      </section>

      <Band tone="light">
        <div className="band__inner" data-reveal>
          <h2>{ui.finalCta.heading}</h2>
          <p>{ui.finalCta.text}</p>
          <TrackedLink className="arq-primary" href={contactHref(locale)} locale={locale}>
            {ui.nav.contact}
            <Icon name="arrow-right" size={18} className="btn-icon" />
          </TrackedLink>
        </div>
      </Band>
    </>
  );
}
