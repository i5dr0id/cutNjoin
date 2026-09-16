import { ButtonLink, Container, SectionEyebrow } from "@/components/primitives";

export function ComingSoon({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Container className="py-24">
      <SectionEyebrow label={eyebrow} />
      <h1 className="text-heading font-bold uppercase">{title}</h1>
      <p className="mt-6 max-w-xl text-fg/60">This page is on its way.</p>
      <ButtonLink href="/" variant="outline" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}
