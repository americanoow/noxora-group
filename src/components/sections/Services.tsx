import { Blocks, Globe, Workflow, type LucideIcon } from "lucide-react";
import { apiDemo } from "@/content/api-demo";
import { services } from "@/content/services";
import { ApiIntegrationFigure } from "@/components/illustrations/api/ApiIntegrationFigure";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { PlayFigure } from "@/components/ui/PlayFigure";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<string, LucideIcon> = {
  web: Globe,
  sistemas: Blocks,
  automacao: Workflow,
};

export function Services() {
  const api = services.find((service) => service.id === "integracoes");
  // Protótipo da Fase 3A: só "APIs e integrações" tem ilustração própria;
  // os demais entram na Fase 4.
  const others = services.filter((service) => service.id !== "integracoes");

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-title"
      className="relative bg-graphite-1 py-section"
    >
      <RailDivider className="absolute inset-x-0 top-0" />

      <Container>
        <SectionHeader
          id="solucoes-title"
          eyebrow="Soluções"
          title="Soluções sob medida para cada etapa do seu negócio."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {api ? (
            <Facet
              as="article"
              aria-labelledby="solucao-api"
              size="lg"
              innerClassName="bg-surface"
              className="lg:col-span-7"
            >
              <div className="p-5 sm:p-8">
                <PlayFigure
                  replayLabel={apiDemo.replayLabel}
                  aside={
                    <p className="text-sm whitespace-nowrap text-muted">{apiDemo.conceptLabel}</p>
                  }
                >
                  <ApiIntegrationFigure />
                </PlayFigure>
                <h3
                  id="solucao-api"
                  className="mt-4 font-display text-h3 font-semibold text-fg"
                >
                  {api.title}
                </h3>
                <p className="mt-1 text-muted">{api.outcome}</p>
              </div>
            </Facet>
          ) : null}

          <ul className="grid content-start gap-4 lg:col-span-5">
            {others.map((service) => {
              const Icon = icons[service.id] ?? Globe;
              return (
                <li
                  key={service.id}
                  className="flex items-start gap-4 rounded-lg border border-line bg-graphite-2 p-5"
                >
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-chrome"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-display text-h3 font-semibold text-fg">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-muted">{service.outcome}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
