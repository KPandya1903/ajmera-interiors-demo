import { ArrowLink, Container, Eyebrow, SectionTitle } from "./ui";

/** Short studio introduction on the home page; the full story lives on /about. */
export default function StudioTeaser() {
  return (
    <section id="about" className="bg-sand/40 py-24 md:py-32">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-24">
        <div>
          <Eyebrow>The studio</Eyebrow>
          <SectionTitle>
            Luxury that fits you, <em className="text-gold">and your budget.</em>
          </SectionTitle>
        </div>
        <div>
          <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-ink/75">
            Ajmera Interiors is a family-owned design studio in Mumbai, designing homes with warmth, refinement and local
            character. We show you every room in 3D before any work begins, and shape every contract around the budget you have in mind.
          </p>
          <div className="mt-8">
            <ArrowLink href="/about">Meet the founders</ArrowLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
