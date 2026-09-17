"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlayRing } from "@/components/primitives";
import { embedUrl, type HeroVideoSource } from "@/lib/heroVideo";

type AmbientProps = { source: HeroVideoSource | null; posterUrl?: string; poster: ReactNode };

const soundState = { listeners: new Set<(on: boolean) => void>(), on: false };

function setSound(on: boolean) {
  soundState.on = on;
  soundState.listeners.forEach((listener) => listener(on));
}

function useSound() {
  const [on, setOn] = useState(soundState.on);
  useEffect(() => {
    soundState.listeners.add(setOn);
    return () => void soundState.listeners.delete(setOn);
  }, []);
  return on;
}

export function HeroAmbientVideo({ source, posterUrl, poster }: AmbientProps) {
  const video = useRef<HTMLVideoElement>(null);
  const sound = useSound();

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = !sound;
    if (sound) void element.play().catch(() => setSound(false));
  }, [sound]);

  if (!source) return poster;

  if (source.kind === "embed") {
    return (
      <iframe
        key={sound ? "sound" : "muted"}
        src={embedUrl(source, { muted: !sound, loop: true, controls: false })}
        title="Showreel"
        tabIndex={-1}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-video h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
    );
  }

  return (
    <video
      ref={video}
      src={source.src}
      poster={posterUrl}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="absolute inset-0 size-full bg-bg object-cover"
    />
  );
}

export function HeroSoundToggle({ source }: { source: HeroVideoSource | null }) {
  const sound = useSound();
  if (!source) return null;
  return (
    <>
      {!sound && <PlayRing />}
      <button
        type="button"
        onClick={() => setSound(!sound)}
        aria-pressed={sound}
        aria-label={sound ? "Mute showreel" : "Play showreel with sound"}
        className="grid size-[72px] place-items-center rounded-full border-[1.36px] border-fg/32 bg-scrim text-fg/92 backdrop-blur-[6px] transition-all duration-300 hover:scale-112 hover:border-fg/60 hover:bg-bg/72"
      >
        {sound ? <Volume2 aria-hidden className="size-6" /> : <VolumeX aria-hidden className="size-6" />}
      </button>
    </>
  );
}
