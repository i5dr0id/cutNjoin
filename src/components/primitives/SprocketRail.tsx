const HOLES_PER_COPY = 48;
const REEL_COPIES = 2;

const holes = Array.from({ length: HOLES_PER_COPY * REEL_COPIES });

export function SprocketRail() {
  return (
    <div aria-hidden className="flex h-6 items-center overflow-hidden bg-strip">
      <div className="flex shrink-0 animate-reel-sprocket items-center will-change-transform">
        {holes.map((_, i) => (
          <span key={i} className="mx-2 h-3.5 w-7 shrink-0 rounded-hole border border-fg/12 bg-bg" />
        ))}
      </div>
    </div>
  );
}
