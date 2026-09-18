"use client";

import { useEffect } from "react";
import { Button, Container, SectionEyebrow } from "@/components/primitives";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site]", error);
  }, [error]);

  return (
    <Container className="pt-40 pb-24">
      <div className="flex max-w-[640px] flex-col items-start gap-6">
        <SectionEyebrow label="Something went wrong" />
        <h1 className="text-heading font-bold uppercase">This page didn&apos;t load</h1>
        <p className="text-lg leading-[28.67px] text-fg/66">
          The page hit an error on its way to you. Try again — if it keeps happening, email
          hello@cutandjoinstudios.com and we&apos;ll sort it out.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  );
}
