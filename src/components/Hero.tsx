"use client";

/* eslint-disable @next/next/no-img-element -- hero slides are pre-built responsive WebP */
import { useCallback, useEffect, useState } from "react";
import slides from "@/data/hero.json";
import { WHATSAPP, arrowNav } from "./ui";

const INTERVAL = 6500; // ms per slide (inside the requested 5–7 s)
const src = (id: string, w: number) => `/hero/${id.split("/")[1]}-${w}.webp`;

export default function Hero() {
  const [active, setActive] = useState(0);
  // Only mount a slide once it is (about to be) shown, so visitors don't download all 11 up front.
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => {
    const n = (i + slides.length) % slides.length;
    setActive(n);
    setMounted((m) => new Set([...m, n, (n + 1) % slides.length]));
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(active + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const s = slides[active];
  return (
    <section id="top" className="relative h-svh min-h-[620px] overflow-hidden bg-navy short:min-h-80" aria-roledescription="carousel" aria-label="Featured work">
      {slides.map((slide, i) =>
        mounted.has(i) ? (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== active}>
            <img
              src={src(slide.id, 1920)}
              srcSet={`${src(slide.id, 1280)} 1280w, ${src(slide.id, 1920)} 1920w, ${src(slide.id, 2560)} 2560w`}
              sizes="100vw"
              alt={`${slide.room}, ${slide.home}, designed by Ajmera Interiors`}
              fetchPriority={i === 0 ? "high" : "low"}
              className={`h-full w-full object-cover motion-safe:transition-transform motion-safe:ease-linear ${
                i === active ? "scale-[1.08] duration-[8000ms]" : "scale-100 duration-[1600ms]"
              }`}
            />
          </div>
        ) : null,
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,22,36,0.5)_0%,rgba(17,22,36,0)_20%,rgba(17,22,36,0.25)_40%,rgba(17,22,36,0.85)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,22,36,0.45)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-site flex-col justify-end px-gutter pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] md:pb-20 short:pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl">
          <p className="font-logo text-label font-medium uppercase tracking-[0.3em] text-ivory/90 short:hidden">Interior design studio · Mumbai</p>
          <h1 className="mt-5 font-serif text-[clamp(2.25rem,11.5vw,3rem)] font-normal leading-[0.98] tracking-[-0.015em] text-ivory sm:text-[min(5rem,8.4vw)] sm:leading-[1.075] lg:text-[5rem] short:mt-0 short:text-[2.375rem]">
            Homes designed
            <br />
            around <em className="text-gold-soft">the way you live.</em>
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:flex short:mt-5">
            <a href="#wall" className="bg-ivory px-8 py-4 text-center short:py-3 font-logo text-label font-medium uppercase tracking-[0.22em] text-navy transition-colors hover:bg-gold hover:text-white">
              View our work
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="border border-ivory/50 px-8 py-4 text-center short:py-3 font-logo text-label font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-navy">
              Free consultation
            </a>
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-6 border-t border-ivory/20 pt-5 text-ivory short:mt-4 short:items-center short:pt-3 short:pr-[4.5rem]">
          <p key={active} className="max-lg:min-w-0 animate-[fadeUp_900ms_ease-out] text-sm">
            <span className="font-serif text-lg italic">{s.room}</span>
            <span className="mx-3 text-ivory/40">/</span>
            <span className="whitespace-nowrap text-ivory/70">{s.home}</span>
          </p>
          <div className="flex items-center gap-5" onKeyDown={arrowNav}>
            <span className="hidden whitespace-nowrap text-xs tabular-nums 3xl:text-sm tracking-widest text-ivory/70 sm:block">
              {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="hidden gap-1.5 lg:flex short:hidden" role="group" aria-label="Choose slide">
              {slides.map((sl, i) => (
                <button key={sl.id} onClick={() => go(i)} aria-pressed={i === active} aria-label={`Show ${sl.room}`} className="group relative h-6 w-7">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-ivory/30" />
                  <span
                    className={`absolute left-0 top-1/2 h-px bg-ivory ${i === active && !paused ? "w-full transition-[width] ease-linear" : i === active ? "w-full" : "w-0"}`}
                    style={i === active ? { transitionDuration: `${INTERVAL}ms` } : undefined}
                  />
                </button>
              ))}
            </div>
            <div className="flex shrink-0 gap-2">
              {([-1, 1] as const).map((d) => (
                <button key={d} onClick={() => go(active + d)} aria-label={d < 0 ? "Previous slide" : "Next slide"} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/35 transition-colors hover:border-ivory hover:bg-ivory hover:text-navy">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="size-3.5"><path d={d < 0 ? "M9 2 4 7l5 5" : "M5 2l5 5-5 5"} stroke="currentColor" strokeWidth="1.3" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
