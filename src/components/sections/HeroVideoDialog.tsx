"use client";

import { X } from "lucide-react";
import { useRef, useState } from "react";
import { PlayButton, PlayRing } from "@/components/primitives";
import { embedUrl, type HeroVideoSource } from "@/lib/heroVideo";

export function HeroVideoDialog({ source, label }: { source: HeroVideoSource | null; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  if (!source) return null;

  const play = () => {
    setOpen(true);
    dialog.current?.showModal();
  };
  const close = () => {
    setOpen(false);
    dialog.current?.close();
  };

  return (
    <>
      <PlayRing />
      <PlayButton label={label} onPlay={play} />
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => event.target === dialog.current && close()}
        aria-label="Showreel"
        className="m-auto w-[min(1200px,92vw)] bg-transparent p-0 text-fg backdrop:bg-bg/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={close}
            className="flex items-center gap-2 self-end text-xs leading-4 font-semibold tracking-button text-fg/60 uppercase transition-colors hover:text-fg"
          >
            Close
            <X aria-hidden className="size-4" />
          </button>
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            {open &&
              (source.kind === "file" ? (
                <video
                  src={source.src}
                  autoPlay
                  controls
                  playsInline
                  onEnded={close}
                  className="absolute inset-0 size-full"
                />
              ) : (
                <iframe
                  src={embedUrl(source)}
                  title="Showreel"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
