import { MapPin } from "lucide-react";
import { ArrowLink, SanityImage, Section } from "@/components/primitives";
import { routes, sections } from "@/lib/site";
import { FavouriteButton } from "./FavouriteButton";
import { FootageDownload } from "./FootageDownload";
import { FootagePreview } from "./FootagePreview";
import type { Footage, HomePage } from "./types";

const specs = (item: Footage) => [item.fps && `${item.fps}fps`, item.resolution].filter(Boolean).join(" · ");

type DownloadProps = { licenceSummary: string | null; downloadLabel: string };

function FeaturedFootage({ item, licenceSummary, downloadLabel }: { item: Footage } & DownloadProps) {
  return (
    <article className="group relative h-[420px] overflow-hidden bg-well lg:h-[808px]">
      <FootagePreview src={item.previewUrl}>
        <SanityImage
          image={item.poster}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </FootagePreview>
      {item.location && (
        <p className="absolute top-6 left-6 flex items-center gap-1.5 border border-fg/10 bg-bg/75 px-3 py-1.5 font-mono text-xs leading-4 tracking-[1.2px] text-fg/80 backdrop-blur-[8px]">
          <MapPin aria-hidden className="size-[11px]" />
          {item.location}
        </p>
      )}
      <FavouriteButton id={item._id} title={item.title} size="large" className="absolute top-4 right-4" />
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg leading-[27px] font-semibold">{item.title}</h3>
          <p className="flex gap-3 font-mono text-[11px] leading-[16.5px] tracking-[1.1px]">
            <span className="text-fg/55">{item.duration}</span>
            <span className="text-fg/51">{specs(item)}</span>
          </p>
        </div>
        <FootageDownload
          id={item._id}
          title={item.title}
          available={item.hasDownload}
          licenceSummary={licenceSummary}
          label={downloadLabel}
          variant="button"
        />
      </div>
    </article>
  );
}

function FootageTile({ item, licenceSummary, downloadLabel }: { item: Footage } & DownloadProps) {
  return (
    <article className="group relative h-[260px] overflow-hidden bg-well lg:h-[348px]">
      <FootagePreview src={item.previewUrl}>
        <SanityImage
          image={item.poster}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </FootagePreview>
      <FavouriteButton id={item._id} title={item.title} size="small" className="absolute top-3 right-3" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div>
          <h3 className="text-xs leading-[16.5px] font-medium text-fg/80">{item.title}</h3>
          <p className="pt-2 font-mono text-[10px] leading-[15px] tracking-[1px] text-fg/52">
            {[item.duration, specs(item)].filter(Boolean).join(" · ")}
          </p>
        </div>
        <FootageDownload
          id={item._id}
          title={item.title}
          available={item.hasDownload}
          licenceSummary={licenceSummary}
          label={downloadLabel}
          variant="icon"
        />
      </div>
    </article>
  );
}

type FreeFootageProps = { page: HomePage; footage: Footage[]; licenceSummary: string | null };

export function FreeFootage({ page, footage, licenceSummary }: FreeFootageProps) {
  const [featured, ...tiles] = footage;
  const downloadLabel = page.footageDownload ?? "Download";
  return (
    <Section
      id={sections.footage}
      eyebrow={page.footage.eyebrow}
      heading={page.footage.heading}
      divider
      action={page.footage.linkLabel && <ArrowLink href={routes.footage}>{page.footage.linkLabel}</ArrowLink>}
    >
      {featured && (
        <FeaturedFootage item={featured} licenceSummary={licenceSummary} downloadLabel={downloadLabel} />
      )}
      <div className="grid gap-4 pt-4 pb-12 lg:grid-cols-3">
        {tiles.map((item) => (
          <FootageTile
            key={item._id}
            item={item}
            licenceSummary={licenceSummary}
            downloadLabel={downloadLabel}
          />
        ))}
      </div>
    </Section>
  );
}
