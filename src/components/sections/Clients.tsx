import { Container, SanityImage } from "@/components/primitives";
import { sections } from "@/lib/site";
import type { Client, HomePage } from "./types";

const DEFAULT_LOGO_HEIGHT = 80;
const DESIGN_WIDTH = 1950;

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
      className="w-auto object-contain"
      style={{ height: `min(${height}px, ${((height / DESIGN_WIDTH) * 100).toFixed(2)}vw)` }}
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
        <h2 id="clients-heading" className="text-center eyebrow leading-[15px] tracking-[3.5px] text-fg/16">
          {page.clientsHeading}
        </h2>
        <ul className="flex min-h-[min(152px,7.8vw)] items-center justify-between gap-4">
          {clients.map((client) => (
            <li key={client._id} className="flex">
              <ClientLogo client={client} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
