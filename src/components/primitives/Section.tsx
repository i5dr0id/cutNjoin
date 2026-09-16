import type { ReactNode } from "react";
import { Container } from "./Container";
import { SectionEyebrow } from "./SectionEyebrow";
import { SectionHeading } from "./SectionHeading";
import { SectionDivider } from "./TimecodeBar";

type SectionProps = {
  id: string;
  eyebrow: string;
  heading: ReactNode;
  action?: ReactNode;
  divider?: boolean;
  bleed?: boolean;
  contentGap?: string;
  className?: string;
  children?: ReactNode;
};

export function Section({
  id,
  eyebrow,
  heading,
  action,
  divider = false,
  bleed = false,
  contentGap = "mt-16",
  className = "",
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  const content = <div className={contentGap}>{children}</div>;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative scroll-mt-24 py-12 lg:py-24 ${className}`}
    >
      {divider && <SectionDivider className="absolute inset-x-0 top-10" />}
      <Container>
        <header className="flex items-end justify-between gap-8">
          <div>
            <SectionEyebrow label={eyebrow} />
            <SectionHeading id={headingId}>{heading}</SectionHeading>
          </div>
          {action}
        </header>
        {!bleed && content}
      </Container>
      {bleed && content}
    </section>
  );
}
