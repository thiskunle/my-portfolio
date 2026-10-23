import type { ImageLoaderProps } from "next/image";

/** Widths pre-rendered for every image in public/services (see lib/content.ts). */
const serviceWidths = [640, 960, 1280, 1920] as const;

/**
 * Site-wide next/image loader (images.loaderFile in next.config.ts). The site is a static
 * export, so Next cannot resize images at build time. The service artwork therefore ships at
 * fixed widths, and this picks the smallest one covering the requested width (<name>.webp is
 * the 1280px file). Every other image is marked `unoptimized` where it is used and is served
 * as-is; this loader returns its src unchanged as a fallback.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!src.startsWith("/services/")) return src;
  const w = serviceWidths.find((candidate) => candidate >= width) ?? serviceWidths[serviceWidths.length - 1];
  return w === 1280 ? src : src.replace(/\.webp$/, `-${w}.webp`);
}
