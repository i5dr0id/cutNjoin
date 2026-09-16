import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { urlFor } from "@/sanity/image";
import { getSeo } from "@/sanity/fetch";

export const alt = "CUT&JOIN Studios — post-production in Lagos, Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const ACCENT = "#3DDC4F";
const INK = "#0D0D0D";
const PAPER = "#F2F2F2";

export default async function OpengraphImage() {
  const [seo, poppinsBold, logo] = await Promise.all([
    getSeo(),
    readFile(join(process.cwd(), "src/assets/fonts/Poppins-Bold.ttf")),
    readFile(join(process.cwd(), "src/assets/brand/logo-white.png")),
  ]);

  const photo = seo?.shareImage?.asset ? seo.shareImage : seo?.heroImage;
  const photoUrl = photo?.asset
    ? urlFor(photo).width(size.width).height(size.height).fit("crop").url()
    : null;
  const headline = seo?.heroHeadline ?? ["WE CUT.", "WE JOIN.", "WE FINISH", "THE STORY."];
  const highlight = seo?.heroHighlight ?? "";

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: INK, position: "relative" }}>
      {photoUrl && (
        <img
          src={photoUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage:
            "linear-gradient(90deg, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.75) 45%, rgba(13,13,13,0) 85%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          width: "100%",
        }}
      >
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" height={96} width={137} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {headline.map((line) => {
            const [before, after] =
              highlight && line.includes(highlight) ? line.split(highlight) : [line, null];
            return (
              <div
                key={line}
                style={{
                  display: "flex",
                  whiteSpace: "pre",
                  fontSize: 76,
                  lineHeight: 0.95,
                  letterSpacing: -2,
                  color: PAPER,
                }}
              >
                <span>{before}</span>
                {after !== null && <span style={{ color: ACCENT }}>{highlight}</span>}
                {after !== null && <span>{after}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: ACCENT }}>
          POST-PRODUCTION · LAGOS, NIGERIA
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Poppins", data: poppinsBold, weight: 700, style: "normal" }] },
  );
}
