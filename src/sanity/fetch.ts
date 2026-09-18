import "server-only";
import { cache } from "react";
import { client } from "./client";
import {
  checkoutQuery,
  footageLibraryQuery,
  productQuery,
  productSlugsQuery,
  returnsQuery,
  storeQuery,
  storeStatusQuery,
  footageTitleQuery,
  homepageQuery,
  projectsQuery,
  licenceQuery,
  seoQuery,
  siteQuery,
} from "./queries";
import type {
  CheckoutQueryResult,
  FootageLibraryQueryResult,
  ProductQueryResult,
  ProductSlugsQueryResult,
  ReturnsQueryResult,
  StoreQueryResult,
  StoreStatusQueryResult,
  FootageTitleQueryResult,
  HomepageQueryResult,
  ProjectsQueryResult,
  LicenceQueryResult,
  SeoQueryResult,
  SiteQueryResult,
} from "./types";

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

export const getLicence = cache(() =>
  client.fetch<LicenceQueryResult>(
    licenceQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["site"] } },
  ),
);

export const getFootageTitle = cache((id: string) =>
  client.fetch<FootageTitleQueryResult>(
    footageTitleQuery,
    { id },
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["footage"] } },
  ),
);

export type FootageFilter = "all" | "video" | "image" | "drone";

export const getFootageLibrary = cache((type: FootageFilter, query: string, start: number, end: number) =>
  client.fetch<FootageLibraryQueryResult>(
    footageLibraryQuery,
    { type, search: query ? `${query}*` : "", start, end },
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["footage"] } },
  ),
);

const storeCache = { next: { revalidate: REVALIDATE_SECONDS, tags: ["store"] } };

export const getProjects = cache(() =>
  client.fetch<ProjectsQueryResult>(
    projectsQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["projects"] } },
  ),
);

export const getStoreStatus = cache(() =>
  client.fetch<StoreStatusQueryResult>(storeStatusQuery, {}, storeCache),
);

export const getStore = cache(() => client.fetch<StoreQueryResult>(storeQuery, {}, storeCache));

export const getProduct = cache((slug: string) =>
  client.fetch<ProductQueryResult>(productQuery, { slug }, storeCache),
);

export const getProductSlugs = () => client.fetch<ProductSlugsQueryResult>(productSlugsQuery, {}, storeCache);

export const getCheckoutSettings = () =>
  client.fetch<CheckoutQueryResult>(checkoutQuery, {}, { cache: "no-store" });

export const getReturns = cache(() => client.fetch<ReturnsQueryResult>(returnsQuery, {}, storeCache));
