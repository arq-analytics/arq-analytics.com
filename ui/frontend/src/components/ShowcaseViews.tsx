import { ageingBuckets, astraAnswer, fleetSummary, monthTotals, totalOf } from "@arq/backend/domain";
import { getProductById, showcase } from "@/lib/content";
import { fill, formatINR, formatLakh } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import {
  customerQuery,
  deadStock,
  downtimeHours,
  machines,
  months,
  msmeAlerts,
  receivables,
  supplierQuery,
  threshold,
} from "@/lib/mockdata";
import { Icon } from "./Icon";
import { StepList } from "./blocks";
import { YantraMachineList, YantraVoiceLog } from "./YantraViews";

const S = showcase;
const index = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* ---------------- ARQ Astra ---------------- */

export function AstraCollect() {
  const buckets = ageingBuckets(receivables);
  const max = Math.max(...buckets.map((b) => b.total));
  const total = totalOf(receivables.map((r) => r.amount));
  const tone = { upTo30: "green", d31to45: "", d46to60: "amber", over60: "red" } as const;
  return (
    <div className="view">
      <div className="answer arq-answer">
        <span className="arq-label">{S.astra.collect.total}</span>
        <span className="arq-metric">{formatINR(total)}</span>
      </div>
      <h3>{S.astra.collect.heading}</h3>
      <div className="bars">
        {buckets.map((b) => (
          <div className="bar-row" key={b.key}>
            <span>{S.astra.collect.buckets[b.key]}</span>
            <span className="bar-row__track" aria-hidden="true">
              <span
                className={`bar-row__fill${tone[b.key] ? ` bar-row__fill--${tone[b.key]}` : ""}`}
                style={{ width: `${(b.total / max) * 100}%` }}
              />
            </span>
            <span className="num">
              {formatINR(b.total)} · {fill(S.astra.collect.parties, { n: b.count })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AstraSales() {
  const peak = Math.max(...months.flatMap((m) => [m.sales, m.purchases, m.expenses]));
  const totals = monthTotals(months);
  const h = (v: number) => ({ height: `${(v / peak) * 100}%`, "--i": 0 }) as React.CSSProperties;
  return (
    <div className="view">
      <h3>{S.astra.sales.heading}</h3>
      <div className="cols" role="img" aria-label={S.astra.sales.heading}>
        {months.map((m, i) => (
          <div className="col" key={m.month}>
            <div className="col__bars">
              <i className="s" style={{ ...h(m.sales), "--i": i } as React.CSSProperties} />
              <i className="p" style={{ ...h(m.purchases), "--i": i } as React.CSSProperties} />
              <i className="e" style={{ ...h(m.expenses), "--i": i } as React.CSSProperties} />
            </div>
            <span>{m.month}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="s" />
          {S.astra.sales.sales}
        </span>
        <span>
          <i className="p" />
          {S.astra.sales.purchases}
        </span>
        <span>
          <i className="e" />
          {S.astra.sales.expenses}
        </span>
      </div>
      <div className="kpis">
        <div className="fact">
          <span className="arq-metric">{formatLakh(totals.sales)}</span>
          <span>{S.astra.sales.sales}</span>
        </div>
        <div className="fact">
          <span className="arq-metric">{formatLakh(totals.purchases)}</span>
          <span>{S.astra.sales.purchases}</span>
        </div>
        <div className="fact">
          <span className="arq-metric">{formatLakh(totals.expenses)}</span>
          <span>{S.astra.sales.expenses}</span>
        </div>
        <div className="fact fact--hero">
          <span className="arq-label">{S.astra.sales.totals}</span>
        </div>
      </div>
    </div>
  );
}

export function AstraAgents() {
  const answer = astraAnswer(receivables, threshold);
  const customer = receivables.find((r) => r.party === customerQuery);
  const supplier = msmeAlerts.find((s) => s.supplier === supplierQuery);
  const items = [
    fill(S.astra.agents.priorityOverdue, { count: answer.count, days: threshold, amount: formatINR(answer.total) }),
    fill(S.astra.agents.priorityMsme, {
      count: msmeAlerts.length,
      amount: formatINR(totalOf(msmeAlerts.map((a) => a.amount))),
    }),
    fill(S.astra.agents.priorityStock, {
      count: deadStock.length,
      amount: formatINR(totalOf(deadStock.map((d) => d.valueLocked))),
    }),
  ];
  return (
    <div className="view">
      <h3>{S.astra.agents.heading}</h3>
      <ul className="list-plain stagger">
        {items.map((text, i) => (
          <li key={i} className="priority" style={index(i)}>
            <Icon name="check" size={18} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <div className="grid grid--2">
        {customer && (
          <div className="fact">
            <span className="arq-label">{S.astra.agents.searchCustomer}</span>
            <strong>{customerQuery}</strong>
            <span>
              {fill(S.astra.agents.customerResult, {
                party: customer.party,
                invoice: customer.invoice,
                amount: formatINR(customer.amount),
                days: customer.daysOverdue,
              })}
            </span>
          </div>
        )}
        {supplier && (
          <div className="fact">
            <span className="arq-label">{S.astra.agents.searchSupplier}</span>
            <strong>{supplierQuery}</strong>
            <span>
              {fill(S.astra.agents.supplierResult, {
                party: supplier.supplier,
                invoice: supplier.invoice,
                amount: formatINR(supplier.amount),
                days: supplier.daysSinceInvoice,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AstraConnector() {
  const steps = getProductById("astra").steps;
  return (
    <div className="view">
      <h3>{S.astra.connector.heading}</h3>
      <StepList steps={steps} />
      <p className="cta-note">{S.astra.connector.note}</p>
    </div>
  );
}

/* ---------------- ARQ Yantra ---------------- */

export function YantraDashboard() {
  const fleet = fleetSummary(machines);
  const circumference = 2 * Math.PI * 70;
  const len = (fleet.running / fleet.total) * circumference;
  const peak = Math.max(...downtimeHours.map((d) => d.hours), 1);
  return (
    <div className="view">
      <h3>{S.yantra.dashboard.heading}</h3>
      <div className="view-split">
        <div className="ring-wrap">
          <svg
            className="ring"
            viewBox="0 0 180 180"
            aria-hidden="true"
            style={{ "--len": len } as React.CSSProperties}
          >
            <circle className="ring__bg" cx="90" cy="90" r="70" />
            <circle className="ring__fg" cx="90" cy="90" r="70" />
          </svg>
          <div className="ring-wrap__label">
            <strong>
              {fleet.running}/{fleet.total}
            </strong>
            <span>{S.yantra.dashboard.running}</span>
          </div>
        </div>
        <div className="kpis">
          <div className="fact">
            <span className="arq-metric">{fleet.total}</span>
            <span>{S.yantra.dashboard.total}</span>
          </div>
          <div className="fact">
            <span className="arq-metric">{fleet.down}</span>
            <span>{S.yantra.dashboard.down}</span>
          </div>
          <div className="fact">
            <span className="arq-metric">{fleet.overdue}</span>
            <span>{S.yantra.dashboard.overdue}</span>
          </div>
          <div className="fact">
            <span className="arq-metric">{fleet.dueSoon}</span>
            <span>{S.yantra.dashboard.dueSoon}</span>
          </div>
        </div>
      </div>
      <h3>{S.yantra.dashboard.downtimeHeading}</h3>
      <div className="bars">
        {downtimeHours.map((d) => (
          <div className="bar-row" key={d.machine}>
            <span>{d.machine}</span>
            <span className="bar-row__track" aria-hidden="true">
              <span className="bar-row__fill" style={{ width: `${(d.hours / peak) * 100}%` }} />
            </span>
            <span className="num">{fill(S.yantra.dashboard.hours, { n: d.hours })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function YantraBrief() {
  const lines: string[] = [
    ...machines
      .filter((m) => m.state === "down")
      .map((m) => fill(S.yantra.brief.down, { machine: m.name, issue: (m.lastIssue ?? "").toLowerCase() })),
    ...machines
      .filter((m) => m.nextServiceInDays < 0)
      .map((m) => fill(S.yantra.brief.overdue, { machine: m.name, n: Math.abs(m.nextServiceInDays) })),
    ...machines
      .filter((m) => m.nextServiceInDays >= 0 && m.nextServiceInDays <= 7)
      .map((m) => fill(S.yantra.brief.dueSoon, { machine: m.name, n: m.nextServiceInDays })),
  ];
  return (
    <div className="view">
      <h3>{S.yantra.brief.heading}</h3>
      <ul className="list-plain stagger">
        {(lines.length ? lines : [S.yantra.brief.allClear]).map((text, i) => (
          <li key={i} className="priority" style={index(i)}>
            <Icon name="check" size={18} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function YantraMachines({ ui }: { ui: Ui }) {
  return (
    <div className="view">
      <h3>{S.yantra.machines.heading}</h3>
      <YantraMachineList ui={ui} />
    </div>
  );
}

export function YantraVoice({ ui }: { ui: Ui }) {
  return (
    <div className="view">
      <h3>{S.yantra.voice.heading}</h3>
      <YantraVoiceLog ui={ui} />
    </div>
  );
}
