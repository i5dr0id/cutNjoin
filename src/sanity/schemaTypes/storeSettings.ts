import { defineArrayMember, defineField, defineType } from "sanity";
import { countries, nigerianStates } from "@/lib/store/regions";

export const storeSettings = defineType({
  name: "storeSettings",
  title: "Store settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "nigeria", title: "Nigeria delivery" },
    { name: "international", title: "International delivery" },
    { name: "policies", title: "Policies" },
  ],
  fields: [
    defineField({
      name: "open",
      title: "Store open",
      type: "boolean",
      group: "general",
      initialValue: false,
      description: "When off, the store shows “coming soon” and checkout is disabled.",
    }),
    defineField({ name: "heading", type: "string", group: "general", initialValue: "Wear the Cut" }),
    defineField({ name: "intro", type: "text", rows: 2, group: "general" }),
    defineField({
      name: "orderEmail",
      title: "Order notification email",
      type: "string",
      group: "general",
      description: "Where new order notifications are sent. Defaults to the contact inbox.",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "nigeriaRates",
      title: "Delivery fee by state (₦)",
      type: "array",
      group: "nigeria",
      description: "States without a fee can't be delivered to.",
      of: [
        defineArrayMember({
          type: "object",
          name: "stateRate",
          fields: [
            defineField({
              name: "state",
              type: "string",
              options: { list: [...nigerianStates] },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "fee",
              title: "Fee (₦)",
              type: "number",
              validation: (r) => r.min(0).integer(),
            }),
            defineField({
              name: "eta",
              title: "Delivery time",
              type: "string",
              description: "e.g. 1–2 working days",
            }),
          ],
          preview: {
            select: { title: "state", fee: "fee", eta: "eta" },
            prepare: ({ title, fee, eta }) => ({
              title,
              subtitle: [fee === undefined ? "No fee set" : `₦${fee.toLocaleString("en-NG")}`, eta]
                .filter(Boolean)
                .join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "internationalZones",
      title: "International delivery zones",
      type: "array",
      group: "international",
      of: [
        defineArrayMember({
          type: "object",
          name: "shippingZone",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "countries",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: {
                list: countries.filter((c) => c.code !== "NG").map((c) => ({ title: c.name, value: c.code })),
              },
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: "fee",
              title: "Fee (₦)",
              type: "number",
              validation: (r) => r.min(0).integer(),
            }),
            defineField({ name: "eta", title: "Delivery time", type: "string" }),
          ],
          preview: {
            select: { title: "name", fee: "fee", countries: "countries" },
            prepare: ({ title, fee, countries: codes }) => ({
              title,
              subtitle: [
                fee === undefined ? "No fee set" : `₦${fee.toLocaleString("en-NG")}`,
                `${codes?.length ?? 0} countries`,
              ].join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "restOfWorldFee",
      title: "Rest of the world fee (₦)",
      type: "number",
      group: "international",
      description: "Used for countries not in any zone. Leave empty to not ship there.",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "restOfWorldEta",
      title: "Rest of the world delivery time",
      type: "string",
      group: "international",
    }),
    defineField({
      name: "returnsPolicy",
      title: "Returns & exchanges policy",
      type: "array",
      group: "policies",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Store settings" }) },
});
