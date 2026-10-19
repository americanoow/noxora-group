import { ArrowRight, Code2, Lightbulb, Target, type LucideIcon } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { ProjectStage } from "@/components/illustrations/projects/ProjectStage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "./ProjectCard";

// Como cada projeto será apresentado quando houver cases reais autorizados.
const steps: { label: string; icon: LucideIcon }[] = [
  { label: "Problema", icon: Target },
  { label: "Solução", icon: Lightbulb },
  { label: "Tecnologias", icon: Code2 },
];

export function Portfolio({
  items = projects,
}: {
  items?: readonly Project[];
}) {
  return (
    <section
      id="projetos"
      aria-labelledby="projetos-title"
      className="relative bg-graphite-1 py-section"
    >
      <RailDivider className="absolute inset-x-0 top-0" />

      <Container>
        <SectionHeader
          id="projetos-title"
          eyebrow="Projetos"
          title="Problemas reais, soluções sob medida."
        />

        {items.length > 0 ? (
          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {items.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <ProjectStage />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink px-3.5 py-1.5 text-sm font-medium text-fg">
                <span className="size-2 rounded-full bg-light-ice shadow-[0_0_10px_2px_rgb(143_180_255/0.5)]" />
                Casos reais em breve
              </p>

              {/* Estrutura de cada caso, como um fluxo */}
              <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Como cada projeto será apresentado">
                {steps.map(({ label, icon: Icon }, index) => (
                  <li key={label} className="flex items-center gap-2">
                    <Facet size="sm" innerClassName="bg-graphite-2">
                      <span className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-fg">
                        <Icon aria-hidden="true" className="size-4 text-chrome" strokeWidth={1.75} />
                        {label}
                      </span>
                    </Facet>
                    {index < steps.length - 1 ? (
                      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
                    ) : null}
                  </li>
                ))}
              </ol>

              <ButtonLink href="#contato" size="lg" className="mt-8">
                Pedir uma apresentação
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
