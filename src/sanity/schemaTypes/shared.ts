import { defineField } from "sanity";

export const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  initialValue: 0,
});

export const imageWithAlt = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });

export const timecodeField = defineField({
  name: "timecode",
  title: "Timecode",
  type: "string",
  description: "HH:MM:SS:FF, e.g. 01:00:07:12",
  validation: (rule) => rule.regex(/^\d{2}:\d{2}:\d{2}:\d{2}$/, { name: "timecode" }),
});
