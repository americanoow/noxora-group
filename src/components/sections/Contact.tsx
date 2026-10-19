import Image from "next/image";
import { ArrowUpRight, Camera, Mail, MessageCircle } from "lucide-react";
import { contactSection, getContactChannels } from "@/content/contact";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { RailDivider } from "@/components/ui/RailDivider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "./ContactForm";

const icons = { email: Mail, whatsapp: MessageCircle, instagram: Camera };

/**
 * Fecho da página. Ênfase nos contatos: três peças lado a lado; o formulário
 * vem logo abaixo. Canal ainda não definido aparece como "Em breve", sem link
 * fictício.
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
          <Image
            src="/images/noxora-icon.png"
            alt=""
            width={1283}
            height={1226}
            sizes="144px"
            className="h-auto w-28 shrink-0 drop-shadow-[0_18px_30px_rgb(0_0_0/0.8)] sm:w-36"
          />
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = icons[channel.id];
            const body = (
              <Facet size="sm" innerClassName="bg-graphite-2" className="h-full">
                <div className="flex h-full flex-col gap-6 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-14 place-items-center rounded-lg border border-line bg-ink text-chrome">
                      <Icon aria-hidden="true" className="size-7" strokeWidth={1.5} />
                    </span>
                    {channel.href ? (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-6 shrink-0 text-chrome transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    ) : (
                      <span className="shrink-0 rounded-full border border-line px-3 py-1 text-sm font-medium text-muted">
                        {contactSection.comingSoon}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="block text-sm text-muted">{channel.label}</span>
                    <span className="mt-1 block font-display text-xl font-semibold wrap-anywhere text-fg">
                      {channel.value}
                    </span>
                    {channel.description ? (
                      <span className="mt-1 block text-sm text-muted">
                        {channel.description}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Facet>
            );

            return (
              <li key={channel.id}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group block h-full transition-opacity hover:opacity-90"
                  >
                    {body}
                    <span className="sr-only">
                      {channel.action}
                      {channel.external ? ` ${contactSection.newTab}` : ""}
                    </span>
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>

        <Facet size="lg" innerClassName="bg-graphite-2" className="mx-auto mt-8 max-w-3xl">
          <ContactForm whatsappUrl={whatsappUrl} />
        </Facet>
      </Container>
    </section>
  );
}
