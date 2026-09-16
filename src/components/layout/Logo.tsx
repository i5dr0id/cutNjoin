import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/logo-white.png";

type LogoProps = { className?: string; preload?: boolean };

export function Logo({ className = "h-[67px]", preload = false }: LogoProps) {
  return (
    <Link href="/" aria-label="CUT&JOIN Studios — home" className="flex shrink-0 items-center">
      <Image src={logo} alt="" className={`w-auto object-contain ${className}`} preload={preload} />
    </Link>
  );
}
