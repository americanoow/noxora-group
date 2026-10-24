"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { requestTurn } from "./playQueue";
import { useMotionEnabled } from "./useMotionEnabled";

type Phase = "static" | "armed" | "playing";

/**
 * Figura animada ao entrar na tela, com botão "Repetir".
 *
 * O HTML do servidor é o estado final (estático e completo). Depois da
 * hidratação, se a figura está abaixo da dobra e o usuário não pediu movimento
 * reduzido, ela fica "armada" e pede a vez na fila (playQueue.ts) quando entra
 * na tela: só uma figura toca por vez. Enquanto espera, mostra o estado final.
 * Depois de `loopMs` (pausa longa) pede a vez de novo, só enquanto estiver à
 * vista. Sem JavaScript, com movimento reduzido, pausado ou com a aba em
 * segundo plano, nada anima e nada fica oculto. O botão "Repetir" reinicia só
 * esta figura, na hora. Os estilos de cada fase estão em globals.css (`[data-play]`).
 */
export function PlayFigure({
  children,
  replayLabel = "Repetir animação",
  replayAriaLabel,
  loopMs = 18000,
  turnMs = 4200,
  aside,
  className = "",
}: {
  children: ReactNode;
  /** `null` esconde o botão (figuras sem opção de repetir). */
  replayLabel?: string | null;
  /** Nome acessível do botão quando o texto visível é curto. */
  replayAriaLabel?: string;
  /** Duração de um ciclo, com a pausa antes de recomeçar. */
  loopMs?: number;
  /** Quanto tempo a sequência ocupa a vez da fila. */
  turnMs?: number;
  /** Conteúdo fixo à esquerda da linha de controles (ex.: rótulo de demonstração). */
  aside?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");
  const [canPlay, setCanPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  // Falta tocar: verdadeiro até a primeira sequência e de novo a cada fim de ciclo.
  const [due, setDue] = useState(true);
  const release = useRef<(() => void) | null>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!enabled) {
      // Pausou, reduziu o movimento ou a aba foi para segundo plano: volta ao estado final e, ao retomar,
      // cada figura visível pede a vez de novo (em vez de todas recomeçarem juntas).
      const reset = window.setTimeout(() => {
        setPhase("static");
        setDue(true);
      }, 0);
      return () => window.clearTimeout(reset);
    }

    let safety = 0;
    // Disparado depois da hidratação, para só então armar a animação.
    const arm = window.setTimeout(() => {
      setCanPlay(true);
      const { top } = element.getBoundingClientRect();
      if (top >= window.innerHeight) {
        setPhase("armed");
        // Rede de segurança: se a figura nunca atingir a faixa de visibilidade, não fica escondida.
        safety = window.setTimeout(() => setPhase((p) => (p === "armed" ? "static" : p)), 4000);
      }
    }, 0);

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
      threshold: 0.2,
    });
    observer.observe(element);

    return () => {
      window.clearTimeout(arm);
      window.clearTimeout(safety);
      observer.disconnect();
    };
  }, [enabled]);

  const replay = useCallback(() => {
    setDue(false);
    setPhase("armed");
    // Dois quadros: o navegador precisa pintar o estado "armado" antes de tocar.
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("playing")));
  }, []);

  // Pede a vez quando está à vista e falta tocar; sair da tela ou pausar tira da fila quem ainda espera.
  useEffect(() => {
    if (!due || !visible || !enabled || !canPlay) return;
    let granted = false;
    const cancel = requestTurn(
      () => {
        granted = true;
        replay();
      },
      turnMs,
      // Esperando a vez: mostra a figura completa em vez de um quadro vazio.
      () => queueMicrotask(() => setPhase((p) => (p === "armed" ? "static" : p))),
    );
    release.current = cancel;
    // Quem já começou termina a sua vez (a fila a libera sozinha); só quem espera sai da fila.
    return () => {
      if (!granted) cancel();
    };
  }, [due, visible, enabled, canPlay, replay, turnMs]);

  // Saiu da tela (ou pausou): devolve a vez na hora, para a próxima figura visível não esperar à toa.
  useEffect(() => {
    if (visible && enabled) return;
    release.current?.();
    release.current = null;
  }, [visible, enabled]);

  // Pausa longa entre ciclos: depois de tocar, volta a ficar "devida" após loopMs.
  useEffect(() => {
    if (phase !== "playing" || !enabled) return;
    const id = window.setTimeout(() => setDue(true), loopMs);
    return () => window.clearTimeout(id);
  }, [phase, loopMs, enabled]);

  return (
    <div className={className}>
      <div ref={ref} data-play={!enabled || phase === "static" ? undefined : phase} data-in-view={visible}>
        {children}
      </div>
      {replayLabel !== null || aside ? (
        // Altura reservada: o botão aparece após a hidratação sem deslocar o layout (no celular, abaixo do rótulo).
        <div className="mt-2 flex flex-col items-start sm:min-h-11 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
          {aside ?? <span />}
          {replayLabel !== null ? (
            <div className="min-h-11 sm:-mr-3">
              <button
                type="button"
                onClick={replay}
                hidden={!canPlay || !enabled}
                aria-label={replayAriaLabel}
                className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg sm:ml-0"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                {replayLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
