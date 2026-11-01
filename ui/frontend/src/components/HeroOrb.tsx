"use client";

import { useState } from "react";
import { ParticleOrb, type OrbShape } from "./ParticleOrb";

export interface HeroOrbItem {
  id: string;
  name: string;
  href: string;
  shape: OrbShape;
  live: boolean;
}

/**
 * The hero visual: the particle orb in full view, cycling through one shape per product,
 * with a row of product chips under it. Each chip is a real link to that product's
 * section; pointing at or focusing a chip morphs the orb to that product and holds it.
 */
export function HeroOrb({ items, label }: { items: HeroOrbItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  return (
    <div className="hero-orb">
      <ParticleOrb
        className="orb--hero"
        shapes={items.map((i) => i.shape)}
        ring
        index={index}
        onIndexChange={setIndex}
        paused={held}
        interval={6000}
      />
      <nav className="orb-chips" aria-label={label}>
        {items.map((item, i) => (
          <a
            key={item.id}
            href={item.href}
            className={`orb-chip${item.live ? " orb-chip--live" : ""}`}
            aria-current={i === index ? "true" : undefined}
            onPointerEnter={() => {
              setIndex(i);
              setHeld(true);
            }}
            onPointerLeave={() => setHeld(false)}
            onFocus={() => {
              setIndex(i);
              setHeld(true);
            }}
            onBlur={() => setHeld(false)}
          >
            <span className={`orb-chip__dot planet--${item.id}`} aria-hidden="true" />
            {item.name.replace(/^ARQ\s+/, "")}
          </a>
        ))}
      </nav>
    </div>
  );
}
