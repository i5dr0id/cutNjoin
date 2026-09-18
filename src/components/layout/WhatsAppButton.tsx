"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon, whatsappLink } from "@/components/icons/WhatsAppIcon";

const SHOW_AFTER_PX = 700;

type WhatsAppButtonProps = { number: string; message?: string | null; label: string };

export function WhatsAppButton({ number, message, label }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = whatsappLink(number, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`fixed right-6 bottom-6 z-40 grid size-14 place-items-center rounded-full bg-accent text-bg shadow-[0_8px_24px_rgb(13_13_13/0.45)] transition-all duration-300 hover:scale-105 hover:brightness-110 lg:right-12 lg:bottom-12 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
