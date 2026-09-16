type DecorativeTextProps = { text: string; className?: string };

export function DecorativeText({ text, className = "" }: DecorativeTextProps) {
  return <span aria-hidden data-text={text} className={`before:content-[attr(data-text)] ${className}`} />;
}
