import type { HomepageQueryResult } from "@/sanity/types";

export type HomePage = NonNullable<HomepageQueryResult["page"]>;
export type Service = HomepageQueryResult["services"][number];
export type Project = HomepageQueryResult["projects"][number];
export type Client = HomepageQueryResult["clients"][number];
export type Post = HomepageQueryResult["posts"][number];
export type Footage = HomepageQueryResult["footage"][number];
export type Product = HomepageQueryResult["products"][number];
