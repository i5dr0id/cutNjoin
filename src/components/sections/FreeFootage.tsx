import { Section, ButtonLink } from "@/components/primitives";
import { routes, sections } from "@/lib/site";

export function FreeFootage() {
  return (
    <Section
      id={sections.footage}
      eyebrow="free DRONE pictures and videos"
      heading="Free Footage"
      action={
        <ButtonLink href={routes.footage} variant="text">
          View more footage
        </ButtonLink>
      }
    />
  );
}
