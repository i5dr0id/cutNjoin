import { PlayIcon } from "@/components/icons/PlayIcon";

const face =
  "grid size-[72px] place-items-center rounded-full border-[1.36px] border-fg/32 bg-scrim text-fg/92 backdrop-blur-[6px] transition-colors hover:border-fg/60";

type PlayButtonProps = { href?: string | null; label: string; className?: string };

export function PlayButton({ href, label, className = "" }: PlayButtonProps) {
  const icon = <PlayIcon className="translate-x-[1.5px]" />;
  if (!href) {
    return (
      <span aria-hidden className={`${face} ${className}`}>
        {icon}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={`${face} ${className}`}>
      {icon}
    </a>
  );
}
