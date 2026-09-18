"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cutnjoin:favourites";
const listeners = new Set<() => void>();

function readFavourites(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function favouriteIds(serialized: string): string[] {
  try {
    const parsed: unknown = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function toggleFavourite(id: string) {
  const current = new Set<string>(favouriteIds(readFavourites()));
  if (current.has(id)) current.delete(id);
  else current.add(id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

type FavouriteButtonProps = { id: string; title: string; size: "large" | "small"; className?: string };

const sizes = {
  large: { box: "size-11 bg-bg/60", icon: "size-4" },
  small: { box: "size-9 bg-bg/65", icon: "size-[13px]" },
};

export function FavouriteButton({ id, title, size, className = "" }: FavouriteButtonProps) {
  const serialized = useSyncExternalStore(subscribe, readFavourites, () => "[]");
  const liked = favouriteIds(serialized).includes(id);
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      onClick={() => toggleFavourite(id)}
      className={`grid place-items-center border border-fg/10 backdrop-blur-[8px] transition-colors hover:border-fg/30 ${sizes[size].box} ${className}`}
    >
      <Heart
        aria-hidden
        className={`${sizes[size].icon} transition-colors ${liked ? "fill-accent text-accent" : "text-fg/80"}`}
      />
    </button>
  );
}
