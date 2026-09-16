import { SocialIcon, socialPlatforms } from "@/components/icons/SocialIcon";
import type { SiteQueryResult } from "@/sanity/types";

type Socials = NonNullable<SiteQueryResult["settings"]>["socials"];

export function SocialLinks({ socials, className = "" }: { socials: Socials; className?: string }) {
  const urlFor = (platform: string) => socials?.find((s) => s.platform === platform)?.url;
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {socialPlatforms.map((platform) => {
        const url = urlFor(platform);
        return (
          <li key={platform} className="flex">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={platform}
                className="text-fg/27 transition-colors hover:text-accent"
              >
                <SocialIcon platform={platform} />
              </a>
            ) : (
              <SocialIcon platform={platform} className="text-fg/27" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
