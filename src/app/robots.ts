import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// Generated from siteConfig.url so it always matches the deployment's domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in app routes; they redirect to sign-in for crawlers anyway.
      disallow: ["/projects", "/settings", "/dashboard", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
