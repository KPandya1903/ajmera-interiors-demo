/* eslint-disable @next/next/no-img-element */
import { Container, Eyebrow, SectionTitle } from "./ui";

export default function About() {
  return (
    <section id="about" className="bg-sand/40 py-24 md:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <img src="/hero/EFCB3640-1280.webp" alt="Master suite with arched display niches, by Ajmera Interiors" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <div className="absolute -bottom-6 -right-2 hidden bg-navy px-8 py-6 text-ivory sm:block lg:-right-10">
            <p className="text-micro uppercase tracking-[0.24em] text-ivory/70">Designing Mumbai homes since</p>
            <p className="mt-2 font-serif text-4xl">2018</p>
          </div>
        </div>
        <div>
          <Eyebrow>The studio</Eyebrow>
          <SectionTitle>
            Luxury that fits you, <em className="text-gold">and your budget.</em>
          </SectionTitle>
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.75] text-ink/75">
            <p>
              Ajmera Interiors is a family-owned design studio in Mumbai. We design homes with warmth, refinement and local
              character, and we show you every room in 3D before any work begins.
            </p>
            <p>Your first consultation is free, and every contract is shaped around the budget you have in mind.</p>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-black/10 pt-8">
            <div>
              <dt className="font-serif text-2xl">Sanket Ajmera</dt>
              <dd className="mt-1 text-label uppercase tracking-[0.2em] text-ink/55">Founder · Design</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">Ishita Mehta</dt>
              <dd className="mt-1 text-label uppercase tracking-[0.2em] text-ink/55">Co-founder · Operations</dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
