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
      <Container className="grid grid-cols-1 divide-y divide-black/[0.07] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {items.map(([title, text], i) => (
          <div key={title} className="py-10 sm:px-8 lg:first:pl-0 lg:last:pr-0">
            <p className="font-serif text-sm italic text-gold">0{i + 1}</p>
            <h3 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em]">{title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
