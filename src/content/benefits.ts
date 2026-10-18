export type Benefit = {
  id: string;
  title: string;
  description: string;
};

// Sem números ou percentuais: só entram aqui resultados que possamos comprovar.
export const benefits: readonly Benefit[] = [
  {
    id: "manual",
    title: "Reduzir trabalhos manuais",
    description:
      "Rotinas repetitivas passam a rodar de forma automática, com menos chance de erro e mais tempo para a equipe.",
  },
  {
    id: "integrar",
    title: "Integrar operações",
    description:
      "Vendas, financeiro e atendimento compartilham as mesmas informações, sem planilhas paralelas.",
  },
  {
    id: "digitalizar",
    title: "Digitalizar processos",
    description:
      "Processos em papel, e-mail ou mensagens viram fluxos digitais rastreáveis e fáceis de acompanhar.",
  },
  {
    id: "produtos",
    title: "Criar produtos digitais",
    description:
      "Ideias viram plataformas e aplicações prontas para clientes, parceiros ou novos modelos de receita.",
  },
  {
    id: "experiencia",
    title: "Melhorar a experiência dos clientes",
    description:
      "Canais mais rápidos, claros e acessíveis em cada ponto de contato com a sua empresa.",
  },
];
