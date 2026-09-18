"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor='interactive']";
const TEXT_FIELD = "input:not([type='checkbox']):not([type='radio']):not([type='submit']), textarea";
const FOLLOW = 0.18;

const QUERY = "(hover: hover) and (pointer: fine)";

function usePrecisePointer() {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const enabled = usePrecisePointer();
  const [mode, setMode] = useState<"default" | "interactive" | "hidden">("hidden");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.customCursor = "on";
    return () => {
      delete document.documentElement.dataset.customCursor;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    let hovered: Element | null = null;
    let pending = false;

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      hovered = event.target instanceof Element ? event.target : null;
      pending = true;
    };
    const leave = () => setMode("hidden");

    const render = () => {
      if (pending) {
        pending = false;
        setMode(
          hovered?.closest(TEXT_FIELD) ? "hidden" : hovered?.closest(INTERACTIVE) ? "interactive" : "default",
        );
      }
      const { x, y } = current.current;
      current.current = { x: x + (target.current.x - x) * FOLLOW, y: y + (target.current.y - y) * FOLLOW };
      if (ring.current) {
        ring.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  const visible = mode !== "hidden";
  const interactive = mode === "interactive";

  return (
    <div aria-hidden data-cursor-layer className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={ring}
        className={`absolute top-0 left-0 rounded-full border border-fg/45 transition-[width,height,opacity,border-color] duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        } ${interactive ? "size-16 border-fg/70" : "size-9"}`}
      />
      <div
        ref={dot}
        className={`absolute top-0 left-0 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <span
          className={`block shadow-[0_0_4px_rgb(13_13_13/0.6)] transition-all duration-300 ${
            interactive ? "h-[3px] w-[14px] bg-fg" : "size-[6px] rounded-full bg-accent"
          }`}
        />
        <span
          className={`absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 bg-fg shadow-[0_0_4px_rgb(13_13_13/0.6)] transition-all duration-300 ${
            interactive ? "h-[14px] w-[3px] opacity-100" : "h-0 w-0 opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
