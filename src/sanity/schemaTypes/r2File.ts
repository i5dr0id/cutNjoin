import { defineField, defineType } from "sanity";
import { createR2FileInput } from "../components/R2FileInput";

const r2FileFields = [
  defineField({ name: "key", type: "string", readOnly: true }),
  defineField({ name: "url", type: "url", readOnly: true }),
  defineField({ name: "filename", type: "string", readOnly: true }),
  defineField({ name: "size", type: "number", readOnly: true }),
  defineField({ name: "contentType", title: "Content type", type: "string", readOnly: true }),
];

export const r2Original = defineType({
  name: "r2Original",
  title: "Original file",
  type: "object",
  fields: r2FileFields,
  components: { input: createR2FileInput("original") },
});

export const r2Preview = defineType({
  name: "r2Preview",
  title: "Preview video",
  type: "object",
  fields: r2FileFields,
  components: { input: createR2FileInput("preview") },
});
