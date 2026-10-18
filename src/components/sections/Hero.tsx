import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <Container className="grid items-center gap-12 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pt-28 lg:pb-32">
        <div className="relative z-10">
          <p className="text-sm font-medium tracking-[0.14em] text-muted uppercase">
            Sites · Sistemas · Integrações · Automações
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[2.5rem] leading-[1.08] font-semibold tracking-[-0.05em] text-fg sm:text-6xl lg:text-[4rem]"
          >
            Seu negócio evolui.{" "}
            <span className="chrome-text block">
              A tecnologia acompanha.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Criamos sites, sistemas personalizados, integrações e automações
            que conectam a sua operação e acompanham o crescimento da empresa,
            do primeiro contato do cliente ao processo interno.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contato" size="lg">
              Conversar sobre um projeto
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="#solucoes" variant="secondary" size="lg">
              Explorar soluções
            </ButtonLink>
          </div>
        </div>

        {/* PNG com fundo transparente: assenta direto sobre o preto AMOLED. */}
        <div className="mx-auto w-full max-w-[24rem] sm:max-w-md lg:max-w-none">
          <Image
            src="/images/noxora-icon.png"
            alt="Tecla de vidro translúcido com a marca Noxora gravada na face superior"
            width={1283}
            height={1226}
            priority
            sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 90vw"
            className="h-auto w-full"
          />
        </div>
      </Container>
    </section>
  );
}
