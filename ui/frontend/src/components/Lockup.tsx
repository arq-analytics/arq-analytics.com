import Image from "next/image";

// Generated from assets/brand/arq-logo.jpeg by `npm run logo` (720 x 340).
const LOGO_W = 720;
const LOGO_H = 340;

/**
 * The real ARQ ONE AI Labs logo. Two transparent versions are made from the brand JPEG:
 * white and orange for dark surfaces, ink and orange for light ones. `surface="auto"`
 * renders both and CSS shows the one that matches the theme. `surface="dark"` is for
 * places that are always dark, like the footer.
 */
export function Lockup({
  label,
  surface = "auto",
  priority = false,
}: {
  label: string;
  surface?: "auto" | "dark";
  priority?: boolean;
}) {
  return (
    <span className="logo" role="img" aria-label={label}>
      <Image
        className="logo__img logo__img--on-dark"
        src="/brand/arq-logo-on-dark.png"
        alt=""
        width={LOGO_W}
        height={LOGO_H}
        sizes="160px"
        priority={priority}
      />
      {surface === "auto" && (
        <Image
          className="logo__img logo__img--on-light"
          src="/brand/arq-logo-on-light.png"
          alt=""
          width={LOGO_W}
          height={LOGO_H}
          sizes="160px"
          priority={priority}
        />
      )}
    </span>
  );
}
