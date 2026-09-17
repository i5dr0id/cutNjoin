export const footageFileKinds = {
  original: {
    accept: [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/tiff",
    ],
    maxBytes: 5 * 1024 ** 3,
  },
  preview: {
    accept: ["video/mp4", "video/webm"],
    maxBytes: 100 * 1024 ** 2,
  },
} as const;

export type FootageFileKind = keyof typeof footageFileKinds;

export function isFootageFileKind(value: unknown): value is FootageFileKind {
  return typeof value === "string" && value in footageFileKinds;
}

export function safeFilename(filename: string) {
  const cleaned = filename
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned.slice(-120) || "file";
}

export function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}
