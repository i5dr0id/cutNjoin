import type { SiteQueryResult } from "@/sanity/types";

type Settings = NonNullable<SiteQueryResult["settings"]>;

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const COUNTRY_CODES: Record<string, string> = { nigeria: "NG" };

function expandDays(label: string): string[] {
  const [start, end] = label.split(/\s*[–—-]\s*/).map((part) => part.trim());
  const from = WEEK.indexOf(start);
  if (from < 0) return [];
  if (!end) return [WEEK[from]];
  const to = WEEK.indexOf(end);
  return to < from ? [] : WEEK.slice(from, to + 1);
}

function to24Hour(time: string): string | null {
  const match = time
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!match) return null;
  const [, rawHour, minutes = "00", meridiem] = match;
  const hour = (Number(rawHour) % 12) + (meridiem === "pm" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

function openingHours(rows: Settings["hours"]) {
  return (rows ?? []).flatMap((row) => {
    const days = expandDays(row.days ?? "");
    const [opens, closes] = (row.time ?? "").split(/\s*[–—-]\s*/).map(to24Hour);
    if (days.length === 0 || !opens || !closes) return [];
    return [{ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes }];
  });
}

function postalAddress(address: string | null) {
  if (!address) return undefined;
  const parts = address.split(",").map((part) => part.trim());
  if (parts.length < 4) return { "@type": "PostalAddress", streetAddress: address };
  const [streetAddress, addressLocality, addressRegion, country] = parts.slice(-4);
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressRegion,
    addressCountry: COUNTRY_CODES[country.toLowerCase()] ?? country,
  };
}

type LocalBusinessInput = {
  settings: Settings | null;
  name: string;
  description: string;
  url: string;
  logoUrl: string;
  imageUrl?: string;
};

export function localBusinessJsonLd({
  settings,
  name,
  description,
  url,
  logoUrl,
  imageUrl,
}: LocalBusinessInput) {
  const location = settings?.location;
  const sameAs = (settings?.socials ?? []).flatMap((social) => (social.url ? [social.url] : []));
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#business`,
    name,
    description,
    url,
    logo: logoUrl,
    image: imageUrl ?? logoUrl,
    email: settings?.email ?? undefined,
    telephone: settings?.phone ?? undefined,
    address: postalAddress(settings?.address ?? null),
    geo:
      location?.latitude !== undefined && location?.longitude !== undefined
        ? { "@type": "GeoCoordinates", latitude: location.latitude, longitude: location.longitude }
        : undefined,
    areaServed: { "@type": "City", name: "Lagos" },
    openingHoursSpecification: openingHours(settings?.hours ?? null),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}
