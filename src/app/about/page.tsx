import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the founders and the studio behind every home.",
  alternates: { canonical: "/about" },
};

// TODO(page agent): replace this stub with the real /about page.
export default function Page() {
  return (
    <>
      <PageHeader eyebrow="The studio" title="About">
        <p>Meet the founders and the studio behind every home.</p>
      </PageHeader>
      <Container className="pb-24 md:pb-32">
        <p className="text-ink/60">TODO: this page is being built.</p>
      </Container>
    </>
  );
}
