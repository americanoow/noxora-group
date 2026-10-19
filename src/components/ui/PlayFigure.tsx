"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// Ciclo em loop só com os loops ligados (<html data-motion="on">, ver MotionToggle).
const loopsOn = () => document.documentElement.dataset.motion === "on";

type Phase = "static" | "armed" | "playing";

/**
 * Figura animada ao entrar na tela, em loop enquanto está à vista, com botão
 * "Repetir".
 *
 * O HTML do servidor é o estado final (estático e completo). Depois da
 * hidratação, se a figura está abaixo da dobra e o usuário não pediu movimento
 * reduzido, ela fica "armada" e toca quando entra na tela (ou em 4 s, no
 * máximo); depois recomeça a cada `loopMs` enquanto estiver visível e os loops
 * estiverem ligados. Sem JavaScript, com movimento reduzido ou com as animações
 * pausadas, nada anima em loop e nada fica oculto.
 * Os estilos de cada fase estão em globals.css (`[data-play]`).
 */
export function PlayFigure({
  children,
  replayLabel = "Repetir animação",
  replayAriaLabel,
  loopMs = 7000,
  aside,
  className = "",
}: {
  children: ReactNode;
  /** `null` esconde a linha de controles (figuras sem opção de repetir). */
  replayLabel?: string | null;
  /** Nome acessível do botão quando o texto visível é curto. */
  replayAriaLabel?: string;
  /** Duração de um ciclo, com a pausa antes de recomeçar. Sem loop (movimento reduzido ou pausado), toca uma vez. */
  loopMs?: number;
  /** Conteúdo fixo à direita da linha de controles (ex.: rótulo de demonstração). */
  aside?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");
  const [canPlay, setCanPlay] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let safety = 0;
    // Disparado depois da hidratação, para só então armar a animação.
    const arm = window.setTimeout(() => {
      setCanPlay(true);
      const { top, bottom } = element.getBoundingClientRect();
      if (top >= window.innerHeight) {
        setPhase("armed");
        // Rede de segurança: se a figura nunca atingir a faixa de visibilidade, não fica escondida.
        safety = window.setTimeout(() => setPhase((p) => (p === "armed" ? "playing" : p)), 4000);
      } else if (bottom > 0) {
        setPhase("playing"); // já visível: toca desde o início
      }
    }, 0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setPhase((p) => (p === "armed" ? "playing" : p));
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    observer.observe(element);

    return () => {
      window.clearTimeout(arm);
      window.clearTimeout(safety);
      observer.disconnect();
    };
  }, []);

  const replay = useCallback(() => {
    setPhase("armed");
    // Dois quadros: o navegador precisa pintar o estado "armado" antes de tocar.
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("playing")));
  }, []);

  // Loop: com a figura à vista, recomeça a cada ciclo; pausado, espera a retomada.
  useEffect(() => {
    if (phase !== "playing" || !visible) return;
    let id = 0;
    const next = () => {
      if (loopsOn()) replay();
      else id = window.setTimeout(next, 1000);
    };
    id = window.setTimeout(next, loopMs);
    return () => window.clearTimeout(id);
  }, [phase, visible, loopMs, replay]);

  return (
    <div className={className}>
      <div ref={ref} data-play={phase === "static" ? undefined : phase}>
        {children}
      </div>
      {replayLabel !== null || aside ? (
        // Altura reservada: o botão aparece após a hidratação sem deslocar o layout.
        <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-x-4">
          {replayLabel !== null ? (
            <button
              type="button"
              onClick={replay}
              hidden={!canPlay}
              aria-label={replayAriaLabel}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              {replayLabel}
            </button>
          ) : null}
          {aside}
        </div>
      ) : null}
    </div>
  );
}
