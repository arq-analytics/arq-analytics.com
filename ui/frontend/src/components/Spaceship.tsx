import { useId } from "react";

const flightPaths = {
  rise: "M -120 560 C 220 420, 480 560, 720 300 S 980 80, 1140 30",
  cross: "M 1120 120 C 820 60, 620 260, 380 220 S 60 330, -140 260",
};

/**
 * An original ARQ scout ship that flies across its band now and then, with an engine
 * trail. Pure SVG and CSS. Decorative, and hidden under reduced motion.
 */
export function Spaceship({ path = "rise", delay = 0 }: { path?: keyof typeof flightPaths; delay?: number }) {
  const id = useId().replace(/:/g, "");
  const d = flightPaths[path];
  return (
    <svg
      className={`ship-layer ship-layer--${path}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`trail-${id}`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" className="ship__trail-a" />
          <stop offset="0.35" className="ship__trail-b" />
          <stop offset="1" className="ship__trail-c" />
        </linearGradient>
      </defs>
      <path className="ship__route" d={d} />
      <g className="ship" style={{ offsetPath: `path("${d}")`, animationDelay: `${delay}s` }}>
        <rect className="ship__trail" x="-170" y="-2.5" width="150" height="5" rx="2.5" fill={`url(#trail-${id})`} />
        <ellipse className="ship__flame" cx="-22" cy="0" rx="8" ry="3.6" />
        <path className="ship__wing" d="M 4 -6 L -12 -21 L -19 -21 L -12 -6 Z" />
        <path className="ship__wing" d="M 4 6 L -12 21 L -19 21 L -12 6 Z" />
        <path className="ship__hull" d="M 32 0 L 8 -7.5 L -14 -9 L -20 -4.5 L -20 4.5 L -14 9 L 8 7.5 Z" />
        <path className="ship__stripe" d="M -6 -8.4 L -2 -8.4 L -2 8.4 L -6 8.4 Z" />
        <ellipse className="ship__cockpit" cx="13" cy="0" rx="7" ry="3.2" />
      </g>
    </svg>
  );
}
