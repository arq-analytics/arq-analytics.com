"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Keeps the header in step with the page under it: dark while it sits over a space band
 * (any `.on-ink` section or the footer), light over the content sections. It sets
 * `data-tone` on the header; the colours are in marketing.css. Renders nothing visible.
 */
export function HeaderTone() {
  const anchor = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = anchor.current?.closest<HTMLElement>(".site-header");
    if (!header) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      // probe just below the header, so a section starting right under it counts
      const line = header.getBoundingClientRect().bottom + 2;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("main .on-ink, .site-footer")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < line && r.bottom > line;
      });
      header.dataset.tone = dark ? "dark" : "light";
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

  return <span ref={anchor} hidden />;
}
