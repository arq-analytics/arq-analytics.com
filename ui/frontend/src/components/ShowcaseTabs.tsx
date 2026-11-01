"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./Icon";

export interface TabDef {
  id: string;
  label: string;
  panel: ReactNode;
}

export interface AppDef {
  id: string;
  name: string;
  tabs: TabDef[];
}

export interface AutoplayOptions {
  /** Milliseconds each tab stays before the next one. */
  interval: number;
  pauseLabel: string;
  playLabel: string;
}

interface ShowcaseTabsProps {
  apps: AppDef[];
  switchLabel: string;
  tabsLabel: string;
  /** Plays through the tabs like a demo. Pauses on hover or focus, stops for good once
   * the visitor picks a tab, and never runs under reduced motion (the progress bar that
   * drives it is not animated there). */
  autoplay?: AutoplayOptions;
}

/** Tabs for the app views. Panels are rendered on the server; this only switches which is visible. */
export function ShowcaseTabs({ apps, switchLabel, tabsLabel, autoplay }: ShowcaseTabsProps) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const [appId, setAppId] = useState(apps[0]?.id ?? "");
  const [tabByApp, setTabByApp] = useState<Record<string, string>>(
    Object.fromEntries(apps.map((a) => [a.id, a.tabs[0]?.id ?? ""])),
  );
  const [playing, setPlaying] = useState(Boolean(autoplay));
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = root.current;
    if (!el || !autoplay) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay]);

  const app = apps.find((a) => a.id === appId) ?? apps[0];
  if (!app) return null;
  const activeTab = tabByApp[app.id];
  const running = Boolean(autoplay) && playing && inView && !held;

  function select(tabId: string, focus = true) {
    setTabByApp((prev) => ({ ...prev, [app!.id]: tabId }));
    if (focus) tabRefs.current[`${app!.id}:${tabId}`]?.focus();
  }

  function advance() {
    const i = app!.tabs.findIndex((t) => t.id === activeTab);
    const next = app!.tabs[(i + 1) % app!.tabs.length];
    if (next) select(next.id, false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = app!.tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setPlaying(false);
    const target = app!.tabs[next];
    if (target) select(target.id);
  }

  return (
    <div
      ref={root}
      className="showcase"
      data-running={running ? "true" : "false"}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {apps.length > 1 && (
        <div className="showcase__switch" role="group" aria-label={switchLabel} style={{ margin: "14px 14px 0" }}>
          {apps.map((a) => (
            <button key={a.id} type="button" aria-pressed={a.id === app.id} onClick={() => setAppId(a.id)}>
              {a.name}
            </button>
          ))}
        </div>
      )}
      <div className="tabs-bar">
        <div className="tabs" role="tablist" aria-label={`${app.name}: ${tabsLabel}`}>
          {app.tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[`${app.id}:${t.id}`] = el;
              }}
              type="button"
              role="tab"
              className="tab"
              id={`${uid}-${app.id}-${t.id}-tab`}
              aria-selected={t.id === activeTab}
              aria-controls={`${uid}-${app.id}-${t.id}-panel`}
              tabIndex={t.id === activeTab ? 0 : -1}
              onClick={() => {
                setPlaying(false);
                select(t.id);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
              {autoplay && playing && t.id === activeTab && (
                <span
                  className="tab__progress"
                  aria-hidden="true"
                  style={{ animationDuration: `${autoplay.interval}ms` }}
                  onAnimationEnd={advance}
                />
              )}
            </button>
          ))}
        </div>
        {autoplay && (
          <button
            type="button"
            className="demo-toggle"
            aria-label={playing ? autoplay.pauseLabel : autoplay.playLabel}
            title={playing ? autoplay.pauseLabel : autoplay.playLabel}
            onClick={() => setPlaying((p) => !p)}
          >
            <Icon name={playing ? "pause" : "play"} size={16} />
          </button>
        )}
      </div>
      {apps.map((a) =>
        a.tabs.map((t) => (
          <div
            key={`${a.id}:${t.id}`}
            role="tabpanel"
            className="tabpanel"
            id={`${uid}-${a.id}-${t.id}-panel`}
            aria-labelledby={`${uid}-${a.id}-${t.id}-tab`}
            hidden={!(a.id === app.id && t.id === activeTab)}
          >
            {t.panel}
          </div>
        )),
      )}
    </div>
  );
}
