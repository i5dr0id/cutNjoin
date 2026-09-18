import type { MetadataRoute } from "next";
import { productPath, routes, siteConfig } from "@/lib/site";
import { getProductSlugs, getStoreStatus } from "@/sanity/fetch";

const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await getStoreStatus();
  const productSlugs = store?.open ? await getProductSlugs() : [];

  const entries: MetadataRoute.Sitemap = [
    { url: url(routes.home), changeFrequency: "weekly", priority: 1 },
    { url: url(routes.projects), changeFrequency: "weekly", priority: 0.8 },
    { url: url(routes.footage), changeFrequency: "weekly", priority: 0.7 },
    { url: url(routes.footageLicence), changeFrequency: "yearly", priority: 0.3 },
  ];

  if (store?.open) {
    entries.push({ url: url(routes.store), changeFrequency: "weekly", priority: 0.8 });
    for (const slug of productSlugs) {
      entries.push({ url: url(productPath(slug)), changeFrequency: "weekly", priority: 0.7 });
    }
    entries.push({ url: url(routes.returns), changeFrequency: "yearly", priority: 0.3 });
  }

  return entries;
}
