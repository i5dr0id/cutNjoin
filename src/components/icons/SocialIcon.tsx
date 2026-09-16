import type { SVGProps } from "react";

export type SocialPlatform = "YouTube" | "Instagram" | "Facebook" | "LinkedIn" | "X" | "TikTok";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.44061,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const glyphs: Record<SocialPlatform, React.ReactNode> = {
  YouTube: (
    <g {...strokeProps}>
      <path d="M1.798 5.042a17.4 17.4 0 0 0 0 7.203 1.44 1.44 0 0 0 1.008 1.009c3.864.64 7.806.64 11.67 0a1.44 1.44 0 0 0 1.008-1.009 17.4 17.4 0 0 0 0-7.203 1.44 1.44 0 0 0-1.008-1.008 35.3 35.3 0 0 0-11.67 0 1.44 1.44 0 0 0-1.008 1.008Z" />
      <path d="m7.202 10.805 3.601-2.161-3.601-2.161v4.322Z" />
    </g>
  ),
  Instagram: (
    <g {...strokeProps}>
      <path d="M12.249 1.44H5.046a3.6 3.6 0 0 0-3.602 3.602v7.203a3.6 3.6 0 0 0 3.602 3.602h7.203a3.6 3.6 0 0 0 3.601-3.602V5.042a3.6 3.6 0 0 0-3.601-3.601Z" />
      <path d="M11.526 8.19a2.88 2.88 0 1 1-5.694.88 2.88 2.88 0 0 1 5.694-.88Z" />
      <path d="M12.609 4.682h.007" />
    </g>
  ),
  Facebook: (
    <path
      {...strokeProps}
      d="M12.967 1.44h-2.161a3.6 3.6 0 0 0-3.602 3.602v2.161H5.043v2.881h2.161v5.762h2.881v-5.762h2.162l.72-2.881h-2.882V5.042a.72.72 0 0 1 .72-.72h2.162V1.44Z"
    />
  ),
  LinkedIn: (
    <g {...strokeProps}>
      <path d="M11.526 5.762a4.32 4.32 0 0 1 4.322 4.322v5.042h-2.881v-5.042a1.44 1.44 0 0 0-2.881 0v5.042H7.205v-5.042a4.32 4.32 0 0 1 4.321-4.322Z" />
      <path d="M4.325 6.483H1.443v8.643h2.882V6.483Z" />
      <path d="M2.884 4.322a1.44 1.44 0 1 0 0-2.881 1.44 1.44 0 0 0 0 2.881Z" />
    </g>
  ),
  X: (
    <path
      fill="currentColor"
      d="M13.14 1.621h2.383l-5.205 5.95 6.124 8.096h-4.795l-3.396-4.489-3.89 4.489H1.977L7.545 9.303.903 1.621H5.82l3.063 4.05 4.258-4.05Zm-.836 12.62h1.32L5.102 2.972H3.685l8.619 11.268Z"
    />
  ),
  TikTok: (
    <path
      fill="currentColor"
      d="M14.111 4.819a3.97 3.97 0 0 1-3.716-3.061V1.44H8.91v9.847a2.08 2.08 0 1 1-1.505-2.29V6.49a4.57 4.57 0 1 0 3.99 4.53V6.519a5.93 5.93 0 0 0 3.436 1.095V5.128a3.5 3.5 0 0 1-.72-.31Z"
    />
  ),
};

type SocialIconProps = SVGProps<SVGSVGElement> & { platform: SocialPlatform };

export function SocialIcon({ platform, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 17.2873 17.2873" width={17} height={17} aria-hidden {...props}>
      {glyphs[platform]}
    </svg>
  );
}

export const socialPlatforms: SocialPlatform[] = [
  "YouTube",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "X",
  "TikTok",
];
