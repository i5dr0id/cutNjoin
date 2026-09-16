import "server-only";
import { cache } from "react";
import { client } from "./client";
import { homepageQuery, seoQuery, siteQuery } from "./queries";
import type { HomepageQueryResult, SeoQueryResult, SiteQueryResult } from "./types";

const REVALIDATE_SECONDS = 60;

export const getHomepage = cache(() =>
  client.fetch<HomepageQueryResult>(
    homepageQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["homepage"] } },
  ),
);

export const getSite = cache(() =>
  client.fetch<SiteQueryResult>(siteQuery, {}, { next: { revalidate: REVALIDATE_SECONDS, tags: ["site"] } }),
);

export const getSeo = cache(() =>
  client.fetch<SeoQueryResult>(
    seoQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["homepage"] } },
  ),
);
