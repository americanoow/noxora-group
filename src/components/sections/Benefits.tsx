import { ArrowDownRight, Check, Code2, MessagesSquare, PenTool } from "lucide-react";
import { processSection } from "@/content/benefits";
import { Container } from "@/components/ui/Container";
import { RailDivider } from "@/components/ui/RailDivider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons = [MessagesSquare, PenTool, Code2, Check];

export function Benefits() {
  return (
    <section id="beneficios" aria-labelledby="beneficios-title" className="relative bg-surface py-section">
      <RailDivider className="absolute inset-x-0 top-0" />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <SectionHeader id="beneficios-title" eyebrow={processSection.eyebrow} title={processSection.title} />
          <p className="max-w-md text-body-lg text-muted lg:justify-self-end">{processSection.description}</p>
        </div>
        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {processSection.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <li key={step.title} className="min-w-0">
                <Reveal delay={index * 80} className="process-step h-full border-t border-control pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-muted">0{index + 1}</span>
                    <Icon aria-hidden="true" className="size-5 text-chrome" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-8 font-display text-h3 font-medium text-fg">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <a href="#contato" className="mt-12 inline-flex min-h-11 items-center gap-3 rounded-sm text-fg underline decoration-control underline-offset-8">
          {processSection.cta}<ArrowDownRight aria-hidden="true" className="size-5" />
        </a>
      </Container>
    </section>
  );
}
