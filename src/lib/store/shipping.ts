import { NIGERIA } from "./regions";

export type StateRate = { state?: string | null; fee?: number | null; eta?: string | null };
export type ShippingZone = {
  name?: string | null;
  countries?: string[] | null;
  fee?: number | null;
  eta?: string | null;
};

export type ShippingRates = {
  nigeriaRates: StateRate[] | null;
  internationalZones: ShippingZone[] | null;
  restOfWorldFee: number | null;
  restOfWorldEta: string | null;
};

export type ShippingQuote = { fee: number; eta: string | null; zone: string };

export function quoteShipping(rates: ShippingRates, country: string, state: string): ShippingQuote | null {
  if (country === NIGERIA) {
    const rate = rates.nigeriaRates?.find((entry) => entry.state === state);
    return typeof rate?.fee === "number"
      ? { fee: rate.fee, eta: rate.eta ?? null, zone: `Nigeria — ${state}` }
      : null;
  }
  const zone = rates.internationalZones?.find((entry) => entry.countries?.includes(country));
  if (zone && typeof zone.fee === "number")
    return { fee: zone.fee, eta: zone.eta ?? null, zone: zone.name ?? "International" };
  if (typeof rates.restOfWorldFee === "number") {
    return { fee: rates.restOfWorldFee, eta: rates.restOfWorldEta, zone: "Rest of the world" };
  }
  return null;
}
