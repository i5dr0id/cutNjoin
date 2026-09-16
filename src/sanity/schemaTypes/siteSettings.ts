import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroIntro", type: "text", rows: 3, group: "hero" }),
    { ...imageWithAlt("heroImage", "Hero image"), group: "hero" },
    defineField({ name: "heroVideoUrl", title: "Showreel URL", type: "url", group: "hero" }),
    defineField({
      name: "stats",
      type: "array",
      group: "hero",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", description: "e.g. 200+" }),
            defineField({ name: "label", type: "string", description: "e.g. Projects Delivered" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({ name: "address", type: "string", group: "contact" }),
    defineField({
      name: "hours",
      title: "Work hours",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "hoursRow",
          fields: [
            defineField({ name: "days", type: "string", description: "e.g. Monday – Friday" }),
            defineField({ name: "time", type: "string", description: "e.g. 9:00am – 7:00pm, or Closed" }),
          ],
          preview: { select: { title: "days", subtitle: "time" } },
        }),
      ],
    }),
    defineField({
      name: "socials",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: ["YouTube", "Instagram", "Facebook", "LinkedIn", "X", "TikTok"] },
            }),
            defineField({ name: "url", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
