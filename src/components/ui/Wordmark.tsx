/**
 * Logotipo em texto, reproduzindo o wordmark da marca: caixa alta, traço firme,
 * espaçamento curto e ponto final. Trocar por SVG se a marca fornecer um vetor.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-lg font-semibold tracking-[0.1em] text-fg ${className}`}
    >
      NOXORA.
    </span>
  );
}
