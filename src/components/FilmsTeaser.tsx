import { ArrowLink, Eyebrow, SectionTitle } from "./ui";
import { VideoRowSection } from "./VideoRow";

/** Home page films teaser: the first six walkthroughs and a link to /films. id="videos" keeps the header's dark-bar switch. */
export default function FilmsTeaser() {
  return (
    <section id="videos" className="bg-night py-24 md:py-32">
      <div className="mx-auto max-w-site">
        <div className="px-gutter pb-12">
          <Eyebrow light>Films</Eyebrow>
          <SectionTitle light>
            Walk through <em className="text-gold-soft">our homes.</em>
          </SectionTitle>
        </div>
        <VideoRowSection kind="walkthrough" limit={6} />
        <div className="mt-10 px-gutter">
          <ArrowLink href="/films" light>
            View all films
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
