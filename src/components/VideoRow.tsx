"use client";

/* eslint-disable @next/next/no-img-element -- Drive thumbnails are remote, unoptimised by design */
import { useEffect, useRef, useState } from "react";
import { embed, label, poster, posterFallback, posterRotation, videos, watch, type Video } from "@/lib/videos";
import { Eyebrow, SectionTitle, arrowNav } from "./ui";

function Poster({ v }: { v: Video }) {
  const rot = posterRotation(v);
  const fb = posterFallback(v);
  const onError = fb ? (e: React.SyntheticEvent<HTMLImageElement>) => { if (e.currentTarget.src !== fb) e.currentTarget.src = fb; } : undefined;
  if (rot === 0)
    return <img src={poster(v)} alt="" loading="lazy" referrerPolicy="no-referrer" onError={onError} className="h-full w-full object-cover" />;
  /* Drive returns some phone clips as sideways 16:9 frames; rotate upright inside the 9:16 card */
  return (
    <img
      src={poster(v)}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={onError}
      className="absolute left-1/2 top-1/2 max-w-none object-cover"
      style={{ width: "177.78%", height: "56.25%", transform: `translate(-50%, -50%) rotate(${rot}deg)` }}
    />
  );
}

function Row({ title, items, portrait }: { title: string; items: Video[]; portrait?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: "smooth" });

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!playing) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setPlaying(null);
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe, [tabindex]:not([tabindex='-1'])"));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [playing]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between px-gutter">
        <h3 className="text-label font-medium uppercase tracking-[0.24em] text-ivory/80">{title}</h3>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              onClick={() => scroll(d)}
              aria-label={d < 0 ? "Scroll left" : "Scroll right"}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 lg:h-10 lg:w-10 text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-ink"
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div ref={track} onKeyDown={arrowNav} className="scrollbar-none flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-gutter py-3">
        {items.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setPlaying(v)}
            className={`group relative shrink-0 snap-start overflow-hidden bg-neutral-800 transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.03] focus-visible:z-10 focus-visible:scale-[1.03] ${
              portrait ? "aspect-[9/16] w-[46vw] sm:w-52 3xl:w-60" : "aspect-video w-[78vw] sm:w-80 3xl:w-96"
            }`}
            aria-label={`Play ${label(v)} ${i + 1}`}
          >
            <Poster v={v} />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-ivory">
              <span className="text-micro font-medium uppercase tracking-[0.22em]">
                {v.project}
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ivory/60 transition-colors group-hover:border-ivory group-hover:bg-ivory group-hover:text-ink">
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden className="h-3 w-2.5"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
              </span>
            </span>
          </button>
        ))}
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setPlaying(null)} role="dialog" aria-modal="true" aria-label={`${label(playing)} video`} ref={dialogRef}>
          <div
            className={`relative w-full ${playing.kind === "reel" ? "aspect-[9/16] max-h-[88vh] max-w-[calc(88vh*9/16)]" : "aspect-video max-w-[min(80rem,94vw,calc(88vh*16/9))]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe src={embed(playing)} title={`Ajmera Interiors ${label(playing)}`} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
            <a href={watch(playing)} target="_blank" rel="noreferrer" className="absolute -bottom-8 right-0 text-xs text-ivory/70 underline max-lg:-bottom-10 max-lg:py-2 max-lg:text-sm 3xl:-bottom-10 3xl:text-sm">
              {playing.youtubeId ? "Watch on YouTube" : "Open in Google Drive"}
            </a>
          </div>
          <button ref={closeRef} onClick={() => setPlaying(null)} aria-label="Close video" className="absolute right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.25rem,env(safe-area-inset-top))] text-3xl text-ivory max-lg:-mr-3 max-lg:-mt-3 max-lg:grid max-lg:h-12 max-lg:w-12 max-lg:place-items-center">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default function VideoRow() {
  return (
    <section id="videos" className="bg-[#161c2c] py-24 md:py-32">
      <div className="mx-auto max-w-site">
        <div className="px-gutter pb-12">
          <Eyebrow light>Films</Eyebrow>
          <SectionTitle light>
            Walk through <em className="text-[#d9bd92]">our homes.</em>
          </SectionTitle>
        </div>
        <div className="space-y-14">
          <Row title="Walkthroughs" items={videos.filter((v) => v.kind === "walkthrough")} />
          <Row title="Reels" items={videos.filter((v) => v.kind === "reel")} portrait />
        </div>
      </div>
    </section>
  );
}
