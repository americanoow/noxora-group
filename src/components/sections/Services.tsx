import { Blocks, Cable, Globe, Workflow, type LucideIcon } from "lucide-react";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<string, LucideIcon> = {
  web: Globe,
  sistemas: Blocks,
  integracoes: Cable,
  automacao: Workflow,
};

export function Services() {
  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          id="solucoes-title"
          eyebrow="Soluções"
          title="Tecnologia aplicada ao que move a sua empresa."
          description="Cada solução começa pelo problema de negócio. A tecnologia é escolhida depois, para resolver o que realmente importa."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {services.map((service) => {
            const Icon = icons[service.id] ?? Globe;
            return (
              <li key={service.id} className="flex flex-col bg-ink p-7 sm:p-9">
                <Icon aria-hidden="true" className="size-6 text-chrome" />
                <h3 className="mt-6 text-xl font-medium text-fg">
                  {service.title}
                </h3>
                <p className="mt-2 chrome-text font-display text-xl font-medium tracking-tight">
                  {service.outcome}
                </p>
                <p className="mt-4 leading-relaxed text-muted">
                  {service.description}
                </p>
                <p className="sr-only">Aplicações:</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.applications.map((application) => (
                    <li
                      key={application}
                      className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                    >
                      {application}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
