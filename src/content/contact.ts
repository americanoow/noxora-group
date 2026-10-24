import { defaultWhatsAppNumber, whatsappDefaultMessage } from "@/content/site";
import { formatPhone, getWhatsAppDigits, getWhatsAppUrl } from "@/lib/whatsapp";

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
  href: string;
  action: string;
  external: boolean;
};

// Lidos no build. Só aparecem os canais válidos: nada "em definição" nem link fictício.
export function getContactChannels(): readonly ContactChannel[] {
  const configuredEmail = process.env.CONTACT_EMAIL?.trim() || "groupnoxora@gmail.com";
  const email = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(configuredEmail)
    ? configuredEmail
    : null;
  const whatsappDigits = getWhatsAppDigits(defaultWhatsAppNumber);
  const whatsappUrl = getWhatsAppUrl(whatsappDefaultMessage, defaultWhatsAppNumber);

  const channels: (ContactChannel | null)[] = [
    whatsappUrl && whatsappDigits
      ? {
          id: "whatsapp",
          label: "WhatsApp",
          value: formatPhone(whatsappDigits),
          description: "Conversa direta com a equipe.",
          href: whatsappUrl,
          action: "Abrir WhatsApp",
          external: true,
        }
      : null,
    email
      ? {
          id: "email",
          label: "E-mail",
          value: email,
          description: "Envie os detalhes do projeto.",
          href: `mailto:${email}`,
          action: "Enviar e-mail",
          external: false,
        }
      : null,
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
  return channels.filter((channel): channel is ContactChannel => channel !== null);
}
