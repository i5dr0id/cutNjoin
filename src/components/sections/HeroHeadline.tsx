import type { ReactNode } from "react";

const INTRO_START_MS = 250;
const PHRASE_STRIDE_MS = 1100;
const ENTER_AFTER_PUSH_MS = 380;

function pushStartsAt(index: number) {
  return INTRO_START_MS + index * PHRASE_STRIDE_MS;
}

function phraseAppearsAt(index: number) {
  return index === 0 ? INTRO_START_MS : pushStartsAt(index) + ENTER_AFTER_PUSH_MS;
}

export function headlineRevealEndMs(lines: string[]) {
  return phraseAppearsAt(Math.max(lines.length - 2, 0));
}

function Highlighted({ line, highlight }: { line: string; highlight: string | null }) {
  if (!highlight || !line.includes(highlight)) return line;
  const [before, after] = line.split(highlight);
  return (
    <>
      {before}
      <span className="text-accent">{highlight}</span>
      {after}
    </>
  );
}

function StackedPhrase({ index, total, children }: { index: number; total: number; children: ReactNode }) {
  const pushTimes = Array.from({ length: total - 1 - index }, (_, step) => pushStartsAt(index + 1 + step));
  const entering = (
    <span className="block animate-stack-enter" style={{ animationDelay: `${phraseAppearsAt(index)}ms` }}>
      {children}
    </span>
  );
  return pushTimes.reduceRight<ReactNode>(
    (inner, pushAt) => (
      <span className="block animate-stack-shift" style={{ animationDelay: `${pushAt}ms` }}>
        {inner}
      </span>
    ),
    entering,
  );
}

export function HeroHeadline({ lines, highlight }: { lines: string[]; highlight: string | null }) {
  const phraseCount = lines.length - 1;
  return (
    <h1
      id="hero-heading"
      className="pt-4 text-[52px] leading-none font-bold tracking-[-0.025em] uppercase md:text-display"
    >
      {lines.map((line, index) => (
        <span key={line} className="block">
          {index < phraseCount ? (
            <StackedPhrase index={index} total={phraseCount}>
              <Highlighted line={line} highlight={highlight} />
            </StackedPhrase>
          ) : (
            <Highlighted line={line} highlight={highlight} />
          )}
        </span>
      ))}
    </h1>
  );
}
