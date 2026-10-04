import type { MetadataRoute } from "next";
import { company } from "@/lib/content";

// Rendered once at build time for the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${company.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
