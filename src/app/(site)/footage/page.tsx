import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Free Footage", robots: { index: false, follow: true } };

export default function Page() {
  return <ComingSoon eyebrow="Free Footage" title="Free Footage" />;
}
