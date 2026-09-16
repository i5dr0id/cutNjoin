import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: true } };

export default function Page() {
  return <ComingSoon eyebrow="Featured Work" title="Projects" />;
}
