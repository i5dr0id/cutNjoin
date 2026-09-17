"use client";

import Lenis from "lenis";
import { useEffect } from "react";

const HEADER_OFFSET = 0;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, wheelMultiplier: 0.9, anchors: false });
    document.documentElement.classList.add("lenis-active");

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      const hash = link?.getAttribute("href");
      if (!link || !hash?.startsWith("#") || hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: HEADER_OFFSET });
      history.pushState(null, "", hash);
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("lenis-active");
      lenis.destroy();
    };
  }, []);

  return null;
}
