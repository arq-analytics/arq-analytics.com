import { creditAtRisk } from "@arq/backend/domain";
import { showcase } from "@/lib/content";
import { fill, formatINR } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import { dine, reconciliation, twinSections } from "@/lib/mockdata";

export function TwinConcept({ ui }: { ui: Ui }) {
  return (
    <div className="view">
      <h3>{ui.mockup.twin.heading}</h3>
      <div className="twin stagger">
        {twinSections.map((s, i) => (
          <section key={s.name} className="twin__col" style={{ "--i": i } as React.CSSProperties} aria-label={s.name}>
            <span className="arq-label">{s.name}</span>
            {s.machines.map((m) => (
              <div key={m.name} className="tile">
                <span>{m.name}</span>
                <span className="arq-status" data-tone={m.state === "down" ? "critical" : "healthy"}>
                  {ui.mockup.machineState[m.state]}
                </span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

const matchTone = {
  matched: "healthy",
  supplierNotFiled: "critical",
  mismatch: "warning",
  missingIn2B: "warning",
} as const;

export function DravyaConcept({ ui }: { ui: Ui }) {
  const atRisk = creditAtRisk(reconciliation);
  return (
    <div className="view">
      <h3>{ui.mockup.dravya.heading}</h3>
      <div className="arq-table-wrap">
        <table className="arq-table">
          <caption className="sr-only">{ui.mockup.dravya.heading}</caption>
          <thead>
            <tr>
              <th scope="col">{ui.mockup.dravya.table.supplier}</th>
              <th scope="col">{ui.mockup.dravya.table.invoice}</th>
              <th scope="col" className="num">
                {ui.mockup.dravya.table.credit}
              </th>
              <th scope="col">{ui.mockup.dravya.table.match}</th>
            </tr>
          </thead>
          <tbody>
            {reconciliation.map((r) => (
              <tr key={r.invoice}>
                <td>{r.supplier}</td>
                <td>{r.invoice}</td>
                <td className="num">{formatINR(r.itc)}</td>
                <td>
                  <span className="arq-status" data-tone={matchTone[r.match]}>
                    {ui.mockup.dravya.match[r.match]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="recon-total">
        <span className="arq-label">{ui.mockup.dravya.atRisk}</span>
        <span className="arq-metric">{formatINR(atRisk)}</span>
      </div>
    </div>
  );
}

/** DineAstra is planned: a concept of the owner's end-of-day view, on fictional numbers. */
export function DineAstraConcept() {
  const T = showcase.dineastra;
  const due = (days: number) =>
    days < 0
      ? { tone: "critical" as const, text: fill(T.overdue, { n: -days }) }
      : days === 0
        ? { tone: "warning" as const, text: T.dueToday }
        : { tone: "neutral" as const, text: fill(T.dueIn, { n: days }) };
  return (
    <div className="view" lang="en">
      <h3>
        {T.heading} <span className="view__sub">{dine.outlet}</span>
      </h3>
      <div className="facts stagger">
        <div className="fact fact--hero" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="arq-metric num">{formatINR(dine.day.sales)}</span>
          <span>{T.sales}</span>
        </div>
        <div className="fact" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="arq-metric num">{formatINR(dine.day.purchases)}</span>
          <span>{T.purchases}</span>
        </div>
        <div className="fact" style={{ "--i": 2 } as React.CSSProperties}>
          <span className="arq-metric num">{formatINR(dine.day.wastage)}</span>
          <span>{T.wastage}</span>
        </div>
      </div>
      <div className="dine">
        <section className="dine__col" aria-label={T.wastageHeading}>
          <span className="arq-label">{T.wastageHeading}</span>
          {dine.wastage.map((w) => (
            <div key={w.item} className="tile">
              <span>
                {w.item} <small className="tile__meta">{w.qty}</small>
              </span>
              <span className="num">{formatINR(w.value)}</span>
            </div>
          ))}
        </section>
        <section className="dine__col" aria-label={T.duesHeading}>
          <span className="arq-label">{T.duesHeading}</span>
          {dine.vendorDues.map((v) => {
            const d = due(v.dueInDays);
            return (
              <div key={v.vendor} className="tile tile--stack">
                <span>{v.vendor}</span>
                <span className="tile__row">
                  <span className="num">{formatINR(v.amount)}</span>
                  <span className="arq-status" data-tone={d.tone}>
                    {d.text}
                  </span>
                </span>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
