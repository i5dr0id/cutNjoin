import { Section, ButtonLink } from "@/components/primitives";
import { routes, sections } from "@/lib/site";

export function Updates() {
  return (
    <Section
      id={sections.updates}
      eyebrow="From the Studio"
      heading="Updates"
      action={
        <ButtonLink href={routes.updates} variant="text">
          View more
        </ButtonLink>
      }
    />
  );
}
