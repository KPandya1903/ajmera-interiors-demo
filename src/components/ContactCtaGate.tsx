"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders its children everywhere except /contact, where the page itself is the call to action (used by the footer CTA). */
export default function ContactCtaGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/contact" || pathname === "/contact/" ? null : children;
}
