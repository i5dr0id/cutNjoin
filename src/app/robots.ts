import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [routes.studio, "/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
