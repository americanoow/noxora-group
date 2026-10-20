import { SweepOnView } from "./SweepOnView";

/**
 * Divisor entre composições: um fio de metal líquido com um ponto de luz no
 * centro. Decorativo; é a "costura" que liga as seções (trilho cromado).
 * Quando o divisor entra na tela, um reflexo curto o percorre uma vez; com
 * movimento reduzido ou sem JavaScript, nada se move (estilos em globals.css).
 */
export function RailDivider({ className = "" }: { className?: string }) {
  return (
    <SweepOnView
      aria-hidden="true"
      className={`h-px w-full bg-[linear-gradient(90deg,transparent,rgb(212_216_222/0.5)_30%,rgb(255_255_255/0.85)_50%,rgb(212_216_222/0.5)_70%,transparent)] ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="rail-sheen absolute inset-y-0 left-0 block w-1/5 bg-[linear-gradient(90deg,transparent,rgb(255_255_255),transparent)]" />
      </span>
      <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg shadow-[0_0_0_4px_rgb(143_180_255/0.14),0_0_18px_2px_rgb(143_180_255/0.35)]" />
    </SweepOnView>
  );
}
