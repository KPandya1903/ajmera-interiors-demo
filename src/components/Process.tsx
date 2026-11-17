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
        <ol className="mt-16 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <li key={title} className="bg-ivory p-8 lg:p-10">
              <span className="font-serif text-5xl text-gold/70">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.16em]">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
