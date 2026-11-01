import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Band, Breadcrumb, EnglishOnlyNote, FaqList, FeatureList, StepList } from "@/components/blocks";
import { CtaPair } from "@/components/CtaPair";
import { JsonLd } from "@/components/JsonLd";
import { ParticleOrb } from "@/components/ParticleOrb";
import { ProductDemo } from "@/components/Showcase";
import { ProductTiles } from "@/components/ProductTiles";
import { Spaceship } from "@/components/Spaceship";
import { Starfield } from "@/components/Starfield";
import { StatusPill } from "@/components/StatusPill";
import { getProduct, getProducts, showcase } from "@/lib/content";
import { productShapes } from "@/lib/shapes";
import { fill } from "@/lib/format";
import { localePath } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { faqLd, pageMetadata, softwareLd } from "@/lib/seo";
import { site } from "@/lib/content";
import type { Locale } from "@/lib/types";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await resolveLocale(params);
  const product = getProduct(slug);
  if (!product) notFound();
  return pageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: product.seo.title,
    description: product.seo.description,
  });
}

/** A section heading in the visitor's language above English body text. */
function Heading({ locale, children }: { locale: Locale; children: string }) {
  return (
    <h2 lang={locale} style={{ fontSize: "var(--arq-h2-size)" }} data-reveal>
      {children}
    </h2>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { locale, ui } = await resolveLocale(params);
  const product = getProduct(slug);
  if (!product) notFound();

  const card = ui.products.cards[product.id];
  const live = product.status === "live";
  const related = getProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 2);
  const englishOnly = locale !== "en";

  return (
    <>
      <JsonLd data={[softwareLd(product, locale), live ? faqLd(product.faq) : null]} />

      <section className="page-hero product-hero on-ink space">
        <Starfield />
        <span className="nebula" aria-hidden="true" />
        <span className="glow glow--orange" aria-hidden="true" />
        <Spaceship path="cross" delay={4} />
        <span className="horizon" aria-hidden="true" />
        <div className="container">
          <Breadcrumb
            label={ui.common.breadcrumb}
            items={[
              { label: ui.productPage.breadcrumbProducts, href: localePath(locale, "/products") },
              { label: product.name },
            ]}
          />
          <div className="product-hero__grid">
            <div className="page-hero__grid">
              <div className="page-hero__row">
                <span className="eyebrow">{card.domain}</span>
                <StatusPill status={product.status} label={ui.products.status[product.status]} />
              </div>
              <h1>{product.name}</h1>
              <p className="tagline">{card.tagline}</p>
              <p className="lead">{card.oneLine}</p>
              <CtaPair product={product} locale={locale} ui={ui} />
            </div>
            <ParticleOrb className="orb--product" shapes={[productShapes[product.id] ?? "sphere"]} ring={live} />
          </div>
        </div>
      </section>

      <div lang={englishOnly ? "en" : undefined}>
        {product.mockup && (
          <section className="section demo-section" aria-labelledby="demo-h">
            <div className="container">
              {englishOnly && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
              <div className="section-head section-head--center" data-reveal>
                <span className="eyebrow">{product.name}</span>
                <h2 id="demo-h" lang="en">
                  {live ? showcase.demo.headingLive : showcase.demo.headingConcept}
                </h2>
                <p lang="en">{live ? showcase.demo.subLive : showcase.demo.subConcept}</p>
              </div>
              <div className="demo-stage rise" data-reveal>
                <ProductDemo product={product} ui={ui} />
              </div>
            </div>
          </section>
        )}

        <section className="section section--tint" aria-label={ui.productPage.problem}>
          <div className="container two-col">
            <div className="prose" data-reveal>
              <h2 lang={locale}>{ui.productPage.problem}</h2>
              <p>{product.problem}</p>
            </div>
            <div className="prose">
              <Heading locale={locale}>{live ? ui.productPage.whatWorks : ui.productPage.plannedScope}</Heading>
              {!live && product.plannedNote && <p className="cta-note">{product.plannedNote}</p>}
              <FeatureList items={live ? product.featuresLive : product.featuresNext} quiet={!live} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container two-col">
            <div className="prose">
              {live && product.featuresNext.length > 0 && (
                <>
                  <Heading locale={locale}>{ui.productPage.comingNext}</Heading>
                  <FeatureList items={product.featuresNext} quiet />
                </>
              )}
              {product.steps.length > 0 && (
                <>
                  <Heading locale={locale}>{ui.productPage.steps}</Heading>
                  <StepList steps={product.steps} wide />
                </>
              )}
            </div>
            <div className="prose">
              {product.worksWith.length > 0 && (
                <>
                  <Heading locale={locale}>{ui.productPage.worksWith}</Heading>
                  <ul className="chips" data-reveal>
                    {product.worksWith.map((w) => (
                      <li key={w} className="chip">
                        {w}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {product.whyNotYet && (
                <div className="note" data-reveal>
                  <strong lang={locale}>{ui.productPage.whyNotYet}</strong>
                  <span>{product.whyNotYet}</span>
                </div>
              )}
              {product.notThis && (
                <div className="note" data-reveal>
                  <strong lang={locale}>{ui.productPage.notThis}</strong>
                  <span>{product.notThis}</span>
                </div>
              )}
              {product.disclaimer && (
                <p className="cta-note" data-reveal>
                  {product.disclaimer}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="section section--tint">
          <div className="container two-col">
            <div className="prose">
              <Heading locale={locale}>{ui.productPage.faq}</Heading>
              <FaqList items={product.faq} />
            </div>
            <div className="prose">
              <Heading locale={locale}>{ui.productPage.related}</Heading>
              <ProductTiles products={related} locale={locale} ui={ui} stack />
            </div>
          </div>
        </section>
      </div>

      <Band>
        <div className="band__inner" data-reveal>
          <h2>{product.name}</h2>
          {live && <p>{fill(ui.productPage.trialFor, { days: site.trial.days })}</p>}
          <CtaPair product={product} locale={locale} ui={ui} />
        </div>
      </Band>
    </>
  );
}
