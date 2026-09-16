import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/lib/site";

const indexedRoutes = [routes.home];

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedRoutes.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: 1,
  }));
}
