import { defineField, defineType } from "sanity";

export const monthlyCount = defineType({
  name: "monthlyCount",
  title: "Monthly count",
  type: "object",
  fields: [defineField({ name: "count", type: "number", readOnly: true })],
  preview: {
    select: { count: "count" },
    prepare: ({ count }) => ({ title: `${count ?? 0}` }),
  },
});
