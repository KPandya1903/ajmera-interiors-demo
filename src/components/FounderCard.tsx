"use client";

/* eslint-disable @next/next/no-img-element -- static export: images are pre-sized WebP files */
import { useEffect, useRef } from "react";

export type Founder = { name: string; role: string; photo: string; bio: string[] };

/**
 * One founder row on /about: portrait on one side, name, role and the full bio on the other.
 * `mirrored` puts the photo on the right from lg up; below lg the photo always comes first.
 *
 * The portrait fades in slowly the first time it scrolls into view. The frame has a fixed 4:5
 * aspect ratio and the image carries width/height, so nothing shifts. The reveal is only armed
 * for rows that start below the fold, so the page renders fully without JS and nothing on screen
 * ever disappears; it is skipped entirely under prefers-reduced-motion.
 */
export default function FounderCard({ founder, index, mirrored }: { founder: Founder; index: number; mirrored?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const { name, role, photo, bio } = founder;
  const headingId = `founder-${index}`;

  useEffect(() => {
    const el = frame.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return; // already on (or above) screen: leave it alone
    el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article aria-labelledby={headingId} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-12">
      <div
        ref={frame}
        className={`group w-full max-w-md overflow-hidden bg-sand lg:row-start-1 lg:max-w-none ${
          mirrored ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5 lg:col-start-1"
        }`}
      >
        <img
          src={photo}
          alt={`${name}, ${role.toLowerCase()} of Ajmera Interiors`}
          width={900}
          height={1000}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover object-top transition-[opacity,transform] duration-[900ms] ease-out group-data-[reveal=wait]:scale-[1.04] group-data-[reveal=wait]:opacity-0"
        />
      </div>

      <div className={`lg:row-start-1 ${mirrored ? "lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7"}`}>
        <p className="font-logo text-label font-medium uppercase tracking-[0.28em] text-gold-deep">
          <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden className="mx-3 inline-block h-px w-8 bg-current align-middle" />
          {role}
        </p>
        <h3 id={headingId} className="mt-4 font-serif text-[2.5rem] font-normal leading-[1.08] tracking-[-0.01em] sm:text-[3.5rem]">
          {name}
        </h3>
        <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.75] text-ink/80 sm:text-[1.125rem]">
          {bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
