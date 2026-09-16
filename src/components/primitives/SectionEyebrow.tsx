export function SectionEyebrow({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span aria-hidden className="h-px w-6 bg-fg/15" />
      {pulse && <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-accent" />}
      <span className="eyebrow text-fg/35">{label}</span>
    </div>
  );
}
