"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { useScrollSpy } from "./useScrollSpy";

const sectionIds = mainNav.flatMap((item) => (item.section ? [item.section] : []));

export function MainNav() {
  const pathname = usePathname();
  const activeSection = useScrollSpy(sectionIds);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {mainNav.map((item) => {
          const active = item.section
            ? pathname === "/" && activeSection === item.section
            : pathname.startsWith(item.href);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={`text-sm font-medium tracking-widest uppercase transition-colors duration-150 ${
                  active ? "text-accent" : "text-fg/60 hover:text-fg"
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
