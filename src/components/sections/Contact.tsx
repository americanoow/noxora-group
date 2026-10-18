import { ArrowUpRight, Camera, Mail, MessageCircle } from "lucide-react";
import { contactSection, getContactChannels } from "@/content/contact";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons = { email: Mail, whatsapp: MessageCircle, instagram: Camera };

export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <Container>
        <SectionHeader id="contato-title" {...contactSection} />

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {getContactChannels().map((channel) => {
            const Icon = icons[channel.id];
            const content = (
              <>
                <Icon aria-hidden="true" className="size-6 text-chrome" />
                <h3 className="mt-7 text-sm font-medium text-muted">
                  {channel.label}
                </h3>
                <p className="mt-2 font-display text-xl font-semibold tracking-tight wrap-anywhere text-fg lg:text-2xl">
                  {channel.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {channel.description}
                </p>
                <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-fg">
                  {channel.href ? (
                    <>
                      {channel.action}
                      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      {channel.external ? (
                        <span className="sr-only"> {contactSection.newTab}</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="rounded-full border border-line px-3 py-1 text-sm font-medium text-muted">
                      {contactSection.comingSoon}
                    </span>
                  )}
                </span>
              </>
            );
            const classes = "flex h-full flex-col items-start rounded-2xl border border-line bg-surface-2 p-7 lg:p-8";

            return (
              <li key={channel.id}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className={`group ${classes} transition-colors hover:border-control/50 hover:bg-surface-3`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={classes}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
