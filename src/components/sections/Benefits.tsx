import { benefits } from "@/content/benefits";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Benefits() {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="beneficios-title"
            eyebrow="Como ajudamos"
            title="Menos atrito na operação. Mais espaço para crescer."
          />
        </div>

        <ol className="divide-y divide-line border-y border-line">
          {benefits.map((benefit, index) => (
            <li key={benefit.id} className="grid gap-2 py-7 sm:grid-cols-[4rem_1fr]">
              <span
                aria-hidden="true"
                className="font-display text-2xl text-muted tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-medium text-fg">{benefit.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
