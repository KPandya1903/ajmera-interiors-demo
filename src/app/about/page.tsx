import type { Metadata } from "next";
import { ClosingCta, Founders, HowWeWork, MissionVision } from "@/components/About";
import { PageHeader } from "@/components/PageShell";
import team from "@/data/team.json";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const description =
  "Ajmera Interiors is a family-owned interior design studio in Mumbai, founded by Sanket Ajmera with co-founder Ishita Mehta. Free first consultation, 3D design before work begins, and a fee of 10% of the project cost.";

const ogImage = { url: "/hero/EFCB3640-1920.webp", width: 1920, height: 1280, alt: "Master suite with arched display niches, by Ajmera Interiors" };

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  // Page openGraph replaces the layout's, so the shared fields are repeated here.
  openGraph: {
    type: "website",
    siteName: "Ajmera Interiors",
    locale: "en_IN",
    url: "/about",
    title: "About Ajmera Interiors",
    description,
    images: [ogImage],
  },
};

const emails: Record<string, string> = {
  "Sanket Ajmera": "sanket@ajmerainteriors.com",
  "Ishita Mehta": "ishita@ajmerainteriors.com",
};

const orgId = `${SITE_URL}/#organization`;

// Facts only: no ratings, review counts or figures the owner has not confirmed.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": orgId,
      name: "Ajmera Interiors",
      url: absoluteUrl("/"),
      description,
      image: `${SITE_URL}${ogImage.url}`,
      telephone: "+91 93264 51272",
      email: ["sanket@ajmerainteriors.com", "ishita@ajmerainteriors.com"],
      address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
      areaServed: { "@type": "City", name: "Mumbai" },
      founder: team.map((p) => ({ "@id": `${absoluteUrl("/about")}#${p.name.toLowerCase().replace(/\s+/g, "-")}` })),
    },
    ...team.map((p) => ({
      "@type": "Person",
      "@id": `${absoluteUrl("/about")}#${p.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: p.name,
      jobTitle: p.role,
      image: `${SITE_URL}${p.photo}`,
      email: emails[p.name],
      worksFor: { "@id": orgId },
    })),
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            A family studio, designing <em className="text-gold">Mumbai homes.</em>
          </>
        }
      >
        <p>
          Ajmera Interiors began with a friend&apos;s home in Mumbai. Today founders Sanket Ajmera and Ishita Mehta lead a
          family-owned studio that designs homes of every size and style.
        </p>
      </PageHeader>
      <MissionVision />
      <Founders />
      <HowWeWork />
      <ClosingCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
