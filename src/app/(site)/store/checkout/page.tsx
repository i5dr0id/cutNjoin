import type { Metadata } from "next";
import { Container, SectionEyebrow, ButtonLink } from "@/components/primitives";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { routes } from "@/lib/site";
import { getCheckoutSettings } from "@/sanity/fetch";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const settings = await getCheckoutSettings();

  return (
    <Container className="pt-40 pb-24">
      <SectionEyebrow label="Store" />
      <h1 className="pt-4 pb-12 text-heading font-bold uppercase">Checkout</h1>
      {settings?.open ? (
        <CheckoutForm
          rates={{
            nigeriaRates: settings.nigeriaRates ?? [],
            internationalZones: settings.internationalZones ?? [],
            restOfWorldFee: settings.restOfWorldFee ?? null,
            restOfWorldEta: settings.restOfWorldEta ?? null,
          }}
        />
      ) : (
        <div className="flex flex-col items-start gap-6">
          <p className="text-base leading-6 text-fg/80">The store isn&apos;t taking orders right now.</p>
          <ButtonLink href={routes.store} variant="outline">
            Back to the store
          </ButtonLink>
        </div>
      )}
    </Container>
  );
}
