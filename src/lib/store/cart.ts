"use client";

import { useSyncExternalStore } from "react";
import { MAX_QUANTITY_PER_LINE } from "./limits";

export type CartLine = {
  productId: string;
  variantKey: string;
  quantity: number;
  name: string;
  size: string;
  unitPrice: number;
  imageUrl: string | null;
  slug: string;
};

const STORAGE_KEY = "cutnjoin:cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY;

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    typeof line.variantKey === "string" &&
    typeof line.name === "string" &&
    typeof line.size === "string" &&
    typeof line.slug === "string" &&
    Number.isFinite(line.quantity) &&
    Number.isFinite(line.unitPrice) &&
    (line.imageUrl === null || typeof line.imageUrl === "string")
  );
}

function snapshot(): CartLine[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  let lines: CartLine[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) lines = parsed.filter(isCartLine);
  } catch {
    lines = EMPTY;
  }
  cachedLines = lines;
  if (raw !== null && lines.length !== safeLength(raw)) write(lines);
  return cachedLines;
}

function safeLength(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : -1;
  } catch {
    return -1;
  }
}

function write(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const sameLine = (
  a: Pick<CartLine, "productId" | "variantKey">,
  b: Pick<CartLine, "productId" | "variantKey">,
) => a.productId === b.productId && a.variantKey === b.variantKey;

export function addToCart(line: CartLine, maxQuantity: number) {
  const cap = Math.min(maxQuantity, MAX_QUANTITY_PER_LINE);
  const lines = snapshot();
  const existing = lines.find((entry) => sameLine(entry, line));
  write(
    existing
      ? lines.map((entry) =>
          sameLine(entry, line)
            ? { ...entry, ...line, quantity: Math.min(entry.quantity + line.quantity, cap) }
            : entry,
        )
      : [...lines, { ...line, quantity: Math.min(line.quantity, cap) }],
  );
}

export function setLineQuantity(line: CartLine, quantity: number) {
  write(
    snapshot().map((entry) =>
      sameLine(entry, line)
        ? { ...entry, quantity: Math.max(1, Math.min(quantity, MAX_QUANTITY_PER_LINE)) }
        : entry,
    ),
  );
}

export function removeLine(line: Pick<CartLine, "productId" | "variantKey">) {
  write(snapshot().filter((entry) => !sameLine(entry, line)));
}

export function clearCart() {
  write([]);
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  return { lines, count, subtotal };
}

const drawerListeners = new Set<() => void>();
let drawerOpen = false;

export function setCartOpen(open: boolean) {
  drawerOpen = open;
  drawerListeners.forEach((listener) => listener());
}

export function useCartOpen() {
  return useSyncExternalStore(
    (listener) => {
      drawerListeners.add(listener);
      return () => drawerListeners.delete(listener);
    },
    () => drawerOpen,
    () => false,
  );
}
