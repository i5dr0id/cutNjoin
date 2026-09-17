import { DecorativeText } from "@/components/primitives";

const INTRO_START_MS = 250;
const SLIDE_MS = 300;
const FIRST_HOLD_MS = 700;
const BACKSPACE_MS = 70;
const EMPTY_PAUSE_MS = 200;
const TYPE_MS = 110;
const WORD_HOLD_MS = 650;
const FINAL_HOLD_MS = 800;
const SETTLE_STAGGER_MS = 90;

type Frame = { length: number; start: number; duration: number };

function sharedPrefix(phrases: string[]) {
  let prefix = phrases[0] ?? "";
  for (const phrase of phrases) {
    while (!phrase.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix.slice(0, prefix.lastIndexOf(" ") + 1);
}

function buildFrames(phrases: string[], prefixLength: number) {
  const timeline: Frame[][] = phrases.map(() => []);
  let time = INTRO_START_MS + SLIDE_MS + FIRST_HOLD_MS;
  timeline[0].push({ length: phrases[0].length, start: 0, duration: time });

  for (let index = 1; index < phrases.length; index++) {
    const previous = phrases[index - 1];
    for (let length = previous.length - 1; length >= prefixLength; length--) {
      const duration = length === prefixLength ? EMPTY_PAUSE_MS : BACKSPACE_MS;
      timeline[index - 1].push({ length, start: time, duration });
      time += duration;
    }
    const phrase = phrases[index];
    const isFinal = index === phrases.length - 1;
    for (let length = prefixLength + 1; length <= phrase.length; length++) {
      const complete = length === phrase.length;
      const duration = complete ? (isFinal ? FINAL_HOLD_MS : WORD_HOLD_MS) : TYPE_MS;
      timeline[index].push({ length, start: time, duration });
      time += duration;
    }
  }

  return { timeline, settleAt: time };
}

function highlightParts(phrase: string, length: number, highlight: string | null) {
  const visible = phrase.slice(0, length);
  const start = highlight ? phrase.indexOf(highlight) : -1;
  if (!highlight || start < 0) return [{ text: visible, accent: false }];
  const end = start + highlight.length;
  return [
    { text: visible.slice(0, start), accent: false },
    { text: visible.slice(start, end), accent: true },
    { text: visible.slice(end), accent: false },
  ].filter((part) => part.text);
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

function TypedFrame({
  phrase,
  frame,
  highlight,
  fill,
}: {
  phrase: string;
  frame: Frame;
  highlight: string | null;
  fill: "backwards" | "forwards" | "none";
}) {
  return (
    <span
      className="invisible col-start-1 row-start-1 block whitespace-pre"
      style={{ animation: `frame-on ${frame.duration}ms linear ${frame.start}ms ${fill}` }}
    >
      {highlightParts(phrase, frame.length, highlight).map((part, index) => (
        <DecorativeText
          key={index}
          text={part.text}
          className={`whitespace-pre ${part.accent ? "text-accent" : ""}`}
        />
      ))}
      <span
        className={`ml-[0.04em] inline-block h-[0.74em] w-[0.07em] animate-caret-blink ${
          highlight && phrase.includes(highlight) ? "bg-accent" : "bg-fg"
        }`}
      />
    </span>
  );
}

export function headlineRevealEndMs(lines: string[]) {
  const phrases = lines.slice(0, -1);
  if (phrases.length === 0) return 0;
  const { settleAt } = buildFrames(phrases, sharedPrefix(phrases).length);
  return settleAt + (phrases.length - 1) * SETTLE_STAGGER_MS;
}

export function HeroHeadline({ lines, highlight }: { lines: string[]; highlight: string | null }) {
  const phrases = lines.slice(0, -1);
  const slotRow = phrases.length;
  const prefixLength = sharedPrefix(phrases).length;
  const { timeline, settleAt } = buildFrames(phrases, prefixLength);
  const lastFrame = timeline.at(-1)?.at(-1);

  return (
    <h1
      id="hero-heading"
      className="grid pt-4 text-[52px] leading-none font-bold tracking-[-0.025em] uppercase md:text-display"
    >
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;
        const isSlotLine = index === slotRow - 1;
        return (
          <span
            key={line}
            className={`block ${isLast ? "" : "animate-headline-settle"}`}
            style={{
              gridRow: index + 1,
              gridColumn: 1,
              ...(isLast
                ? {}
                : {
                    animationDelay: `${isSlotLine ? settleAt : settleAt + index * SETTLE_STAGGER_MS}ms`,
                    ...(isSlotLine && { animationDuration: "1ms" }),
                  }),
            }}
          >
            <Highlighted line={line} highlight={highlight} />
          </span>
        );
      })}
      {phrases.length > 0 && (
        <span
          aria-hidden
          className="-mt-[0.12em] animate-vanish overflow-hidden pt-[0.12em]"
          style={{ gridRow: slotRow, gridColumn: 1, animationDelay: `${settleAt}ms` }}
        >
          <span className="grid animate-phrase-land" style={{ animationDelay: `${INTRO_START_MS}ms` }}>
            {timeline.flatMap((frames, phraseIndex) =>
              frames.map((frame, frameIndex) => (
                <TypedFrame
                  key={`${phraseIndex}-${frameIndex}`}
                  phrase={phrases[phraseIndex]}
                  frame={frame}
                  highlight={highlight}
                  fill={frame === lastFrame ? "forwards" : frame.start === 0 ? "backwards" : "none"}
                />
              )),
            )}
          </span>
        </span>
      )}
    </h1>
  );
}
