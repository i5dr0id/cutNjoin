import { randomUUID } from "node:crypto";
import { z } from "zod";
import { footageFileKinds, safeFilename } from "@/lib/footage/files";
import { R2NotConfiguredError, createUploadUrl } from "@/lib/r2";
import { verifyEditor } from "@/sanity/verifyEditor";

const requestSchema = z.object({
  documentId: z.string().regex(/^(drafts\.)?[\w.-]+$/),
  kind: z.enum(["original", "preview"]),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().int().positive(),
});

export async function POST(request: Request) {
  const editor = await verifyEditor(request.headers.get("authorization"));
  if (!editor)
    return Response.json({ error: "Sign in to the Studio as an editor to upload files." }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid upload request." }, { status: 400 });

  const { documentId, kind, filename, contentType, size } = parsed.data;
  const rules = footageFileKinds[kind];
  if (!(rules.accept as readonly string[]).includes(contentType)) {
    return Response.json(
      { error: `${contentType || "This file type"} is not allowed here.` },
      { status: 415 },
    );
  }
  if (size > rules.maxBytes) {
    return Response.json({ error: "This file is larger than the upload limit." }, { status: 413 });
  }

  const publishedId = documentId.replace(/^drafts\./, "");
  const key = `footage/${publishedId}/${kind}/${randomUUID()}-${safeFilename(filename)}`;

  try {
    const { uploadUrl, publicUrl } = await createUploadUrl(key, contentType);
    return Response.json({ uploadUrl, key, url: publicUrl });
  } catch (error) {
    if (error instanceof R2NotConfiguredError) {
      return Response.json({ error: "File storage (Cloudflare R2) is not configured yet." }, { status: 503 });
    }
    console.error("[footage] upload url", error);
    return Response.json({ error: "Could not prepare the upload." }, { status: 500 });
  }
}
