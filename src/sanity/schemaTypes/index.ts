import type { SchemaTypeDefinition } from "sanity";
import { client } from "./client";
import { footageAsset } from "./footageAsset";
import { homePage } from "./homePage";
import { post } from "./post";
import { order } from "./order";
import { product } from "./product";
import { project } from "./project";
import { r2Original, r2Preview } from "./r2File";
import { sectionIntro } from "./sectionIntro";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { storeSettings } from "./storeSettings";

export const singletonTypes = new Set(["homePage", "siteSettings", "storeSettings"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  siteSettings,
  storeSettings,
  sectionIntro,
  r2Original,
  r2Preview,
  service,
  project,
  client,
  post,
  footageAsset,
  product,
  order,
];
