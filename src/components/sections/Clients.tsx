import { Container } from "@/components/primitives";
import { sections } from "@/lib/site";

export function Clients() {
  return (
    <section id={sections.clients} aria-labelledby="clients-heading" className="py-12">
      <Container>
        <h2 id="clients-heading" className="eyebrow text-fg/35">
          Partners &amp; Clients
        </h2>
      </Container>
    </section>
  );
}
