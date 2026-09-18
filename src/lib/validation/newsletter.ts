import { z } from "zod";

z.config({ jitless: true });

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  company: z.string().max(200).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
