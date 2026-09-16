import { NextStudio } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="p-8 font-mono text-sm">
        <p>Sanity isn&apos;t configured yet.</p>
        <p className="mt-2 text-fg/60">
          Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local (see .env.example), then restart the dev server.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
