import { resolveSiteUrl } from "@/lib/site-url";

export const site = {
  name: "Noxora",
  title: "Noxora | Sites, sistemas, integrações e automações",
  description:
    "A Noxora desenvolve sites, sistemas personalizados, integrações e automações para empresas que precisam que a tecnologia acompanhe a evolução do negócio.",
  locale: "pt_BR",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export type NavItem = { label: string; href: `#${string}` };

export const navItems: readonly NavItem[] = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

export const whatsappDefaultMessage =
  "Olá, Noxora! Gostaria de conversar sobre um projeto.";
