import type { CSSProperties, ReactNode } from "react";

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      data-reveal=""
      style={{ "--reveal-delay": "120ms" } as CSSProperties}
      className="pt-4 text-heading font-bold uppercase"
    >
      {children}
    </h2>
  );
}
