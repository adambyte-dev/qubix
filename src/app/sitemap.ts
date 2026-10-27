import type { MetadataRoute } from "next";
import { SLUG_CONFIGS } from "@/lib/slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://qubix-two.vercel.app";
  const now = new Date();

  const slugEntries: MetadataRoute.Sitemap = Object.keys(SLUG_CONFIGS).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...slugEntries,
  ];
}
