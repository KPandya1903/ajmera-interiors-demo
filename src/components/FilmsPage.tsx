"use client";

import { useState } from "react";
import { homeName, projectsOf, type Video } from "@/lib/videos";
import { ArrowLink, Container, WHATSAPP, arrowNav } from "./ui";
import { PlayIcon, Poster, VideoModal, VideoRail } from "./VideoRow";

const KINDS = [
  ["walkthrough", "Walkthroughs"],
  ["reel", "Reels"],
] as const;

const PRIMARY =
  "inline-flex min-h-12 items-center justify-center bg-ivory px-8 py-4 text-center font-logo text-label font-medium uppercase tracking-[0.22em] text-navy transition-colors duration-200 hover:bg-gold hover:text-white";

/** The first walkthrough as a large 16:9 poster that opens the player. */
function Featured({ v }: { v: Video }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="mx-auto w-full max-w-[min(100%,calc((100svh-14rem)*16/9))]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play ${homeName(v.project)} walkthrough`}
        className="group relative block aspect-video w-full overflow-hidden bg-neutral-800"
      >
        <Poster v={v} eager className="transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" aria-hidden />
        <span className="absolute inset-0 grid place-items-center" aria-hidden>
          <span className="grid h-16 w-16 place-items-center rounded-full border border-ivory/70 bg-black/20 text-ivory backdrop-blur-sm transition-colors duration-300 group-hover:border-ivory group-hover:bg-ivory group-hover:text-ink sm:h-20 sm:w-20 3xl:h-24 3xl:w-24">
            <PlayIcon className="ml-1 h-5 w-4 sm:h-6 sm:w-5" />
          </span>
        </span>
      </button>
      <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="font-serif text-2xl text-ivory sm:text-3xl">{homeName(v.project)}</span>
        <span className="font-logo text-label font-medium uppercase tracking-[0.24em] text-gold-soft">{v.project} walkthrough</span>
      </figcaption>
      {open && <VideoModal video={v} onClose={() => setOpen(false)} />}
    </figure>
  );
}

function Empty() {
  return (
    <Container className="pb-24 md:pb-32">
      <div className="max-w-[62ch] border-t border-white/15 pt-12">
        <p className="font-serif text-3xl text-ivory sm:text-4xl">
          New films are <em className="text-gold-soft">on their way.</em>
        </p>
        <p className="mt-5 text-[1.0625rem] leading-[1.75] text-ivory/75">
          We are editing walkthroughs of our latest homes. Until they are up, message us and we will share a few, or show you a finished home in person.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className={PRIMARY}>
            Book a free consultation
          </a>
          <ArrowLink href="/#wall" light>
            See the photo wall
          </ArrowLink>
        </div>
      </div>
    </Container>
  );
}

/** /films body: featured walkthrough, home filter, Netflix-style rows per home and type, closing CTA. */
export default function FilmsPageBody({ items }: { items: Video[] }) {
  const homes = projectsOf(items);
  const [home, setHome] = useState<string | null>(null);
  const featured = items.find((v) => v.kind === "walkthrough");

  if (!items.length) return <Empty />;

  const shown = home && homes.includes(home) ? [home] : homes;
  const chips: [string | null, string][] = [[null, "All"], ...homes.map((h): [string, string] => [h, h])];

  return (
    <>
      {featured && (
        <Container className="pb-16 md:pb-24">
          <Featured v={featured} />
        </Container>
      )}

      <div className="mx-auto max-w-site pb-8">
        <h2 className="sr-only">Films by home</h2>
        {homes.length > 1 && (
          <div role="group" aria-label="Show films from" onKeyDown={arrowNav} className="flex flex-wrap gap-2 px-gutter pb-10">
            {chips.map(([value, text]) => {
              const on = home === value;
              return (
                <button
                  key={text}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setHome(value)}
                  className={`min-h-11 rounded-full border px-5 font-logo text-label font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
                    on ? "border-ivory bg-ivory text-ink" : "border-white/25 text-ivory/80 hover:border-ivory hover:text-ivory"
                  }`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-14 md:space-y-16">
          {shown.map((h) =>
            KINDS.map(([kind, kindLabel]) => {
              const row = items.filter((v) => v.project === h && v.kind === kind);
              return row.length ? <VideoRail key={`${h}-${kind}`} title={`${homeName(h)} — ${kindLabel}`} items={row} portrait={kind === "reel"} /> : null;
            }),
          )}
        </div>
      </div>

      <Container className="pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="flex flex-col gap-8 border-t border-white/15 pt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[36ch] font-serif text-3xl leading-tight text-ivory sm:text-4xl">
            Want a home <em className="text-gold-soft">like these?</em>
          </p>
          {/* The footer carries the page's single primary consultation CTA, so this is a text link only. */}
          <ArrowLink href="/#wall" light>
            See the photo wall
          </ArrowLink>
        </div>
      </Container>
    </>
  );
}
