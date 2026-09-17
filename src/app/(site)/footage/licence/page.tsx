import { Download } from "lucide-react";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { Container, SectionEyebrow } from "@/components/primitives";
import { getFootageTitle, getLicence } from "@/sanity/fetch";

export const metadata: Metadata = {
  title: "Free Footage Licence",
  description: "Terms for using free footage downloaded from CUT&JOIN Studios.",
  alternates: { canonical: "/footage/licence" },
};

type LicencePageProps = { searchParams: Promise<{ download?: string | string[] }> };

export default async function LicencePage({ searchParams }: LicencePageProps) {
  const { download } = await searchParams;
  const downloadId = typeof download === "string" && /^[\w.-]+$/.test(download) ? download : null;
  const [licence, footage] = await Promise.all([
    getLicence(),
    downloadId ? getFootageTitle(downloadId) : Promise.resolve(null),
  ]);

  return (
    <Container className="pt-40 pb-24">
      <div className="max-w-[720px]">
        <SectionEyebrow label="Free footage" />
        <h1 className="pt-4 text-heading font-bold uppercase">Licence</h1>
        {licence?.footageLicenceSummary && (
          <p className="pt-6 text-lg leading-[28.67px] text-fg/66">{licence.footageLicenceSummary}</p>
        )}

        {footage && (
          <form
            action={`/api/footage/${footage._id}/download`}
            method="get"
            className="mt-10 flex flex-col gap-5 border border-fg/12 bg-well p-6"
          >
            <input type="hidden" name="licence" value="accepted" />
            <p className="text-sm leading-5 text-fg/66">
              Downloading <strong className="text-fg">{footage.title}</strong>
            </p>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-fg/80">
              <input type="checkbox" required className="mt-0.5 size-4 accent-accent" />
              <span>I have read and agree to the licence below.</span>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-start bg-accent px-5 py-3 text-sm leading-5 font-semibold tracking-[1px] text-bg uppercase transition hover:brightness-110"
            >
              <Download aria-hidden className="size-3.5" />
              Download
            </button>
          </form>
        )}

        <div className="mt-12 flex flex-col gap-4 text-[15px] leading-[24.4px] text-fg/66 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:pt-2 [&_h3]:font-semibold [&_h3]:text-fg [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:text-fg [&_ul]:list-disc">
          {licence?.footageLicence ? (
            <PortableText value={licence.footageLicence} />
          ) : (
            <p>The full licence is being finalised.</p>
          )}
        </div>
      </div>
    </Container>
  );
}
