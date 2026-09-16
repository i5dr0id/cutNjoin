"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const QuoteForm = dynamic(() => import("./QuoteForm").then((mod) => mod.QuoteForm), {
  ssr: false,
  loading: () => <FormShell />,
});

function FormShell() {
  return <div aria-hidden className="h-[768px] border border-fg/7 bg-well" />;
}

type LazyQuoteFormProps = { heading: string; submitLabel: string; fallbackEmail?: string | null };

export function LazyQuoteForm(props: LazyQuoteFormProps) {
  const placeholder = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const el = placeholder.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (nearViewport) return <QuoteForm {...props} />;
  return (
    <div ref={placeholder}>
      <FormShell />
    </div>
  );
}
