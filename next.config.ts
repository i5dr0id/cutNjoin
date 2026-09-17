import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const r2PublicOrigin = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).origin
  : null;
const r2Sources = r2PublicOrigin ? [r2PublicOrigin] : [];

const directives = (entries: Record<string, string[]>) =>
  Object.entries(entries)
    .map(([name, values]) => [name, ...values].join(" "))
    .join("; ");

const siteCsp = directives({
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://challenges.cloudflare.com",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "blob:", "data:", "https://cdn.sanity.io", ...r2Sources],
  "media-src": ["'self'", "https://cdn.sanity.io", ...r2Sources],
  "font-src": ["'self'"],
  "connect-src": ["'self'", "https://challenges.cloudflare.com", ...(isDev ? ["ws:"] : [])],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-src": [
    "https://www.youtube-nocookie.com",
    "https://www.youtube.com",
    "https://player.vimeo.com",
    "https://challenges.cloudflare.com",
  ],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
});

const studioCsp = directives({
  "frame-ancestors": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
});

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "Content-Security-Policy", value: siteCsp },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      { source: "/studio/:path*", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
      { source: "/studio", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
    ];
  },
};

export default nextConfig;
