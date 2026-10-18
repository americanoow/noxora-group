import { Reveal } from "@/components/ui/Reveal";

type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
};

/** Título de seção. O `id` vai no h2 para ser referenciado via aria-labelledby. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <Reveal className="max-w-2xl">
      <header>
        <p className="text-sm font-medium tracking-[0.14em] text-muted uppercase">
          {eyebrow}
        </p>
        <h2 id={id} className="mt-4 font-display text-h2 font-semibold text-fg">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </header>
    </Reveal>
  );
}
