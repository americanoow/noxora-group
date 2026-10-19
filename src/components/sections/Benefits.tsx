import type { ReactNode } from "react";
import { benefits, type Benefit } from "@/content/benefits";
import {
  DigitalizeScene,
  ExperienceScene,
  IntegrateScene,
  ManualScene,
  ProductScene,
} from "@/components/illustrations/benefits/BenefitScenes";
import { Container } from "@/components/ui/Container";
import { Facet } from "@/components/ui/Facet";
import { RailDivider } from "@/components/ui/RailDivider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const scenes: Record<Benefit["id"], ReactNode> = {
  manual: <ManualScene />,
  integrar: <IntegrateScene />,
  digitalizar: <DigitalizeScene />,
  produtos: <ProductScene />,
  experiencia: <ExperienceScene />,
};

/**
 * Cada benefício tem molduras e tamanhos próprios para quebrar a repetição:
 * faceta, painel solto sobre luz, grafite e contorno simples.
 */
const layout: Record<Benefit["id"], { span: string; frame: "facet" | "light" | "graphite" | "outline" | "facet-sm" }> = {
  manual: { span: "lg:col-span-5", frame: "facet" },
  integrar: { span: "lg:col-span-7", frame: "light" },
  digitalizar: { span: "lg:col-span-4", frame: "graphite" },
  produtos: { span: "lg:col-span-4", frame: "facet-sm" },
  experiencia: { span: "lg:col-span-4", frame: "outline" },
};

function Tile({ benefit, index }: { benefit: Benefit; index: number }) {
  const { frame } = layout[benefit.id];
  const content = (
    <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
      {scenes[benefit.id]}
      <div>
        <h3 className="font-display text-h3 font-semibold text-fg">{benefit.title}</h3>
        <p className="mt-1 text-muted">{benefit.line}</p>
      </div>
    </div>
  );

  if (frame === "facet") {
    return <Facet innerClassName="bg-surface" className="h-full">{content}</Facet>;
  }
  if (frame === "facet-sm") {
    return <Facet size="sm" innerClassName="bg-graphite-1" className="h-full">{content}</Facet>;
  }
  const classes = {
    light:
      "h-full rounded-2xl bg-[radial-gradient(70%_80%_at_70%_0%,rgb(143_180_255/0.12),transparent_70%)]",
    graphite: "h-full rounded-2xl border border-line bg-graphite-2",
    outline: "h-full rounded-2xl border border-line bg-surface",
  }[frame];
  return (
    <div className={classes} data-index={index}>
      {content}
    </div>
  );
}

export function Benefits() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="relative py-section"
    >
      <RailDivider className="absolute inset-x-0 top-0" />
      <Container>
        <SectionHeader
          id="beneficios-title"
          eyebrow="Como ajudamos"
          title="Menos atrito na operação. Mais espaço para crescer."
        />

        <ul className="mt-12 grid gap-5 lg:grid-cols-12">
          {benefits.map((benefit, index) => (
            <li key={benefit.id} className={layout[benefit.id].span}>
              <Reveal className="h-full" delay={index * 70}>
                <Tile benefit={benefit} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
