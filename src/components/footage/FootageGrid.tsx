import { SanityImage, PlayButton } from "@/components/primitives";
import { FavouriteButton } from "@/components/sections/FavouriteButton";
import { FootageDownload } from "@/components/sections/FootageDownload";
import { FootagePreview } from "@/components/sections/FootagePreview";
import type { FootageLibraryQueryResult } from "@/sanity/types";

type Item = FootageLibraryQueryResult["items"][number];

const DEFAULT_RATIO = 16 / 9;

function FootageCard({ item, licenceSummary }: { item: Item; licenceSummary: string | null }) {
  const dimensions = item.poster.dimensions;
  const ratio = dimensions ? dimensions.width / dimensions.height : DEFAULT_RATIO;
  const specs = [item.duration, item.fps && `${item.fps}fps`, item.resolution].filter(Boolean).join(" · ");
  return (
    <article
      className="group relative mb-6 break-inside-avoid overflow-hidden bg-well"
      style={{ aspectRatio: ratio }}
    >
      <FootagePreview src={item.previewUrl}>
        <SanityImage
          image={item.poster}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </FootagePreview>
      {item.kind === "video" && (
        <PlayButton
          label={`Play ${item.title}`}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-0"
        />
      )}
      <FavouriteButton id={item._id} title={item.title} size="small" className="absolute top-3 right-3" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-bg/85 to-transparent p-4 pt-12">
        <div className="min-w-0">
          <h2 className="truncate text-sm leading-5 font-medium">{item.title}</h2>
          <p className="pt-1 font-mono text-[10px] leading-[15px] tracking-[1px] text-fg/60">
            {[item.location, specs].filter(Boolean).join(" · ")}
          </p>
        </div>
        <FootageDownload
          id={item._id}
          title={item.title}
          available={item.hasDownload}
          licenceSummary={licenceSummary}
          label="Download"
          variant="icon"
        />
      </div>
    </article>
  );
}

export function FootageGrid({ items, licenceSummary }: { items: Item[]; licenceSummary: string | null }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <FootageCard key={item._id} item={item} licenceSummary={licenceSummary} />
      ))}
    </div>
  );
}
