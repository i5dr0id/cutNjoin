import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Updates" };

export default function Page() {
  return <ComingSoon eyebrow="From the Studio" title="Updates" />;
}
