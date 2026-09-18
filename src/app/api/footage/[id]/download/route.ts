import { clientIdFrom, createRateLimiter } from "@/lib/rateLimit";
import { R2NotConfiguredError, createDownloadUrl } from "@/lib/r2";
import { routes } from "@/lib/site";
import { recordFootageDownload } from "@/lib/stats";
import { client } from "@/sanity/client";

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 30 });
const noStore = { "Cache-Control": "no-store" };

type DownloadableFootage = { title: string; original: { key?: string; filename?: string } | null } | null;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);

  if (url.searchParams.get("licence") !== "accepted") {
    const licenceUrl = new URL(routes.footageLicence, url);
    licenceUrl.searchParams.set("download", id);
    return Response.redirect(licenceUrl, 303);
  }

  if (isRateLimited(clientIdFrom(request))) {
    return new Response("Too many downloads. Please try again in a few minutes.", {
      status: 429,
      headers: noStore,
    });
  }

  const footage = await client.fetch<DownloadableFootage>(
    `*[_type == "footageAsset" && _id == $id][0]{ title, original }`,
    { id },
    { cache: "no-store" },
  );
  const key = footage?.original?.key;
  if (!footage || !key) return new Response("Not found", { status: 404, headers: noStore });

  try {
    const downloadUrl = await createDownloadUrl(key, footage.original?.filename ?? `${footage.title}`);
    await recordFootageDownload(id);
    return new Response(null, { status: 302, headers: { Location: downloadUrl, ...noStore } });
  } catch (error) {
    if (error instanceof R2NotConfiguredError) {
      return new Response("Downloads are not available yet.", { status: 503, headers: noStore });
    }
    console.error("[footage] download", error);
    return new Response("Download failed.", { status: 500, headers: noStore });
  }
}
