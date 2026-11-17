import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1400px] px-6 md:px-12 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] ${light ? "text-[#d9bd92]" : "text-gold"}`}>
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </p>
  );
}

export function SectionTitle({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`mt-5 font-serif text-[2.5rem] font-normal leading-[1.05] tracking-[-0.01em] sm:text-6xl ${light ? "text-ivory" : "text-ink"}`}>
      {children}
    </h2>
  );
}

export const WHATSAPP = "https://wa.me/919326451272?text=Hi%20Ajmera%20Interiors%2C%20I%27d%20like%20to%20discuss%20my%20home.";
