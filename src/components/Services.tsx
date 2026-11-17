import { Container } from "./ui";

const items = [
  ["Residential interiors", "Complete homes, from 1 BHK apartments to 5 BHK residences."],
  ["3D design first", "See every room in 3D and approve it before work begins."],
  ["Lighting & automation", "Cove, profile and accent lighting planned with the layout."],
  ["Turnkey execution", "One team from first sketch to handover, on a budget you set."],
];

export default function Services() {
  return (
    <section className="border-b border-black/[0.07] bg-ivory">
      <Container className="grid grid-cols-1 divide-y divide-black/[0.07] sm:grid-cols-2 sm:gap-x-16 sm:divide-y-0 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
        {items.map(([title, text]) => (
          <div key={title} className="py-10 lg:px-8 lg:first:pl-0 lg:last:pr-0">
            <span className="block h-px w-8 bg-gold" aria-hidden />
            <h3 className="mt-5 font-logo text-[0.8125rem] font-semibold uppercase tracking-[0.16em]">{title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/65">{text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
