"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { embedUrl, type HeroVideoSource } from "@/lib/heroVideo";

type HeroAmbientVideoProps = {
  source: HeroVideoSource | null;
  posterUrl?: string;
  poster: ReactNode;
  startAfterMs: number;
};

function prefersStillHero() {
  if (typeof window === "undefined") return false;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(reducedMotion || connection?.saveData);
}

export function HeroAmbientVideo({ source, posterUrl, poster, startAfterMs }: HeroAmbientVideoProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!source || prefersStillHero()) return;
    const timer = setTimeout(() => setStarted(true), startAfterMs);
    return () => clearTimeout(timer);
  }, [source, startAfterMs]);

  useEffect(() => {
    if (!started || source?.kind !== "file") return;
    const element = video.current;
    if (!element) return;
    const show = () => setVisible(true);
    element.addEventListener("playing", show, { once: true });
    void element.play().catch(() => undefined);
    return () => element.removeEventListener("playing", show);
  }, [started, source]);

  const overlay = "absolute inset-0 size-full transition-opacity duration-1000";

  return (
    <>
      {poster}
      {source?.kind === "file" && started && (
        <video
          ref={video}
          src={source.src}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className={`${overlay} object-cover ${visible ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {source?.kind === "embed" && started && (
        <iframe
          src={embedUrl(source, { muted: true, loop: true, controls: false })}
          title="Showreel"
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={() => setVisible(true)}
          className={`pointer-events-none absolute top-1/2 left-1/2 aspect-video h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
