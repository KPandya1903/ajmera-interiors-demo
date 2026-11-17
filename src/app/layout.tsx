import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Lato, Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Typography from the original site (docs/03-design-system.md): Bodoni Moda headings, Lato body,
// Montserrat for the logo, nav and small uppercase labels.
const heading = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "variable", // 400–900 in one file; opsz lets the display sizes use the fine high-contrast cut
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const logo = Montserrat({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "variable", // labels use 400–600
  display: "swap",
});

const description =
  "Ajmera Interiors is a family-owned interior design studio in Mumbai. Luxury homes, 3D design before work begins, and budgets that respect yours.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ajmera Interiors | Interior Designers in Mumbai",
    template: "%s | Ajmera Interiors",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Ajmera Interiors",
    locale: "en_IN",
    title: "Ajmera Interiors | Interior Designers in Mumbai",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // let the page run under the notch; header, buttons and gutters pad with env(safe-area-inset-*)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2a44" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${logo.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only font-logo focus:not-sr-only focus:fixed focus:left-[max(1rem,env(safe-area-inset-left))] focus:top-[max(1rem,env(safe-area-inset-top))] focus:z-[60] focus:bg-navy focus:px-5 focus:py-3 focus:text-label focus:font-medium focus:uppercase focus:tracking-[0.2em] focus:text-ivory"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
