import type { Metadata } from "next";
import { notFound } from "next/navigation";
import logo from "@/assets/brand/logo-white.png";
import {
  Clients,
  FreeFootage,
  Hero,
  Merch,
  Projects,
  Services,
  StartProject,
  Updates,
} from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/seo/localBusiness";
import { getHomepage, getSeo, getSite } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  const title = seo?.seoTitle ?? siteConfig.name;
  const description = seo?.seoDescription ?? seo?.heroIntro ?? siteConfig.description;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const [home, site, seo] = await Promise.all([getHomepage(), getSite(), getSeo()]);
  const { page } = home;
  if (!page) notFound();

  const business = localBusinessJsonLd({
    settings: site.settings,
    name: siteConfig.name,
    description: seo?.seoDescription ?? page.heroIntro ?? siteConfig.description,
    url: siteConfig.url,
    logoUrl: new URL(logo.src, siteConfig.url).href,
    imageUrl: page.heroImage.asset ? urlFor(page.heroImage).width(1200).url() : undefined,
  });

  return (
    <>
      <JsonLd data={business} />
      <Hero page={page} />
      <Services page={page} services={home.services} />
      <Projects page={page} projects={home.projects} />
      <Clients page={page} clients={home.clients} />
      <Updates page={page} posts={home.posts} />
      <FreeFootage
        page={page}
        footage={home.footage}
        licenceSummary={site.settings?.footageLicenceSummary ?? null}
      />
      <Merch page={page} products={home.products} />
      <StartProject page={page} settings={site.settings} />
    </>
  );
}
