import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, SanityImage } from "@/components/primitives";
import { AddToCart } from "@/components/store/AddToCart";
import { formatNaira } from "@/lib/format";
import { productPath, routes } from "@/lib/site";
import { getProduct, getProductSlugs } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/store/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { settings, product } = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: [product.tagline, product.description].filter(Boolean).join(" "),
    alternates: { canonical: productPath(slug) },
    openGraph: product.front.asset
      ? { images: [urlFor(product.front).width(1200).height(1500).url()] }
      : undefined,
    robots: settings?.open ? undefined : { index: false, follow: true },
  };
}

export default async function ProductPage({ params }: PageProps<"/store/[slug]">) {
  const { slug } = await params;
  const { settings, product } = await getProduct(slug);
  if (!product) notFound();

  const variants = (product.variants ?? []).map(({ _key, size, stock }) => ({
    _key,
    size,
    stock: stock ?? 0,
  }));
  const onSale = settings?.open === true && product.available === true;
  const soldOut = variants.every((variant) => variant.stock <= 0);
  const thumbnail = product.front.asset ? urlFor(product.front).width(240).height(300).url() : null;

  return (
    <Container className="pt-40 pb-24">
      <Link
        href={routes.store}
        className="inline-flex items-center gap-2 text-sm leading-5 font-semibold tracking-button text-fg/55 uppercase transition-colors hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Store
      </Link>

      <div className="grid gap-12 pt-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-6 sm:grid-cols-2">
          {(["front", "back"] as const).map((side) => (
            <div key={side} className="relative aspect-[453/567] overflow-hidden bg-card">
              <SanityImage
                image={product[side]}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                preload={side === "front"}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-3">
            {product.collection && (
              <p className="font-mono text-xs leading-4 tracking-[1.2px] text-fg/55 uppercase">
                {product.collection}
              </p>
            )}
            <h1 className="text-[40px] leading-none font-bold tracking-[-1px] uppercase">{product.name}</h1>
            {product.subtitle && <p className="text-base leading-6 text-fg/66">{product.subtitle}</p>}
            <p className="pt-2 font-mono text-xl leading-7">{formatNaira(product.price)}</p>
          </div>

          {product.tagline && <p className="text-lg leading-7 font-semibold uppercase">{product.tagline}</p>}
          {product.description && (
            <p className="text-[15px] leading-[24.4px] whitespace-pre-line text-fg/66">
              {product.description}
            </p>
          )}

          {onSale && !soldOut ? (
            <AddToCart
              productId={product._id}
              name={product.name}
              slug={slug}
              price={product.price}
              imageUrl={thumbnail}
              variants={variants}
            />
          ) : (
            <p className="border border-fg/12 bg-well px-6 py-4 text-sm leading-5 text-fg/80">
              {onSale ? "Sold out — more coming soon." : "Coming soon. Orders aren't open yet."}
            </p>
          )}

          <p className="text-xs leading-5 text-fg/55">
            Delivery across Nigeria and internationally, calculated at checkout.{" "}
            <Link href={routes.returns} className="underline underline-offset-2 hover:text-fg">
              Returns policy
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
