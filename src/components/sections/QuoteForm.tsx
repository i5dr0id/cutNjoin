"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/primitives";
import { contactSchema, projectTypes, type ContactInput } from "@/lib/validation/contact";

type Status = "idle" | "sent" | "error";

const control =
  "w-full border border-fg/12 bg-card px-6 text-sm leading-5 text-fg outline-none transition-colors placeholder:text-fg/50 focus:border-fg/40 aria-invalid:border-red-400";

type QuoteFormProps = { heading: string; submitLabel: string };

export function QuoteForm({ heading, submitLabel }: QuoteFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      reset();
      setStatus("sent");
    } else {
      setStatus("error");
    }
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
            onSubmit={handleSubmit(onSubmit)}
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

            {status === "error" && (
              <p role="alert" className="text-sm text-red-400">
                Something went wrong. Please try again, or email us directly.
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
