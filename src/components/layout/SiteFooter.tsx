import { Mail, MapPin, Phone } from "lucide-react";
import { mapsSearchUrl } from "@/lib/maps";
import Link from "next/link";
import { Container } from "@/components/primitives";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { footerNav, sections } from "@/lib/site";
import { getSite } from "@/sanity/fetch";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

const columnHeading = "text-xs leading-4 font-semibold tracking-[2.4px] uppercase text-fg/52";
const columnLink = "text-sm leading-5 text-fg/57 transition-colors hover:text-fg";
const barItem = "flex items-center gap-2 font-mono text-[11px] leading-[16.5px] text-fg/50";

export async function SiteFooter() {
  const { settings, services } = await getSite();
  const year = new Date().getFullYear();

  return (
    <footer>
      <Container className="pt-10 pb-4">
        <div className="pl-2">
          <Logo className="h-[50px]" />
        </div>

        <div className="mt-6 grid gap-8 pb-12 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <p className="max-w-[260px] text-[13px] leading-[21.1px] text-fg/55">{settings?.footerBlurb}</p>
            <SocialLinks socials={settings?.socials ?? null} className="pt-2" />
          </div>

          <nav aria-labelledby="footer-quick-links" className="flex flex-col gap-4">
            <h2 id="footer-quick-links" className={columnHeading}>
              Quick Links
            </h2>
            <ul className="flex flex-col gap-3">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={columnLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services" className="flex flex-col gap-4">
            <h2 id="footer-services" className={columnHeading}>
              Services
            </h2>
            <ul className="flex flex-col gap-3">
              {services.map((service) => (
                <li key={service._id}>
                  <Link href={`/#${sections.services}`} className={columnLink}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h2 className={columnHeading}>Work Hours</h2>
            <dl className="flex flex-col gap-2">
              {settings?.hours?.map((row) => (
                <div key={row._key} className="flex flex-col gap-0.5">
                  <dt className="text-xs leading-4 font-medium text-fg/60">{row.days}</dt>
                  <dd className="font-mono text-xs leading-4 text-fg/52">{row.time}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/#${sections.contact}`}
              className="mt-2 flex items-center justify-center bg-accent px-6 py-3.5 text-sm leading-5 font-semibold tracking-button text-bg uppercase transition hover:brightness-110"
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className={columnHeading}>Newsletter</h2>
            <p className="text-sm leading-5 text-fg/57">
              Studio news, new free footage and drops. No more than once a month.
            </p>
          </div>
          <div className="w-full max-w-[360px]">
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-8">
            {settings?.address && (
              <li>
                <a
                  href={mapsSearchUrl(settings.address)}
                  target="_blank"
                  rel="noreferrer"
                  className={`${barItem} hover:text-fg/80`}
                >
                  <MapPin aria-hidden className="size-[11px]" />
                  {settings.address}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={`${barItem} hover:text-fg/80`}>
                  <Mail aria-hidden className="size-[11px]" />
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.phone && (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className={`${barItem} hover:text-fg/80`}
                >
                  <Phone aria-hidden className="size-[11px]" />
                  {settings.phone}
                </a>
              </li>
            )}
          </ul>
          <p className="font-mono text-[11px] leading-[16.5px] text-fg/48">
            © {year} {settings?.copyrightName ?? "CUT&JOIN Studios"}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
