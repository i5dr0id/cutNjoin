import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./shared";

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    imageWithAlt("logo", "Logo (white, transparent background)"),
    defineField({
      name: "logoHeight",
      title: "Display height (px)",
      type: "number",
      description: "Height of the logo in the homepage row at desktop width",
      initialValue: 80,
      validation: (r) => r.min(16).max(200),
    }),
    defineField({ name: "url", type: "url" }),
    orderField,
  ],
  preview: { select: { title: "name", media: "logo" } },
});
