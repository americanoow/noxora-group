import { ArrowUpRight, Lightbulb, Target } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectPreview } from "@/components/illustrations/projects/ProjectPreview";
import { Badge } from "@/components/ui/Badge";
import { Facet } from "@/components/ui/Facet";

/**
 * Um projeto na vitrine: a prévia visual domina; ao lado, o que é, o problema
 * e a solução em uma linha cada. Demonstração conceitual é sempre rotulada.
 */
export function ProjectSlide({ project }: { project: Project }) {
  const titleId = `projeto-${project.id}`;
  const concept = project.kind === "concept";

  return (
    <Facet as="article" aria-labelledby={titleId} size="lg" innerClassName="bg-surface" className="w-full">
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10 lg:p-8">
        <div className="min-w-0">
          <ProjectPreview project={project} />
        </div>

        <div className="grid min-w-0 gap-5 px-1 pb-2 sm:px-2 lg:pb-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="solid">{project.category}</Badge>
            {concept ? (
              <Badge className="border-light-ice/40 text-light-ice">Demonstração conceitual</Badge>
            ) : null}
          </div>

          <div>
            <h3 id={titleId} className="font-display text-h3 font-semibold text-fg">
              {project.title}
            </h3>
            <p className="mt-2 text-base text-muted sm:text-lg">{project.description}</p>
          </div>

          <dl className="grid gap-3">
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <Target aria-hidden="true" className="size-5 text-chrome" strokeWidth={1.75} />
                <span className="sr-only">Problema</span>
              </dt>
              <dd className="text-fg">{project.problem}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="mt-0.5 shrink-0">
                <Lightbulb aria-hidden="true" className="size-5 text-light-ice" strokeWidth={1.75} />
                <span className="sr-only">Solução</span>
              </dt>
              <dd className="text-fg">{project.solution}</dd>
            </div>
          </dl>

          <ul className="flex flex-wrap gap-2" aria-label="Tecnologias">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <Badge>{technology}</Badge>
              </li>
            ))}
          </ul>

          {project.demoUrl || project.caseStudyUrl ? (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline"
                >
                  Ver demonstração
                  <span className="sr-only"> de {project.title} (abre em nova aba)</span>
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              ) : null}
              {project.caseStudyUrl ? (
                <a
                  href={project.caseStudyUrl}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline"
                >
                  Ler estudo de caso
                  <span className="sr-only"> de {project.title}</span>
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Facet>
  );
}
