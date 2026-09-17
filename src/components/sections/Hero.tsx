import {
  ButtonLink,
  DecorativeText,
  PlayButton,
  PlayRing,
  SanityImage,
  SectionEyebrow,
  TimecodeBar,
} from "@/components/primitives";
import { sections } from "@/lib/site";
import type { HomePage } from "./types";

const INTRO_START_MS = 250;
const PHRASE_STRIDE_MS = 900;
const FINAL_HOLD_MS = 700;
const SETTLE_STAGGER_MS = 90;

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

function DecorativePhrase({ phrase, highlight }: { phrase: string; highlight: string | null }) {
  if (!highlight || !phrase.includes(highlight))
    return <DecorativeText text={phrase} className="whitespace-pre" />;
  const [before, after] = phrase.split(highlight);
  return (
    <>
      {before && <DecorativeText text={before} className="whitespace-pre" />}
      <DecorativeText text={highlight} className="whitespace-pre text-accent" />
      {after && <DecorativeText text={after} className="whitespace-pre" />}
    </>
  );
}

function Headline({ lines, highlight }: { lines: string[]; highlight: string | null }) {
  const phrases = lines.slice(0, -1);
  const slotRow = phrases.length;
  const settleAt = INTRO_START_MS + (phrases.length - 1) * PHRASE_STRIDE_MS + FINAL_HOLD_MS;
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

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
                : isSlotLine
                  ? { ...delay(settleAt), animationDuration: "1ms" }
                  : delay(settleAt + index * SETTLE_STAGGER_MS)),
            }}
          >
            <Highlighted line={line} highlight={highlight} />
          </span>
        );
      })}
      {phrases.length > 0 && (
        <span
          aria-hidden
          className="-mt-[0.12em] grid animate-vanish overflow-hidden pt-[0.12em]"
          style={{ gridRow: slotRow, gridColumn: 1, ...delay(settleAt) }}
        >
          {phrases.map((phrase, index) => {
            const isFinal = index === phrases.length - 1;
            return (
              <span
                key={phrase}
                className={`col-start-1 row-start-1 block ${isFinal ? "animate-phrase-land" : "animate-phrase-pass"}`}
                style={delay(INTRO_START_MS + index * PHRASE_STRIDE_MS)}
              >
                <DecorativePhrase phrase={phrase} highlight={highlight} />
              </span>
            );
          })}
        </span>
      )}
    </h1>
  );
}

function FrameCounter() {
  return (
    <div className="absolute top-[94px] right-12 hidden flex-col items-end gap-1 font-mono opacity-32 sm:flex">
      <DecorativeText
        text="Frame"
        className="text-[9px] leading-[13.5px] tracking-[2.7px] text-fg/50 uppercase"
      />
      <DecorativeText text="0078" className="text-[22px] leading-[22px] font-bold text-fg/25" />
      <DecorativeText text="25fps · 4K" className="text-[9px] leading-[13.5px] tracking-[1.8px] text-fg/21" />
    </div>
  );
}

export function Hero({ page }: { page: HomePage }) {
  return (
    <section id={sections.hero} aria-labelledby="hero-heading" className="relative pb-[165px]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[1121px] overflow-hidden bg-card">
        <SanityImage image={page.heroImage} fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-bg/45 via-bg/35 via-35% to-transparent to-60%" />
      </div>

      <div className="relative mx-auto max-w-site px-6 pt-[86.5px] lg:px-12">
        <TimecodeBar />
        <FrameCounter />

        <div className="relative mt-[88px]">
          <SectionEyebrow label={page.heroEyebrow ?? ""} pulse />
          <Headline lines={page.heroHeadline} highlight={page.heroHighlight} />
          {page.heroIntro && (
            <p className="max-w-[576px] pt-8 text-lg leading-[28.67px] text-fg/66">{page.heroIntro}</p>
          )}
          <div className="flex flex-wrap gap-4 pt-8">
            <ButtonLink href={`#${sections.contact}`}>{page.heroPrimaryCta}</ButtonLink>
            <ButtonLink href={`#${sections.projects}`} variant="ghost">
              {page.heroSecondaryCta}
            </ButtonLink>
          </div>
          {page.stats && page.stats.length > 0 && (
            <div className="pt-12">
              <dl className="flex max-w-[960px] flex-wrap gap-8 border-t border-fg/9 pt-8">
                {page.stats.map((stat) => (
                  <div key={stat._key} className="flex flex-col-reverse gap-1">
                    <dt className="text-xs leading-4 font-medium tracking-[0.3px] text-fg/55 uppercase">
                      {stat.label}
                    </dt>
                    <dd className="text-lg leading-[18px] font-bold text-accent">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="absolute top-[518px] left-[46.9%] hidden lg:block">
          <PlayRing />
          <PlayButton href={page.heroVideoUrl} label="Play showreel" />
        </div>

        <TimecodeBar className="mt-[90px]" />
      </div>
    </section>
  );
}
