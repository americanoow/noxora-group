export type ProjectImage = {
  /** Caminho em /public/projects ou URL de domínio liberado em next.config.ts. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectCategory = "Website" | "Sistema" | "Integração" | "Automação";

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  problem: string;
  solution: string;
  technologies: readonly string[];
  images: readonly ProjectImage[];
  url?: string;
};

/**
 * Projetos reais da Noxora, exibidos na seção "Projetos".
 *
 * Adicione apenas trabalhos reais e autorizados pelo cliente. Enquanto a lista
 * estiver vazia, a seção mostra um estado vazio honesto em vez de cases fictícios.
 *
 * Exemplo de item:
 * {
 *   slug: "portal-cliente-x",
 *   name: "Portal do Cliente X",
 *   category: "Sistema",
 *   problem: "Pedidos eram acompanhados por e-mail e telefone.",
 *   solution: "Portal web com status de pedidos em tempo real integrado ao ERP.",
 *   technologies: ["Next.js", "PostgreSQL"],
 *   images: [{ src: "/projects/cliente-x/capa.webp", alt: "Tela inicial do portal", width: 1600, height: 1000 }],
 *   url: "https://cliente-x.com.br",
 * }
 */
export const projects: readonly Project[] = [];
