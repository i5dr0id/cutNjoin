import type { SchemaTypeDefinition } from "sanity";
import { client } from "./client";
import { footageAsset } from "./footageAsset";
import { homePage } from "./homePage";
import { post } from "./post";
import { product } from "./product";
import { project } from "./project";
import { r2Original, r2Preview } from "./r2File";
import { sectionIntro } from "./sectionIntro";
import { service } from "./service";
import { siteSettings } from "./siteSettings";

export const singletonTypes = new Set(["homePage", "siteSettings"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  siteSettings,
  sectionIntro,
  r2Original,
  r2Preview,
  service,
  project,
  client,
  post,
  footageAsset,
  product,
];
