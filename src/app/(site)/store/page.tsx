import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionEyebrow } from "@/components/primitives";
import { ProductCard } from "@/components/store/ProductCard";
import { productPath, routes } from "@/lib/site";
import { getStore } from "@/sanity/fetch";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getStore();
  return {
    title: "Store",
    description: "The Timeline Collection — T-shirts by CUT&JOIN Studios.",
    alternates: { canonical: routes.store },
    robots: settings?.open ? undefined : { index: false, follow: true },
  };
}

export default async function StorePage() {
  const { settings, products } = await getStore();
  const open = settings?.open === true;

  return (
    <Container className="pt-40 pb-24">
      <div className="max-w-[720px]">
        <SectionEyebrow label={open ? "Merch" : "Merch (coming soon)"} />
        <h1 className="pt-4 text-heading font-bold uppercase">{settings?.heading ?? "Wear the Cut"}</h1>
        <p className="pt-6 text-lg leading-[28.67px] text-fg/66">
          {settings?.intro ?? "Tools. Techniques. Stories. This is our language."}
        </p>
        {!open && <p className="pt-4 text-sm leading-5 text-fg/55">Orders open soon — check back shortly.</p>}
      </div>

      <div className="grid gap-x-6 gap-y-12 pt-16 sm:grid-cols-2">
        {products.map((product) =>
          product.slug ? (
            <ProductCard
              key={product._id}
              href={productPath(product.slug)}
              name={product.name}
              subtitle={product.subtitle}
              price={product.price}
              front={product.front}
              back={product.back}
              status={!open ? "Coming soon" : !product.available || !product.inStock ? "Sold out" : null}
            />
          ) : null,
        )}
      </div>

      {open && (
        <p className="pt-16 text-sm leading-5 text-fg/55">
          Delivery across Nigeria and internationally.{" "}
          <Link href={routes.returns} className="underline underline-offset-2 hover:text-fg">
            Returns policy
          </Link>
        </p>
      )}
    </Container>
  );
}
