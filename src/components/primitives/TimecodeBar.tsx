const TICK_PATTERN_WIDTH = 36;
const PATTERN_REPEATS_PER_COPY = 80;
const REEL_COPIES = 2;
const reelWidth = TICK_PATTERN_WIDTH * PATTERN_REPEATS_PER_COPY * REEL_COPIES;

export function TimecodeBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full items-center gap-3 overflow-hidden ${className}`}>
      <span className="shrink-0 font-mono text-[10px] tracking-widest text-fg/19 select-none">
        TC 01:00:00:00
      </span>
      <div className="relative h-4 flex-1 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 animate-reel-timecode timecode-ticks will-change-transform"
          style={{ width: reelWidth }}
        />
      </div>
      <span className="shrink-0 font-mono text-[10px] tracking-widest text-fg/13 select-none">
        TC 01:00:30:00
      </span>
    </div>
  );
}

export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`px-8 lg:px-16 ${className}`}>
      <TimecodeBar className="opacity-30" />
    </div>
  );
}
