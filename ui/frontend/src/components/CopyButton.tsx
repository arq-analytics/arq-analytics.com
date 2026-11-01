"use client";

import { useState } from "react";

/** Copies a draft to the clipboard. The text is a draft: the visitor sends it themselves. */
export function CopyButton({ text, label, doneLabel }: { text: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
      {done ? doneLabel : label}
    </button>
  );
}
