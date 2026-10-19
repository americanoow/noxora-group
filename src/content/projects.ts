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
  /** O que é, em uma frase. */
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
 * preferência, com captura de tela em `public/projects/`. As três demonstrações
 * abaixo são conceituais: mostram o tipo de solução que a Noxora desenvolve e
 * não são trabalhos entregues. Não há clientes, números nem resultados.
 * Quando houver projetos reais, adicione-os no início da lista.
 *
 * Exemplo de projeto real:
 * {
 *   id: "portal-cliente-x",
 *   title: "Portal do Cliente X",
 *   category: "Sistema",
 *   kind: "real",
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
    id: "website-comercial",
    title: "Website comercial",
    category: "Website",
    kind: "concept",
    description: "Um site que apresenta a empresa e leva o visitante ao contato.",
    problem: "Clientes não encontram a empresa ou não entendem o que ela faz.",
    solution: "Site rápido, claro e pronto para o celular, com chamadas diretas para o WhatsApp.",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    mockup: "website",
  },
  {
    id: "sistema-de-gestao",
    title: "Sistema de gestão",
    category: "Sistema",
    kind: "concept",
    description: "Um painel para acompanhar pedidos, clientes e tarefas em um só lugar.",
    problem: "As informações ficam em planilhas e conversas, difíceis de acompanhar.",
    solution: "Painel web com cadastros, status e relatórios simples, acessível de qualquer lugar.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    mockup: "system",
  },
  {
    id: "automacao-de-processos",
    title: "Automação de processos",
    category: "Automação",
    kind: "concept",
    description: "Tarefas repetitivas passam a acontecer sozinhas.",
    problem: "A equipe copia os mesmos dados de um lugar para outro todos os dias.",
    solution: "As ferramentas conversam entre si: o pedido chega, é registrado e o cliente é avisado.",
    technologies: ["APIs", "Webhooks", "Node.js"],
    mockup: "automation",
  },
];
