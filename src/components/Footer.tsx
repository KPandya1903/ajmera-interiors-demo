import Link from "next/link";
import { NAV } from "@/lib/site";
import { EMAILS, PHONES, SOCIAL } from "@/lib/contact";
import ContactCtaGate from "./ContactCtaGate";
import { Container, WHATSAPP } from "./ui";

// The footer keeps id="contact" on every page: /#contact links land here, and the floating WhatsApp
// button hides while it is in view. The big CTA block is skipped on /contact, which is itself the CTA.
export default function Footer() {
  return (
    <footer id="contact" className="bg-navy text-ivory">
      <Container className="pb-24 pt-16 md:pb-32 md:pt-20">
        <ContactCtaGate>
          <div className="mb-12 grid gap-12 border-b border-white/15 pb-24 pt-8 md:pt-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="font-serif text-[clamp(2.5rem,14vw,3rem)] font-normal leading-[1.02] sm:text-7xl">
              Let&apos;s design
              <br />
              <em className="text-gold-soft">your home.</em>
            </h2>
            <div>
              <p className="max-w-sm text-[1.0625rem] leading-relaxed text-ivory/70">Tell us about your space. The first consultation is free, at your home or ours.</p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block bg-ivory px-8 py-4 text-center font-logo text-label font-medium uppercase tracking-[0.22em] text-navy transition-colors hover:bg-gold hover:text-white"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </ContactCtaGate>

        <div className="grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Footer">
            <p className="font-logo text-micro uppercase tracking-[0.24em] text-ivory/50">Explore</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 max-lg:mt-0.5">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="block hover:text-gold-soft max-lg:py-2.5">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-logo text-micro uppercase tracking-[0.24em] text-ivory/50">Call</p>
            {PHONES.map((p, i) => (
              <a key={p.tel} href={`tel:${p.tel}`} className={`block hover:text-gold-soft max-lg:py-2.5 ${i ? "mt-1 max-lg:mt-0" : "mt-3 max-lg:mt-0.5"}`}>
                {p.display}
              </a>
            ))}
          </div>
          <div>
            <p className="font-logo text-micro uppercase tracking-[0.24em] text-ivory/50">Email</p>
            {EMAILS.map((e, i) => (
              <a key={e.address} href={`mailto:${e.address}`} className={`block hover:text-gold-soft max-lg:py-2.5 ${i ? "mt-1 max-lg:mt-0" : "mt-3 max-lg:mt-0.5"}`}>
                {e.address}
              </a>
            ))}
          </div>
          <div>
            <p className="font-logo text-micro uppercase tracking-[0.24em] text-ivory/50">Follow</p>
            <div className="mt-3 flex flex-wrap gap-x-6 max-lg:mt-0.5">
              {SOCIAL.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="hover:text-gold-soft max-lg:py-2.5">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col justify-between gap-2 pb-24 pt-6 text-label tracking-wide text-ivory/45 sm:flex-row sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <span>© {new Date().getFullYear()} Ajmera Interiors. All rights reserved.</span>
          <span>Interior design studio · Mumbai</span>
        </Container>
      </div>
    </footer>
  );
}
