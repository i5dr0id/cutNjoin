import "server-only";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { serverEnv } from "@/lib/env";

const UPLOAD_URL_TTL_SECONDS = 60 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

export class R2NotConfiguredError extends Error {
  constructor() {
    super("R2 is not configured");
  }
}

let cached: { client: S3Client; accountId: string } | null = null;

function r2() {
  const config = serverEnv.r2();
  if (!config) throw new R2NotConfiguredError();
  if (cached?.accountId !== config.accountId) {
    cached = {
      accountId: config.accountId,
      client: new S3Client({
        region: "auto",
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
      }),
    };
  }
  return { client: cached.client, config };
}

export function isR2Configured() {
  return serverEnv.r2() !== null;
}

export async function createUploadUrl(key: string, contentType: string) {
  const { client, config } = r2();
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );
  return { uploadUrl, publicUrl: `${config.publicUrl}/${key}` };
}

export async function createDownloadUrl(key: string, filename: string) {
  const { client, config } = r2();
  const asciiName = filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    }),
    { expiresIn: DOWNLOAD_URL_TTL_SECONDS },
  );
}
