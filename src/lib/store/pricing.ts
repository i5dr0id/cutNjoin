import "server-only";
import { freshClient } from "@/sanity/writeClient";
import type { CartLineInput, CheckoutDetails } from "./checkoutSchema";
import { quoteShipping, type ShippingQuote, type ShippingRates } from "./shipping";

type ProductRecord = {
  _id: string;
  name: string;
  price: number;
  available: boolean | null;
  variants: { _key: string; size: string; stock: number }[] | null;
};

export type PricedLine = {
  productId: string;
  variantKey: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type PricingProblem = {
  productId: string;
  variantKey: string;
  reason: "unavailable" | "insufficient_stock";
  available: number;
};

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotal: number; shipping: ShippingQuote; total: number }
  | { ok: false; error: "store_closed" | "no_delivery" | "cart_changed"; problems?: PricingProblem[] };

export async function priceCheckout(
  items: CartLineInput[],
  details: CheckoutDetails,
): Promise<PricingResult> {
  const { settings, products } = await freshClient.fetch<{
    settings: (ShippingRates & { open: boolean | null }) | null;
    products: ProductRecord[];
  }>(
    `{
      "settings": *[_id == "storeSettings"][0]{ open, nigeriaRates, internationalZones, restOfWorldFee, restOfWorldEta },
      "products": *[_type == "product" && _id in $ids]{ _id, name, price, available, variants[]{ _key, size, stock } }
    }`,
    { ids: [...new Set(items.map((item) => item.productId))] },
    { cache: "no-store" },
  );

  if (!settings?.open) return { ok: false, error: "store_closed" };

  const requested = new Map<string, number>();
  for (const item of items) {
    const key = `${item.productId}:${item.variantKey}`;
    requested.set(key, (requested.get(key) ?? 0) + item.quantity);
  }

  const problems: PricingProblem[] = [];
  const lines: PricedLine[] = [];
  for (const [key, quantity] of requested) {
    const [productId, variantKey] = key.split(":");
    const product = products.find((entry) => entry._id === productId);
    const variant = product?.variants?.find((entry) => entry._key === variantKey);
    if (!product || !product.available || !variant) {
      problems.push({ productId, variantKey, reason: "unavailable", available: 0 });
      continue;
    }
    if (variant.stock < quantity) {
      problems.push({
        productId,
        variantKey,
        reason: "insufficient_stock",
        available: Math.max(variant.stock, 0),
      });
      continue;
    }
    lines.push({
      productId,
      variantKey,
      name: product.name,
      size: variant.size,
      quantity,
      unitPrice: product.price,
    });
  }
  if (problems.length > 0) return { ok: false, error: "cart_changed", problems };

  const shipping = quoteShipping(settings, details.country, details.state);
  if (!shipping) return { ok: false, error: "no_delivery" };

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  return { ok: true, lines, subtotal, shipping, total: subtotal + shipping.fee };
}
