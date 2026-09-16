import type { SchemaTypeDefinition } from "sanity";
import { client } from "./client";
import { footageAsset } from "./footageAsset";
import { post } from "./post";
import { product } from "./product";
import { project } from "./project";
import { service } from "./service";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  service,
  project,
  client,
  post,
  footageAsset,
  product,
];
