import type { CSSProperties } from "react";

const NAME = "NOXORA.";

/**
 * Logotipo em texto, reproduzindo o wordmark da marca: caixa alta, traço firme,
 * espaçamento curto e ponto final. Trocar por SVG se a marca fornecer um vetor.
 *
 * Com `animated`, as letras sobem uma a uma na carga (uma vez) e, em loop com
 * pausa longa, um brilho percorre as letras, terminando no ponto em azul-gelo
 * (estilos `.wm-*` em globals.css). O nome completo fica em texto para leitores
 * de tela; as letras separadas são decorativas.
 */
export function Wordmark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  const classes = `text-lg font-semibold tracking-[0.1em] text-fg ${className}`;
  if (!animated) return <span className={classes}>{NAME}</span>;

  return (
    <span className={classes}>
      <span className="sr-only">{NAME}</span>
      <span aria-hidden="true" className="wm inline-flex">
        {[...NAME].map((letter, index) => (
          <span key={index} className="wm-letter inline-block" style={{ "--i": index } as CSSProperties}>
            <span className={`wm-glint inline-block ${letter === "." ? "wm-dot" : ""}`}>{letter}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
