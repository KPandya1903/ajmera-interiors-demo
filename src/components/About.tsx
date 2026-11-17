import team from "@/data/team.json";
import FounderCard, { type Founder } from "./FounderCard";
import { ArrowLink, Container, Eyebrow, SectionTitle, WHATSAPP } from "./ui";

/* Body sections of the /about page. Copy follows the original ajmerainteriors.com/about page. */

const founders: Founder[] = team;

/** Mission and vision, side by side with a hairline between them (stacked on phones). */
export function MissionVision() {
  const items = [
    {
      label: "Our mission",
      text: "By adhering to our principles, we strive to convey a passion for our clients. We deliver the finest possible service experience, implement the highest standards of design excellence and make a significant contribution to the community.",
    },
    {
      label: "Our vision",
      text: "With our vision, we strive to provide our clients with memorable brand experiences while improving the quality of their lives.",
    },
  ];
  return (
    <section aria-label="Mission and vision" className="pb-20 md:pb-32">
      <Container>
        <div className="grid border-t border-black/10 md:grid-cols-2">
          {items.map(({ label, text }, i) => (
            <div key={label} className={i === 0 ? "pt-10 md:pr-12 md:pt-12 lg:pr-20" : "mt-10 border-t border-black/10 pt-10 md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-12 lg:pl-20"}>
              <h2 className="font-logo text-label font-medium uppercase tracking-[0.28em] text-gold-deep">{label}</h2>
              <p className="mt-6 max-w-[34ch] font-serif text-[1.5rem] leading-[1.4] tracking-[-0.005em] lg:text-[1.75rem]">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** The two founders, in alternating rows. */
export function Founders() {
  return (
    <section aria-labelledby="founders-title" className="pb-24 md:pb-32">
      <Container>
        <Eyebrow>The founders</Eyebrow>
        <SectionTitle>
          <span id="founders-title">
            The people behind <em className="text-gold">every home.</em>
          </span>
        </SectionTitle>
        <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {founders.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} mirrored={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}

const steps = [
  { title: "A free consultation", text: "When you contact us, one of our designers holds a complimentary consultation with you." },
  {
    title: "The scope",
    text: "We visit your home or review your plans to evaluate the scope of the project, which can include specifications and coordination with the contractor.",
  },
  { title: "Design in 3D", text: "We design every room and show it to you in 3D before any work begins." },
  { title: "Execution", text: "We coordinate with the contractor and monitor the work through to completion." },
];

/** "How we work": the fee model and the four steps, from the original site's copy. */
export function HowWeWork() {
  return (
    <section aria-labelledby="how-title" className="bg-sand/40 pb-20 pt-24 md:pb-24 md:pt-32">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <Eyebrow>How we work</Eyebrow>
          <SectionTitle>
            <span id="how-title">
              No set fee. <em className="text-gold">Just <span className="not-italic">10%</span> of the project cost.</em>
            </span>
          </SectionTitle>
          <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-[1.75] text-ink/75 sm:text-[1.125rem]">
            Since the work we do in each home varies, we do not have a set fee. The first consultation is complimentary, and
            our design fee is just 10% of the project cost.
          </p>
        </div>
        <ol className="border-b border-black/10">
          {steps.map(({ title, text }, i) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-black/10 py-8 sm:grid-cols-[4.5rem_1fr]">
              <span aria-hidden className="font-serif text-[1.75rem] leading-none text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-[1.5rem] font-normal leading-tight sm:text-[1.75rem]">{title}</h3>
                <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-[1.75] text-ink/75">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Short closing call to action. Kept light because the footer's "Let's design your home" follows. */
export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 md:py-28">
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="cta-title" className="font-serif text-[1.75rem] font-normal leading-[1.1] tracking-[-0.01em] text-balance sm:text-[2.5rem]">
            Begin with a conversation.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.75] text-ink/75 text-pretty">We visit your home or review your plans, at no cost.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center bg-navy px-8 font-logo text-label font-medium uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-gold"
          >
            Book a free consultation
          </a>
          <ArrowLink href="/films">See our films</ArrowLink>
        </div>
      </Container>
    </section>
  );
}

/*
 * TODO(owner): studio figures. NOT rendered on purpose.
 * The old site's stats bar (352 projects, 120+ customers, 12 awards, 15 years) contradicts the
 * founder bios (founded 2019, 30+ clients, 25+ families). Once the owner confirms real figures,
 * render <Stats items={[{ value: "…", label: "…" }]} /> between HowWeWork and ClosingCta.
 */
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section aria-label="The studio in numbers" className="py-20 md:py-28">
      <Container>
        <dl className="grid grid-cols-2 gap-y-12 border-y border-black/10 py-12 lg:grid-cols-4">
          {items.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse px-2">
              <dt className="mt-3 font-logo text-label font-medium uppercase tracking-[0.24em] text-gold-deep">{label}</dt>
              <dd className="font-serif text-[2.5rem] leading-none sm:text-[3.5rem]">{value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
