import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "text";

const base =
  "inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-150 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-accent px-6 py-3 text-bg hover:brightness-110",
  outline: "border border-fg/25 px-6 py-3 text-fg/80 hover:border-fg/70 hover:bg-fg/5 hover:text-fg",
  text: "text-fg/60 hover:text-fg",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
