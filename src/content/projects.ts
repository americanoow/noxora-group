export type ProjectCategory = "Website" | "Sistema" | "Automação";

/** Tipo de composição desenhada em código, usada quando não há captura real. */
export type MockupId = "website" | "system" | "automation";

export type ProjectImage = {
  /** Caminho em /public/projects ou URL de domínio liberado em next.config.ts. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  /** "real": trabalho entregue e autorizado. "concept": demonstração conceitual. */
  kind: "real" | "concept";
  /** Apresentação inicial: uma frase factual curta, só com o que está confirmado. */
  summary: string;
  /** O que é, em uma frase (texto completo; a vitrine mostra `summary`). */
  description: string;
  problem: string;
  solution: string;
  technologies: readonly string[];
  /** Captura real do projeto. Se faltar, `mockup` desenha uma prévia conceitual. */
  image?: ProjectImage;
  mockup?: MockupId;
  /** Link de demonstração, se existir. */
  demoUrl?: string;
  /** Link do estudo de caso, quando houver. */
  caseStudyUrl?: string;
};

/**
 * Vitrine da seção "Projetos".
 *
 * Projetos reais (`kind: "real"`) só entram com autorização do cliente e, de
 * preferência, com captura de tela em `public/projects/`. Os websites
 * têm autoria confirmada pelo responsável. A clínica foi retirada da vitrine
 * a pedido do responsável em 23/10/2026. A vitrine exibe
 * somente esses trabalhos construídos. Nenhum resultado comercial
 * ou tecnologia é atribuído aos projetos reais sem confirmação.
 *
 * Exemplo de projeto real:
 * {
 *   id: "portal-cliente-x",
 *   title: "Portal do Cliente X",
 *   category: "Sistema",
 *   kind: "real",
 *   summary: "Acompanhamento de pedidos online.",
 *   description: "Portal para acompanhar pedidos online.",
 *   problem: "Pedidos eram acompanhados por e-mail e telefone.",
 *   solution: "Portal web com o status de cada pedido, integrado ao ERP.",
 *   technologies: ["Next.js", "PostgreSQL"],
 *   image: { src: "/projects/cliente-x/capa.webp", alt: "Tela inicial do portal", width: 1600, height: 1000 },
 *   demoUrl: "https://cliente-x.com.br",
 * }
 */
export const projects: readonly Project[] = [
  {
    id: "bazar-oliveira",
    title: "Bazar Oliveira",
    category: "Website",
    kind: "real",
    summary: "Catálogo por categorias, busca de produtos e pedidos pelo WhatsApp.",
    description: "Website de loja de materiais de construção, com catálogo e pedidos pelo WhatsApp.",
    problem: "Apresentar os materiais e facilitar a escolha dos produtos para retirada na loja.",
    solution: "Catálogo por categorias, busca de produtos e carrinho com envio do pedido pelo WhatsApp.",
    technologies: [],
    image: { src: "/projects/bazar-oliveira.webp", alt: "Site Bazar Oliveira com categorias e catálogo de materiais de construção.", width: 1440, height: 900 },
    demoUrl: "https://bazar-oliveira-page.vercel.app/",
  },
  {
    id: "peb-estudio",
    title: "PeB Estúdio Fotográfico",
    category: "Website",
    kind: "real",
    summary: "Galeria de fotografias, pacotes e contato direto pelo WhatsApp.",
    description: "Website para estúdio fotográfico, com portfólio de ensaios newborn.",
    problem: "Apresentar o trabalho do estúdio e ajudar o visitante a conhecer os ensaios disponíveis.",
    solution: "Galeria de fotografias, apresentação dos pacotes e contato direto pelo WhatsApp.",
    technologies: [],
    image: { src: "/projects/peb-estudio.webp", alt: "Site PeB Estúdio Fotográfico com apresentação de ensaios e fotografia newborn.", width: 1440, height: 900 },
    demoUrl: "https://pebestudiofotografico.vercel.app/",
  },
];

export const projectLabels = {
  real: "Projeto Noxora",
  goal: "Objetivo",
  problem: "Problema",
  solution: "Solução",
  details: "Ver detalhes",
  visit: "Visitar site",
  previewLink: (title: string) => `Abrir site de ${title} pela imagem (abre em nova aba)`,
};
