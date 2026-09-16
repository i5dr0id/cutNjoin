import { defineField, defineType } from "sanity";
import { orderField, timecodeField } from "./shared";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tag",
      type: "string",
      description: "Short code, e.g. EDIT, CLR",
      validation: (r) => r.required().max(4),
    }),
    timecodeField,
    defineField({ name: "description", type: "text", rows: 4, validation: (r) => r.required() }),
    orderField,
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tag" } },
});
