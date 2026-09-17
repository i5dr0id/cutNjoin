import "server-only";
import { cache } from "react";
import { client } from "./client";
import {
  footageLibraryQuery,
  footageTitleQuery,
  homepageQuery,
  licenceQuery,
  seoQuery,
  siteQuery,
} from "./queries";
import type {
  FootageLibraryQueryResult,
  FootageTitleQueryResult,
  HomepageQueryResult,
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
