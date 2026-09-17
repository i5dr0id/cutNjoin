import type { Metadata } from "next";
import Link from "next/link";
import { FootageGrid } from "@/components/footage/FootageGrid";
import { FootageSearch, footageTypeOptions } from "@/components/footage/FootageSearch";
import { Container, SanityImage, SectionEyebrow, buttonClasses } from "@/components/primitives";
import { routes } from "@/lib/site";
import { getFootageLibrary, type FootageFilter } from "@/sanity/fetch";

const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: "Free Footage",
  description: "Free drone videos and pictures of Lagos and Nigeria for non-commercial projects.",
  alternates: { canonical: routes.footage },
};

type FootagePageProps = {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[]; page?: string | string[] }>;
};

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

function parseFilter(value: string): FootageFilter {
  return footageTypeOptions.some((option) => option.value === value) ? (value as FootageFilter) : "all";
}

function hrefFor(params: { q: string; type: FootageFilter; page?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type !== "all") search.set("type", params.type);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `${routes.footage}?${query}` : routes.footage;
}

export default async function FootagePage({ searchParams }: FootagePageProps) {
  const params = await searchParams;
  const query = single(params.q).trim().slice(0, 80);
  const type = parseFilter(single(params.type));
  const page = Math.min(Math.max(Number.parseInt(single(params.page), 10) || 1, 1), 50);

  const library = await getFootageLibrary(type, query, 0, page * PAGE_SIZE);
  const { settings, hero, items, total } = library;
  const hasMore = items.length < total;

  return (
    <>
      <section aria-labelledby="footage-heading" className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-card">
          {hero?.poster && (
            <SanityImage image={hero.poster} fill preload sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-bg/40 via-bg/55 to-bg" />
        </div>
        <Container className="flex min-h-[560px] flex-col justify-end gap-6 pt-40 pb-16 lg:px-12">
          <SectionEyebrow label="free DRONE pictures and videos" />
          <h1 id="footage-heading" className="text-heading font-bold uppercase">
            {settings?.footageHeading ?? "Free Footage"}
          </h1>
          {settings?.footageIntro && (
            <p className="max-w-[576px] text-lg leading-[28.67px] text-fg/80">{settings.footageIntro}</p>
          )}
          <FootageSearch query={query} type={type} />
        </Container>
      </section>

      <nav aria-label="Footage type" className="border-b border-line-soft">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-12 gap-y-2 py-6 lg:gap-x-24">
            {footageTypeOptions.map((option) => {
              const active = option.value === type;
              return (
                <li key={option.value}>
                  <Link
                    href={hrefFor({ q: query, type: option.value })}
                    aria-current={active ? "page" : undefined}
                    className={`relative block py-2 text-sm leading-5 font-medium tracking-[0.35px] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-accent after:transition-opacity ${
                      active ? "text-accent after:opacity-100" : "text-fg/60 after:opacity-0 hover:text-fg"
                    }`}
                  >
                    {option.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      <Container className="py-12 lg:py-16">
        <p role="status" className="pb-8 font-mono text-xs leading-4 tracking-[1.2px] text-fg/55 uppercase">
          {total === 1 ? "1 result" : `${total} results`}
          {query && ` for “${query}”`}
        </p>

        {items.length > 0 ? (
          <FootageGrid items={items} licenceSummary={settings?.footageLicenceSummary ?? null} />
        ) : (
          <div className="flex flex-col items-start gap-6 border border-fg/7 bg-well p-8">
            <p className="text-base leading-6 text-fg/80">
              No footage matches{query ? ` “${query}”` : " this filter"} yet.
            </p>
            <Link href={routes.footage} className={buttonClasses("outline")}>
              Show all footage
            </Link>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-8">
            <Link
              href={hrefFor({ q: query, type, page: page + 1 })}
              scroll={false}
              className={buttonClasses("outline")}
            >
              Load more
            </Link>
          </div>
        )}

        <p className="pt-12 text-sm leading-5 text-fg/55">
          All footage is free for non-commercial use under the{" "}
          <Link
            href={routes.footageLicence}
            className="text-fg/80 underline underline-offset-2 hover:text-fg"
          >
            free footage licence
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
