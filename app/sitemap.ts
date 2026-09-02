import type { MetadataRoute } from "next";
import { teas } from "@/lib/teas";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/teas", priority: 0.9, freq: "weekly" as const },
    { path: "/wholesale", priority: 0.9, freq: "monthly" as const },
    { path: "/request", priority: 0.9, freq: "monthly" as const },
    { path: "/origins", priority: 0.8, freq: "monthly" as const },
    { path: "/journey", priority: 0.8, freq: "monthly" as const },
    { path: "/tea-finder", priority: 0.7, freq: "monthly" as const },
    { path: "/about", priority: 0.7, freq: "monthly" as const },
    { path: "/faq", priority: 0.7, freq: "monthly" as const },
    { path: "/contact", priority: 0.7, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${site.url}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...teas.map((t) => ({
      url: `${site.url}/teas/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
