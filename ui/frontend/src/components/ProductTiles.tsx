import Link from "next/link";
import type { ReactNode } from "react";
import { ageingBuckets, creditAtRisk, fleetSummary, totalOf, type ReconMatch } from "@arq/backend/domain";
import { showcase } from "@/lib/content";
import { formatINR } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { dine, machines, receivables, reconciliation, twinSections } from "@/lib/mockdata";
import type { Locale, Product } from "@/lib/types";
import { Icon } from "./Icon";
import { StatusPill } from "./StatusPill";
import { TiltCard } from "./TiltCard";

/* ---------------- the front window of each tile: one detail of the product ---------------- */

function AstraGlimpse() {
  const buckets = ageingBuckets(receivables);
  const max = Math.max(...buckets.map((b) => b.total), 1);
  return (
    <>
      <div className="g-metric">
        <span className="arq-label">{showcase.astra.collect.total}</span>
        <strong>{formatINR(totalOf(receivables.map((r) => r.amount)))}</strong>
      </div>
      <div className="g-bars">
        {buckets.map((b) => (
          <div className="g-bar" key={b.key}>
            <span>{showcase.astra.collect.buckets[b.key]}</span>
            <span className="g-bar__track">
              <span
                className={`g-bar__fill g-bar__fill--${b.key}`}
                style={{ width: `${Math.max(4, (b.total / max) * 100)}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function YantraGlimpse() {
  const fleet = fleetSummary(machines);
  const c = 2 * Math.PI * 30;
  const len = (fleet.running / Math.max(fleet.total, 1)) * c;
  const D = showcase.yantra.dashboard;
  return (
    <div className="g-split">
      <div className="g-ring">
        <svg viewBox="0 0 76 76">
          <circle className="g-ring__bg" cx="38" cy="38" r="30" />
          <circle className="g-ring__fg" cx="38" cy="38" r="30" strokeDasharray={`${len} ${c}`} />
        </svg>
        <span>
          <strong>
            {fleet.running}/{fleet.total}
          </strong>
          <small>{D.running}</small>
        </span>
      </div>
      <dl className="g-facts">
        <div>
          <dt>{D.down}</dt>
          <dd>{fleet.down}</dd>
        </div>
        <div>
          <dt>{D.overdue}</dt>
          <dd>{fleet.overdue}</dd>
        </div>
        <div>
          <dt>{D.dueSoon}</dt>
          <dd>{fleet.dueSoon}</dd>
        </div>
      </dl>
    </div>
  );
}

function TwinGlimpse({ ui }: { ui: Ui }) {
  return (
    <div className="g-sections">
      {twinSections.map((s) => (
        <div key={s.name} className="g-section">
          <span className="arq-label">{s.name}</span>
          <span className="g-section__dots">
            {s.machines.map((m) => (
              <i key={m.name} data-tone={m.state === "down" ? "critical" : "healthy"} />
            ))}
          </span>
          <small>
            {s.machines.filter((m) => m.state === "running").length}/{s.machines.length}{" "}
            {ui.mockup.machineState.running}
          </small>
        </div>
      ))}
    </div>
  );
}

function DineGlimpse() {
  const L = showcase.dineastra;
  const rows: [string, number][] = [
    [L.sales, dine.day.sales],
    [L.purchases, dine.day.purchases],
    [L.wastage, dine.day.wastage],
  ];
  return (
    <dl className="g-facts g-facts--money">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{formatINR(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

const matchTone: Record<ReconMatch, string> = {
  matched: "healthy",
  supplierNotFiled: "critical",
  mismatch: "warning",
  missingIn2B: "warning",
};

function DravyaGlimpse({ ui }: { ui: Ui }) {
  const counts = new Map<ReconMatch, number>();
  for (const r of reconciliation) counts.set(r.match, (counts.get(r.match) ?? 0) + 1);
  return (
    <>
      <div className="g-metric">
        <span className="arq-label">{ui.mockup.dravya.atRisk}</span>
        <strong>{formatINR(creditAtRisk(reconciliation))}</strong>
      </div>
      <div className="g-pills">
        {[...counts].map(([match, n]) => (
          <span key={match} className="arq-status" data-tone={matchTone[match]}>
            {n} · {ui.mockup.dravya.match[match]}
          </span>
        ))}
      </div>
    </>
  );
}

/** Front window title, the glimpse, and the titles of the windows stacked behind it. */
function windowFor(product: Product, ui: Ui): { title: string; body: ReactNode; behind: string[] } {
  const planned = product.featuresNext.map((f) => f.title);
  switch (product.id) {
    case "astra": {
      const t = showcase.astra.tabs;
      return { title: t.collect, body: <AstraGlimpse />, behind: [t.sales, t.agents] };
    }
    case "yantra": {
      const t = showcase.yantra.tabs;
      return { title: t.dashboard, body: <YantraGlimpse />, behind: [t.brief, t.voice] };
    }
    case "digitalTwin":
      return { title: ui.mockup.twin.heading, body: <TwinGlimpse ui={ui} />, behind: planned.slice(0, 2) };
    case "dineastra":
      return { title: showcase.dineastra.heading, body: <DineGlimpse />, behind: planned.slice(1, 3) };
    case "dravya":
      return { title: ui.mockup.dravya.heading, body: <DravyaGlimpse ui={ui} />, behind: planned.slice(1, 3) };
    default:
      return { title: product.name, body: null, behind: [] };
  }
}

/* ---------------- the cascade of windows ---------------- */

function Cascade({
  title,
  badge,
  tone,
  behind,
  children,
}: {
  title: string;
  badge?: string;
  tone?: "healthy" | "warning";
  behind: string[];
  children: ReactNode;
}) {
  const label = badge ? `${title}, ${badge}` : title;
  return (
    <div className="cascade" role="img" aria-label={label} style={{ "--depth": behind.length } as React.CSSProperties}>
      {behind.map((t, i) => (
        <div
          key={t}
          className="cascade__win cascade__win--back"
          style={{ "--k": behind.length - i } as React.CSSProperties}
        >
          <div className="cascade__bar">
            <span className="mock__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="cascade__title">{t}</span>
          </div>
        </div>
      ))}
      <div className="cascade__win cascade__win--front">
        <div className="cascade__bar">
          <span className="mock__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="cascade__title">{title}</span>
          {badge && (
            <span className="arq-status" data-tone={tone}>
              {badge}
            </span>
          )}
        </div>
        <div className="cascade__body">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- tiles ---------------- */

interface TileProps {
  product: Product;
  locale: Locale;
  ui: Ui;
  index?: number;
}

/**
 * A product as a tile: its name, a cascade of app windows with one detail of the product
 * in front (sample data for live products, a labelled concept for the rest), a short
 * description, and a button to the product page.
 */
export function ProductTile({ product, locale, ui, index = 0 }: TileProps) {
  const card = ui.products.cards[product.id];
  const live = product.status === "live";
  const href = localePath(locale, `/products/${product.slug}`);
  const win = windowFor(product, ui);
  return (
    <TiltCard max={5}>
      <article
        className={`ptile${live ? " ptile--live" : ""}`}
        data-reveal
        aria-labelledby={`tile-${product.slug}`}
        style={{ "--i": index } as React.CSSProperties}
      >
        <div className="ptile__head">
          <span className={`ptile__planet planet--${product.id}`} aria-hidden="true" />
          <h3 className="ptile__name" id={`tile-${product.slug}`}>
            <Link href={href}>{product.name}</Link>
          </h3>
          <StatusPill status={product.status} label={ui.products.status[product.status]} />
        </div>
        <Cascade
          title={win.title}
          badge={live ? ui.common.sampleData : ui.common.conceptNotLive}
          tone={live ? "healthy" : "warning"}
          behind={win.behind}
        >
          {win.body}
        </Cascade>
        <p className="ptile__tagline">{card.tagline}</p>
        <p className="ptile__text">{card.oneLine}</p>
        <Link className="arq-outline ptile__btn" href={href}>
          {ui.common.seeDetails}
          <Icon name="arrow-right" size={16} className="btn-icon" />
        </Link>
      </article>
    </TiltCard>
  );
}

/** The last tile: custom apps, with an empty window waiting for the visitor's process. */
export function CustomAppsTile({ locale, ui, index = 0 }: { locale: Locale; ui: Ui; index?: number }) {
  const href = localePath(locale, "/custom-apps");
  return (
    <TiltCard max={5}>
      <article
        className="ptile ptile--custom"
        data-reveal
        aria-labelledby="tile-custom"
        style={{ "--i": index } as React.CSSProperties}
      >
        <div className="ptile__head">
          <span className="ptile__planet" aria-hidden="true" />
          <h3 className="ptile__name" id="tile-custom">
            <Link href={href}>{ui.nav.customApps}</Link>
          </h3>
        </div>
        <Cascade title={ui.nav.customApps} behind={[]}>
          <div className="g-blank" aria-hidden="true">
            <i />
            <i />
            <i />
            <Icon name="plus" size={22} />
          </div>
        </Cascade>
        <p className="ptile__tagline">{ui.customApps.heading}</p>
        <p className="ptile__text">{ui.customApps.text}</p>
        <Link className="arq-outline ptile__btn" href={href}>
          {ui.common.seeDetails}
          <Icon name="arrow-right" size={16} className="btn-icon" />
        </Link>
      </article>
    </TiltCard>
  );
}

export function ProductTiles({
  products,
  locale,
  ui,
  withCustom = false,
  stack = false,
}: {
  products: Product[];
  locale: Locale;
  ui: Ui;
  withCustom?: boolean;
  /** One tile per row, for a narrow column. */
  stack?: boolean;
}) {
  return (
    <div className={`ptiles${stack ? " ptiles--stack" : ""}`}>
      {products.map((p, i) => (
        <ProductTile key={p.id} product={p} locale={locale} ui={ui} index={i} />
      ))}
      {withCustom && <CustomAppsTile locale={locale} ui={ui} index={products.length} />}
    </div>
  );
}
