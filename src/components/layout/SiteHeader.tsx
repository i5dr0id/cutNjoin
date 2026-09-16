import { getSite } from "@/sanity/fetch";
import { HeaderFrame } from "./HeaderFrame";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";
import { SocialLinks } from "./SocialLinks";

export async function SiteHeader() {
  const { settings } = await getSite();
  return (
    <HeaderFrame>
      <div className="mx-auto flex h-[100px] max-w-site items-start justify-between px-6 lg:px-12">
        <div className="pt-[26px]">
          <Logo preload />
        </div>
        <MainNav className="hidden pt-[21px] lg:block" />
        <SocialLinks socials={settings?.socials ?? null} className="hidden pt-[23px] lg:flex" />
        <MobileNav socials={<SocialLinks socials={settings?.socials ?? null} />} />
      </div>
    </HeaderFrame>
  );
}
