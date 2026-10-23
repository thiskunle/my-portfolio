import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: `next build` writes the whole site to `out/`. No server runtime.
  output: "export",
  images: {
    // GitHub Pages has no image optimizer. lib/imageLoader.ts serves pre-sized variants of the
    // service artwork; every other image sets `unoptimized` and is served from /public as-is.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
