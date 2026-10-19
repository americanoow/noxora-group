import { ArrowRight } from "lucide-react";
import { hero } from "@/content/hero";
import { HeroStage } from "@/components/illustrations/hero/HeroStage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* L0: luz-chave do alto à esquerda do palco. Decorativa; nunca sob o texto. */}
      <div
        aria-hidden="true"
        className="hero-light pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        style={{
          backgroundImage: [
            "conic-gradient(from 158deg at 66% -8%, transparent 0deg, rgb(143 180 255 / 0.05) 6deg, rgb(200 214 255 / 0.15) 21deg, rgb(255 255 255 / 0.2) 27deg, rgb(200 214 255 / 0.11) 35deg, transparent 54deg)",
            "radial-gradient(46% 42% at 70% 52%, rgb(143 180 255 / 0.1), transparent 70%)",
          ].join(","),
        }}
      />

      <Container className="grid items-center gap-8 pt-24 pb-16 sm:pt-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-4 lg:pt-32 lg:pb-24">
        <div className="relative z-10 text-center lg:text-left">
          <p className="text-sm font-medium tracking-[0.1em] text-muted uppercase sm:tracking-[0.14em]">
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-5 font-display text-h1 font-semibold text-fg"
          >
            {hero.headlineLead}{" "}
            <span className="chrome-text">{hero.headlineAccent}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-body-lg text-muted lg:mx-0">
            {hero.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href="#contato" size="lg">
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="#solucoes" variant="secondary" size="lg">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto w-[78%] max-w-[26rem] max-lg:order-first lg:mx-0 lg:ml-auto lg:w-full lg:max-w-none xl:w-[125%] xl:-mr-[22%]">
          <HeroStage />
        </div>
      </Container>
    </section>
  );
}
