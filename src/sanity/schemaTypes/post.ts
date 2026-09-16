import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

export const post = defineType({
  name: "post",
  title: "Update",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "string", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", title: "Date", type: "datetime", validation: (r) => r.required() }),
    imageWithAlt("cover", "Cover image"),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
    defineField({
      name: "body",
      type: "array",
      of: [defineArrayMember({ type: "block" }), defineArrayMember({ type: "image" })],
    }),
    defineField({ name: "author", type: "string" }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});
