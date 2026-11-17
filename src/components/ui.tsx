import Link from "next/link";
import type { KeyboardEvent, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-gutter ${className}`}>{children}</div>;
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-logo text-label font-medium uppercase tracking-[0.28em] ${light ? "text-gold-soft" : "text-gold-deep"}`}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function SectionTitle({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`mt-5 font-serif text-[2.5rem] font-normal leading-[1.05] tracking-[-0.01em] max-lg:text-balance sm:text-[3.5rem] sm:leading-[1.125] ${light ? "text-ivory" : "text-ink"}`}>
      {children}
    </h2>
  );
}

/** Secondary text link with a trailing arrow ("View all films →"). Montserrat caps, 44px target. */
export function ArrowLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-3 border-b font-logo text-label font-medium uppercase tracking-[0.22em] transition-colors ${
        light ? "border-ivory/30 text-ivory hover:border-gold-soft hover:text-gold-soft" : "border-ink/25 text-ink hover:border-gold-deep hover:text-gold-deep"
      }`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export const WHATSAPP = "https://wa.me/919326451272?text=Hi%20Ajmera%20Interiors%2C%20I%27d%20like%20to%20discuss%20my%20home.";

/**
 * Arrow-key (TV remote D-pad) navigation inside a group: moves focus to the nearest button or link
 * in the pressed direction. Attach as onKeyDown on the group. If nothing lies that way the key is
 * left alone, so the page (or the TV's own spatial navigation) still handles it.
 */
const DIRS: Partial<Record<string, readonly [number, number]>> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

export function arrowNav(e: KeyboardEvent<HTMLElement>) {
  const dir = DIRS[e.key];
  const from = document.activeElement;
  if (!dir || e.altKey || e.ctrlKey || e.metaKey || !(from instanceof HTMLElement) || !e.currentTarget.contains(from)) return;
  const c = (r: DOMRect) => [r.left + r.width / 2, r.top + r.height / 2];
  const [fx, fy] = c(from.getBoundingClientRect());
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of e.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")) {
    // Skip hidden targets (display:none has no client rects), so a key never "lands" on nothing.
    if (el === from || !el.getClientRects().length || getComputedStyle(el).visibility === "hidden") continue;
    const [x, y] = c(el.getBoundingClientRect());
    const along = (x - fx) * dir[0] + (y - fy) * dir[1]; // distance in the pressed direction
    const across = Math.abs((x - fx) * dir[1]) + Math.abs((y - fy) * dir[0]); // sideways drift
    if (along <= 1) continue;
    const score = along + across * 2;
    if (score < bestScore) [best, bestScore] = [el, score];
  }
  if (!best) return;
  best.focus();
  if (document.activeElement === best) e.preventDefault(); // only swallow the key if focus really moved
}
