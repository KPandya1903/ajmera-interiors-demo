/**
 * Sub-path the site is served under ("" at a domain root, "/ajmera-interiors-demo" for the GitHub
 * Pages demo). Mirrors `basePath` in next.config.ts. next/link and metadata URLs get it automatically;
 * everything else that points at a local file (plain <img>, srcSet, <a>) must go through withBase().
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Prefixes a root-absolute local path ("/photos/x.webp") with BASE_PATH. Other URLs pass through. */
export const withBase = (path: string) => (BASE_PATH && path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path);

/**
 * Canonical site URL including the base path, used for metadataBase, JSON-LD, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL (origin only) per deploy.
 */
export const SITE_URL = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://ajmerainteriors.com").replace(/\/$/, "")}${BASE_PATH}`;

/** Sub-path builds also turn on `trailingSlash` (see next.config.ts), so their page URLs end in "/". */
const SLASH = BASE_PATH ? "/" : "";

/** Absolute URL of a route, matching the canonical tags Next emits ("https://x.com", "https://x.com/about", or "<base>/about/"). */
export const absoluteUrl = (path: string) => (path === "/" ? `${SITE_URL}${SLASH}` : `${SITE_URL}${path}${SLASH}`);

/** Demo/preview builds (NEXT_PUBLIC_NOINDEX=1) ask search engines not to index the site. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

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
