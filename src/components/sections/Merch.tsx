import { Section, ButtonLink } from "@/components/primitives";
import { routes, sections } from "@/lib/site";

export function Merch() {
  return (
    <Section
      id={sections.merch}
      eyebrow="Merch (coming soon)"
      heading="Wear the Cut"
      action={
        <ButtonLink href={routes.store} variant="text">
          View full store
        </ButtonLink>
      }
    ></Section>
  );
}
