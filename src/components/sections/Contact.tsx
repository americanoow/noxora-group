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
 * Fecho da página: o selo do cubo, os canais diretos e o formulário.
 * Canal ainda não definido aparece como "Em breve", sem link fictício.
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

      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Image
            src="/images/noxora-icon.png"
            alt=""
            width={1283}
            height={1226}
            sizes="144px"
            className="mb-8 h-auto w-32 drop-shadow-[0_18px_30px_rgb(0_0_0/0.8)] sm:w-36"
          />
          <SectionHeader
            id="contato-title"
            eyebrow={contactSection.eyebrow}
            title={contactSection.title}
          />

          <ul className="mt-10 grid gap-3">
            {channels.map((channel) => {
              const Icon = icons[channel.id];
              const body = (
                <Facet size="sm" innerClassName="bg-graphite-2">
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md border border-line bg-ink text-chrome">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{channel.label}</span>
                      <span className="block font-display text-lg font-semibold wrap-anywhere text-fg">
                        {channel.value}
                      </span>
                      {channel.description ? (
                        <span className="block text-sm text-muted">
                          {channel.description}
                        </span>
                      ) : null}
                    </span>
                    {channel.href ? (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 shrink-0 text-chrome transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    ) : (
                      <span className="shrink-0 rounded-full border border-line px-3 py-1 text-sm font-medium text-muted">
                        {contactSection.comingSoon}
                      </span>
                    )}
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
                      className="group block transition-opacity hover:opacity-90"
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
        </div>

        <Facet size="lg" innerClassName="bg-graphite-2" className="lg:col-span-7 lg:self-start">
          <ContactForm whatsappUrl={whatsappUrl} />
        </Facet>
      </Container>
    </section>
  );
}
