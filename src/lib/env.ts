import "server-only";

export const serverEnv = {
  resendApiKey: () => process.env.RESEND_API_KEY,
  contactTo: () => process.env.CONTACT_TO_EMAIL,
  contactFrom: () => process.env.CONTACT_FROM_EMAIL ?? "CUT&JOIN Website <onboarding@resend.dev>",
};
