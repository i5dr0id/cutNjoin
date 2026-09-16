import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField, timecodeField } from "./shared";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      description: "e.g. Feature Film, Music Video",
      validation: (r) => r.required(),
    }),
    timecodeField,
    imageWithAlt("still", "Still"),
    defineField({ name: "videoUrl", title: "Video URL", type: "url" }),
    defineField({ name: "featured", type: "boolean", initialValue: true }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "category", media: "still" } },
});
