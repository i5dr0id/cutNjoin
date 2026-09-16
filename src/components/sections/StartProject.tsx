import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import {
  Container,
  SanityImage,
  SectionDivider,
  SectionEyebrow,
  SectionHeading,
} from "@/components/primitives";
import { sections } from "@/lib/site";
import type { SiteQueryResult } from "@/sanity/types";
import { LazyQuoteForm } from "./LazyQuoteForm";
import type { HomePage } from "./types";

type Settings = SiteQueryResult["settings"];

function Detail({ icon: Icon, children, href }: { icon: LucideIcon; children: string; href?: string }) {
  const content = (
    <>
      <Icon aria-hidden className="size-[15px] shrink-0" />
      {children}
    </>
  );
  const className = "flex items-center gap-3 text-sm leading-5 text-fg/59";
  return (
    <li>
      {href ? (
        <a href={href} className={`${className} transition-colors hover:text-fg`}>
          {content}
        </a>
      ) : (
        <span className={className}>{content}</span>
      )}
    </li>
  );
}

export function StartProject({ page, settings }: { page: HomePage; settings: Settings }) {
  const headingId = `${sections.contact}-heading`;
  return (
    <section
      id={sections.contact}
      aria-labelledby={headingId}
      className="relative scroll-mt-24 py-12 lg:py-24"
    >
      <SectionDivider className="absolute inset-x-0 top-10" />
      <Container className="grid items-start gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div>
            <SectionEyebrow label={page.contact.eyebrow} />
            <SectionHeading id={headingId}>{page.contact.heading}</SectionHeading>
            {page.contactIntro && (
              <p className="pt-6 text-[15px] leading-[24.4px] text-fg/58">{page.contactIntro}</p>
            )}
          </div>
          <div className="relative h-[280px] overflow-hidden bg-card lg:h-[480px]">
            <SanityImage
              image={page.contactImage}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <ul className="flex flex-col gap-4">
            {settings?.email && (
              <Detail icon={Mail} href={`mailto:${settings.email}`}>
                {settings.email}
              </Detail>
            )}
            {settings?.phone && (
              <Detail icon={Phone} href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                {settings.phone}
              </Detail>
            )}
            {settings?.addressShort && <Detail icon={MapPin}>{settings.addressShort}</Detail>}
            {settings?.hoursSummary && <Detail icon={Clock}>{settings.hoursSummary}</Detail>}
          </ul>
        </div>
        <LazyQuoteForm
          heading={page.contactFormHeading ?? "Request a Quote"}
          submitLabel={page.contactSubmit ?? "Submit brief"}
          fallbackEmail={settings?.email}
        />
      </Container>
    </section>
  );
}
