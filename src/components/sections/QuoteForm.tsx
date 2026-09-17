"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/primitives";
import { contactSchema, projectTypes, type ContactField, type ContactInput } from "@/lib/validation/contact";
import { TurnstileField } from "./TurnstileField";

type Status = "idle" | "sent" | "rate_limited" | "failed" | "bot_check";

type ContactResponse = { ok: boolean; error?: string; fields?: Partial<Record<ContactField, string[]>> };

const control =
  "w-full border border-fg/12 bg-card px-6 text-sm leading-5 text-fg outline-none transition-colors placeholder:text-fg/50 focus:border-fg/40 aria-invalid:border-red-400";

type QuoteFormProps = { heading: string; submitLabel: string; fallbackEmail?: string | null };

export function QuoteForm({ heading, submitLabel, fallbackEmail }: QuoteFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [resetSignal, setResetSignal] = useState(0);
  const startedAt = useRef(0);
  const turnstileToken = useRef("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (data: ContactInput) => {
    setStatus("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, startedAt: startedAt.current, turnstileToken: turnstileToken.current }),
    }).catch(() => null);
    const result: ContactResponse | null = res ? await res.json().catch(() => null) : null;

    if (res?.ok && result?.ok) {
      reset();
      startedAt.current = Date.now();
      turnstileToken.current = "";
      setResetSignal((value) => value + 1);
      setStatus("sent");
      return;
    }
    if (result?.fields) {
      for (const [field, messages] of Object.entries(result.fields)) {
        if (messages?.[0]) setError(field as ContactField, { message: messages[0] }, { shouldFocus: true });
      }
      return;
    }
    turnstileToken.current = "";
    setResetSignal((value) => value + 1);
    if (result?.error === "bot_check") return setStatus("bot_check");
    setStatus(res?.status === 429 ? "rate_limited" : "failed");
  };

  return (
    <div className="border border-fg/7 bg-well px-8 py-12">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-lg leading-7 font-bold tracking-[-0.45px] uppercase">Brief received</h3>
            <p className="text-sm leading-[22.75px] text-fg/56">
              Thanks — we&apos;ll get back to you within 24 hours.
            </p>
            <Button variant="outline" className="self-start" onClick={() => setStatus("idle")}>
              Send another brief
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onSubmit={(event) => handleSubmit(onSubmit)(event)}
            noValidate
            className="flex flex-col gap-4"
          >
            <h3 className="pb-2 text-lg leading-7 font-bold tracking-[-0.45px] uppercase">{heading}</h3>

            <Field id="fullName" label="Full Name" error={errors.fullName?.message}>
              <input
                id="fullName"
                autoComplete="name"
                placeholder="e.g. Adebayo Okafor"
                className={`${control} h-[55px]`}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                {...register("fullName")}
              />
            </Field>
            <Field id="phone" label="Phone Number" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                className={`${control} h-[55px]`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone")}
              />
            </Field>
            <Field id="email" label="Email Address" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${control} h-[55px]`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </Field>
            <Field id="projectType" label="Project Type" error={errors.projectType?.message}>
              <select
                id="projectType"
                defaultValue=""
                className={`${control} h-[55px] appearance-none`}
                aria-invalid={!!errors.projectType}
                aria-describedby={errors.projectType ? "projectType-error" : undefined}
                {...register("projectType")}
              >
                <option value="" disabled>
                  Select a service…
                </option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="description" label="Project Description" error={errors.description?.message}>
              <textarea
                id="description"
                placeholder="Brief description of your project, timeline, and any key references…"
                className={`${control} h-[139px] resize-y py-4`}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
                {...register("description")}
              />
            </Field>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
              {...register("company")}
            />

            {siteKey && (
              <TurnstileField
                siteKey={siteKey}
                resetSignal={resetSignal}
                onToken={(token) => {
                  turnstileToken.current = token;
                }}
              />
            )}

            {status === "bot_check" && (
              <p role="alert" className="text-sm text-red-400">
                We couldn&apos;t confirm you&apos;re human. Please try again.
              </p>
            )}
            {status === "rate_limited" && (
              <p role="alert" className="text-sm text-red-400">
                You&apos;ve sent several briefs in a short time. Please wait a few minutes and try again.
              </p>
            )}
            {status === "failed" && (
              <p role="alert" className="text-sm text-red-400">
                We couldn&apos;t send your brief. Please try again
                {fallbackEmail ? (
                  <>
                    {" "}
                    or email us at{" "}
                    <a
                      href={`mailto:${fallbackEmail}`}
                      className="underline underline-offset-2 hover:text-fg"
                    >
                      {fallbackEmail}
                    </a>
                  </>
                ) : null}
                .
              </p>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full disabled:opacity-60">
                {isSubmitting ? "Sending…" : submitLabel}
              </Button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs leading-4 font-medium tracking-[1.2px] text-fg/57 uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
