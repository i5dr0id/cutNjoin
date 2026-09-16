const HOLES_PER_COPY = 48;
const REEL_COPIES = 2;
const REEL_DURATION = "14s";

const holes = Array.from({ length: HOLES_PER_COPY * REEL_COPIES });

export function SprocketRail() {
  return (
    <div aria-hidden className="flex h-6 items-center overflow-hidden bg-strip">
      <div data-reel={REEL_DURATION} className="flex shrink-0 items-center will-change-transform">
        {holes.map((_, i) => (
          <span key={i} className="mx-2 h-3.5 w-7 shrink-0 border border-fg/12 bg-bg" />
        ))}
      </div>
    </div>
  );
}
