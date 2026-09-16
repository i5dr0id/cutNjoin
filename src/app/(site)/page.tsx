import { SectionDivider } from "@/components/primitives";
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <SectionDivider />
      <Projects />
      <Clients />
      <SectionDivider />
      <Updates />
      <SectionDivider />
      <FreeFootage />
      <SectionDivider />
      <Merch />
      <SectionDivider />
      <StartProject />
    </>
  );
}
