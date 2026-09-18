import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { appleStartupImages } from "@/lib/pwa";
import { CloudflareAnalytics } from "@/components/layout/CloudflareAnalytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image" },
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    title: "CUT&JOIN",
    statusBarStyle: "black-translucent",
    startupImage: appleStartupImages,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  colorScheme: "dark",
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const cloudflareToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh">
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {cloudflareToken && <CloudflareAnalytics token={cloudflareToken} />}
      </body>
    </html>
  );
}
