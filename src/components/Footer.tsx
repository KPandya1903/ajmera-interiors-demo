import { Container, WHATSAPP } from "./ui";

const social = [
  ["Instagram", "https://instagram.com/ajmerainteriors"],
  ["YouTube", "https://www.youtube.com/@AjmeraInteriors"],
  ["Pinterest", "https://pin.it/2ymAAT2rU"],
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy text-ivory">
      <Container className="py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="font-serif text-5xl font-normal leading-[1.02] sm:text-7xl">
            Let&apos;s design
            <br />
            <em className="text-[#d9bd92]">your home.</em>
          </h2>
          <div>
            <p className="max-w-sm text-[17px] leading-relaxed text-ivory/70">Tell us about your space. The first consultation is free, at your home or ours.</p>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-8 inline-block bg-ivory px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-navy transition-colors hover:bg-gold hover:text-white">
              Message us on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-white/15 pt-12 text-sm sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/50">Call</p>
            <a href="tel:+919326451272" className="mt-3 block hover:text-[#d9bd92]">+91 93264 51272</a>
            <a href="tel:+917021336382" className="mt-1 block hover:text-[#d9bd92]">+91 70213 36382</a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/50">Email</p>
            <a href="mailto:sanket@ajmerainteriors.com" className="mt-3 block hover:text-[#d9bd92]">sanket@ajmerainteriors.com</a>
            <a href="mailto:ishita@ajmerainteriors.com" className="mt-1 block hover:text-[#d9bd92]">ishita@ajmerainteriors.com</a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/50">Follow</p>
            <div className="mt-3 flex gap-6">
              {social.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="hover:text-[#d9bd92]">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col justify-between gap-2 py-6 text-[11px] tracking-wide text-ivory/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Ajmera Interiors. All rights reserved.</span>
          <span>Interior design studio · Mumbai</span>
        </Container>
      </div>
    </footer>
  );
}
