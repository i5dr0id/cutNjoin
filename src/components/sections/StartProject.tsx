import { Section } from "@/components/primitives";
import { sections } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";

export function StartProject() {
  return (
    <Section id={sections.contact} eyebrow="Work with us" heading="Start a Project">
      <div className="grid gap-12 lg:grid-cols-2">
        <div />
        <QuoteForm />
      </div>
    </Section>
  );
}
