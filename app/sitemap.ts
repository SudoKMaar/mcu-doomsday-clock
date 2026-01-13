import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mcu-doomsday-clock.vercel.app",
      lastModified: "2025-01-13",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
