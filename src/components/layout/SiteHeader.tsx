import { Container } from "@/components/primitives";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-8">
        <Logo preload />
        <MainNav />
      </Container>
    </header>
  );
}
