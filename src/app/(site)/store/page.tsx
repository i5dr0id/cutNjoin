import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Store", robots: { index: false, follow: true } };

export default function Page() {
  return <ComingSoon eyebrow="Merch" title="Store" />;
}
