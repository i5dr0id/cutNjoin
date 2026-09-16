import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./shared";

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    imageWithAlt("logo", "Logo (white, transparent background)"),
    defineField({ name: "url", type: "url" }),
    orderField,
  ],
  preview: { select: { title: "name", media: "logo" } },
});
