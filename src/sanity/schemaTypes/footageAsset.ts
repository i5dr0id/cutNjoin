import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./shared";

export const footageAsset = defineType({
  name: "footageAsset",
  title: "Free Footage",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "files", title: "Files" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "details", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Image", value: "image" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "video",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "drone",
      title: "Drone shot",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({ name: "location", type: "string", group: "details" }),
    defineField({
      name: "tags",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Words people might search for, e.g. market, traffic, sunset",
    }),
    defineField({
      name: "duration",
      type: "string",
      group: "details",
      description: "mm:ss, e.g. 00:42",
      hidden: ({ document }) => document?.kind === "image",
      validation: (r) => r.regex(/^\d{2}:\d{2}$/),
    }),
    defineField({
      name: "fps",
      title: "Frame rate",
      type: "number",
      group: "details",
      initialValue: 25,
      hidden: ({ document }) => document?.kind === "image",
    }),
    defineField({
      name: "resolution",
      type: "string",
      group: "details",
      options: { list: ["4K", "HD"] },
      initialValue: "4K",
    }),
    defineField({ name: "featured", type: "boolean", group: "details", initialValue: false }),
    orderField,

    { ...imageWithAlt("poster", "Poster"), group: "files" },
    defineField({
      name: "original",
      title: "Original file (download)",
      type: "r2Original",
      group: "files",
      description: "The full-quality file people download. Up to 5 GB.",
    }),
    defineField({
      name: "preview",
      title: "Preview clip",
      type: "r2Preview",
      group: "files",
      description: "A short, compressed 720p MP4 that plays on the website. Up to 100 MB.",
      hidden: ({ document }) => document?.kind === "image",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "poster", kind: "kind", hasFile: "original.key" },
    prepare: ({ title, subtitle, media, kind, hasFile }) => ({
      title,
      subtitle: [kind === "image" ? "Image" : "Video", subtitle, hasFile ? null : "no file yet"]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
