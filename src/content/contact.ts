import { whatsappDefaultMessage } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const contactSection = {
  eyebrow: "Contato",
  title: "Vamos conversar sobre o seu projeto.",
  description:
    "Uma ideia, um desafio ou uma nova possibilidade. Escolha o melhor canal para falar com a Noxora.",
  comingSoon: "Em breve",
  newTab: "(abre em nova aba)",
} as const;

type ContactChannel = {
  id: "email" | "whatsapp" | "instagram";
  label: string;
  value: string;
  description: string;
  href: string | null;
  action: string;
  external: boolean;
};

// Lidos no build. Os canais pendentes continuam visíveis, sem links fictícios.
export function getContactChannels(): readonly ContactChannel[] {
  const configuredEmail = process.env.CONTACT_EMAIL?.trim() ?? "";
  const email = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(configuredEmail)
    ? configuredEmail
    : null;
  const whatsappUrl = getWhatsAppUrl(whatsappDefaultMessage);

  return [
    {
      id: "email",
      label: "E-mail",
      value: email ?? "Endereço em definição",
      description: email
        ? "Conte sua ideia ou envie os detalhes do seu projeto."
        : "Nosso endereço de contato será divulgado em breve.",
      href: email ? `mailto:${email}` : null,
      action: "Enviar e-mail",
      external: false,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: whatsappUrl ? "Converse com a Noxora" : "Número em definição",
      description: whatsappUrl
        ? "Um canal direto para começar a conversa sobre o seu projeto."
        : "Em breve, mais um jeito de conversar com a nossa equipe.",
      href: whatsappUrl,
      action: "Abrir WhatsApp",
      external: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      value: "@noxoragroup",
      description: "Acompanhe as novidades e fale com a gente pelo direct.",
      href: "https://www.instagram.com/noxoragroup/",
      action: "Abrir Instagram",
      external: true,
    },
  ];
}
