"use client";

import { ShoppingBag } from "lucide-react";
import { setCartOpen, useCart } from "@/lib/store/cart";

export function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
      className={`relative grid size-11 place-items-center text-fg/80 transition-colors hover:text-fg ${className}`}
    >
      <ShoppingBag aria-hidden className="size-[18px]" />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute top-1.5 right-1 grid min-w-4 place-items-center bg-accent px-1 text-[10px] leading-4 font-semibold text-bg"
        >
          {count}
        </span>
      )}
    </button>
  );
}
