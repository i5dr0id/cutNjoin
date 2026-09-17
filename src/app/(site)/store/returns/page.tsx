import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { Container, SectionEyebrow } from "@/components/primitives";
import { routes } from "@/lib/site";
import { getReturns } from "@/sanity/fetch";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Returns and exchanges policy for the CUT&JOIN Studios store.",
  alternates: { canonical: routes.returns },
};

export default async function ReturnsPage() {
  const settings = await getReturns();

  return (
    <Container className="pt-40 pb-24">
      <div className="max-w-[720px]">
        <SectionEyebrow label="Store" />
        <h1 className="pt-4 text-heading font-bold uppercase">Returns &amp; exchanges</h1>
        <div className="mt-12 flex flex-col gap-4 text-[15px] leading-[24.4px] text-fg/66 [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:pt-2 [&_h3]:font-semibold [&_h3]:text-fg [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:text-fg [&_ul]:list-disc">
          {settings?.returnsPolicy ? (
            <PortableText value={settings.returnsPolicy} />
          ) : (
            <p>Our returns policy is being finalised. Contact us about any issue with your order.</p>
          )}
        </div>
      </div>
    </Container>
  );
}
