import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// Public marketing pages only; placeholders (about, blog, contact) are left
// out until they have real content.
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/term-of-service", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: "weekly",
    priority,
  }));
}
