import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DecorativeText, Section } from "@/components/primitives";
import { formatTimecode } from "@/lib/format";
import { sections } from "@/lib/site";
import type { HomePage, Service } from "./types";

function ServiceCard({ service, cta }: { service: Service; cta: string }) {
  return (
    <article className="group flex flex-col gap-4 border border-fg/7 bg-card p-6 transition-colors duration-250 hover:bg-accent">
      <div className="flex items-center justify-between font-mono text-[10px] leading-[15px]">
        <DecorativeText
          text={service.timecode ? formatTimecode(service.timecode) : ""}
          className="tracking-[1px] text-fg/16 transition-colors duration-250 group-hover:text-bg/60"
        />
        <DecorativeText
          text={service.tag}
          className="border border-fg/14 px-2 py-0.5 tracking-[2px] text-fg/27 uppercase transition-colors duration-250 group-hover:border-bg/30 group-hover:text-bg/70"
        />
      </div>
      <h3 className="text-xl leading-[25px] font-semibold tracking-[-0.5px] transition-colors duration-250 group-hover:text-bg">
        {service.title}
      </h3>
      <p className="flex-1 text-sm leading-[22.75px] text-fg/58 transition-colors duration-250 group-hover:text-bg/75">
        {service.description}
      </p>
      <Link
        href={`#${sections.contact}`}
        className="inline-flex items-center gap-2 self-start pt-2 text-xs leading-4 font-semibold tracking-[1.08px] text-accent uppercase transition-colors duration-250 group-hover:text-bg"
      >
        {cta}
        <ArrowRight aria-hidden className="size-[13px]" />
      </Link>
    </article>
  );
}

export function Services({ page, services }: { page: HomePage; services: Service[] }) {
  return (
    <Section
      id={sections.services}
      eyebrow={page.services.eyebrow}
      heading={page.services.heading}
      contentGap="mt-[72px]"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} cta={page.servicesCta ?? "Book a session"} />
        ))}
      </div>
    </Section>
  );
}
