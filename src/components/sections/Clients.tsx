import type { CSSProperties } from "react";
import { Container, SanityImage } from "@/components/primitives";
import { sections } from "@/lib/site";
import type { Client, HomePage } from "./types";

const DEFAULT_LOGO_HEIGHT = 80;
const DESIGN_WIDTH = 1950;
const MOBILE_SCALE = 0.5;

function ClientLogo({ client }: { client: Client }) {
  const height = client.logoHeight ?? DEFAULT_LOGO_HEIGHT;
  const dimensions = client.logo.dimensions;
  const width = dimensions ? Math.round((dimensions.width / dimensions.height) * height) : height;
  const logo = (
    <SanityImage
      image={client.logo}
      width={width}
      height={height}
      sizes={`${width}px`}
      className="h-(--logo-mobile) w-auto max-w-full object-contain lg:h-(--logo-desktop)"
      style={
        {
          "--logo-mobile": `${Math.round(height * MOBILE_SCALE)}px`,
          "--logo-desktop": `min(${height}px, ${((height / DESIGN_WIDTH) * 100).toFixed(2)}vw)`,
        } as CSSProperties
      }
    />
  );
  return client.url ? (
    <a href={client.url} target="_blank" rel="noreferrer" aria-label={client.name}>
      {logo}
    </a>
  ) : (
    logo
  );
}

export function Clients({ page, clients }: { page: HomePage; clients: Client[] }) {
  return (
    <section id={sections.clients} aria-labelledby="clients-heading" className="border-y border-line-soft">
      <Container className="py-12">
        <h2 id="clients-heading" className="text-center eyebrow leading-[15px] tracking-[3.5px] text-fg/49">
          {page.clientsHeading}
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-y-8 pt-8 lg:min-h-[min(152px,7.8vw)] lg:flex-nowrap lg:justify-between lg:gap-4 lg:pt-0">
          {clients.map((client) => (
            <li
              key={client._id}
              className="flex basis-1/3 justify-center px-3 sm:basis-1/4 lg:basis-auto lg:px-0"
            >
              <ClientLogo client={client} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
