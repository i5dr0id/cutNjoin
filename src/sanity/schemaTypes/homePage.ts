import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

const groups = [
  { name: "hero", title: "Hero", default: true },
  { name: "services", title: "Services" },
  { name: "projects", title: "Projects" },
  { name: "clients", title: "Clients" },
  { name: "updates", title: "Updates" },
  { name: "footage", title: "Free Footage" },
  { name: "merch", title: "Merch" },
  { name: "contact", title: "Contact" },
  { name: "seo", title: "SEO & sharing" },
];

const section = (name: string, group: string) =>
  defineField({ name, title: "Header", type: "sectionIntro", group, validation: (r) => r.required() });

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups,
  fields: [
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({
      name: "heroHeadline",
      title: "Headline lines",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: "heroHighlight",
      title: "Highlighted word",
      description: "Shown in green. Must appear in one of the headline lines.",
      type: "string",
      group: "hero",
    }),
    defineField({ name: "heroIntro", title: "Intro", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroPrimaryCta", title: "Primary button", type: "string", group: "hero" }),
    defineField({ name: "heroSecondaryCta", title: "Secondary button", type: "string", group: "hero" }),
    { ...imageWithAlt("heroImage", "Image"), group: "hero" },
    defineField({
      name: "heroVideo",
      title: "Showreel file",
      type: "r2Preview",
      group: "hero",
      description: "MP4 or WebM up to 100MB. Used before the showreel link when both are set.",
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Showreel link",
      type: "url",
      group: "hero",
      description: "YouTube or Vimeo link, used when no file is uploaded.",
    }),
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

    section("services", "services"),
    defineField({ name: "servicesCta", title: "Card button", type: "string", group: "services" }),

    section("projects", "projects"),

    defineField({ name: "clientsHeading", title: "Heading", type: "string", group: "clients" }),

    section("updates", "updates"),
    defineField({ name: "updatesReadMore", title: "Card link label", type: "string", group: "updates" }),

    section("footage", "footage"),
    defineField({ name: "footageDownload", title: "Download button", type: "string", group: "footage" }),

    section("merch", "merch"),

    section("contact", "contact"),
    defineField({ name: "contactIntro", title: "Intro", type: "text", rows: 4, group: "contact" }),
    defineField({ name: "contactFormHeading", title: "Form heading", type: "string", group: "contact" }),
    defineField({ name: "contactSubmit", title: "Submit button", type: "string", group: "contact" }),
    { ...imageWithAlt("contactImage", "Image"), group: "contact" },

    defineField({
      name: "seoTitle",
      title: "Search title",
      type: "string",
      group: "seo",
      description: "Shown in search results and browser tabs. Aim for under 60 characters.",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Shown under the title in search results. Aim for 120–160 characters.",
      validation: (r) => r.max(200),
    }),
    {
      ...imageWithAlt("shareImage", "Share image", false),
      group: "seo",
      description: "Background photo for the social share card. Leave empty to use the hero image.",
    },
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
