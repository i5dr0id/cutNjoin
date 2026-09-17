import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "social", title: "Social" },
    { name: "footer", title: "Footer" },
    { name: "footage", title: "Footage licence" },
  ],
  fields: [
    defineField({ name: "email", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "phone", type: "string", group: "contact" }),
    defineField({ name: "address", title: "Full address", type: "string", group: "contact" }),
    defineField({ name: "addressShort", title: "Short address", type: "string", group: "contact" }),
    defineField({
      name: "location",
      title: "Map location",
      type: "object",
      group: "contact",
      description: "Coordinates for search engines. Copy them from Google Maps.",
      fields: [
        defineField({ name: "latitude", type: "number", validation: (r) => r.min(-90).max(90) }),
        defineField({ name: "longitude", type: "number", validation: (r) => r.min(-180).max(180) }),
      ],
    }),
    defineField({
      name: "hoursSummary",
      title: "Hours summary",
      type: "string",
      description: "e.g. Mon – Fri: 9am – 7pm WAT",
      group: "contact",
    }),
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
    defineField({ name: "footerBlurb", title: "About text", type: "text", rows: 3, group: "footer" }),
    defineField({ name: "copyrightName", title: "Copyright name", type: "string", group: "footer" }),
    defineField({
      name: "footageHeading",
      title: "Footage page heading",
      type: "string",
      group: "footage",
      initialValue: "Free Footage",
    }),
    defineField({
      name: "footageIntro",
      title: "Footage page intro",
      type: "string",
      group: "footage",
    }),
    defineField({
      name: "footageLicenceSummary",
      title: "Licence summary",
      type: "text",
      rows: 3,
      group: "footage",
      description: "One or two sentences shown before every download.",
    }),
    defineField({
      name: "footageLicence",
      title: "Full licence",
      type: "array",
      group: "footage",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
