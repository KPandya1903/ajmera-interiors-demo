import type { NextConfig } from "next";

// Sub-path deploys (the GitHub Pages demo at /ajmera-interiors-demo). Empty = served at the domain root.
// Next prefixes this onto next/link hrefs, _next/ assets and the router; plain <img>/<a> URLs use
// withBase() from src/lib/site.ts, which reads the same variable. No assetPrefix: assets are
// served from the same origin, and basePath already covers _next/.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS: deployable to Cloudflare Pages, Hostinger, GitHub Pages, anywhere.
  output: "export",
  basePath,
  // Sub-path (GitHub Pages) builds emit films/index.html instead of films.html. The export also writes a
  // films/ folder of RSC payloads next to films.html, and Pages resolves /films to that folder (redirect
  // to /films/, no index.html, 404). Root builds keep the flat files the current hosts expect.
  trailingSlash: Boolean(basePath),
  // Photos are pre-optimised by `npm run photos`, so the runtime image optimiser isn't needed.
  images: { unoptimized: true },
  // Let phones/TVs on the home Wi-Fi load the dev server (dev-only; no effect on the static build).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
