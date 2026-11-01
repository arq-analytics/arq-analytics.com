"use client";

import { useEffect, useRef } from "react";
import { animateWhileVisible, fitCanvas, readPalette, reducedMotionQuery } from "@/lib/canvas";

interface Star {
  x: number;
  y: number;
  z: number; // depth 0 (far) to 1 (near)
  r: number;
  phase: number;
  speed: number;
  tone: 0 | 1 | 2; // white, gold, orange
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

/**
 * A decorative starfield: twinkling stars in three depths that drift and follow the
 * pointer a little, plus the odd shooting star. Fills its positioned parent.
 * Draws one still frame under reduced motion, and pauses when off screen.
 */
export function Starfield({ density = 1, meteors = true }: { density?: number; meteors?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const palette = readPalette(canvas);
    const tones: [string, string, string] = [palette.white, palette.gold, palette.accent];
    const rm = reducedMotionQuery();
    let size = fitCanvas(canvas);
    let stars: Star[] = [];
    const shooting: Meteor[] = [];
    let nextMeteor = 2500 + Math.random() * 3000;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let last = 0;

    const seed = () => {
      const count = Math.min(520, Math.round(((size.w * size.h) / 2400) * density));
      stars = Array.from({ length: count }, () => {
        const z = Math.random() ** 2.2;
        const pick = Math.random();
        return {
          x: Math.random() * size.w,
          y: Math.random() * size.h,
          z,
          r: 0.35 + z * 1.35,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          tone: pick > 0.93 ? 2 : pick > 0.8 ? 1 : 0,
        };
      });
    };

    const draw = (time: number, still: boolean) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0.016;
      last = time;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      ctx.clearRect(0, 0, size.w, size.h);

      for (const s of stars) {
        if (!still) {
          s.x -= (0.6 + s.z * 4) * dt;
          if (s.x < -4) s.x = size.w + 4;
        }
        const px = s.x + pointer.x * s.z * 18;
        const py = s.y + pointer.y * s.z * 12;
        const twinkle = still ? 0.8 : 0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = (0.25 + s.z * 0.75) * twinkle;
        ctx.fillStyle = tones[s.tone];
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.z > 0.82) {
          ctx.globalAlpha *= 0.18;
          ctx.beginPath();
          ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.35 * twinkle;
          ctx.fillRect(px - s.r * 5, py - 0.3, s.r * 10, 0.6);
          ctx.fillRect(px - 0.3, py - s.r * 5, 0.6, s.r * 10);
        }
      }

      if (!still && meteors) {
        nextMeteor -= dt * 1000;
        if (nextMeteor <= 0) {
          nextMeteor = 4000 + Math.random() * 6000;
          const speed = 520 + Math.random() * 380;
          const angle = Math.PI * (0.78 + Math.random() * 0.12);
          shooting.push({
            x: size.w * (0.35 + Math.random() * 0.7),
            y: -20 + Math.random() * size.h * 0.3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            age: 0,
            life: 0.9 + Math.random() * 0.6,
          });
        }
        for (let i = shooting.length - 1; i >= 0; i--) {
          const m = shooting[i];
          if (!m) continue;
          m.age += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          if (m.age > m.life) {
            shooting.splice(i, 1);
            continue;
          }
          const fade = Math.sin((m.age / m.life) * Math.PI);
          const tail = 0.16;
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
          g.addColorStop(0, palette.white);
          g.addColorStop(0.25, palette.gold);
          g.addColorStop(1, "transparent");
          ctx.globalAlpha = fade;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    seed();
    let stop: (() => void) | null = null;
    const start = () => {
      stop?.();
      stop = null;
      if (rm?.matches) {
        draw(performance.now(), true);
      } else {
        stop = animateWhileVisible(canvas, (t) => draw(t, false));
      }
    };
    start();

    const ro = new ResizeObserver(() => {
      size = fitCanvas(canvas);
      seed();
      if (rm?.matches) draw(performance.now(), true);
    });
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    rm?.addEventListener("change", start);

    return () => {
      stop?.();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      rm?.removeEventListener("change", start);
    };
  }, [density, meteors]);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
