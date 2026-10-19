import Image from "next/image";
import { ArrowUpRight, Target, Lightbulb } from "lucide-react";
import type { Project } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { Facet } from "@/components/ui/Facet";

/**
 * Cartão de projeto real: a imagem vem primeiro e ocupa a maior parte do
 * espaço; problema e solução em uma linha cada; tecnologias como rótulos.
 */
export function ProjectCard({ project }: { project: Project }) {
  const [cover] = project.images;
  const titleId = `projeto-${project.slug}`;

  return (
    <Facet
      as="article"
      aria-labelledby={titleId}
      size="lg"
      innerClassName="bg-surface"
      className="w-full"
    >
      {cover ? (
        <div className="relative">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[16/10] w-full object-cover"
          />
          <Badge variant="solid" className="absolute bottom-4 left-4 bg-black/80">
            {project.category}
          </Badge>
        </div>
      ) : null}

      <div className="grid gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 id={titleId} className="font-display text-h3 font-semibold text-fg">
            {project.name}
          </h3>
          {!cover ? <Badge variant="solid">{project.category}</Badge> : null}
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

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-fg underline-offset-4 hover:underline"
          >
            Ver projeto
            <span className="sr-only"> {project.name} (abre em nova aba)</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
      </div>
    </Facet>
  );
}
