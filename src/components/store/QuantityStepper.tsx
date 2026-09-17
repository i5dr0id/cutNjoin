"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = { value: number; max: number; onChange: (value: number) => void; label: string };

export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-11 items-center border border-fg/14">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="grid h-full w-11 place-items-center text-fg/80 transition-colors hover:text-fg disabled:opacity-30"
      >
        <Minus aria-hidden className="size-3.5" />
      </button>
      <output aria-live="polite" className="w-8 text-center font-mono text-sm">
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-full w-11 place-items-center text-fg/80 transition-colors hover:text-fg disabled:opacity-30"
      >
        <Plus aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
