import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: `next build` writes the whole site to `out/`. No server runtime.
  output: "export",
  images: {
    // GitHub Pages has no image optimizer; serve the files in /public as-is.
    unoptimized: true,
  },
};

export default nextConfig;
