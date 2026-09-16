import { SiteShell } from "@/components/layout";
import { ComingSoon } from "./(site)/_components/ComingSoon";

export default function NotFound() {
  return (
    <SiteShell>
      <ComingSoon eyebrow="404" title="Scene not found" />
    </SiteShell>
  );
}
