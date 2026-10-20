import { navItems } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { HeaderShell } from "./HeaderShell";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <HeaderShell>
      <Container className="flex h-(--header-h) items-center justify-between gap-6">
        <a
          href="#inicio"
          className="-mx-1 px-1 py-2"
          aria-label="Noxora, voltar ao início"
        >
          <Wordmark animated />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="motion-nav rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="#contato" className="max-sm:hidden">
            Fale com a Noxora
          </ButtonLink>
          <MobileNav items={navItems} />
        </div>
      </Container>
    </HeaderShell>
  );
}
