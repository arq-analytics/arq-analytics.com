"use client";

import { useEffect, useRef, useState } from "react";

export interface ChapterNavItem {
  id: string;
  name: string;
  planet: string;
}

/** A sticky row of product links over the chapters. The chapter in view is marked current. */
export function ChapterNav({ items, label }: { items: ChapterNavItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const bar = useRef<HTMLDivElement>(null);
  const key = items.map((i) => i.id).join(",");

  // On a narrow screen the bar scrolls sideways: keep the current product in view.
  // Only the bar moves; scrollIntoView would also scroll the page.
  useEffect(() => {
    const el = bar.current;
    const link = el?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!el || !link || el.scrollWidth <= el.clientWidth) return;
    const left = link.offsetLeft - (el.clientWidth - link.offsetWidth) / 2;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  useEffect(() => {
    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return (
    <nav className="chapter-nav" aria-label={label}>
      <div className="chapter-nav__inner" ref={bar}>
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="chapter-nav__link"
            aria-current={active === it.id ? "true" : undefined}
          >
            <span className={`chapter-nav__dot planet--${it.planet}`} aria-hidden="true" />
            {it.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
