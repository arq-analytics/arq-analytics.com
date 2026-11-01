import { astraAnswer } from "@arq/backend/domain";
import { fill, formatINR } from "@/lib/format";
import type { Ui } from "@/lib/i18n";
import { question, receivables, reminderDraft, threshold } from "@/lib/mockdata";
import { CopyButton } from "./CopyButton";

/** The answer-first panel: the question, three key facts, three rows, and a draft reminder. */
export function AstraAnswerPanel({ ui }: { ui: Ui }) {
  const answer = astraAnswer(receivables, threshold);
  const rows = answer.rows.slice(0, 3);
  return (
    <div className="answer arq-answer">
      <div className="answer__q">
        <span className="arq-label">{ui.mockup.question}</span>
        <strong>{question}</strong>
      </div>
      <div className="facts stagger">
        <div className="fact" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="arq-metric">{answer.count}</span>
          <span>{fill(ui.mockup.facts.parties, { days: threshold })}</span>
        </div>
        <div className="fact fact--hero" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="arq-metric">{formatINR(answer.total)}</span>
          <span>{ui.mockup.facts.overdue}</span>
        </div>
        <div className="fact" style={{ "--i": 2 } as React.CSSProperties}>
          <span className="arq-metric">{fill(ui.mockup.days, { n: answer.oldestDays })}</span>
          <span>{ui.mockup.facts.oldest}</span>
        </div>
      </div>
      <div className="arq-table-wrap">
        <table className="arq-table">
          <caption className="sr-only">{question}</caption>
          <thead>
            <tr>
              <th scope="col">{ui.mockup.table.party}</th>
              <th scope="col">{ui.mockup.table.invoice}</th>
              <th scope="col" className="num">
                {ui.mockup.table.amount}
              </th>
              <th scope="col" className="num">
                {ui.mockup.table.daysOverdue}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.invoice}>
                <td>{r.party}</td>
                <td>{r.invoice}</td>
                <td className="num">{formatINR(r.amount)}</td>
                <td className="num">{r.daysOverdue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="draft">
        <div className="draft__head">
          <span className="arq-label">{ui.mockup.reminder.title}</span>
          <CopyButton text={reminderDraft} label={ui.common.copy} doneLabel={ui.common.copied} />
        </div>
        <p>{reminderDraft}</p>
        <p className="cta-note">{ui.mockup.reminder.note}</p>
      </div>
    </div>
  );
}
