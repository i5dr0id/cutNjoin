import { PlayIcon } from "@/components/icons/PlayIcon";

const face =
  "grid size-[72px] place-items-center rounded-full border-[1.36px] border-fg/32 bg-scrim text-fg/92 backdrop-blur-[6px] transition-all duration-300";
const interactive = "hover:scale-112 hover:border-fg/60 hover:bg-bg/72";

type PlayButtonProps = { href?: string | null; label: string; className?: string; onPlay?: () => void };

export function PlayButton({ href, label, className = "", onPlay }: PlayButtonProps) {
  const icon = <PlayIcon className="translate-x-[1.5px]" />;
  if (onPlay) {
    return (
      <button
        type="button"
        onClick={onPlay}
        aria-label={label}
        className={`${face} ${interactive} ${className}`}
      >
        {icon}
      </button>
    );
  }
  if (!href) {
    return (
      <span aria-hidden className={`${face} ${className}`}>
        {icon}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`${face} ${interactive} ${className}`}
    >
      {icon}
    </a>
  );
}

export function PlayRing() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 animate-play-ring rounded-full border-[1.5px] border-fg/35"
    />
  );
}
