import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./shared";

export const footageAsset = defineType({
  name: "footageAsset",
  title: "Free Footage",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "duration",
      type: "string",
      description: "mm:ss, e.g. 00:42",
      validation: (r) => r.regex(/^\d{2}:\d{2}$/),
    }),
    defineField({ name: "fps", title: "Frame rate", type: "number", initialValue: 25 }),
    defineField({ name: "resolution", type: "string", options: { list: ["4K", "HD"] }, initialValue: "4K" }),
    imageWithAlt("poster", "Poster"),
    defineField({ name: "previewUrl", title: "Preview video URL", type: "url" }),
    defineField({ name: "downloadUrl", title: "Download URL", type: "url" }),
    defineField({ name: "licence", type: "text", rows: 3 }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "location", media: "poster" } },
});
