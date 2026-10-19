import type { ReactNode } from "react";
import { apiDemo } from "@/content/api-demo";
import { services } from "@/content/services";
import { ApiIntegrationFigure } from "@/components/illustrations/api/ApiIntegrationFigure";
import { AutomationFigure, SystemFigure, WebFigure } from "@/components/illustrations/services/ServiceFigures";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { PlayFigure } from "@/components/ui/PlayFigure";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Miniatura de cada solução. Websites e sistemas montam camadas; a automação
// mostra um documento passando pela regra e tem a opção de repetir.
const figures: Record<string, ReactNode> = {
  web: <PlayFigure replayLabel={null} loopMs={5500}><WebFigure /></PlayFigure>,
  sistemas: <PlayFigure replayLabel={null} loopMs={5500}><SystemFigure /></PlayFigure>,
  automacao: (
    <PlayFigure replayLabel="Repetir" replayAriaLabel="Repetir a animação da automação" loopMs={7500}>
      <AutomationFigure />
    </PlayFigure>
  ),
};

export function Services() {
  const api = services.find((service) => service.id === "integracoes");
  // "APIs e integrações" ganha a ilustração grande; as demais, uma miniatura animada.
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

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
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
                  loopMs={9500}
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

          <ul className="grid grid-cols-1 content-start gap-4 lg:col-span-5">
            {others.map((service) => (
              <li
                key={service.id}
                className="flex items-start gap-4 rounded-lg border border-line bg-graphite-2 p-4"
              >
                <div className="w-28 shrink-0 sm:w-40">{figures[service.id]}</div>
                <div className="min-w-0 pt-1">
                  <h3 className="font-display text-h3 font-semibold text-fg">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-muted">{service.outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
