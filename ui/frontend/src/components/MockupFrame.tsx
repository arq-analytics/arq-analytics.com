import type { ReactNode } from "react";
import type { Ui } from "@/lib/i18n";

interface MockupFrameProps {
  kind: "sample" | "concept";
  title: string;
  ui: Ui;
  children: ReactNode;
  /** Remove body padding so tabs sit flush with the frame. */
  flush?: boolean;
  float?: boolean;
}

/** A device-agnostic window. The badge is required: sample data or concept, never live. */
export function MockupFrame({ kind, title, ui, children, flush, float }: MockupFrameProps) {
  const sample = kind === "sample";
  return (
    <figure className={`mock-wrap${float ? " mock-wrap--float" : ""}`} style={{ margin: 0 }}>
      <div className="mock">
        <div className="mock__bar">
          <span className="mock__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="mock__title">{title}</span>
          <span className="arq-status" data-tone={sample ? "healthy" : "warning"}>
            {sample ? ui.common.sampleData : ui.common.conceptNotLive}
          </span>
        </div>
        <div className="mock__body" style={flush ? { padding: 0 } : undefined}>
          {children}
        </div>
        <figcaption className="mock__caption">
          {sample ? ui.common.fictionalCaption : ui.common.conceptCaption}
        </figcaption>
      </div>
    </figure>
  );
}
