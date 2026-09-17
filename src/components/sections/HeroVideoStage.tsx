"use client";

import { X } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PlayButton, PlayRing } from "@/components/primitives";
import { embedUrl, type HeroVideoSource } from "@/lib/heroVideo";

type StageState = {
  source: HeroVideoSource | null;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
};

const StageContext = createContext<StageState>({ source: null, playing: false, setPlaying: () => {} });

export function HeroVideoStage({
  source,
  children,
}: {
  source: HeroVideoSource | null;
  children: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setPlaying(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [playing]);

  return <StageContext value={{ source, playing, setPlaying }}>{children}</StageContext>;
}

export function HeroBackdrop({ poster, posterUrl }: { poster: ReactNode; posterUrl?: string }) {
  const { source, playing, setPlaying } = useContext(StageContext);
  return (
    <>
      {playing && source ? (
        source.kind === "file" ? (
          <video
            src={source.src}
            poster={posterUrl}
            preload="metadata"
            autoPlay
            controls
            playsInline
            onEnded={() => setPlaying(false)}
            className="absolute inset-0 size-full bg-bg object-cover"
          />
        ) : (
          <iframe
            src={embedUrl(source)}
            title="Showreel"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full bg-bg"
          />
        )
      ) : (
        poster
      )}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-r from-bg/45 via-bg/35 via-35% to-transparent to-60% transition-opacity duration-500 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}

export function HeroContentFade({ className = "", children }: { className?: string; children: ReactNode }) {
  const { playing } = useContext(StageContext);
  return (
    <div
      className={`${className} transition-opacity duration-500 ${playing ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {children}
    </div>
  );
}

export function HeroPlayTrigger({ label }: { label: string }) {
  const { source, playing, setPlaying } = useContext(StageContext);
  if (!source) return null;
  if (playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(false)}
        aria-label="Close showreel"
        className="grid size-11 place-items-center border border-fg/20 bg-bg/70 text-fg/80 backdrop-blur-sm transition-colors hover:border-fg/50 hover:text-fg"
      >
        <X aria-hidden className="size-4" />
      </button>
    );
  }
  return (
    <>
      <PlayRing />
      <PlayButton label={label} onPlay={() => setPlaying(true)} />
    </>
  );
}
