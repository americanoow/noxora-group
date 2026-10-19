import { ArrowRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectSlide } from "./ProjectSlide";

/**
 * Vitrine de projetos. Cresce com `src/content/projects.ts`: nenhum projeto
 * mostra um aviso honesto; um mostra o destaque sem controles; dois ou mais
 * viram um carrossel manual.
 */
export function Portfolio({ items = projects }: { items?: readonly Project[] }) {
  const onlyConcepts = items.length > 0 && items.every((project) => project.kind === "concept");

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
          title="Veja como transformamos problemas em soluções."
        />

        {items.length === 0 ? (
          <Facet size="lg" innerClassName="bg-surface" className="mt-12">
            <div className="grid justify-items-start gap-5 p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink px-3.5 py-1.5 text-sm font-medium text-fg">
                <span className="size-2 rounded-full bg-light-ice shadow-[0_0_10px_2px_rgb(143_180_255/0.5)]" />
                Casos reais em breve
              </p>
              <p className="max-w-xl text-base text-muted sm:text-lg">
                Estamos reunindo os primeiros projetos autorizados. Peça uma apresentação para ver como trabalhamos.
              </p>
              <ButtonLink href="#contato" size="lg">
                Pedir uma apresentação
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
          </Facet>
        ) : (
          <>
            {items.length === 1 ? (
              <div className="mt-10">
                <ProjectSlide project={items[0]} />
              </div>
            ) : (
              <ProjectCarousel titles={items.map((project) => project.title)}>
                {items.map((project) => (
                  <ProjectSlide key={project.id} project={project} />
                ))}
              </ProjectCarousel>
            )}

            <div className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              {onlyConcepts ? (
                <p className="max-w-xl text-sm text-muted sm:text-base">
                  Demonstrações conceituais do tipo de solução que desenvolvemos. Nossos primeiros projetos reais
                  entram aqui assim que forem autorizados.
                </p>
              ) : (
                <span />
              )}
              <ButtonLink href="#contato" size="lg">
                Pedir uma apresentação
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
