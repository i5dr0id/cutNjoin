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
import { HeroHeadline, headlineRevealEndMs } from "./HeroHeadline";
import type { HomePage } from "./types";

const INTRO_TEXT_GAP_MS = 150;
const INTRO_BUTTONS_GAP_MS = 350;

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
  const revealEnd = headlineRevealEndMs(page.heroHeadline);
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
          <HeroHeadline lines={page.heroHeadline} highlight={page.heroHighlight} />
          {page.heroIntro && (
            <p
              className="max-w-[576px] animate-soft-rise pt-8 text-lg leading-[28.67px] text-fg/66"
              style={{ animationDelay: `${revealEnd + INTRO_TEXT_GAP_MS}ms` }}
            >
              {page.heroIntro}
            </p>
          )}
          <div
            className="flex animate-soft-rise flex-wrap gap-4 pt-8"
            style={{ animationDelay: `${revealEnd + INTRO_BUTTONS_GAP_MS}ms` }}
          >
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
