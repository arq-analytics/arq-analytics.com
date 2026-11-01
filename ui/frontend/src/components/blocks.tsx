import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Faq, Step, TitledText } from "@/lib/types";
import { Icon } from "./Icon";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export function SectionHead({
  eyebrow,
  title,
  sub,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="section-head" data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag>{title}</Tag>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function StepList({ steps, wide }: { steps: Step[]; wide?: boolean }) {
  return (
    <ol className={`steps${wide ? " steps--wide" : ""}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="step" data-reveal style={delay(i)}>
          <span className="step__n" aria-hidden="true" />
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function PrincipleList({ items }: { items: TitledText[] }) {
  return (
    <ul className="grid grid--2">
      {items.map((p, i) => (
        <li key={p.title} className="principle" data-reveal style={delay(i)}>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Native details and summary, no JavaScript needed. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} data-reveal style={delay(i)}>
          <summary>{f.q}</summary>
          <p className="faq__a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function ReferenceStrip({ label, name }: { label: string; name: string }) {
  return (
    <div className="ref-strip" data-reveal>
      <span className="arq-label">{label}</span>
      <strong>{name}</strong>
    </div>
  );
}

export function FeatureList({ items, quiet }: { items: TitledText[]; quiet?: boolean }) {
  return (
    <ul className={`feature-list${quiet ? " feature-list--quiet" : ""}`}>
      {items.map((f, i) => (
        <li key={f.title} data-reveal style={delay(i)}>
          <Icon name="check" size={20} />
          <div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Breadcrumb({ label, items }: { label: string; items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label={label} className="breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** An English-only block inside a translated page. */
export function EnglishOnlyNote({ text }: { text: string }) {
  return (
    <p className="english-only" role="note">
      {text}
    </p>
  );
}

export function Band({
  children,
  tone = "ink",
  center,
}: {
  children: ReactNode;
  tone?: "ink" | "light";
  center?: boolean;
}) {
  return (
    <section className={`band ${tone === "ink" ? "on-ink" : "band--light"}${center ? " band--center" : ""}`}>
      <div className="container">{children}</div>
    </section>
  );
}
