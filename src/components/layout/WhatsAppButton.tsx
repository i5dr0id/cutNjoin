"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 700;

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5 shrink-0">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.75-1.8-.19-.46-.39-.4-.53-.41h-.46Z" />
    </svg>
  );
}

type WhatsAppButtonProps = { number: string; message?: string | null; label: string };

export function WhatsAppButton({ number, message, label }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const digits = number.replace(/\D/g, "");
  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`fixed right-6 bottom-6 z-40 flex items-center gap-3 border border-accent/40 bg-accent px-4 py-3 text-sm leading-5 font-semibold tracking-button text-bg uppercase shadow-[0_8px_24px_rgb(13_13_13/0.45)] transition-all duration-300 hover:brightness-110 lg:right-12 lg:bottom-12 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppGlyph />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
