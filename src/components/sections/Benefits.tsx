import { FileCheck, Link2, Smartphone, Smile, Zap, type LucideIcon } from "lucide-react";
import { benefits, type Benefit } from "@/content/benefits";
import { BeforeAfter } from "@/components/illustrations/benefits/BeforeAfter";
import { Container } from "@/components/ui/Container";
import { RailDivider } from "@/components/ui/RailDivider";
import { PlayFigure } from "@/components/ui/PlayFigure";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<Benefit["id"], LucideIcon> = {
  manual: Zap,
  integrar: Link2,
  digitalizar: FileCheck,
  produtos: Smartphone,
  experiencia: Smile,
};

/**
 * "Como ajudamos", curto e óbvio: um gráfico antes e depois e cinco rótulos.
 * Os serviços em si ficam em "Soluções"; aqui só o resultado para o negócio.
 */
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

        {/* Os blocos soltos se alinham e se ligam uma vez ao entrar na tela. */}
        <PlayFigure replayLabel={null} loopMs={8000} className="mt-10">
          <BeforeAfter />
        </PlayFigure>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {benefits.map((benefit) => {
            const Icon = icons[benefit.id];
            return (
              <li
                key={benefit.id}
                className="motion-benefit inline-flex items-center gap-2.5 rounded-full border border-line bg-graphite-1 px-4 py-2.5 text-sm font-medium text-fg sm:text-base"
              >
                <Icon aria-hidden="true" className="size-5 text-light-ice" strokeWidth={1.75} />
                {benefit.title}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
