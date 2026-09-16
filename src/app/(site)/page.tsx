import { notFound } from "next/navigation";
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
import { getHomepage, getSite } from "@/sanity/fetch";

export const revalidate = 60;

export default async function HomePage() {
  const [home, site] = await Promise.all([getHomepage(), getSite()]);
  const { page } = home;
  if (!page) notFound();

  return (
    <>
      <Hero page={page} />
      <Services page={page} services={home.services} />
      <Projects page={page} projects={home.projects} />
      <Clients page={page} clients={home.clients} />
      <Updates page={page} posts={home.posts} />
      <FreeFootage page={page} footage={home.footage} />
      <Merch page={page} products={home.products} />
      <StartProject page={page} settings={site.settings} />
    </>
  );
}
