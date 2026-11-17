import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Films",
  description: "Walk through our homes, room by room.",
  alternates: { canonical: "/films" },
};

// TODO(page agent): replace this stub with the real /films page.
export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Walkthroughs and reels" title="Films">
        <p>Walk through our homes, room by room.</p>
      </PageHeader>
      <Container className="pb-24 md:pb-32">
        <p className="text-ink/60">TODO: this page is being built.</p>
      </Container>
    </>
  );
}
