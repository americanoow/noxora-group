import { whatsappDefaultMessage } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const contactSection = {
  eyebrow: "Contato",
  title: "Seu próximo projeto começa com uma conversa.",
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
      description: email ? "Envie os detalhes do projeto." : "",
      href: email ? `mailto:${email}` : null,
      action: "Enviar e-mail",
      external: false,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: whatsappUrl ? "Converse com a Noxora" : "Número em definição",
      description: whatsappUrl ? "Conversa direta com a equipe." : "",
      href: whatsappUrl,
      action: "Abrir WhatsApp",
      external: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      value: "@noxoragroup",
      description: "Novidades e mensagens diretas.",
      href: "https://www.instagram.com/noxoragroup/",
      action: "Abrir Instagram",
      external: true,
    },
  ];
}
