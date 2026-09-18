"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "done" | "error";

const messages: Record<string, string> = {
  rate_limited: "Too many attempts. Please try again in a few minutes.",
  unavailable: "The newsletter isn't ready yet. Please try again later.",
};

export function NewsletterForm({ variant = "footer" }: { variant?: "footer" | "section" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage(null);

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), company: data.get("company") }),
    }).catch(() => null);
    const result = response ? await response.json().catch(() => null) : null;

    if (result?.ok) {
      form.reset();
      setStatus("done");
      return;
    }
    setStatus("error");
    setMessage(messages[result?.error ?? ""] ?? "We couldn't sign you up. Please try again.");
  };

  if (status === "done") {
    return (
      <p role="status" className="text-sm leading-5 text-accent">
        You&apos;re on the list. Look out for the next update.
      </p>
    );
  }

  const wide = variant === "section";

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-3 ${wide ? "lg:w-[480px] lg:shrink-0" : ""}`}
    >
      <div className="flex">
        <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${variant}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className={`min-w-0 flex-1 border border-fg/12 bg-card px-4 text-sm leading-5 text-fg transition-colors outline-none placeholder:text-fg/50 focus:border-fg/40 ${
            wide ? "h-12" : "h-11"
          }`}
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-label="Subscribe"
          className={`grid shrink-0 place-items-center bg-accent px-4 text-bg transition hover:brightness-110 disabled:opacity-60 ${
            wide ? "h-12" : "h-11"
          }`}
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
      {message && (
        <p role="alert" className="text-sm leading-5 text-red-400">
          {message}
        </p>
      )}
    </form>
  );
}
