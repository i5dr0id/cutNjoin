import "server-only";
import { escapeHtml } from "@/lib/html";
import type { ContactInput } from "@/lib/validation/contact";

type Brief = Omit<ContactInput, "company" | "startedAt">;

const stripLineBreaks = (value: string) => value.replace(/[\r\n]+/g, " ");

export function briefEmail(brief: Brief, receivedAt = new Date()) {
  const rows: [string, string][] = [
    ["Name", brief.fullName],
    ["Email", brief.email],
    ["Phone", brief.phone],
    ["Project type", brief.projectType],
  ];
  const received = receivedAt.toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = stripLineBreaks(`New brief: ${brief.projectType} — ${brief.fullName}`);

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    `Received: ${received} WAT`,
    "",
    brief.description,
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#0d0d0d;font-family:Arial,Helvetica,sans-serif;color:#f2f2f2">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#161616;border:1px solid #2a2a2a">
      <tr><td style="padding:24px 24px 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#3ddc4f">New project brief</td></tr>
      <tr><td style="padding:0 24px 16px;font-size:22px;font-weight:bold">${escapeHtml(brief.fullName)}</td></tr>
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 24px;font-size:14px"><span style="color:#8a8a8a">${label}:</span> ${escapeHtml(value)}</td></tr>`,
        )
        .join("\n      ")}
      <tr><td style="padding:16px 24px 8px;font-size:12px;color:#8a8a8a">Received ${escapeHtml(received)} WAT</td></tr>
      <tr><td style="padding:8px 24px 24px;font-size:15px;line-height:1.6;white-space:pre-wrap;border-top:1px solid #2a2a2a">${escapeHtml(brief.description)}</td></tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
