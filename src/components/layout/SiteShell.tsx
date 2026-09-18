import type { ReactNode } from "react";
import { CartDrawer } from "@/components/store/CartDrawer";
import { getSite, getStoreStatus } from "@/sanity/fetch";
import { BackgroundTexture } from "./BackgroundTexture";
import { CustomCursor } from "./CustomCursor";
import { MotionProvider } from "./MotionProvider";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SmoothScroll } from "./SmoothScroll";
import { WhatsAppButton } from "./WhatsAppButton";

export async function SiteShell({ children }: { children: ReactNode }) {
  const [store, { settings }] = await Promise.all([getStoreStatus(), getSite()]);
  return (
    <MotionProvider>
      <div className="relative isolate flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <BackgroundTexture />
        <CustomCursor />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        {store?.open && <CartDrawer />}
        {settings?.whatsappNumber && (
          <WhatsAppButton
            number={settings.whatsappNumber}
            message={settings.whatsappMessage}
            label="Chat with us"
          />
        )}
      </div>
    </MotionProvider>
  );
}
