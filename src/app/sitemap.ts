import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";

export const dynamic = "force-static"; // required for output: "export"

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
