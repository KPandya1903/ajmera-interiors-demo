import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your space.",
  alternates: { canonical: "/contact" },
};

// TODO(page agent): replace this stub with the real /contact page.
export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Contact">
        <p>Tell us about your space.</p>
      </PageHeader>
      <Container className="pb-24 md:pb-32">
        <p className="text-ink/60">TODO: this page is being built.</p>
      </Container>
    </>
  );
}
