export type Benefit = {
  id: "manual" | "integrar" | "digitalizar" | "produtos" | "experiencia";
  /** Rótulo curto: o gráfico "antes e depois" carrega a mensagem. */
  title: string;
};

// Sem números ou percentuais: só entram aqui resultados que possamos comprovar.
export const benefits: readonly Benefit[] = [
  { id: "manual", title: "Menos trabalho manual" },
  { id: "integrar", title: "Operações integradas" },
  { id: "digitalizar", title: "Processos digitais" },
  { id: "produtos", title: "Produtos digitais" },
  { id: "experiencia", title: "Clientes bem atendidos" },
];

export const beforeAfter = {
  label: "De processos desconectados a uma operação integrada",
  before: {
    title: "Hoje: processos desconectados",
    note: "Informações espalhadas. Tarefas repetitivas.",
  },
  after: {
    title: "Com a Noxora: operação integrada",
    note: "Informações conectadas. Processos automatizados.",
    core: "Solução Noxora",
  },
  /** Os mesmos quatro pontos do dia a dia nos dois painéis. */
  tools: ["Planilhas", "E-mails", "Mensagens", "Pedidos"],
} as const;
