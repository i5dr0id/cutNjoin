"use client";

import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/primitives";
import { formatNaira } from "@/lib/format";
import { routes } from "@/lib/site";
import { removeLine, setCartOpen, setLineQuantity, useCart, useCartOpen } from "@/lib/store/cart";
import { MAX_QUANTITY_PER_LINE } from "@/lib/store/limits";
import { QuantityStepper } from "./QuantityStepper";

export function CartDrawer() {
  const open = useCartOpen();
  const { lines, count, subtotal } = useCart();
  const panel = useRef<HTMLElement>(null);
  const close = () => setCartOpen(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="overlay"
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm"
          />
          <m.aside
            key="drawer"
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-line bg-well outline-none"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="cart-heading" className="text-lg leading-7 font-bold uppercase">
                Cart {count > 0 && <span className="font-mono text-sm text-fg/55">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="grid size-10 place-items-center text-fg/60 hover:text-fg"
              >
                <X aria-hidden className="size-5" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start gap-6 p-6">
                <p className="text-sm leading-6 text-fg/66">Your cart is empty.</p>
                <Link href={routes.store} onClick={close} className={buttonClasses("outline")}>
                  Shop the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li key={`${line.productId}-${line.variantKey}`} className="flex gap-4 py-5">
                      <div className="relative h-[100px] w-20 shrink-0 overflow-hidden bg-card">
                        {line.imageUrl && (
                          <Image src={line.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`${routes.store}/${line.slug}`}
                            onClick={close}
                            className="text-sm leading-5 font-semibold hover:text-accent"
                          >
                            {line.name}
                          </Link>
                          <span className="font-mono text-sm text-fg/80">
                            {formatNaira(line.unitPrice * line.quantity)}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-fg/55">Size {line.size}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <QuantityStepper
                            value={line.quantity}
                            max={MAX_QUANTITY_PER_LINE}
                            onChange={(quantity) => setLineQuantity(line, quantity)}
                            label={`Quantity of ${line.name}, size ${line.size}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeLine(line)}
                            className="text-xs leading-4 font-medium tracking-[1.2px] text-fg/55 uppercase hover:text-fg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="flex flex-col gap-4 border-t border-line p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fg/66">Subtotal</span>
                    <span className="font-mono text-base">{formatNaira(subtotal)}</span>
                  </div>
                  <p className="text-xs leading-5 text-fg/55">Delivery is calculated at checkout.</p>
                  <Link href={routes.checkout} onClick={close} className={buttonClasses("primary", "w-full")}>
                    Checkout
                  </Link>
                </footer>
              </>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
