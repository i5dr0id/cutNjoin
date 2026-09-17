"use client";

import { useState } from "react";
import { Button } from "@/components/primitives";
import { addToCart, setCartOpen, useCart } from "@/lib/store/cart";
import { MAX_QUANTITY_PER_LINE } from "@/lib/store/limits";
import { QuantityStepper } from "./QuantityStepper";

const LOW_STOCK = 3;

type Variant = { _key: string; size: string; stock: number };

type AddToCartProps = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  variants: Variant[];
};

export function AddToCart({ productId, name, slug, price, imageUrl, variants }: AddToCartProps) {
  const { lines } = useCart();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const selected = variants.find((variant) => variant._key === selectedKey) ?? null;
  const inCart = selected
    ? (lines.find((line) => line.productId === productId && line.variantKey === selected._key)?.quantity ?? 0)
    : 0;
  const maxAddable = selected ? Math.max(0, Math.min(selected.stock, MAX_QUANTITY_PER_LINE) - inCart) : 0;

  const add = () => {
    if (!selected || maxAddable === 0) return;
    addToCart(
      {
        productId,
        variantKey: selected._key,
        quantity: Math.min(quantity, maxAddable),
        name,
        size: selected.size,
        unitPrice: price,
        imageUrl,
        slug,
      },
      Math.min(selected.stock, MAX_QUANTITY_PER_LINE),
    );
    setQuantity(1);
    setCartOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="pb-3 text-xs leading-4 font-medium tracking-[1.2px] text-fg/57 uppercase">
          Size
        </legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const soldOut = variant.stock <= 0;
            const active = variant._key === selectedKey;
            return (
              <label
                key={variant._key}
                className={`grid h-11 min-w-14 cursor-pointer place-items-center border px-3 font-mono text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                  active
                    ? "border-accent bg-accent text-bg"
                    : soldOut
                      ? "cursor-not-allowed border-fg/10 text-fg/30 line-through"
                      : "border-fg/22 text-fg hover:border-fg/60"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={variant._key}
                  disabled={soldOut}
                  checked={active}
                  onChange={() => {
                    setSelectedKey(variant._key);
                    setQuantity(1);
                  }}
                  className="sr-only"
                />
                {variant.size}
                {soldOut && <span className="sr-only"> (sold out)</span>}
              </label>
            );
          })}
        </div>
        <p aria-live="polite" className="min-h-5 text-xs leading-5 text-fg/60">
          {selected
            ? selected.stock <= LOW_STOCK
              ? `Only ${selected.stock} left in ${selected.size}`
              : inCart > 0
                ? `${inCart} already in your cart`
                : ""
            : "Choose a size"}
        </p>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          max={Math.max(1, maxAddable)}
          onChange={setQuantity}
          label={`Quantity of ${name}`}
        />
        <Button onClick={add} disabled={!selected || maxAddable === 0} className="flex-1 disabled:opacity-40">
          {selected && maxAddable === 0 ? "Maximum in cart" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
