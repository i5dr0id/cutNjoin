import "server-only";
import { writeClient } from "@/sanity/writeClient";

const currentMonth = () => new Date().toISOString().slice(0, 7);

export async function recordFootageDownload(id: string) {
  const month = currentMonth();
  try {
    const client = writeClient();
    await client
      .patch(id)
      .setIfMissing({ downloads: 0, downloadsByMonth: [] })
      .inc({ downloads: 1 })
      .set({ lastDownloadedAt: new Date().toISOString() })
      .commit({ visibility: "async" });

    await client
      .patch(id)
      .inc({ [`downloadsByMonth[_key=="${month}"].count`]: 1 })
      .commit({ visibility: "async" })
      .catch(() =>
        client
          .patch(id)
          .append("downloadsByMonth", [{ _key: month, _type: "monthlyCount", count: 1 }])
          .commit({ visibility: "async" }),
      );
  } catch (error) {
    console.error("[footage] download count", id, error);
  }
}
