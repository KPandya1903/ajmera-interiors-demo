"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, isCurrent } from "@/lib/site";
import { WHATSAPP } from "./ui";

export default function Header() {
  const pathname = usePathname();
  // Only the home page has a full-bleed hero under the header; every other page gets the solid bar from the start.
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const solid = scrolled || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after a route change (links also close it on click).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const el = document.getElementById("videos");
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setOnDark(r.top <= 40 && r.bottom > 40);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      setOnDark(false);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const light = (solid || open) && !(onDark && !open); // ivory bar with dark text
  const theme = light ? "light" : "dark";
  // --hh is the bar height; the mobile menu fills the rest of the screen. Landscape phones get a slimmer bar.
  return (
    <header
      data-theme={theme}
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,color,box-shadow] duration-500 ${solid ? "[--hh:4rem]" : "[--hh:5rem]"} short:[--hh:3.5rem] ${
        light
          ? "bg-ivory/95 text-ink shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur"
          : onDark
            ? "bg-night/90 text-ivory shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur"
            : "text-ivory"
      }`}
    >
      <div className="mx-auto flex h-(--hh) max-w-site items-center justify-between px-gutter transition-[height] duration-500">
        <Link href="/" className="font-logo leading-none max-lg:-my-2 max-lg:py-2" aria-label="Ajmera Interiors, home">
          <span className="block text-[0.9375rem] font-semibold tracking-[0.34em]">AJMERA</span>
          <span className="mt-1 block text-[0.5625rem] font-normal 3xl:text-[0.625rem] tracking-[0.62em] opacity-80">INTERIORS</span>
        </Link>

        <nav className="hidden items-center gap-9 font-logo text-label font-medium uppercase tracking-[0.2em] lg:flex" aria-label="Main">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent(href, pathname) ? "page" : undefined}
              className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className={`hidden items-center px-5 py-2.5 font-logo text-label font-medium uppercase tracking-[0.2em] transition-colors sm:inline-flex max-lg:min-h-11 ${
              light ? "bg-navy text-ivory hover:bg-gold" : "bg-ivory text-navy hover:bg-gold hover:text-white"
            }`}
          >
            Book a consultation
          </a>
          <button onClick={() => setOpen((o) => !o)} className="-mr-2.5 grid h-11 w-11 place-items-center lg:hidden" aria-label="Menu" aria-expanded={open} aria-controls="mobile-nav">
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 top-0 h-px w-6 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="h-[calc(100svh-var(--hh)-env(safe-area-inset-top))] overflow-y-auto overscroll-contain border-t border-black/5 bg-ivory px-gutter pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 short:pt-1 lg:hidden" aria-label="Mobile">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(href, pathname) ? "page" : undefined}
              className="flex items-center justify-between border-b border-black/5 py-4 font-serif text-2xl short:py-2.5 short:text-xl aria-[current=page]:text-gold-deep"
            >
              {label}
              {isCurrent(href, pathname) && <span className="h-px w-8 bg-current" aria-hidden />}
            </Link>
          ))}
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-6 block bg-navy py-4 short:mt-4 text-center font-logo text-label font-medium uppercase tracking-[0.2em] text-ivory">
            Book a consultation
          </a>
        </nav>
      )}
    </header>
  );
}
