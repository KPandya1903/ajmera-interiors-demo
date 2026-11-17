/** Canonical site origin, used for metadataBase, sitemap and robots. Set NEXT_PUBLIC_SITE_URL per deploy. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ajmerainteriors.com").replace(/\/$/, "");

/** Main navigation, shared by the header (desktop + mobile) and the footer. */
export const NAV = [
  { label: "Work", href: "/#wall" },
  { label: "Films", href: "/films" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Routes listed in the sitemap. Add new pages here. */
export const ROUTES = ["/", "/films", "/about", "/contact"] as const;

/** True when `href` is the page at `pathname` (section links like /#wall never count). */
export const isCurrent = (href: string, pathname: string) =>
  !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
