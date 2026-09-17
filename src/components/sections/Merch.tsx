import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { SanityImage, Section } from "@/components/primitives";
import { formatNaira } from "@/lib/format";
import { productPath, routes, sections } from "@/lib/site";
import type { HomePage, Product } from "./types";

function MerchTile({ product, side }: { product: Product; side: "front" | "back" }) {
  return (
    <Link href={product.slug ? productPath(product.slug) : routes.store} className="group flex flex-col">
      <div className="relative aspect-[453/567] overflow-hidden bg-card">
        <SanityImage
          image={product[side]}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex items-start justify-between pt-4">
        <span className="text-sm leading-[19.6px] font-semibold">{product.garment ?? product.name}</span>
        <span className="font-mono text-sm leading-5 text-fg/57">{formatNaira(product.price)}</span>
      </div>
    </Link>
  );
}

export function Merch({ page, products }: { page: HomePage; products: Product[] }) {
  return (
    <Section
      id={sections.merch}
      eyebrow={page.merch.eyebrow}
      heading={page.merch.heading}
      divider
      action={
        page.merch.linkLabel && (
          <Link
            href={routes.store}
            className="inline-flex items-center gap-2 text-sm leading-5 font-semibold tracking-button text-accent/70 uppercase transition-colors hover:text-accent"
          >
            <ShoppingBag aria-hidden className="size-[15px]" />
            {page.merch.linkLabel}
          </Link>
        )
      }
    >
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.flatMap((product) =>
          (["front", "back"] as const).map((side) => (
            <MerchTile key={`${product._id}-${side}`} product={product} side={side} />
          )),
        )}
      </div>
    </Section>
  );
}
