"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animateWhileVisible, reducedMotionQuery } from "@/lib/canvas";

export interface SystemPlanet {
  id: string;
  name: string;
  href: string;
  status: string;
  live: boolean;
}

export interface SystemLabels {
  /** Name of the view switch, for assistive tech. */
  label: string;
  today: string;
  connected: string;
  captionToday: string;
  captionConnected: string;
  /** Shown under the core in the connected view. */
  core: string;
}

type Mode = "today" | "connected";

// orbit radius as a share of the width; the height share follows from the tilt
const ORBITS = [0.17, 0.25, 0.33, 0.41, 0.48];
const TILT = 0.36;
const SPEEDS = [0.32, 0.24, 0.18, 0.13, 0.1];
// in the connected view every planet sits on one ring and the ring turns slowly
const RING = 0.36;
const RING_SPEED = 0.05;
// how long the system is on screen before it shows where it is going, once
const AUTO_CONNECT_MS = 3800;

/**
 * The ARQ system. "Today": each product is a planet on its own orbit around the ARQ core.
 * "Where it is going": the planets settle on one ring, linked to the core and to each
 * other, with context moving along the links. The view switches once by itself after a
 * few seconds on screen, and the visitor can switch either way. Every planet is a real
 * link; motion pauses while the pointer or focus is inside. Positions are set inline on
 * the server too, so it reads fine without JavaScript.
 */
export function ProductSystem({
  planets,
  core,
  labels,
}: {
  planets: SystemPlanet[];
  core: string;
  labels: SystemLabels;
}) {
  const root = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [mode, setMode] = useState<Mode>("today");
  const modeRef = useRef<Mode>("today");
  const touched = useRef(false);
  const redraw = useRef<(() => void) | null>(null);

  const n = planets.length;
  const edges = linksFor(n);

  const choose = (next: Mode, byVisitor: boolean) => {
    if (byVisitor) touched.current = true;
    modeRef.current = next;
    setMode(next);
    redraw.current?.();
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rm = reducedMotionQuery();
    const links = linksFor(n);
    const angles = Array.from({ length: n }, (_, i) => ({ value: startAngle(i), speed: SPEEDS[i] ?? 0.1 }));
    let ring = -Math.PI / 2;
    let mix = modeRef.current === "connected" ? 1 : 0;
    let paused = false;
    let last = 0;

    const place = (t: number) => {
      const e = ease(mix);
      const pts = angles.map((a, i) => {
        const today = orbitPoint(ORBITS[i] ?? 0.48, a.value);
        const linked = orbitPoint(RING, ring + (i * Math.PI * 2) / n);
        return {
          left: today.left + (linked.left - today.left) * e,
          top: today.top + (linked.top - today.top) * e,
          s: today.s + (linked.s - today.s) * e,
        };
      });
      pts.forEach((p, i) => {
        const node = refs.current[i];
        if (!node) return;
        node.style.left = `${p.left}%`;
        node.style.top = `${p.top}%`;
        node.style.zIndex = String(p.s > 0 ? 4 : 1);
        node.style.setProperty("--depth", ((p.s + 1) / 2).toFixed(3));
      });
      const at = (k: number) => (k < 0 ? { left: 50, top: 50 } : (pts[k] ?? { left: 50, top: 50 }));
      links.forEach(([a, b], k) => {
        const line = lineRefs.current[k];
        const from = at(a);
        const to = at(b);
        if (line) {
          line.setAttribute("x1", `${from.left}%`);
          line.setAttribute("y1", `${from.top}%`);
          line.setAttribute("x2", `${to.left}%`);
          line.setAttribute("y2", `${to.top}%`);
        }
        const dot = packetRefs.current[k];
        if (dot) {
          // context moves along every link, alternating direction from link to link
          const u = (t / 1000 / (a < 0 ? 2.6 : 3.4) + k * 0.37) % 1;
          const f = k % 2 ? 1 - u : u;
          dot.setAttribute("cx", `${from.left + (to.left - from.left) * f}%`);
          dot.setAttribute("cy", `${from.top + (to.top - from.top) * f}%`);
          dot.style.opacity = String(Math.sin(u * Math.PI) * e);
        }
      });
      el.style.setProperty("--links", e.toFixed(3));
    };

    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    // show the connected view once, after the system has been on screen for a while
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (!entry?.isIntersecting || touched.current || rm?.matches) return;
        timer = window.setTimeout(() => {
          if (touched.current || modeRef.current !== "today") return;
          modeRef.current = "connected";
          setMode("connected");
        }, AUTO_CONNECT_MS);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    let stop: (() => void) | null = null;
    const start = () => {
      stop?.();
      stop = null;
      if (rm?.matches) {
        redraw.current = () => {
          mix = modeRef.current === "connected" ? 1 : 0;
          place(0);
        };
        return redraw.current();
      }
      redraw.current = null;
      stop = animateWhileVisible(el, (t) => {
        const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
        last = t;
        const target = modeRef.current === "connected" ? 1 : 0;
        mix += (target - mix) * (1 - Math.exp(-dt * 2.4));
        if (!paused) {
          const slow = 1 - ease(mix) * 0.7;
          angles.forEach((a) => (a.value += a.speed * slow * dt));
          ring += RING_SPEED * dt;
        }
        place(t);
      });
    };
    start();
    rm?.addEventListener("change", start);

    return () => {
      stop?.();
      io.disconnect();
      window.clearTimeout(timer);
      redraw.current = null;
      rm?.removeEventListener("change", start);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [n]);

  return (
    <>
      <div className="system" ref={root} data-mode={mode}>
        {ORBITS.slice(0, n).map((a, i) => (
          <span
            key={a}
            className="system__orbit"
            aria-hidden="true"
            style={{ width: `${a * 200}%`, height: `${a * 200 * TILT * 2}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <svg className="system__links" aria-hidden="true">
          {edges.map(([a], k) => (
            <line
              key={`l${k}`}
              ref={(node) => {
                lineRefs.current[k] = node;
              }}
              className={a < 0 ? "system__spoke" : "system__chord"}
              x1="50%"
              y1="50%"
              x2="50%"
              y2="50%"
            />
          ))}
          {edges.map(([a], k) => (
            <circle
              key={`p${k}`}
              ref={(node) => {
                packetRefs.current[k] = node;
              }}
              className={a < 0 ? "system__packet system__packet--core" : "system__packet"}
              r={a < 0 ? 3 : 2.2}
              cx="50%"
              cy="50%"
              style={{ opacity: 0 }}
            />
          ))}
        </svg>
        <span className="system__core" aria-hidden="true">
          <span>{core}</span>
          <small>{labels.core}</small>
        </span>
        <ul className="system__list">
          {planets.map((p, i) => {
            const pos = orbitPoint(ORBITS[i] ?? 0.48, startAngle(i));
            return (
              <li key={p.id}>
                <Link
                  ref={(node) => {
                    refs.current[i] = node;
                  }}
                  href={p.href}
                  className={`planet planet--${p.id}${p.live ? " planet--live" : ""}`}
                  style={{ left: `${pos.left}%`, top: `${pos.top}%`, zIndex: pos.s > 0 ? 4 : 1 }}
                >
                  <span className="planet__body" aria-hidden="true" />
                  <span className="planet__label">
                    <strong>{p.name}</strong>
                    <small>{p.status}</small>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="system-story">
        <div className="system-toggle" role="group" aria-label={labels.label}>
          <button type="button" aria-pressed={mode === "today"} onClick={() => choose("today", true)}>
            {labels.today}
          </button>
          <button type="button" aria-pressed={mode === "connected"} onClick={() => choose("connected", true)}>
            {labels.connected}
          </button>
        </div>
        <p className="system-caption" aria-live="polite">
          {mode === "today" ? labels.captionToday : labels.captionConnected}
        </p>
      </div>
      <p className="system-note">{labels.captionConnected}</p>
    </>
  );
}

/** Spokes from the core (-1) to every planet, then a link between every pair of planets. */
function linksFor(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) out.push([-1, i]);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}

function startAngle(i: number) {
  return 0.6 + i * 2.35;
}

function orbitPoint(radius: number, angle: number) {
  const s = Math.sin(angle);
  return { left: 50 + radius * 100 * Math.cos(angle), top: 50 + radius * 100 * TILT * 2 * s, s };
}

function ease(x: number) {
  return x * x * (3 - 2 * x);
}
