import type { MetadataRoute } from "next";
import { routes, siteConfig } from "@/lib/site";

const indexedRoutes = [routes.home, routes.footage, routes.footageLicence];

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedRoutes.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: path === routes.footageLicence ? "yearly" : "weekly",
    priority: path === routes.home ? 1 : 0.7,
  }));
}
