import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS: deployable to Cloudflare Pages, Hostinger, anywhere.
  output: "export",
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
