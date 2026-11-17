import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PhotoWall from "@/components/PhotoWall";
import Process from "@/components/Process";
import Services from "@/components/Services";
import VideoRow from "@/components/VideoRow";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <PhotoWall />
        <VideoRow />
        <About />
        <Process />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
