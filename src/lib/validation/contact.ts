import { z } from "zod";

z.config({ jitless: true });

export const projectTypes = [
  "Digital Editing",
  "Color Grading",
  "Video Production",
  "Sound Design",
  "Equipment Rental",
  "Training / Workshop",
  "Other",
] as const;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number"),
  email: z.email("Enter a valid email address").max(254),
  projectType: z.enum(projectTypes, "Choose a project type"),
  description: z
    .string()
    .trim()
    .min(10, "Tell us a little about the project")
    .max(5000, "Keep the description under 5,000 characters"),
  company: z.string().max(200).optional(),
  startedAt: z.number().int().positive().optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = Exclude<keyof ContactInput, "company" | "startedAt" | "turnstileToken">;
