"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { TURNSTILE_ACTION } from "@/lib/contact/turnstileAction";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export function TurnstileField({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  resetSignal: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callback = useRef(onToken);

  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  const render = useCallback(() => {
    if (!window.turnstile || !container.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      size: "flexible",
      theme: "dark",
      appearance: "interaction-only",
      callback: (token: string) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
    });
  }, [siteKey]);

  useEffect(() => {
    render();
    const id = widgetId.current;
    return () => {
      if (id) window.turnstile?.remove(id);
      widgetId.current = null;
    };
  }, [render]);

  useEffect(() => {
    if (resetSignal && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetSignal]);

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="lazyOnload" onReady={render} />
      <div ref={container} className="empty:hidden" />
    </>
  );
}
