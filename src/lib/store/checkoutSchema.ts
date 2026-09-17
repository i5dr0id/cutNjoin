import { z } from "zod";
import { MAX_QUANTITY_PER_LINE } from "./limits";
import { NIGERIA, nigerianStates } from "./regions";

z.config({ jitless: true });

export const cartLineSchema = z.object({
  productId: z.string().regex(/^[\w.-]+$/),
  variantKey: z.string().regex(/^[\w-]+$/),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
});

export const checkoutDetailsSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(120),
    email: z.email("Enter a valid email address").max(254),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number"),
    country: z.string().length(2, "Choose a country"),
    state: z.string().trim().min(2, "Enter your state or region").max(80),
    city: z.string().trim().min(2, "Enter your city").max(80),
    address: z.string().trim().min(5, "Enter your delivery address").max(300),
    postcode: z.string().trim().max(20).optional(),
  })
  .refine(
    (details) => details.country !== NIGERIA || (nigerianStates as readonly string[]).includes(details.state),
    {
      path: ["state"],
      message: "Choose a state",
    },
  );

export const checkoutRequestSchema = z.object({
  items: z.array(cartLineSchema).min(1, "Your cart is empty").max(20),
  details: checkoutDetailsSchema,
});

export type CartLineInput = z.infer<typeof cartLineSchema>;
export type CheckoutDetails = z.infer<typeof checkoutDetailsSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
