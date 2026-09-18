import { SanityImage, type SanityImageValue } from "@/components/primitives";

type ProjectPosterProps = {
  still: SanityImageValue | null;
  title: string;
  category: string;
  sizes: string;
  className?: string;
};

export function ProjectPoster({ still, title, category, sizes, className = "" }: ProjectPosterProps) {
  if (still?.asset) {
    return (
      <SanityImage
        image={still}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-card p-6">
      <span className="font-mono text-[10px] leading-[15px] tracking-[2.5px] text-fg/40 uppercase">
        {category}
      </span>
      <span className="text-2xl leading-7 font-bold tracking-[-0.5px] text-fg/70 uppercase">{title}</span>
    </div>
  );
}
