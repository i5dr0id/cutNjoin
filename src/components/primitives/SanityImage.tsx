import { Image } from "next-sanity/image";
import type { CSSProperties } from "react";
import type { SanityImageCrop, SanityImageHotspot } from "@/sanity/types";
import { urlFor } from "@/sanity/image";

export type SanityImageValue = {
  asset?: { _ref: string };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt: string;
};

type SanityImageProps = {
  image: SanityImageValue;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
} & ({ fill: true; width?: never; height?: never } | { fill?: false; width: number; height: number });

export function SanityImage({
  image,
  sizes,
  className = "",
  style,
  preload = false,
  ...dimensions
}: SanityImageProps) {
  if (!image.asset) return null;
  const objectPosition = image.hotspot
    ? `${(image.hotspot.x ?? 0.5) * 100}% ${(image.hotspot.y ?? 0.5) * 100}%`
    : undefined;
  return (
    <Image
      src={urlFor(image).url()}
      alt={image.alt}
      sizes={sizes}
      preload={preload}
      className={className}
      style={{ objectPosition, ...style }}
      {...dimensions}
    />
  );
}
