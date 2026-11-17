import { Container, Eyebrow, SectionTitle } from "./ui";

const steps = [
  ["Consultation", "A free first meeting. We visit your home or study the plans and understand how you live."],
  ["3D design", "Every room is designed and shown to you in 3D. Nothing is built until you approve it."],
  ["Execution", "Our team manages carpentry, lighting and finishes, and keeps you updated throughout."],
  ["Handover", "A finished, styled home, ready to live in."],
];

export default function Process() {
  return (
    <section id="process" className="py-24 md:py-32">
      <Container>
        <Eyebrow>How we work</Eyebrow>
        <SectionTitle>
          From first visit <em className="text-gold">to handover.</em>
        </SectionTitle>
        <ol className="mt-16 grid divide-y divide-black/10 border-t border-black/10 sm:grid-cols-2 sm:gap-x-16 sm:divide-y-0 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
          {steps.map(([title, text], i) => (
            <li key={title} className="py-8 lg:px-8 lg:py-10 lg:first:pl-0 lg:last:pr-0">
              <span className="font-serif text-4xl text-gold/70">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[0.8125rem] font-semibold uppercase tracking-[0.16em]">{title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/65">{text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
