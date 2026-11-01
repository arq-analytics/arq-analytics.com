/**
 * Small helpers shared by the canvas effects (starfield, particle orb).
 * Colours are read from CSS variables so the palette stays in the stylesheets.
 */

export interface Palette {
  white: string;
  gold: string;
  accent: string;
}

/** Reads the space colours from the tokens in theme.css and marketing.css. */
export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    white: v("--arq-ink-text", "white"),
    gold: v("--arq-gold-bright", "gold"),
    accent: v("--arq-accent", "orange"),
  };
}

export function reducedMotionQuery(): MediaQueryList | null {
  return typeof window !== "undefined" && "matchMedia" in window
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
}

/** Sizes a canvas to its CSS box at a capped device pixel ratio. Returns the CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, dpr };
}

/**
 * Runs `frame` on every animation frame while the element is on screen and the tab is
 * visible. Returns a cleanup function.
 */
export function animateWhileVisible(el: Element, frame: (time: number) => void): () => void {
  let raf = 0;
  let onScreen = false;
  const loop = (t: number) => {
    frame(t);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const run = onScreen && document.visibilityState === "visible";
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
      sync();
    },
    { rootMargin: "80px" },
  );
  io.observe(el);
  document.addEventListener("visibilitychange", sync);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
}

/** A critically damped style spring step for a single value. */
export function springStep(s: { x: number; v: number }, target: number, dt: number, stiffness = 60, damping = 12) {
  const a = -stiffness * (s.x - target) - damping * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}
