"use client";

import { useRef, useState, type ReactNode } from "react";

type ProjectsCarouselProps = {
  titles: string[];
  rail: ReactNode;
  children: ReactNode;
};

export function ProjectsCarousel({ titles, rail, children }: ProjectsCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const tileWidth = () => scroller.current?.querySelector("article")?.getBoundingClientRect().width ?? 1;

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setActive(atEnd ? titles.length - 1 : Math.round(el.scrollLeft / tileWidth()));
  };

  const goTo = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(index * tileWidth(), maxScroll), behavior: "smooth" });
    setActive(index);
  };

  return (
    <>
      <div className="border-y-2 border-well bg-strip-2">
        {rail}
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar snap-x scroll-px-8 overflow-x-auto">
          {children}
        </div>
        {rail}
      </div>
      <div className="flex items-center justify-center gap-2 pt-8">
        {titles.map((title, index) => (
          <button
            key={title}
            type="button"
            aria-label={`Show ${title}`}
            aria-current={index === active}
            onClick={() => goTo(index)}
            className={`h-2 transition-all duration-300 ${index === active ? "w-6 bg-accent" : "w-2 bg-fg/20 hover:bg-fg/40"}`}
          />
        ))}
      </div>
    </>
  );
}
