import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArrowLink, SanityImage, Section } from "@/components/primitives";
import { formatDate } from "@/lib/format";
import { routes, sections } from "@/lib/site";
import type { HomePage, Post } from "./types";

function PostCard({ post, readMore }: { post: Post; readMore: string }) {
  return (
    <article className="group flex flex-col overflow-hidden border border-fg/5 bg-well transition-colors duration-200 hover:border-fg/12">
      <div className="relative h-[260px] overflow-hidden lg:h-[382px]">
        <SanityImage
          image={post.cover}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between font-mono text-[10px] leading-[15px]">
          <span className="tracking-[2.5px] text-fg/55 uppercase">{post.category}</span>
          <time dateTime={post.publishedAt} className="text-fg/50">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h3 className="text-base leading-[22px] font-semibold">{post.title}</h3>
        <p className="flex-1 text-[13px] leading-[21.1px] text-fg/55">{post.excerpt}</p>
        <Link
          href={routes.updates}
          className="inline-flex items-center gap-2 self-start text-xs leading-4 font-semibold tracking-[1.2px] text-fg/53 uppercase transition-colors hover:text-fg"
        >
          {readMore}
          <span className="sr-only">: {post.title}</span>
          <ArrowRight aria-hidden className="size-3" />
        </Link>
      </div>
    </article>
  );
}

export function Updates({ page, posts }: { page: HomePage; posts: Post[] }) {
  return (
    <Section
      id={sections.updates}
      eyebrow={page.updates.eyebrow}
      heading={page.updates.heading}
      divider
      action={page.updates.linkLabel && <ArrowLink href={routes.updates}>{page.updates.linkLabel}</ArrowLink>}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} readMore={page.updatesReadMore ?? "Read more"} />
        ))}
      </div>
    </Section>
  );
}
