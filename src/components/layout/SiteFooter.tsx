import Link from "next/link";
import { Container } from "@/components/primitives";
import { footerNav } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-8 py-16 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo className="h-[50px]" />
          <p className="text-sm text-fg/60">A digital post-production company in Lagos, Nigeria.</p>
        </div>
        <nav aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links" className="mb-4 text-sm font-semibold tracking-widest uppercase">
            Quick Links
          </h2>
          <ul className="flex flex-col gap-2">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-fg/60 transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-line py-6">
        <p className="text-xs text-fg/40">
          © {new Date().getFullYear()} CUT&amp;JOIN Studios. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
