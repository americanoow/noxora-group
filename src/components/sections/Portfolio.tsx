import { projects, type Project } from "@/content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "./ProjectCard";

export function Portfolio({
  items = projects,
}: {
  items?: readonly Project[];
}) {
  return (
    <section
      id="projetos"
      aria-labelledby="projetos-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          id="projetos-title"
          eyebrow="Projetos"
          title="Problemas reais, soluções sob medida."
          description="Cada projeto é apresentado pelo desafio que resolveu, pela solução construída e pelas tecnologias envolvidas."
        />

        {items.length > 0 ? (
          <ul className="mt-14 grid gap-6 lg:grid-cols-2">
            {items.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-14 flex flex-col items-start gap-6 rounded-3xl border border-dashed border-line p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-xl leading-relaxed text-muted">
              Estamos preparando os estudos de caso com autorização dos
              clientes. Enquanto isso, podemos apresentar trabalhos anteriores
              em uma conversa.
            </p>
            <ButtonLink href="#contato" variant="secondary">
              Pedir uma apresentação
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
