"use client";

import type { ReactNode } from "react";

type RevealGroupProps = { as?: "div" | "header"; className?: string; children: ReactNode };

function observeOnce(element: HTMLElement | null) {
  if (!element) return;
  const reveal = () => element.setAttribute("data-revealed", "");
  if (!("IntersectionObserver" in window)) return reveal();
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      reveal();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

export function RevealGroup({ as: Tag = "div", className, children }: RevealGroupProps) {
  return (
    <Tag ref={observeOnce} data-reveal-group="" className={className}>
      {children}
    </Tag>
  );
}
