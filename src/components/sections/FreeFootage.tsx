import { Section, ButtonLink } from "@/components/primitives";
import { routes, sections } from "@/lib/site";

export function FreeFootage() {
  return (
    <Section
      id={sections.footage}
      eyebrow="Free Footage"
      heading="free DRONE pictures and videos"
      action={
        <ButtonLink href={routes.footage} variant="text">
          View more footage
        </ButtonLink>
      }
    ></Section>
  );
}
