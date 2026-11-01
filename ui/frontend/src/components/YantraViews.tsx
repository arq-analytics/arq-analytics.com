import { fill } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import { machines, voiceLog } from "@/lib/mockdata";

function ServiceText({ days, ui }: { days: number; ui: Ui }) {
  const overdue = days < 0;
  return (
    <span className="arq-status" data-tone={overdue ? "critical" : days <= 7 ? "warning" : "healthy"}>
      {overdue ? fill(ui.mockup.service.overdue, { n: Math.abs(days) }) : fill(ui.mockup.service.dueIn, { n: days })}
    </span>
  );
}

/** Machine rows: state pill, last issue, and service due in text (overdue is never colour alone). */
export function YantraMachineList({ ui }: { ui: Ui }) {
  return (
    <ul className="machines stagger">
      {machines.map((m, i) => (
        <li key={m.id} className="machine" style={{ "--i": i } as React.CSSProperties}>
          <span>
            <strong>{m.name}</strong>
            <small>{m.lastIssue ?? ui.mockup.noIssue}</small>
          </span>
          <span className="arq-status" data-tone={m.state === "down" ? "critical" : "healthy"}>
            {ui.mockup.machineState[m.state]}
          </span>
          <ServiceText days={m.nextServiceInDays} ui={ui} />
        </li>
      ))}
    </ul>
  );
}

/** Three voice entries in Hindi, Marathi and Gujarati, each beside the fields ARQ recorded. */
export function YantraVoiceLog({ ui }: { ui: Ui }) {
  return (
    <ul className="voice stagger">
      {voiceLog.map((v, i) => (
        <li key={v.lang} className="voice__item" style={{ "--i": i } as React.CSSProperties}>
          <div>
            <span className="voice__tag">
              {ui.mockup.voice.said} · {ui.mockup.voice.languages[v.lang]}
            </span>
            <p className="voice__quote" lang={v.lang}>
              {v.transcript}
            </p>
          </div>
          <span className="voice__arrow" aria-hidden="true">
            &rarr;
          </span>
          <div>
            <span className="voice__tag">{ui.mockup.voice.recorded}</span>
            <dl>
              <dt>{ui.mockup.voice.machine}</dt>
              <dd>{v.parsed.machine}</dd>
              <dt>{ui.mockup.voice.issue}</dt>
              <dd>{v.parsed.issue}</dd>
              <dt>{ui.mockup.voice.stoppedAt}</dt>
              <dd className="num">{v.parsed.stoppedAt}</dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
