import iconGrid from "@/assets/textures/icon-grid.webp";

const DESIGN_SCALE = 2.632;
const DESIGN_OPACITY = 0.029;

export function BackgroundTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 bg-repeat"
      style={{
        backgroundImage: `url(${iconGrid.src})`,
        backgroundSize: `${Math.round(iconGrid.width * DESIGN_SCALE)}px auto`,
        opacity: DESIGN_OPACITY,
      }}
    />
  );
}
