import type { Metadata } from "next";
import FilmsPageBody from "@/components/FilmsPage";
import { PageHeader } from "@/components/PageShell";
import { videos } from "@/lib/videos";

const description = "Walkthroughs and reels of homes designed by Ajmera Interiors in Mumbai: step inside, room by room.";

export const metadata: Metadata = {
  title: "Films",
  description,
  alternates: { canonical: "/films" },
  openGraph: {
    type: "website",
    siteName: "Ajmera Interiors",
    locale: "en_IN",
    url: "/films",
    title: "Films | Ajmera Interiors",
    description,
    images: [{ url: "/hero/EFCB0100-1280.webp", width: 1280, height: 853, alt: "A living room designed by Ajmera Interiors" }],
  },
};

// No VideoObject JSON-LD: Google requires uploadDate (and a thumbnail it can crawl), which we don't have
// for Drive-hosted clips. Add it once clips move to YouTube with real dates.

// The whole page sits on the dark films ground. id="videos" switches the fixed header to its dark bar.
export default function Page() {
  return (
    <div id="videos" className="bg-night text-ivory">
      <PageHeader eyebrow="Films" title={<>Walk through <em className="text-gold-soft">our homes.</em></>} light>
        <p>Short films from homes we have designed and finished. Choose a home, press play, and step inside.</p>
      </PageHeader>
      <FilmsPageBody items={videos} />
    </div>
  );
}
