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
  label: "De ferramentas soltas a uma operação conectada",
  before: "Hoje",
  after: "Com a Noxora",
  description:
    "Antes: planilhas, papel, e-mail e mensagens soltos e desorganizados. Depois: tudo conectado em um só fluxo.",
} as const;
