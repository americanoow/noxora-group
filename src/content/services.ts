export type Service = {
  id: string;
  title: string;
  outcome: string;
  description: string;
  applications: readonly string[];
};

export const services: readonly Service[] = [
  {
    id: "web",
    title: "Websites e aplicações web",
    outcome: "Presença digital que gera conversas.",
    description:
      "Sites institucionais, landing pages e aplicações web rápidas e acessíveis, pensados para transmitir credibilidade e levar o visitante até o contato certo.",
    applications: [
      "Site institucional",
      "Página de campanha",
      "Portal do cliente",
    ],
  },
  {
    id: "sistemas",
    title: "Sistemas personalizados",
    outcome: "Software no formato do seu processo.",
    description:
      "Ferramentas sob medida que substituem planilhas e controles dispersos, organizando a operação em um só lugar e com as regras do seu negócio.",
    applications: [
      "Gestão de pedidos",
      "Controle de estoque",
      "Painéis internos",
    ],
  },
  {
    id: "integracoes",
    title: "APIs e integrações",
    outcome: "Dados que circulam sem redigitação.",
    description:
      "Conectamos ERP, CRM, e-commerce, meios de pagamento e serviços externos para que as informações cheguem onde precisam, com menos retrabalho e menos erros.",
    applications: [
      "Loja virtual com ERP",
      "Site com CRM",
      "Gateways de pagamento",
    ],
  },
  {
    id: "automacao",
    title: "Automação de processos",
    outcome: "Tarefas repetitivas que se resolvem sozinhas.",
    description:
      "Mapeamos rotinas manuais e as transformamos em fluxos automáticos, liberando a equipe para o trabalho que exige decisão humana.",
    applications: [
      "Relatórios recorrentes",
      "Notificações e lembretes",
      "Fluxos de aprovação",
    ],
  },
];

/** Textos dentro das demonstrações de Soluções (dados genéricos, sem clientes nem números). */
export const serviceDemos = {
  concept: "Demonstração conceitual",
  replay: "Repetir",
  replayLabel: (title: string) => `Repetir a animação: ${title}`,
  web: { desktop: "Computador", phone: "Celular" },
  sistemas: {
    columns: ["Recebido", "Em produção", "Concluído"],
    card: "Pedido 01",
    others: ["Pedido 02", "Pedido 03"],
  },
  integracoes: {
    nodes: ["Loja virtual", "Integração", "ERP"],
    token: "Venda 01",
    done: "Estoque atualizado",
  },
  automacao: {
    input: "Relatório semanal",
    actions: ["Reúne os dados", "Envia à equipe"],
  },
} as const;


export const servicesSection = {
  eyebrow: "O que criamos",
  title: "Tecnologia no formato do seu negócio.",
  description: "Da presença digital à operação: conectamos design e desenvolvimento para tirar seu projeto do papel.",
  applications: "Possibilidades de aplicação",
  cta: "Conversar sobre esta solução",
} as const;
