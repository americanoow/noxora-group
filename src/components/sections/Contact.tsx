import Image from "next/image";
import { ArrowUpRight, Camera, Mail, MessageCircle } from "lucide-react";
import { contactSection, getContactChannels } from "@/content/contact";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SweepOnView } from "@/components/ui/SweepOnView";
import { ContactForm } from "./ContactForm";

const icons = { email: Mail, whatsapp: MessageCircle, instagram: Camera };

/**
 * Fecho da página, compacto: o título, o selo do cubo, três canais enxutos lado
 * a lado (só os válidos; nada "em definição") e o formulário, que é o único
 * bloco com o canto chanfrado.
 */
export function Contact() {
  const channels = getContactChannels();
  const whatsappUrl = channels.find((c) => c.id === "whatsapp")?.href ?? null;

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="relative isolate overflow-hidden py-section"
    >
      <RailDivider className="absolute inset-x-0 top-0" />
      {/* Luz decorativa do alto à esquerda: nunca sob o texto principal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(46%_52%_at_8%_0%,rgb(143_180_255/0.1),transparent_70%)]"
      />

      <Container>
        <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            id="contato-title"
            eyebrow={contactSection.eyebrow}
            title={contactSection.title}
          />
          <SweepOnView className="relative w-20 shrink-0 sm:w-28">
            <Image
              src="/images/noxora-icon.png"
              alt=""
              width={1283}
              height={1226}
              sizes="112px"
              className="h-auto w-full drop-shadow-[0_18px_30px_rgb(0_0_0/0.8)]"
            />
            {/* O cubo pega a luz uma vez ao entrar na tela (mesma ideia do hero). */}
            <Image
              src="/images/noxora-icon.png"
              alt=""
              width={1283}
              height={1226}
              sizes="112px"
              aria-hidden="true"
              className="cube-sheen seal-sheen pointer-events-none absolute inset-0 h-auto w-full"
            />
          </SweepOnView>
        </div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = icons[channel.id];
            const opensNewTab = channel.external && channel.id !== "instagram";
            return (
              <li key={channel.id} className="min-w-0">
                <a
                  href={channel.href}
                  target={opensNewTab ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="motion-channel group flex h-full items-center gap-4 rounded-xl border border-line bg-graphite-1 px-5 py-4 transition-colors hover:border-control"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-ink text-chrome">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-muted">{channel.label}</span>
                    <span className="block font-display text-base font-semibold wrap-anywhere text-fg">
                      {channel.value}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-chrome" />
                  <span className="sr-only">
                    {channel.action}
                    {opensNewTab ? ` ${contactSection.newTab}` : ""}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <Facet size="lg" innerClassName="bg-graphite-2" className="mx-auto mt-6 max-w-3xl">
          <ContactForm whatsappUrl={whatsappUrl} />
        </Facet>
      </Container>
    </section>
  );
}
