import { CartButton } from "@/components/store/CartButton";
import { getSite, getStoreStatus } from "@/sanity/fetch";
import { HeaderFrame } from "./HeaderFrame";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";
import { SocialLinks } from "./SocialLinks";

export async function SiteHeader() {
  const [{ settings }, store] = await Promise.all([getSite(), getStoreStatus()]);
  return (
    <HeaderFrame>
      <div className="mx-auto flex h-[100px] max-w-site items-start justify-between px-6 lg:px-12">
        <div className="pt-[26px]">
          <Logo preload />
        </div>
        <MainNav className="hidden pt-[21px] lg:block" />
        <div className="flex items-start gap-2 lg:gap-6">
          <SocialLinks socials={settings?.socials ?? null} className="hidden pt-[23px] lg:flex" />
          {store?.open && <CartButton className="mt-[34px] lg:mt-[10px] lg:-mr-3" />}
          <MobileNav socials={<SocialLinks socials={settings?.socials ?? null} />} />
        </div>
      </div>
    </HeaderFrame>
  );
}
