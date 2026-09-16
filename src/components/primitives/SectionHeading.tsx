import type { ReactNode } from "react";

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="pt-4 text-heading font-bold uppercase">
      {children}
    </h2>
  );
}
