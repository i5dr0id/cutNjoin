import { Section, ButtonLink } from "@/components/primitives";
import { routes, sections } from "@/lib/site";

export function Projects() {
  return (
    <Section
      id={sections.projects}
      eyebrow="Featured Work"
      heading="Projects"
      action={
        <ButtonLink href={routes.projects} variant="text">
          See all projects
        </ButtonLink>
      }
    />
  );
}
