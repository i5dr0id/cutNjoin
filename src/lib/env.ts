import "server-only";

export const serverEnv = {
  resendApiKey: () => process.env.RESEND_API_KEY,
  contactTo: () => process.env.CONTACT_TO_EMAIL,
  newsletterAudienceId: () => process.env.RESEND_AUDIENCE_ID,
  contactFrom: () => process.env.CONTACT_FROM_EMAIL ?? "CUT&JOIN Website <onboarding@resend.dev>",
  sanityWriteToken: () => process.env.NEXT_SANITY_API_WRITE_TOKEN,
  paystackSecretKey: () => process.env.PAYSTACK_SECRET_KEY,
  turnstileSecretKey: () => process.env.TURNSTILE_SECRET_KEY,
  turnstileHostnames: () => process.env.TURNSTILE_HOSTNAMES,
  r2: () => {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET;
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
    return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/$/, "") };
  },
};
