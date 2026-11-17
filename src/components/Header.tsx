"use client";

import { useEffect, useState } from "react";
import { WHATSAPP } from "./ui";

const links = [
  ["Work", "#wall"],
  ["Films", "#videos"],
  ["Studio", "#about"],
  ["Process", "#process"],
  ["Contact", "#contact"],
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = solid || open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ${
        dark ? "bg-ivory/95 text-ink shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur" : "text-ivory"
      }`}
    >
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-[height] duration-500 md:px-12 ${solid ? "h-16" : "h-20"}`}>
        <a href="#top" className="leading-none" aria-label="Ajmera Interiors, home">
          <span className="block text-[15px] font-semibold tracking-[0.34em]">AJMERA</span>
          <span className="mt-1 block text-[9px] font-normal tracking-[0.62em] opacity-80">INTERIORS</span>
        </a>

        <nav className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.2em] lg:flex" aria-label="Main">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className={`hidden px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors sm:inline-block ${
              dark ? "bg-navy text-ivory hover:bg-gold" : "bg-ivory text-navy hover:bg-gold hover:text-white"
            }`}
          >
            Book a consultation
          </a>
          <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Menu" aria-expanded={open}>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 top-0 h-px w-6 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-6 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-ivory px-6 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-black/5 py-4 font-serif text-2xl">
              {label}
            </a>
          ))}
          <a href={WHATSAPP} className="mt-6 block bg-navy py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ivory">
            Book a consultation
          </a>
        </nav>
      )}
    </header>
  );
}
