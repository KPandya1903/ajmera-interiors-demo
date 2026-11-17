"use client";

/* eslint-disable @next/next/no-img-element -- photos are pre-optimised WebP served statically */
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { FOCUS_Y, homeOf, photoSrc, photos, type Photo } from "@/lib/photos";
import { Container, Eyebrow, SectionTitle, arrowNav } from "./ui";

const PAGE = 36;
const FILTERS = ["All", "3 BHK", "5 BHK"] as const;
const ZOOM = 1.4; // clicked photo grows 40% in place

/** Spread photos from different homes evenly so "All" doesn't show one home in a long block. */
function interleave(list: Photo[]): Photo[] {
  const groups = new Map<string, Photo[]>();
  for (const p of list) {
    const g = groups.get(homeOf(p));
    if (g) g.push(p);
    else groups.set(homeOf(p), [p]);
  }
  const lists = [...groups.values()];
  const out: Photo[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** Grow towards the middle of the screen so photos at the edges don't spill off it. */
function originFor(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const x = r.left < window.innerWidth * 0.25 ? "left" : r.right > window.innerWidth * 0.75 ? "right" : "center";
  const y = r.top < window.innerHeight * 0.25 ? "top" : r.bottom > window.innerHeight * 0.75 ? "bottom" : "center";
  return `${x} ${y}`;
}

export default function PhotoWall() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [shown, setShown] = useState(PAGE);
  const [zoomed, setZoomed] = useState<{ id: string; origin: string } | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () => (filter === "All" ? interleave(photos) : photos.filter((p) => homeOf(p) === filter)),
    [filter],
  );
  const visible = list.slice(0, shown);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown((n) => n + PAGE), { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [list]);

  // Shrink back on scroll, Escape, or a tap anywhere else (touch screens have no "mouse leave").
  useEffect(() => {
    if (!zoomed) return;
    const close = () => setZoomed(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, { passive: true, once: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", close);
    };
  }, [zoomed]);

  const toggle = (e: MouseEvent<HTMLButtonElement>, p: Photo) => {
    e.stopPropagation();
    const origin = originFor(e.currentTarget); // read now: currentTarget is null once the handler returns
    setZoomed((z) => (z?.id === p.id ? null : { id: p.id, origin }));
  };

  return (
    <section id="wall" className="py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <SectionTitle>
              Every corner, <em className="text-gold">up close.</em>
            </SectionTitle>
          </div>
          <div className="flex gap-7 border-b border-black/10 sm:gap-8" role="group" aria-label="Filter photos by home" onKeyDown={arrowNav}>
            {FILTERS.map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => {
                  setFilter(f);
                  setShown(PAGE);
                  setZoomed(null);
                }}
                className={`-mb-px border-b max-lg:whitespace-nowrap pb-3 pt-4 font-logo text-label lg:pt-0 font-medium uppercase tracking-[0.2em] transition-colors ${
                  filter === f ? "border-ink text-ink" : "border-transparent text-ink/45 hover:text-ink"
                }`}
              >
                {f === "All" ? (
                  "All work"
                ) : (
                  <>
                    {f}
                    <span className="hidden sm:inline"> Residence</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial grid: every row is exactly one portrait (4:5) tile tall; landscape photos
            span two columns at that same height, and dense flow back-fills any holes. Row height is
            derived from the container width (cqw) so rows line up to the pixel. */}
        <div className="@container">
          <div
            className="grid grid-flow-row-dense grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-(--gap) [--cols:2] [--gap:0.5rem] md:[--cols:3] md:[--gap:0.75rem] xl:[--cols:4] 3xl:[--cols:5] 4xl:[--cols:6]"
            style={{ gridAutoRows: "calc((100cqw - (var(--cols) - 1) * var(--gap)) / var(--cols) * 1.25)" }}
            onKeyDown={arrowNav}
          >
            {visible.map((p) => {
              const isZoomed = zoomed?.id === p.id;
              const wide = p.w > p.h;
              return (
                <button
                  key={p.id}
                  onClick={(e) => toggle(e, p)}
                  onMouseLeave={() => isZoomed && setZoomed(null)}
                  aria-pressed={isZoomed}
                  aria-label={`${isZoomed ? "Shrink" : "Enlarge"} photo, ${p.label}`}
                  className={`group relative block h-full w-full scroll-my-24 overflow-hidden bg-sand focus-visible:z-10 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    wide ? "col-span-2" : ""
                  } ${isZoomed ? "z-20 shadow-[0_24px_60px_rgba(0,0,0,0.35)]" : "z-0 cursor-zoom-in"}`}
                  style={{
                    backgroundImage: `url(${p.blur})`,
                    backgroundSize: "cover",
                    backgroundPosition: `50% ${p.fy ?? FOCUS_Y}%`,
                    transform: isZoomed ? `scale(${ZOOM})` : "scale(1)",
                    transformOrigin: isZoomed ? zoomed.origin : undefined,
                  }}
                >
                  <img
                    src={photoSrc(p, isZoomed ? 1280 : 640)}
                    // Zoomed: always the 1280w file (browsers ignore src when srcSet is set).
                    srcSet={isZoomed ? undefined : `${photoSrc(p, 640)} 640w, ${photoSrc(p, 1280)} 1280w`}
                    sizes={
                      isZoomed
                        ? undefined
                        : wide
                          ? "(min-width:3000px) 34vw, (min-width:2400px) 40vw, (min-width:1280px) 50vw, (min-width:768px) 66vw, 100vw"
                          : "(min-width:3000px) 17vw, (min-width:2400px) 20vw, (min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
                    }
                    width={p.w}
                    height={p.h}
                    loading="lazy"
                    decoding="async"
                    alt={`Interior photo from a ${p.label} by Ajmera Interiors`}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: `50% ${p.fy ?? FOCUS_Y}%` }}
                  />
                  <span
                    className={`pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-transparent to-transparent p-4 transition-opacity duration-500 ${
                      isZoomed ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    <span className="font-logo text-micro font-medium uppercase tracking-[0.22em] text-white">{p.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {shown < list.length && <div ref={sentinel} className="h-10" aria-hidden />}
        <p className="pt-10 text-center font-logo text-label uppercase tracking-[0.2em] text-ink/40">
          {Math.min(shown, list.length)} of {list.length} photographs
        </p>
      </Container>
    </section>
  );
}
