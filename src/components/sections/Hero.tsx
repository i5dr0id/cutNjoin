import { ButtonLink, Container, SectionEyebrow, TimecodeBar } from "@/components/primitives";
import { sections } from "@/lib/site";

export function Hero() {
  return (
    <section id={sections.hero} aria-labelledby="hero-heading" className="relative">
      <TimecodeBar className="px-8 py-2" />
      <Container className="py-24">
        <SectionEyebrow label="Post Production Services" pulse />
        <h1 id="hero-heading" className="text-6xl leading-none font-bold uppercase">
          <span className="block">We cut.</span>
          <span className="block">We join.</span>
          <span className="block">
            We <span className="text-accent">finish</span>
          </span>
          <span className="block">the story.</span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href={`#${sections.contact}`}>Get a quote</ButtonLink>
          <ButtonLink href={`#${sections.projects}`} variant="outline">
            See our work
          </ButtonLink>
        </div>
      </Container>
      <TimecodeBar className="px-8 py-2" />
    </section>
  );
}
