/** "Como ajudamos": uma transformação concreta, diferente do que "Soluções" explica. */
export const benefitsSection = {
  eyebrow: "Como ajudamos",
  title: "Do pedido recebido à equipe avisada.",
  description: "Uma entrada. Informações organizadas. Equipe atualizada.",
} as const;

/** Demonstração em três passos: dados fictícios e genéricos, sem cliente nem número de resultado. */
export const exampleFlow = {
  label: "Do pedido recebido à equipe avisada",
  concept: "Demonstração conceitual",
  first: "Ver exemplo",
  again: "Repetir",
  steps: [
    {
      id: "recebido",
      title: "Pedido recebido",
      note: "O pedido chega do jeito que o cliente escreve: solto, numa mensagem.",
      message: "Oi! Quero 2 caixas do modelo azul para sexta, pode ser?",
    },
    {
      id: "organizado",
      title: "Informação organizada",
      note: "A informação é separada em campos: item, quantidade e prazo.",
      fields: [
        ["Item", "Caixa, modelo azul"],
        ["Quantidade", "2"],
        ["Prazo", "Sexta"],
      ],
    },
    {
      id: "avisado",
      title: "Equipe avisada",
      note: "A equipe é avisada na hora, sem ninguém precisar repassar.",
      alert: "Novo pedido para a equipe",
      status: "Avisado",
    },
  ],
} as const;


export const processSection = {
  eyebrow: "Do primeiro contato à entrega",
  title: "Boas soluções começam por entender o negócio.",
  description: "Cada projeto tem seu contexto. É a partir dele que definimos o que construir e como chegar lá.",
  cta: "Conte o que você quer construir",
  steps: [
    { title: "Entender", description: "Conversamos sobre sua empresa, seus desafios e o que precisa mudar." },
    { title: "Desenhar", description: "Organizamos o escopo e a experiência de quem vai usar a solução." },
    { title: "Desenvolver", description: "Transformamos a ideia em um produto, com testes e espaço para ajustes." },
    { title: "Acompanhar", description: "Alinhamos a entrega, orientamos o uso e conversamos sobre os próximos passos." },
  ],
} as const;
