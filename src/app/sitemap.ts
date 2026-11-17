import type { MetadataRoute } from "next";
import { ROUTES, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static"; // required for output: "export"

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
