import type { ReactNode } from "react";
import { Starfield } from "./Starfield";

/** Ink header band for long-form pages. The copy is English, so it is marked lang en. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero on-ink space">
      <Starfield density={0.8} />
      <span className="nebula" aria-hidden="true" />
      <span className="glow glow--orange" aria-hidden="true" />
      <span className="horizon" aria-hidden="true" />
      <div className="container">
        <div className="page-hero__grid">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="plain">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
