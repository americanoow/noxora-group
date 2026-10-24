import type { CSSProperties } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projectLabels, type Project } from "@/content/projects";
import { ProjectPreview } from "@/components/illustrations/projects/ProjectPreview";

/**
 * Um projeto na vitrine: a captura domina; ao lado, o tipo, o nome, uma frase
 * factual e o acesso ao site. Objetivo e solução ficam em "Ver detalhes" (um
 * <details> nativo: teclado, leitor de tela e sem JavaScript). Demonstração
 * conceitual é sempre rotulada.
 */
// Ordem da entrada em sequência do conteúdo (ver `.pj-reveal` em globals.css).
const step = (index: number) => ({ "--i": index }) as CSSProperties;

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-control px-4 text-sm font-medium text-fg transition-colors hover:border-fg/70 hover:bg-white/5";

export function ProjectSlide({ project }: { project: Project }) {
  const titleId = `projeto-${project.id}`;
  const concept = project.kind === "concept";

  return (
    <article aria-labelledby={titleId} className="project-editorial w-full border-t border-line pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr] lg:items-center lg:gap-10">
        {project.image && project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={projectLabels.previewLink(project.title)}
            className="pj-preview block min-w-0 rounded-xl"
          >
            <ProjectPreview project={project} />
          </a>
        ) : (
          <div className="pj-preview min-w-0">
            <ProjectPreview project={project} />
          </div>
        )}

        <div className="grid min-w-0 content-center gap-4 px-1 pb-2 sm:px-2 lg:pb-0">
          <p className="pj-reveal flex flex-wrap items-center gap-x-2 text-sm text-muted" style={step(0)}>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className={concept ? "text-light-ice" : undefined}>
              {concept ? "Demonstração conceitual" : projectLabels.real}
            </span>
          </p>

          <div className="pj-reveal" style={step(1)}>
            <h3 id={titleId} className="font-display text-h3 font-semibold text-fg">
              {project.title}
            </h3>
            <p className="mt-2 text-base text-muted sm:text-lg">{project.summary}</p>
          </div>

          <div className="pj-reveal flex flex-wrap gap-x-5 gap-y-1" style={step(2)}>
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {concept ? "Ver demonstração" : projectLabels.visit}
                <span className="sr-only"> de {project.title} (abre em nova aba)</span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            ) : null}
            {project.caseStudyUrl ? (
              <a href={project.caseStudyUrl} className={linkClass}>
                Ler estudo de caso
                <span className="sr-only"> de {project.title}</span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            ) : null}
          </div>

          <details className="pj-reveal group" style={step(3)}>
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-md text-sm text-muted transition-colors marker:hidden hover:text-fg [&::-webkit-details-marker]:hidden">
              {projectLabels.details}
              <span className="sr-only"> de {project.title}</span>
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <dl className="mt-2 grid gap-3 text-base">
              <div>
                <dt className="text-sm text-muted">{concept ? projectLabels.problem : projectLabels.goal}</dt>
                <dd className="text-fg">{project.problem}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{projectLabels.solution}</dt>
                <dd className="text-fg">{project.solution}</dd>
              </div>
              {project.technologies.length > 0 ? (
                <div>
                  <dt className="text-sm text-muted">Tecnologias</dt>
                  <dd className="text-fg">{project.technologies.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </details>
        </div>
      </div>
    </article>
  );
}
