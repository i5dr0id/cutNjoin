import Script from "next/script";

export function CloudflareAnalytics({ token }: { token: string }) {
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      type="module"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
