import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "link";

const base =
  "inline-flex items-center justify-center gap-2 text-sm leading-5 font-semibold uppercase tracking-button transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-accent px-8 py-4 text-bg hover:brightness-110 active:scale-[0.98]",
  ghost: "border border-fg/22 px-8 py-4 text-fg hover:border-fg/60 hover:bg-fg/5 active:scale-[0.98]",
  outline: "border border-fg/14 px-6 py-3 text-fg/50 hover:border-fg/40 hover:text-fg",
  link: "text-fg/31 hover:text-fg",
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

type ArrowLinkProps = { href: string; variant?: Variant; children: ReactNode; className?: string };

export function ArrowLink({ href, variant = "outline", children, className }: ArrowLinkProps) {
  return (
    <ButtonLink href={href} variant={variant} className={className}>
      {children}
      <ArrowRight aria-hidden className="size-3.5" />
    </ButtonLink>
  );
}
