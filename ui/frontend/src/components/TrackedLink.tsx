"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

interface TrackedLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  event?: AnalyticsEvent;
  product?: string;
  locale?: string;
  /** Opens in a new tab with rel noopener. Used for wa.me and other sites. */
  external?: boolean;
}

/** A link that reports a cookie-free analytics event with only product, locale and page. */
export function TrackedLink({ href, className, children, event, product, locale, external }: TrackedLinkProps) {
  const onClick = () => {
    if (event) trackEvent(event, { product, locale, page: window.location.pathname });
  };
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
