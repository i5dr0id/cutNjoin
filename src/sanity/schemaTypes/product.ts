import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./shared";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "e.g. 01 THE EDIT",
      validation: (r) => r.required(),
    }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "collection", type: "string", initialValue: "The Timeline Collection" }),
    defineField({ name: "subtitle", type: "string", description: "e.g. Digital Editing" }),
    defineField({ name: "garment", type: "string", initialValue: "T-shirt" }),
    defineField({ name: "tagline", type: "string", description: "e.g. EVERY CUT TELLS A STORY." }),
    defineField({
      name: "price",
      title: "Price (₦)",
      type: "number",
      validation: (r) => r.required().positive().integer(),
    }),
    imageWithAlt("front", "Front"),
    imageWithAlt("back", "Back"),
    defineField({
      name: "variants",
      title: "Sizes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "size",
              type: "string",
              options: { list: ["XS", "S", "M", "L", "XL", "XXL"] },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "stock",
              type: "number",
              initialValue: 0,
              validation: (r) => r.required().min(0).integer(),
            }),
          ],
          preview: {
            select: { size: "size", stock: "stock" },
            prepare: ({ size, stock }) => ({
              title: size,
              subtitle: stock > 0 ? `${stock} in stock` : "Sold out",
            }),
          },
        }),
      ],
    }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({
      name: "unitsSold",
      title: "Units sold",
      type: "number",
      readOnly: true,
      initialValue: 0,
      description: "Counted when an order is paid",
    }),
    defineField({
      name: "available",
      title: "On sale",
      type: "boolean",
      initialValue: false,
      description: "Off = coming soon",
    }),
    orderField,
  ],
  orderings: [
    { name: "unitsSoldDesc", title: "Best selling", by: [{ field: "unitsSold", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "subtitle", media: "front", unitsSold: "unitsSold" },
    prepare: ({ title, subtitle, media, unitsSold }) => ({
      title,
      subtitle: [subtitle, unitsSold ? `${unitsSold} sold` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
