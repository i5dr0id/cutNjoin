import { SocialIcon, socialPlatforms } from "@/components/icons/SocialIcon";
import type { SiteQueryResult } from "@/sanity/types";

type Socials = NonNullable<SiteQueryResult["settings"]>["socials"];

export function SocialLinks({ socials, className = "" }: { socials: Socials; className?: string }) {
  const linked = socialPlatforms.flatMap((platform) => {
    const url = socials?.find((social) => social.platform === platform)?.url;
    return url ? [{ platform, url }] : [];
  });
  if (linked.length === 0) return null;

  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {linked.map(({ platform, url }) => (
        <li key={platform} className="flex">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`CUT&JOIN Studios on ${platform}`}
            className="grid size-6 place-items-center text-fg/53 transition-colors hover:text-accent"
          >
            <SocialIcon platform={platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
