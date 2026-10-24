import type { ReactNode } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { serviceDemos, services, servicesSection } from "@/content/services";
import { AutomationDemo, IntegrationsDemo, SystemsDemo, WebsitesDemo } from "@/components/illustrations/services/ServiceDemos";
import { Container } from "@/components/ui/Container";
import { PlayFigure } from "@/components/ui/PlayFigure";
import { RailDivider } from "@/components/ui/RailDivider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const demos: Record<string, ReactNode> = {
  web: <WebsitesDemo />, sistemas: <SystemsDemo />,
  integracoes: <IntegrationsDemo />, automacao: <AutomationDemo />,
};

export function Services() {
  return (
    <section id="solucoes" aria-labelledby="solucoes-title" className="relative bg-ink py-section">
      <RailDivider className="absolute inset-x-0 top-0" />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <SectionHeader id="solucoes-title" eyebrow={servicesSection.eyebrow} title={servicesSection.title} />
          <p className="max-w-md text-body-lg text-muted lg:justify-self-end">{servicesSection.description}</p>
        </div>
        <Reveal className="mt-12 border-t border-line">
          {services.map((service, index) => (
            <details key={service.id} name="noxora-services" open={index === 0} className="service-entry group border-b border-line">
              <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 rounded-sm py-6 marker:hidden sm:gap-8 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="font-display text-sm text-muted">0{index + 1}</span>
                <h3 id={`solucao-${service.id}`} className="flex-1 font-display text-h3 font-medium text-fg sm:text-2xl">{service.title}</h3>
                <span className="hidden text-sm text-muted lg:block">{service.outcome}</span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-control text-fg group-open:bg-fg group-open:text-ink">
                  <Plus aria-hidden="true" className="service-plus size-5" />
                </span>
              </summary>
              <div className="service-body grid gap-8 pb-8 sm:pb-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:pl-12">
                <div className="flex flex-col items-start">
                  <p className="font-display text-2xl text-fg">{service.outcome}</p>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{service.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={servicesSection.applications}>
                    {service.applications.map((item) => <li key={item} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted">{item}</li>)}
                  </ul>
                  <a href="#contato" className="solution-cta mt-8 text-sm font-medium">
                    <span>{servicesSection.cta}</span><span><ArrowUpRight aria-hidden="true" className="size-4" /></span>
                  </a>
                </div>
                <div className="@container min-w-0 rounded-xl border border-line bg-surface p-4 sm:p-6">
                  <PlayFigure replayLabel={serviceDemos.replay} replayAriaLabel={serviceDemos.replayLabel(service.title)} aside={<p className="text-sm text-muted">{serviceDemos.concept}</p>}>
                    {demos[service.id]}
                  </PlayFigure>
                </div>
              </div>
            </details>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
