import type { Metadata } from "next";
import FilmsTeaser from "@/components/FilmsTeaser";
import Hero from "@/components/Hero";
import PhotoWall from "@/components/PhotoWall";
import Services from "@/components/Services";
import StudioTeaser from "@/components/StudioTeaser";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Header, <main id="main">, Footer (the #contact CTA strip) and the WhatsApp button come from the root layout.
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <PhotoWall />
      <FilmsTeaser />
      <StudioTeaser />
    </>
  );
}
