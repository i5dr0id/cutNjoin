export function SectionEyebrow({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-6 bg-fg/16" />
      {pulse && (
        <span
          aria-hidden
          className="size-[7px] shrink-0 animate-pulse-dot rounded-full bg-accent shadow-[0_0_6px_rgb(61_220_79/0.5)]"
        />
      )}
      <span className="eyebrow leading-[15px] text-fg/55">{label}</span>
    </div>
  );
}
