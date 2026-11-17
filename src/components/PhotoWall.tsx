"use client";

/* eslint-disable @next/next/no-img-element -- photos are pre-optimised WebP served statically */
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { homeOf, photoSrc, photos, type Photo } from "@/lib/photos";
import { Container, Eyebrow, SectionTitle } from "./ui";

const PAGE = 36;
const FILTERS = ["All", "3 BHK", "5 BHK"] as const;
const ZOOM = 1.4; // clicked photo grows 40% in place

/** Spread photos from different homes evenly so "All" doesn't show one home in a long block. */
function interleave(list: Photo[]): Photo[] {
  const groups = new Map<string, Photo[]>();
  for (const p of list) groups.set(homeOf(p), [...(groups.get(homeOf(p)) ?? []), p]);
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
    setZoomed((z) => (z?.id === p.id ? null : { id: p.id, origin: originFor(e.currentTarget) }));
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
          <div className="flex gap-8 border-b border-black/10" role="tablist" aria-label="Filter photos by home">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => {
                  setFilter(f);
                  setShown(PAGE);
                  setZoomed(null);
                }}
                className={`-mb-px border-b pb-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  filter === f ? "border-ink text-ink" : "border-transparent text-ink/45 hover:text-ink"
                }`}
              >
                {f === "All" ? "All work" : `${f} Residence`}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-2 gap-2 md:columns-3 md:gap-3 xl:columns-4">
          {visible.map((p) => {
            const isZoomed = zoomed?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={(e) => toggle(e, p)}
                onMouseLeave={() => isZoomed && setZoomed(null)}
                aria-pressed={isZoomed}
                aria-label={`${isZoomed ? "Shrink" : "Enlarge"} photo, ${p.label}`}
                className={`group relative mb-2 block w-full bg-sand transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:mb-3 ${
                  isZoomed ? "z-20 shadow-[0_24px_60px_rgba(0,0,0,0.35)]" : "z-0 cursor-zoom-in"
                }`}
                style={{
                  aspectRatio: `${p.w} / ${p.h}`,
                  backgroundImage: `url(${p.blur})`,
                  backgroundSize: "cover",
                  transform: isZoomed ? `scale(${ZOOM})` : "scale(1)",
                  transformOrigin: isZoomed ? zoomed.origin : undefined,
                }}
              >
                <img
                  src={photoSrc(p, 640)}
                  srcSet={`${photoSrc(p, 640)} 640w, ${photoSrc(p, 1280)} 1280w`}
                  sizes={isZoomed ? "50vw" : "(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"}
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  decoding="async"
                  alt={`Interior photo from a ${p.label} by Ajmera Interiors`}
                  className="h-full w-full object-cover"
                />
                <span
                  className={`pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-transparent to-transparent p-4 transition-opacity duration-500 ${
                    isZoomed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white">{p.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {shown < list.length && <div ref={sentinel} className="h-10" aria-hidden />}
        <p className="pt-10 text-center text-[11px] uppercase tracking-[0.2em] text-ink/40">
          {Math.min(shown, list.length)} of {list.length} photographs
        </p>
      </Container>
    </section>
  );
}
