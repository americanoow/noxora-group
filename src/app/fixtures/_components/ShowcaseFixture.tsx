import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, type Project } from "@/content/projects";
import { Portfolio } from "@/components/sections/Portfolio";

/**
 * Páginas de apoio dos testes (/fixtures/projetos/0, 1, 2 e 5): a vitrine com
 * essa quantidade de projetos. Só existem quando o build roda com
 * NOXORA_FIXTURES=1 (ver playwright.config.ts); em qualquer outro build, e em
 * qualquer outro caminho, respondem 404.
 */
export const fixtureMetadata: Metadata = { robots: { index: false, follow: false } };

function build(count: number): Project[] {
  return Array.from({ length: count }, (_, index) => {
    const base = projects[index % projects.length];
    return { ...base, id: `${base.id}-${index}`, title: `${base.title} ${index + 1}` };
  });
}

export function ShowcaseFixture({ count }: { count: number }) {
  if (process.env.NOXORA_FIXTURES !== "1") notFound();
  return <Portfolio items={build(count)} />;
}
