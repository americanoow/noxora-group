import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  const [cover] = project.images;
  const titleId = `projeto-${project.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface-2"
    >
      {cover ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <h3 id={titleId} className="text-2xl font-medium text-fg">
          {project.name}
        </h3>

        <dl className="mt-6 grid gap-5 text-sm leading-relaxed">
          <div>
            <dt className="text-sm tracking-[0.14em] text-muted uppercase">
              Problema
            </dt>
            <dd className="mt-1 text-fg">{project.problem}</dd>
          </div>
          <div>
            <dt className="text-sm tracking-[0.14em] text-muted uppercase">
              Solução
            </dt>
            <dd className="mt-1 text-fg">{project.solution}</dd>
          </div>
          <div>
            <dt className="text-sm tracking-[0.14em] text-muted uppercase">
              Tecnologias
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1 self-start text-sm font-medium text-fg underline-offset-4 hover:underline"
          >
            Ver projeto
            <span className="sr-only">
              {" "}
              {project.name} (abre em nova aba)
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
