import { navItems, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Tecnologia sob medida para empresas em evolução.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="motion-nav motion-nav-footer text-muted hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-sm text-muted">{site.name}. Todos os direitos reservados.</p>
          <MotionToggle />
        </div>
      </Container>
    </footer>
  );
}
