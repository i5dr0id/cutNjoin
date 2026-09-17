"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, buttonClasses } from "@/components/primitives";
import { formatNaira } from "@/lib/format";
import { routes } from "@/lib/site";
import { removeLine, setLineQuantity, useCart } from "@/lib/store/cart";
import { checkoutDetailsSchema, type CheckoutDetails } from "@/lib/store/checkoutSchema";
import { NIGERIA, countries, nigerianStates } from "@/lib/store/regions";
import { quoteShipping, type ShippingRates } from "@/lib/store/shipping";

type Problem = {
  productId: string;
  variantKey: string;
  reason: "unavailable" | "insufficient_stock";
  available: number;
};
type CheckoutResponse = {
  ok: boolean;
  authorizationUrl?: string;
  error?: string;
  problems?: Problem[];
  fields?: Record<string, string[]>;
};

const messages: Record<string, string> = {
  store_closed: "The store is closed right now. Please check back soon.",
  no_delivery: "We don't deliver to this location yet. Please contact us to arrange delivery.",
  cart_changed: "Some items changed since you added them. We've updated your cart — please review it.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
  payment_unavailable: "We couldn't start the payment. Please try again in a moment.",
};

const control =
  "w-full border border-fg/12 bg-card px-4 text-sm leading-5 text-fg outline-none transition-colors placeholder:text-fg/50 focus:border-fg/40 aria-invalid:border-red-400";

export function CheckoutForm({ rates }: { rates: ShippingRates }) {
  const { lines, subtotal } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    control: formControl,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutDetails>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: { country: NIGERIA, state: "" },
  });
  const country = useWatch({ control: formControl, name: "country" });
  const state = useWatch({ control: formControl, name: "state" });
  const quote = country && state ? quoteShipping(rates, country, state) : null;
  const deliveryUnavailable = Boolean(country && state && !quote);

  const onSubmit = async (details: CheckoutDetails) => {
    setMessage(null);
    const response = await fetch("/api/store/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map(({ productId, variantKey, quantity }) => ({ productId, variantKey, quantity })),
        details,
      }),
    }).catch(() => null);
    const result: CheckoutResponse | null = response ? await response.json().catch(() => null) : null;

    if (result?.ok && result.authorizationUrl) {
      window.location.assign(result.authorizationUrl);
      return;
    }
    if (result?.fields) {
      for (const [field, fieldMessages] of Object.entries(result.fields)) {
        if (fieldMessages?.[0]) setError(field as keyof CheckoutDetails, { message: fieldMessages[0] });
      }
    }
    for (const problem of result?.problems ?? []) {
      const line = lines.find(
        (entry) => entry.productId === problem.productId && entry.variantKey === problem.variantKey,
      );
      if (!line) continue;
      if (problem.available > 0) setLineQuantity(line, problem.available);
      else removeLine(line);
    }
    setMessage(messages[result?.error ?? ""] ?? "Something went wrong. Please try again.");
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border border-fg/7 bg-well p-8">
        <p className="text-base leading-6 text-fg/80">Your cart is empty.</p>
        <Link href={routes.store} className={buttonClasses("outline")}>
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => handleSubmit(onSubmit)(event)}
      noValidate
      className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_440px]"
    >
      <div className="flex flex-col gap-10">
        <fieldset className="flex flex-col gap-4">
          <legend className="pb-4 text-lg leading-7 font-bold uppercase">Contact</legend>
          <Field id="name" label="Full name" error={errors.name?.message}>
            <input
              id="name"
              autoComplete="name"
              className={`${control} h-12`}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label="Email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`${control} h-12`}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={`${control} h-12`}
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="pb-4 text-lg leading-7 font-bold uppercase">Delivery</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="country" label="Country" error={errors.country?.message}>
              <select
                id="country"
                autoComplete="country"
                className={`${control} h-12`}
                {...register("country")}
              >
                {countries.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id="state"
              label={country === NIGERIA ? "State" : "State / region"}
              error={errors.state?.message}
            >
              {country === NIGERIA ? (
                <select
                  id="state"
                  autoComplete="address-level1"
                  className={`${control} h-12`}
                  aria-invalid={!!errors.state}
                  {...register("state")}
                >
                  <option value="">Select a state…</option>
                  {nigerianStates.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="state"
                  autoComplete="address-level1"
                  className={`${control} h-12`}
                  aria-invalid={!!errors.state}
                  {...register("state")}
                />
              )}
            </Field>
          </div>
          <Field id="address" label="Street address" error={errors.address?.message}>
            <textarea
              id="address"
              rows={2}
              autoComplete="street-address"
              className={`${control} py-3`}
              aria-invalid={!!errors.address}
              {...register("address")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="city" label="City" error={errors.city?.message}>
              <input
                id="city"
                autoComplete="address-level2"
                className={`${control} h-12`}
                aria-invalid={!!errors.city}
                {...register("city")}
              />
            </Field>
            <Field id="postcode" label="Postcode (optional)" error={errors.postcode?.message}>
              <input
                id="postcode"
                autoComplete="postal-code"
                className={`${control} h-12`}
                {...register("postcode")}
              />
            </Field>
          </div>
        </fieldset>
      </div>

      <aside
        aria-labelledby="summary-heading"
        className="flex flex-col gap-6 border border-fg/7 bg-well p-6 lg:sticky lg:top-28"
      >
        <h2 id="summary-heading" className="text-lg leading-7 font-bold uppercase">
          Order summary
        </h2>
        <ul className="flex flex-col gap-4">
          {lines.map((line) => (
            <li key={`${line.productId}-${line.variantKey}`} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-card">
                {line.imageUrl && (
                  <Image src={line.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold">{line.name}</p>
                  <p className="font-mono text-xs text-fg/55">
                    Size {line.size} · Qty {line.quantity}
                  </p>
                </div>
                <span className="font-mono">{formatNaira(line.unitPrice * line.quantity)}</span>
              </div>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg/66">Subtotal</dt>
            <dd className="font-mono">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg/66">
              Delivery{quote?.eta && <span className="block text-xs text-fg/55">{quote.eta}</span>}
            </dt>
            <dd className="font-mono">
              {quote ? formatNaira(quote.fee) : deliveryUnavailable ? "Unavailable" : "—"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="font-mono">{formatNaira(subtotal + (quote?.fee ?? 0))}</dd>
          </div>
        </dl>

        {deliveryUnavailable && <p className="text-sm text-red-400">{messages.no_delivery}</p>}
        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || deliveryUnavailable}
          className="w-full disabled:opacity-50"
        >
          {isSubmitting
            ? "Starting payment…"
            : quote
              ? `Pay ${formatNaira(subtotal + quote.fee)}`
              : "Continue to payment"}
        </Button>
        <p className="text-xs leading-5 text-fg/55">
          You&apos;ll pay securely with Paystack. By paying you agree to our{" "}
          <Link href={routes.returns} className="underline underline-offset-2 hover:text-fg">
            returns policy
          </Link>
          .
        </p>
      </aside>
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
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs leading-4 font-medium tracking-[1.2px] text-fg/57 uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
