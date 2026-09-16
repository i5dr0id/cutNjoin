import type { ReactNode } from "react";
import { Container } from "./Container";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionHeading } from "./SectionHeading";

type SectionProps = {
  id: string;
  eyebrow: string;
  heading: ReactNode;

  action?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Section({ id, eyebrow, heading, action, className = "", children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-24 py-12 lg:py-24 ${className}`}>
      <Container>
        <header className="mb-12 flex items-end justify-between gap-8">
          <div>
            <SectionEyebrow label={eyebrow} />
            <SectionHeading id={headingId}>{heading}</SectionHeading>
          </div>
          {action}
        </header>
        {children}
      </Container>
    </section>
  );
}
