import type { Metadata } from "next";
import ContactChannels from "@/components/ContactChannels";
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/PageShell";
import { Container } from "@/components/ui";
import { EMAILS, PHONES, SOCIAL } from "@/lib/contact";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const title = "Contact";
const description =
  "Plan your home with Ajmera Interiors, a family-owned interior design studio in Mumbai. WhatsApp or call +91 93264 51272. The first consultation is free, at your home or ours.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  // openGraph replaces the layout's object rather than merging, so repeat the site-wide fields.
  openGraph: {
    type: "website",
    siteName: "Ajmera Interiors",
    locale: "en_IN",
    url: "/contact",
    title: `${title} | Ajmera Interiors`,
    description,
  },
};

// Structured data: what we publish on the page and nothing more (no street address, rating or hours).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Ajmera Interiors",
  description: "Family-owned luxury residential interior design studio in Mumbai.",
  url: absoluteUrl("/"),
  telephone: PHONES[0].tel,
  email: EMAILS[0].address,
  areaServed: { "@type": "City", name: "Mumbai", containedInPlace: { "@type": "Country", name: "India" } },
  founder: EMAILS.map((e) => ({ "@type": "Person", name: e.name, jobTitle: e.role, email: e.address })),
  contactPoint: PHONES.map((p) => ({ "@type": "ContactPoint", telephone: p.tel, contactType: "customer service", areaServed: "IN" })),
  sameAs: SOCIAL.map((s) => s.href),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader eyebrow="Contact" title={<>Let&apos;s plan your home.</>}>
        <p>Tell us a little about your space and we will set up a first conversation. Message us, call, or fill in the form and it will arrive as a WhatsApp message you can check before sending.</p>
      </PageHeader>
      <Container className="pb-24 md:pb-32">
        <div className="grid gap-16 border-t border-black/10 pt-12 md:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <ContactChannels />
          <section aria-labelledby="enquiry-title">
            <h2 id="enquiry-title" className="font-serif text-[1.75rem] font-normal leading-tight sm:text-[2rem]">
              Plan my home
            </h2>
            <p className="mt-3 max-w-[52ch] leading-[1.7] text-ink/75">A few details help us come prepared. It takes about a minute.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
