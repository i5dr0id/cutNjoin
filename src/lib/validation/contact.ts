import { z } from "zod";

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
  fullName: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number"),
  email: z.email("Enter a valid email address"),
  projectType: z.enum(projectTypes, "Choose a project type"),
  description: z.string().trim().min(10, "Tell us a little about the project").max(5000),

  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
