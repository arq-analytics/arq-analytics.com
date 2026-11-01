import { EnglishOnlyNote } from "./blocks";
import { PageHero } from "./PageHero";
import { legal } from "@/lib/content";
import type { Ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface LegalDoc {
  heading: string;
  sections: { title: string; text: string }[];
}

/** The review-status line is shown only outside production builds. */
const showStatus =
  process.env.VERCEL_ENV === "preview" ||
  (process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production");

export function LegalPage({ doc, locale, ui }: { doc: LegalDoc; locale: Locale; ui: Ui }) {
  const englishOnly = locale !== "en";
  return (
    <div lang={englishOnly ? "en" : undefined}>
      <PageHero title={doc.heading} />
      <section className="section">
        <div className="container">
          {englishOnly && <EnglishOnlyNote text={ui.common.englishOnlyNote} />}
          {showStatus && (
            <p className="legal-meta" role="note" style={{ marginTop: 16 }}>
              {ui.common.previewDraftLabel}: {legal.reviewStatus}
            </p>
          )}
          <div className="prose" style={{ marginTop: 24 }}>
            {doc.sections.map((s) => (
              <section key={s.title} data-reveal>
                <h2 style={{ fontSize: 22, color: "var(--arq-text-primary)" }}>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
