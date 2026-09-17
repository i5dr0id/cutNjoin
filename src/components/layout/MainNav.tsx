"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { useScrollSpy } from "./useScrollSpy";

const sectionIds = mainNav.flatMap((item) => (item.section ? [item.section] : []));

export function MainNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const activeSection = useScrollSpy(sectionIds);

  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-8">
        {mainNav.map((item) => {
          const onActivePage = item.activeOn !== undefined && pathname.startsWith(item.activeOn);
          const active = item.section
            ? onActivePage || (pathname === "/" && activeSection === item.section)
            : pathname.startsWith(item.href);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={`relative block text-sm leading-5 font-medium tracking-[0.35px] transition-colors duration-150 after:absolute after:inset-x-0 after:top-[23px] after:h-px after:bg-accent after:transition-opacity ${
                  active ? "text-accent after:opacity-100" : "text-fg/60 after:opacity-0 hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
