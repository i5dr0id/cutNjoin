import type { Metadata } from "next";
import { ComingSoon } from "../_components/ComingSoon";

export const metadata: Metadata = { title: "Profile" };

export default function Page() {
  return <ComingSoon eyebrow="About" title="Profile" />;
}
