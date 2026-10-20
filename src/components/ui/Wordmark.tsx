import type { CSSProperties } from "react";

const NAME = "NOXORA.";

/**
 * Logotipo em texto, reproduzindo o wordmark da marca: caixa alta, traço firme,
 * espaçamento curto e ponto final. Trocar por SVG se a marca fornecer um vetor.
 *
 * Com `animated`, as letras se afastam horizontalmente e voltam juntas,
 * com pausa longa entre ciclos. O CSS respeita MotionToggle
 * e movimento reduzido, sem acrescentar JavaScript ao componente.
 */
export function Wordmark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <span
      translate="no"
      className={`inline-block text-lg font-semibold tracking-[0.1em] text-fg ${className}`}
    >
      {animated ? (
        <>
          <span className="sr-only">{NAME}</span>
          <span aria-hidden="true" className="wm inline-flex">
            {[...NAME].map((letter, index) => (
              <span
                key={index}
                className="wm-letter inline-block"
                style={{ "--i": index } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </span>
        </>
      ) : NAME}
    </span>
  );
}
