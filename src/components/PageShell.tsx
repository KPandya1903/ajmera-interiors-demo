import type { ReactNode } from "react";
import { Container, Eyebrow } from "./ui";

/**
 * Standard title block for inner pages (/films, /about, /contact). It clears the fixed header with
 * `pt-header`, so it must be the first thing on the page. <main id="main"> comes from the root layout.
 */
export function PageHeader({ eyebrow, title, children, light }: { eyebrow: ReactNode; title: ReactNode; children?: ReactNode; light?: boolean }) {
  return (
    <header className={`pt-header ${light ? "bg-night text-ivory" : ""}`}>
      <Container className="pb-12 pt-16 md:pb-16 md:pt-24">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-serif text-[2.5rem] font-normal leading-[1.08] tracking-[-0.01em] text-balance sm:text-6xl lg:text-[4rem]">{title}</h1>
        {children && <div className={`mt-8 max-w-[62ch] text-[1.0625rem] leading-[1.75] ${light ? "text-ivory/75" : "text-ink/75"}`}>{children}</div>}
      </Container>
    </header>
  );
}
