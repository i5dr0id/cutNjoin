const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "CUT&JOIN Studios",
  description:
    "Post-production house in Lagos, Nigeria — editing, colour grading, sound design and video production.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000"),
} as const;

export const sections = {
  hero: "top",
  services: "services",
  projects: "projects",
  clients: "clients",
  updates: "updates",
  footage: "footage",
  merch: "store",
  contact: "contact",
} as const;

export type SectionId = (typeof sections)[keyof typeof sections];

export const routes = {
  home: "/",
  projects: "/projects",
  footage: "/footage",
  updates: "/updates",
  store: "/store",
  profile: "/profile",
  studio: "/studio",
} as const;

export type NavItem = { label: string; href: string; section?: SectionId };

export const mainNav: NavItem[] = [
  { label: "Services", href: `/#${sections.services}`, section: sections.services },
  { label: "Projects", href: `/#${sections.projects}`, section: sections.projects },
  { label: "Aerials", href: `/#${sections.footage}`, section: sections.footage },
  { label: "Updates", href: `/#${sections.updates}`, section: sections.updates },
  { label: "Store", href: `/#${sections.merch}`, section: sections.merch },
  { label: "Profile", href: routes.profile },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "About Us", href: routes.profile },
  { label: "Projects", href: routes.projects },
  { label: "Free Footage", href: routes.footage },
  { label: "Updates", href: routes.updates },
  { label: "Store", href: routes.store },
  { label: "Contact", href: `/#${sections.contact}` },
];
