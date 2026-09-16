import { defineField, defineType } from "sanity";

export const sectionIntro = defineType({
  name: "sectionIntro",
  title: "Section header",
  type: "object",
  options: { collapsible: true },
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (r) => r.required() }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "linkLabel", title: "Link label", type: "string" }),
  ],
});
