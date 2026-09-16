import { BackgroundTexture, SiteFooter, SiteHeader } from "@/components/layout";
import { ComingSoon } from "./(site)/_components/ComingSoon";

export default function NotFound() {
  return (
    <>
      <BackgroundTexture />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <ComingSoon eyebrow="404" title="Scene not found" />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
