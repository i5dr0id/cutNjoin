"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeaderFrame({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent transition-colors duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg/85 data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
