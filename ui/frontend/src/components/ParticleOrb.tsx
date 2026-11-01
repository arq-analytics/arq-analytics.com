"use client";

import { useEffect, useRef, useState } from "react";
import { animateWhileVisible, fitCanvas, readPalette, reducedMotionQuery, springStep } from "@/lib/canvas";

export type OrbShape = "sphere" | "torus" | "helix" | "cube" | "spiral";

interface ParticleOrbProps {
  /** One shape is static. Several shapes morph in turn, and a click moves to the next. */
  shapes: OrbShape[];
  /** Optional caption for each shape, shown under the orb. Decorative. */
  labels?: string[];
  /** Milliseconds between morphs. */
  interval?: number;
  /** A tilted ring of gold particles with three moons, echoing the ARQ orbit. */
  ring?: boolean;
  className?: string;
  /** Controlled shape index. Changing it morphs the orb to that shape. */
  index?: number;
  /** Called when the orb moves to another shape by itself (auto morph or a tap). */
  onIndexChange?: (index: number) => void;
  /** Holds the auto morph, for example while a visitor points at a product chip. */
  paused?: boolean;
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const R2A = 0.7548776662466927;
const R2B = 0.5698402909980532;
const frac = (n: number) => n - Math.floor(n);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

type Vec = [number, number, number];

interface Particle {
  cur: Vec;
  from: Vec;
  to: Vec;
  spread: Vec;
  delay: number;
  phase: number;
  ox: number;
  oy: number;
  tone: 0 | 1 | 2;
}

function rotX([x, y, z]: Vec, a: number): Vec {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function rotY([x, y, z]: Vec, a: number): Vec {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

/** Points on a shape of roughly unit radius. */
function shapePoint(shape: OrbShape, i: number, n: number): Vec {
  switch (shape) {
    case "sphere": {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(1 - y * y);
      const t = i * GOLDEN;
      return [Math.cos(t) * r, y, Math.sin(t) * r];
    }
    case "torus": {
      const u = 2 * Math.PI * frac(0.5 + R2A * i);
      const v = 2 * Math.PI * frac(0.5 + R2B * i);
      const big = 0.74;
      const tube = 0.3;
      const p: Vec = [
        (big + tube * Math.cos(v)) * Math.cos(u),
        tube * Math.sin(v),
        (big + tube * Math.cos(v)) * Math.sin(u),
      ];
      return rotX(p, 1.05);
    }
    case "helix": {
      const strandCount = Math.floor(n * 0.78);
      if (i < strandCount) {
        const strand = i % 2;
        const t = Math.floor(i / 2) / (strandCount / 2);
        const a = t * Math.PI * 2 * 2.4 + strand * Math.PI;
        return [Math.cos(a) * 0.5 + gauss() * 0.03, (t - 0.5) * 2.1, Math.sin(a) * 0.5 + gauss() * 0.03];
      }
      const rungs = 20;
      const k = i % rungs;
      const t = (k + 0.5) / rungs;
      const a = t * Math.PI * 2 * 2.4;
      const f = Math.random() * 2 - 1;
      return [Math.cos(a) * 0.5 * f, (t - 0.5) * 2.1, Math.sin(a) * 0.5 * f];
    }
    case "cube": {
      const s = 0.68;
      const u = frac(0.5 + R2A * i) * 2 - 1;
      const v = frac(0.5 + R2B * i) * 2 - 1;
      let p: Vec;
      if (i % 3 === 0) {
        // edges
        const edge = i % 12;
        const t = u;
        const a = edge & 1 ? 1 : -1;
        const b = edge & 2 ? 1 : -1;
        const axis = Math.floor(edge / 4) % 3;
        p = axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t];
      } else {
        const face = i % 6;
        const sign = face < 3 ? 1 : -1;
        const axis = face % 3;
        p = axis === 0 ? [sign, u, v] : axis === 1 ? [u, sign, v] : [u, v, sign];
      }
      return rotY(rotX([p[0] * s, p[1] * s, p[2] * s], 0.62), 0.78);
    }
    case "spiral": {
      if (i % 7 === 0) {
        const y = 1 - (2 * (i + 0.5)) / n;
        const r = Math.sqrt(1 - y * y);
        const t = i * GOLDEN;
        return rotX([Math.cos(t) * r * 0.2, y * 0.13, Math.sin(t) * r * 0.2], 1.1);
      }
      const arm = i % 3;
      const r = 0.12 + 1.0 * Math.sqrt(Math.random());
      const a = (arm * Math.PI * 2) / 3 + r * 3.3 + (gauss() * 0.32) / (r + 0.35);
      return rotX([Math.cos(a) * r, gauss() * 0.05 * (1.2 - r), Math.sin(a) * r], 1.1);
    }
  }
}

/**
 * An interactive particle orb drawn on a canvas. Particles fly in, the orb breathes,
 * tilts toward the pointer, can be dragged and thrown to spin, scatters around the
 * cursor, and morphs between shapes. Decorative: hidden from assistive technology.
 * Under reduced motion it draws one still frame.
 */
export function ParticleOrb({
  shapes,
  labels,
  interval = 7000,
  ring = false,
  className = "",
  index,
  onIndexChange,
  paused = false,
}: ParticleOrbProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const shapeKey = shapes.join(",");
  const onChangeRef = useRef(onIndexChange);
  const pausedRef = useRef(paused);
  const goToRef = useRef<((i: number) => void) | null>(null);

  useEffect(() => {
    onChangeRef.current = onIndexChange;
    pausedRef.current = paused;
  });

  useEffect(() => {
    if (index !== undefined) goToRef.current?.(index);
  }, [index]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const list = shapeKey.split(",") as OrbShape[];
    const shapeAt = (i: number): OrbShape => list[i % list.length] ?? "sphere";

    const palette = readPalette(canvas);
    const tones: [string, string, string] = [palette.accent, palette.gold, palette.white];
    const rm = reducedMotionQuery();
    let size = fitCanvas(canvas);
    const small = size.w < 420;
    const n = small ? 640 : 1100;
    const ringN = ring ? (small ? 160 : 280) : 0;

    // one object per particle; tone 0 orange, 1 gold, 2 white
    const parts: Particle[] = Array.from({ length: n }, (_, i) => ({
      cur: [0, 0, 0],
      from: [0, 0, 0],
      to: [0, 0, 0],
      spread: [0, 0, 0],
      delay: 0,
      phase: Math.random() * Math.PI * 2,
      ox: 0,
      oy: 0,
      tone: i < n * 0.56 ? 0 : i < n * 0.9 ? 1 : 2,
    }));
    const ringParts = Array.from({ length: ringN }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 1.55 + Math.abs(gauss()) * 0.32,
      y: gauss() * 0.03,
    }));

    let current = 0;
    let morphStart = 0;
    let morphing = false;

    const setTargets = (shape: OrbShape, scatter: boolean) => {
      parts.forEach((p, i) => {
        p.to = shapePoint(shape, i, n);
        if (scatter) {
          const d = 2.4 + Math.random() * 1.6;
          const t = Math.random() * Math.PI * 2;
          const y = Math.random() * 2 - 1;
          const r = Math.sqrt(1 - y * y);
          p.from = [Math.cos(t) * r * d, y * d, Math.sin(t) * r * d];
        } else {
          p.from = [...p.cur];
        }
        p.delay = Math.random() * 0.45;
        p.spread = [gauss() * 0.45, gauss() * 0.45, gauss() * 0.45];
      });
      morphing = true;
      // the clock starts on the next drawn frame, so an orb that mounts off screen
      // still plays its fly-in when it scrolls into view
      morphStart = -1;
    };

    // motion state
    let yaw = 0.4;
    let spin = 0;
    const tiltX = { x: 0, v: 0 };
    const tiltY = { x: 0, v: 0 };
    const scale = { x: 1, v: 0 };
    let dragPitch = 0;
    let ringRot = 0;
    const pointer = { nx: 0, ny: 0, cx: -9999, cy: -9999, inside: false };
    const drag = { on: false, lastX: 0, lastY: 0, vel: 0 };
    let last = 0;
    let lastMorph = performance.now();

    const radius = () => Math.min(size.w, size.h) * (ring ? 0.27 : 0.36);

    const draw = (time: number, still: boolean) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0.016;
      last = time;
      const R = radius();
      const cx = size.w / 2;
      const cy = size.h / 2;
      const D = 3.4;

      if (!still) {
        spin *= Math.exp(-dt * 1.4);
        yaw += (0.16 + spin) * dt;
        ringRot += 0.22 * dt;
        springStep(tiltX, pointer.ny * 0.32 + dragPitch, dt, 40, 10);
        springStep(tiltY, pointer.nx * 0.4, dt, 40, 10);
        springStep(scale, pointer.inside ? 1.06 : 1, dt, 90, 9);
        dragPitch *= Math.exp(-dt * 0.8);
        if (pausedRef.current) lastMorph = time;
        if (list.length > 1 && !drag.on && time - lastMorph > interval) {
          lastMorph = time;
          current = (current + 1) % list.length;
          setTargets(shapeAt(current), false);
          announce(current);
        }
      }

      if (morphStart < 0) {
        morphStart = time;
        lastMorph = time;
      }
      const morphT = (time - morphStart) / 1000;

      ctx.clearRect(0, 0, size.w, size.h);
      ctx.globalCompositeOperation = "lighter";

      // core glow
      const glowR = R * 1.25 * scale.x;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g.addColorStop(0, palette.accent);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = g;
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);

      const cosY = Math.cos(yaw + tiltY.x);
      const sinY = Math.sin(yaw + tiltY.x);
      const cosX = Math.cos(tiltX.x + 0.18);
      const sinX = Math.sin(tiltX.x + 0.18);
      const unit = R / 220;
      const repel = 70;

      let tone = -1;
      for (const p of parts) {
        const { cur, from, to, spread } = p;
        if (morphing || still) {
          const local = still ? 1 : Math.min(1, Math.max(0, (morphT - p.delay) / 1.3));
          const e = 1 - (1 - local) ** 3;
          const bulge = still ? 0 : Math.sin(local * Math.PI);
          cur[0] = from[0] + (to[0] - from[0]) * e + spread[0] * bulge;
          cur[1] = from[1] + (to[1] - from[1]) * e + spread[1] * bulge;
          cur[2] = from[2] + (to[2] - from[2]) * e + spread[2] * bulge;
        }
        const wave = still ? 1 : 1 + 0.035 * Math.sin(time * 0.0016 + p.phase * 2 + cur[1] * 4);
        const s = wave * scale.x;
        const x = cur[0] * s;
        const y = cur[1] * s;
        const z0 = cur[2] * s;
        // yaw, then pitch
        const x1 = x * cosY + z0 * sinY;
        const z1 = -x * sinY + z0 * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z = y * sinX + z1 * cosX;
        const persp = D / (D - z);
        let px = cx + x1 * R * persp;
        let py = cy + y1 * R * persp;

        // scatter around the cursor
        let tx = 0;
        let ty = 0;
        if (pointer.inside && !still) {
          const dx = px - pointer.cx;
          const dy = py - pointer.cy;
          const d = Math.hypot(dx, dy);
          if (d < repel && d > 0.01) {
            const push = (1 - d / repel) ** 2 * 28;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
          }
        }
        p.ox += (tx - p.ox) * 0.12;
        p.oy += (ty - p.oy) * 0.12;
        px += p.ox;
        py += p.oy;

        if (p.tone !== tone) {
          tone = p.tone;
          ctx.fillStyle = tones[p.tone];
        }
        const depth = (z + 1.3) / 2.6;
        ctx.globalAlpha = Math.max(0.08, Math.min(1, 0.12 + depth * 0.88)) * (p.tone === 2 ? 0.9 : 0.8);
        const r = Math.max(0.5, (p.tone === 2 ? 1.5 : 1.15) * persp * unit * 1.6);
        if (r < 1.2) ctx.fillRect(px - r, py - r, r * 2, r * 2);
        else {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (morphing && morphT > 2.2) morphing = false;

      if (ringN) {
        ctx.fillStyle = palette.gold;
        const ringTilt = 1.18 + tiltX.x * 0.6;
        const cR = Math.cos(ringTilt);
        const sR = Math.sin(ringTilt);
        const roll = -0.32 + tiltY.x * 0.3;
        const cZ = Math.cos(roll);
        const sZ = Math.sin(roll);
        const drawRingPoint = (a: number, rr: number, yy: number, size: number, alpha: number) => {
          const x0 = Math.cos(a) * rr;
          const z0 = Math.sin(a) * rr;
          const y1 = yy * cR - z0 * sR;
          const z1 = yy * sR + z0 * cR;
          const x2 = x0 * cZ - y1 * sZ;
          const y2 = x0 * sZ + y1 * cZ;
          const persp = D / (D - z1 * 0.6);
          const px = cx + x2 * R * persp;
          const py = cy + y2 * R * persp;
          const behind = z1 < 0 && Math.hypot(px - cx, py - cy) < R * 0.98 * scale.x;
          ctx.globalAlpha = alpha * (behind ? 0.12 : 0.35 + ((z1 + 2) / 4) * 0.65);
          ctx.beginPath();
          ctx.arc(px, py, size * persp, 0, Math.PI * 2);
          ctx.fill();
          return { px, py, behind };
        };
        for (const rp of ringParts) drawRingPoint(rp.a + ringRot * (1.9 / rp.r), rp.r, rp.y, unit * 1.6, 0.75);
        // moons
        for (let m = 0; m < 3; m++) {
          ctx.fillStyle = m === 0 ? palette.white : palette.accent;
          const p = drawRingPoint(ringRot * 1.15 + (m * Math.PI * 2) / 3, 1.72, 0, unit * 4.2, 1);
          if (!p.behind) {
            ctx.globalAlpha = 0.18;
            ctx.beginPath();
            ctx.arc(p.px, p.py, unit * 12, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    function announce(i: number) {
      setShapeIndex(i);
      onChangeRef.current?.(i);
    }

    const settleStill = () => {
      parts.forEach((p, i) => {
        p.to = shapePoint(shapeAt(current), i, n);
        p.from = p.to;
        p.spread = [0, 0, 0];
      });
      draw(performance.now(), true);
    };

    goToRef.current = (i: number) => {
      const target = ((i % list.length) + list.length) % list.length;
      if (target === current) return;
      current = target;
      setShapeIndex(current);
      if (rm?.matches) return settleStill();
      setTargets(shapeAt(current), false);
      lastMorph = performance.now();
      scale.v += 1.4;
    };

    let stop: (() => void) | null = null;
    const start = () => {
      stop?.();
      stop = null;
      if (rm?.matches) {
        settleStill();
      } else {
        setTargets(shapeAt(current), true);
        lastMorph = performance.now();
        stop = animateWhileVisible(canvas, (t) => draw(t, false));
      }
    };
    start();

    const ro = new ResizeObserver(() => {
      size = fitCanvas(canvas);
      if (rm?.matches) draw(performance.now(), true);
    });
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pointer.nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      pointer.ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
      pointer.cx = e.clientX - rect.left;
      pointer.cy = e.clientY - rect.top;
      pointer.inside = Math.hypot(pointer.cx - rect.width / 2, pointer.cy - rect.height / 2) < radius() * 1.5;
      if (drag.on) {
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        yaw += dx * 0.012;
        drag.vel = dx * 0.6;
        dragPitch = Math.max(-0.7, Math.min(0.7, dragPitch + dy * 0.006));
      }
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    let downAt = 0;
    const onDown = (e: PointerEvent) => {
      drag.on = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.vel = 0;
      downAt = performance.now();
      canvas.setPointerCapture(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.on = false;
      spin = Math.max(-6, Math.min(6, drag.vel));
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      const tap = performance.now() - downAt < 220 && Math.abs(drag.vel) < 1;
      if (tap && !rm?.matches) {
        scale.v += 2.4;
        if (list.length > 1) {
          current = (current + 1) % list.length;
          setTargets(shapeAt(current), false);
          announce(current);
          lastMorph = performance.now();
        }
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    rm?.addEventListener("change", start);

    return () => {
      goToRef.current = null;
      stop?.();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      rm?.removeEventListener("change", start);
    };
  }, [shapeKey, interval, ring]);

  return (
    <div className={`orb ${className}`} aria-hidden="true">
      <canvas ref={ref} className="orb__canvas" />
      {labels && labels.length > 0 && (
        <span className="orb__caption" key={shapeIndex}>
          {labels[shapeIndex % labels.length]}
        </span>
      )}
    </div>
  );
}
