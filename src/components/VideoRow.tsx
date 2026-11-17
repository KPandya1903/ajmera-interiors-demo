"use client";

/* eslint-disable @next/next/no-img-element -- Drive thumbnails are remote, unoptimised by design */
import { useEffect, useRef, useState } from "react";
import { embed, thumb, videos, watch, type Video } from "@/lib/videos";
import { Eyebrow, SectionTitle } from "./ui";

function Row({ title, items, portrait }: { title: string; items: Video[]; portrait?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: "smooth" });

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  return (
    <div className="mt-14 first:mt-0">
      <div className="mb-5 flex items-center justify-between px-6 md:px-12">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-ivory/80">{title}</h3>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              onClick={() => scroll(d)}
              aria-label={d < 0 ? "Scroll left" : "Scroll right"}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-ink"
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div ref={track} className="scrollbar-none flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 py-3 md:scroll-px-12 md:px-12">
        {items.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setPlaying(v)}
            className={`group relative shrink-0 snap-start overflow-hidden bg-neutral-800 transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.03] ${
              portrait ? "aspect-[9/16] w-[46vw] sm:w-52" : "aspect-video w-[78vw] sm:w-80"
            }`}
            aria-label={`Play ${title} video ${i + 1}`}
          >
            <img src={thumb(v.id)} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-ivory">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
                {portrait ? "Reel" : "Walkthrough"} {String(i + 1).padStart(2, "0")}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ivory/60 transition-colors group-hover:border-ivory group-hover:bg-ivory group-hover:text-ink">
                <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
              </span>
            </span>
          </button>
        ))}
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setPlaying(null)} role="dialog" aria-modal="true">
          <div
            className={`relative w-full ${playing.kind === "reel" ? "aspect-[9/16] max-h-[88vh] max-w-[calc(88vh*9/16)]" : "aspect-video max-w-5xl"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe src={embed(playing.id)} title={`Ajmera Interiors video ${playing.title}`} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
            <a href={watch(playing.id)} target="_blank" rel="noreferrer" className="absolute -bottom-8 right-0 text-xs text-ivory/70 underline">
              Open in Google Drive
            </a>
          </div>
          <button onClick={() => setPlaying(null)} aria-label="Close video" className="absolute right-5 top-5 text-3xl text-ivory">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default function VideoRow() {
  return (
    <section id="videos" className="bg-[#111318] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-6 pb-14 md:px-12">
          <Eyebrow light>Films</Eyebrow>
          <SectionTitle light>
            Walk through <em className="text-[#d9bd92]">our homes.</em>
          </SectionTitle>
        </div>
        <Row title="Walkthroughs" items={videos.filter((v) => v.kind === "walkthrough")} />
        <Row title="Reels" items={videos.filter((v) => v.kind === "reel")} portrait />
      </div>
    </section>
  );
}
