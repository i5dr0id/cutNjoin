const TEXTURE_OPACITY = 0.07;
const TEXTURE_SRC: string | null = null;

export function BackgroundTexture() {
  if (!TEXTURE_SRC) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-repeat"
      style={{ opacity: TEXTURE_OPACITY, backgroundImage: `url(${TEXTURE_SRC})` }}
    />
  );
}
