import Link from "next/link";
import { SanityImage, type SanityImageValue } from "@/components/primitives";
import { formatNaira } from "@/lib/format";

type ProductCardProps = {
  href: string;
  name: string;
  subtitle: string | null;
  price: number;
  front: SanityImageValue;
  back: SanityImageValue;
  status: string | null;
};

export function ProductCard({ href, name, subtitle, price, front, back, status }: ProductCardProps) {
  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-[453/567] overflow-hidden bg-card">
        <SanityImage
          image={front}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <SanityImage
          image={back}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {status && (
          <span className="absolute top-4 right-4 border border-fg/10 bg-bg/75 px-3 py-1.5 font-mono text-xs leading-4 tracking-[1.2px] text-fg/80 uppercase backdrop-blur-sm">
            {status}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <h2 className="text-base leading-6 font-semibold">{name}</h2>
          {subtitle && (
            <p className="font-mono text-xs leading-4 tracking-[1.2px] text-fg/55 uppercase">{subtitle}</p>
          )}
        </div>
        <span className="font-mono text-sm leading-5 text-fg/57">{formatNaira(price)}</span>
      </div>
    </Link>
  );
}
