# Translation reviewer prompt

Use for `content/hi/ui.json`, `content/mr/ui.json`, `content/gu/ui.json`. A native speaker has the final say; this prompt prepares the review and does not replace it.

Read `docs/specs/003-content-contract.md` (writing rules, point 9) and `docs/specs/002-design-system.md` (Indic typography).

For each key, compare with `content/en/ui.json` and report only real problems:

1. Meaning drift: the sentence says something different from English, especially about product status (live, in development, planned), trial length, and what is a draft.
2. Tone: too formal or too casual for a factory owner. The reader is addressed respectfully.
3. Mixed script: product names and terms (ARQ, Tally, TallyPrime, GST, GSTR-2B, MSME, WhatsApp) stay in Latin script.
4. Length: strings that are much longer than English and would break a button or card.
5. Punctuation: sentence-ending full stop style appropriate to the language, no em dashes.
6. Numerals: 14 stays as the Latin numeral 14 in this site for consistency across locales.

Output a table: key, current text, problem, suggested text. End with a one-line verdict per locale: ready, ready after the listed fixes, or needs a native rewrite.
