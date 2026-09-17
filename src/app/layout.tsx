import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { appleStartupImages } from "@/lib/pwa";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
