"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/primitives";
import { contactSchema, projectTypes, type ContactInput } from "@/lib/validation/contact";

type Status = "idle" | "sent" | "error";

const inputClasses =
  "w-full border border-fg/12 bg-card px-6 py-4 text-sm text-fg outline-none transition-colors placeholder:text-fg/30 focus:border-fg/40 aria-invalid:border-red-400";

export function QuoteForm() {
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

  if (status === "sent") {
    return (
      <div role="status" className="border border-line bg-card-2 p-6">
        <p className="font-semibold">Brief received — we&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 bg-card-2 p-6">
      <h3 className="text-lg font-semibold uppercase">Request a Quote</h3>

      <Field id="fullName" label="Full Name" error={errors.fullName?.message}>
        <input
          id="fullName"
          autoComplete="name"
          placeholder="e.g. Adebayo Okafor"
          className={inputClasses}
          aria-invalid={!!errors.fullName}
          aria-describedby="fullName-error"
          {...register("fullName")}
        />
      </Field>
      <Field id="phone" label="Phone Number" error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          className={inputClasses}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-error"
          {...register("phone")}
        />
      </Field>
      <Field id="email" label="Email Address" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClasses}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          {...register("email")}
        />
      </Field>
      <Field id="projectType" label="Project Type" error={errors.projectType?.message}>
        <select
          id="projectType"
          defaultValue=""
          className={inputClasses}
          aria-invalid={!!errors.projectType}
          aria-describedby="projectType-error"
          {...register("projectType")}
        >
          <option value="" disabled>
            Select a service…
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field id="description" label="Project Description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={5}
          placeholder="Brief description of your project, timeline, and any references…"
          className={inputClasses}
          aria-invalid={!!errors.description}
          aria-describedby="description-error"
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

      <Button type="submit" disabled={isSubmitting} className="self-start disabled:opacity-60">
        {isSubmitting ? "Sending…" : "Submit brief"}
      </Button>
    </form>
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
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium tracking-widest text-fg/60 uppercase">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-4 text-xs text-red-400">
        {error}
      </p>
    </div>
  );
}
