import { defineArrayMember, defineField, defineType } from "sanity";

export const orderStatuses = [
  { title: "Awaiting payment", value: "pending" },
  { title: "Paid", value: "paid" },
  { title: "Payment failed", value: "failed" },
  { title: "Shipped", value: "shipped" },
  { title: "Delivered", value: "delivered" },
  { title: "Cancelled", value: "cancelled" },
  { title: "Refunded", value: "refunded" },
];

const readOnly = true;

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  groups: [
    { name: "status", title: "Status", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({ name: "reference", type: "string", group: "status", readOnly }),
    defineField({
      name: "status",
      type: "string",
      group: "status",
      options: { list: orderStatuses, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "trackingNumber", title: "Tracking number", type: "string", group: "status" }),
    defineField({ name: "notes", title: "Internal notes", type: "text", rows: 3, group: "status" }),
    defineField({ name: "placedAt", title: "Placed", type: "datetime", group: "status", readOnly }),
    defineField({ name: "paidAt", title: "Paid", type: "datetime", group: "status", readOnly }),
    defineField({
      name: "customer",
      type: "object",
      group: "details",
      readOnly,
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "phone", type: "string" }),
      ],
    }),
    defineField({
      name: "shipping",
      type: "object",
      group: "details",
      readOnly,
      fields: [
        defineField({ name: "country", type: "string" }),
        defineField({ name: "state", title: "State / region", type: "string" }),
        defineField({ name: "city", type: "string" }),
        defineField({ name: "address", type: "text", rows: 2 }),
        defineField({ name: "postcode", type: "string" }),
        defineField({ name: "zone", type: "string" }),
        defineField({ name: "eta", type: "string" }),
      ],
    }),
    defineField({
      name: "items",
      type: "array",
      group: "details",
      readOnly,
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "product", type: "reference", to: [{ type: "product" }], weak: true }),
            defineField({ name: "variantKey", type: "string" }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "size", type: "string" }),
            defineField({ name: "quantity", type: "number" }),
            defineField({ name: "unitPrice", title: "Unit price (₦)", type: "number" }),
          ],
          preview: {
            select: { name: "name", size: "size", quantity: "quantity", unitPrice: "unitPrice" },
            prepare: ({ name, size, quantity, unitPrice }) => ({
              title: `${quantity} × ${name} (${size})`,
              subtitle: `₦${(unitPrice ?? 0).toLocaleString("en-NG")} each`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "subtotal", title: "Subtotal (₦)", type: "number", group: "details", readOnly }),
    defineField({ name: "shippingFee", title: "Delivery (₦)", type: "number", group: "details", readOnly }),
    defineField({ name: "total", title: "Total (₦)", type: "number", group: "details", readOnly }),
    defineField({
      name: "payment",
      type: "object",
      group: "details",
      readOnly,
      fields: [
        defineField({ name: "provider", type: "string" }),
        defineField({ name: "transactionId", type: "string" }),
        defineField({ name: "channel", type: "string" }),
        defineField({ name: "amountPaid", title: "Amount paid (₦)", type: "number" }),
      ],
    }),
    defineField({ name: "stockAdjusted", type: "boolean", hidden: true, readOnly }),
    defineField({ name: "emailsSent", type: "boolean", hidden: true, readOnly }),
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "placedAt", direction: "desc" }] }],
  preview: {
    select: { reference: "reference", status: "status", name: "customer.name", total: "total" },
    prepare: ({ reference, status, name, total }) => ({
      title: `${reference} — ${name ?? "Unknown"}`,
      subtitle: `${orderStatuses.find((s) => s.value === status)?.title ?? status} · ₦${(total ?? 0).toLocaleString("en-NG")}`,
    }),
  },
});
