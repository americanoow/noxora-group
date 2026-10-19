export type Benefit = {
  id: "manual" | "integrar" | "digitalizar" | "produtos" | "experiencia";
  title: string;
  /** Uma linha: a ilustração carrega o resto da mensagem. */
  line: string;
};

// Sem números ou percentuais: só entram aqui resultados que possamos comprovar.
export const benefits: readonly Benefit[] = [
  { id: "manual", title: "Reduzir trabalhos manuais", line: "Menos planilhas e retrabalho." },
  { id: "integrar", title: "Integrar operações", line: "Vendas, financeiro e atendimento no mesmo fluxo." },
  { id: "digitalizar", title: "Digitalizar processos", line: "Do papel ao processo rastreável." },
  { id: "produtos", title: "Criar produtos digitais", line: "Da ideia à plataforma pronta." },
  { id: "experiencia", title: "Melhorar a experiência dos clientes", line: "Canais claros e acessíveis." },
];
