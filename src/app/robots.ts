import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/site";

export const dynamic = "force-static"; // required for output: "export"

// Note: crawlers only read robots.txt at a domain root, so under a sub-path (the Pages demo) this file
// is advisory; the noindex <meta> from the root layout is what keeps a demo out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: NOINDEX ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
