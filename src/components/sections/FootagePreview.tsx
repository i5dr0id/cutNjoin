"use client";

import { useEffect, useRef, type ReactNode } from "react";

type FootagePreviewProps = { src: string | null; children: ReactNode };

export function FootagePreview({ src, children }: FootagePreviewProps) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const tile = container.current?.parentElement;
    const element = video.current;
    if (!src || !tile || !element) return;

    const play = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      element.hidden = false;
      void element.play().catch(() => undefined);
    };
    const stop = () => {
      element.pause();
      element.hidden = true;
    };

    tile.addEventListener("pointerenter", play);
    tile.addEventListener("pointerleave", stop);
    tile.addEventListener("focusin", play);
    tile.addEventListener("focusout", stop);
    return () => {
      tile.removeEventListener("pointerenter", play);
      tile.removeEventListener("pointerleave", stop);
      tile.removeEventListener("focusin", play);
      tile.removeEventListener("focusout", stop);
    };
  }, [src]);

  return (
    <div ref={container} className="absolute inset-0">
      {children}
      {src && (
        <video
          ref={video}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          hidden
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}
