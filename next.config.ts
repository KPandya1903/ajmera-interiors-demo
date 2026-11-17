import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS: deployable to Cloudflare Pages, Hostinger, anywhere.
  output: "export",
  // Photos are pre-optimised by `npm run photos`, so the runtime image optimiser isn't needed.
  images: { unoptimized: true },
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
