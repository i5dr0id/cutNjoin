import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return <ComingSoon eyebrow="Featured Work" title="Projects" />;
}
