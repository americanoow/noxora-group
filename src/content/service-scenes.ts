/** Dados ilustrativos genéricos. Nenhuma destas cenas representa um cliente. */
export const serviceScenes = {
  web: {
    address: "seusite.com.br", brand: "ESTÚDIO /", eyebrow: "ARQUITETURA & ESPAÇOS",
    title: "Espaços para viver novas histórias.", mobileTitle: "Seu espaço. Sua história.",
    mobileCta: "Conheça", caption: "Uma experiência, em qualquer tela.",
  },
  system: {
    address: "Seu painel de gestão", title: "Pedidos",
    orders: [
      { name: "Pedido 01", status: "Recebido" },
      { name: "Pedido 02", status: "Concluído" },
      { name: "Pedido 03", status: "Em produção" },
    ],
    note: "Informações em um só lugar", done: "Pedido atualizado", detail: "Tudo pronto para a próxima etapa.",
  },
  integrations: { inputs: ["Loja", "E-mail", "Site"], destination: "Sistema", done: "Dados sincronizados" },
  automation: {
    title: "Rotina automática", tag: "ATIVA",
    events: [
      { title: "Solicitação recebida", description: "O fluxo começa aqui." },
      { title: "Relatório criado", description: "Informações organizadas." },
      { title: "Equipe notificada", description: "Cada pessoa sabe o próximo passo." },
    ],
    done: "Rotina concluída", detail: "Do início ao fim, sem repassar tarefas.",
  },
} as const;
