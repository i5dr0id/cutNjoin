const TICK_PATTERN_LENGTH = 12;
const PATTERN_REPEATS_PER_COPY = 80;
const REEL_COPIES = 2;
const REEL_DURATION = "16s";

const tickPositions = Array.from(
  { length: TICK_PATTERN_LENGTH * PATTERN_REPEATS_PER_COPY * REEL_COPIES },
  (_, i) => i % TICK_PATTERN_LENGTH,
);

function tickClasses(position: number) {
  if (position === 0) return "h-4 bg-tick-beat";
  if (position === 4 || position === 8) return "h-2.5 bg-tick";
  return "h-[5px] bg-tick";
}

export function TimecodeBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full items-center gap-3 overflow-hidden ${className}`}>
      <span className="shrink-0 font-mono text-[10px] tracking-widest text-fg/20 select-none">
        TC 01:00:00:00
      </span>
      <div className="relative h-4 flex-1 overflow-hidden">
        <div
          data-reel={REEL_DURATION}
          className="absolute top-0 left-0 flex h-4 items-end will-change-transform"
        >
          {tickPositions.map((position, i) => (
            <span key={i} className={`mr-px w-0.5 shrink-0 ${tickClasses(position)}`} />
          ))}
        </div>
      </div>
      <span className="shrink-0 font-mono text-[10px] tracking-widest text-fg/15 select-none">
        TC 01:00:30:00
      </span>
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="px-8 lg:px-16">
      <TimecodeBar className="opacity-30" />
    </div>
  );
}
