"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { mainNav } from "@/lib/site";

export function MobileNav({ socials }: { socials: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="pt-[34px] lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center text-fg/80 transition-colors hover:text-fg"
      >
        {open ? <X aria-hidden className="size-[22px]" /> : <Menu aria-hidden className="size-[22px]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[100px] border-b border-line bg-bg/97 px-6 py-6 backdrop-blur-md"
          >
            <ul className="flex flex-col gap-4">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={!item.section && pathname.startsWith(item.href) ? "page" : undefined}
                    className="block py-1 text-base font-medium tracking-[0.35px] text-fg/90 transition-colors hover:text-accent aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-4">{socials}</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
