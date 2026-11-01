/** Inline icon set on a 24px grid, 1.75px stroke, currentColor. Decorative unless given a title. */
const paths = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  chat: "M4 5h16v11H9l-5 4z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  "external-link": "M14 4h6v6M20 4l-9 9M18 14v5H5V6h5",
  chevron: "M6 9l6 6 6-6",
  pause: "M8 5v14M16 5v14",
  plus: "M12 5v14M5 12h14",
  play: "M7 4.5v15l12-7.5z",
} as const;

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  /** Provide only when the icon is the only content of its control. */
  title?: string;
}

export function Icon({ name, size = 20, className, title }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
