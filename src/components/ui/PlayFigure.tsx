"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "static" | "armed" | "playing";

/**
 * Figura animada ao entrar na tela, com botão "Repetir".
 *
 * O HTML do servidor é o estado final (estático e completo). Depois da
 * hidratação, se a figura está abaixo da dobra e o usuário não pediu movimento
 * reduzido, ela fica "armada" e toca uma vez quando entra na tela. Sem
 * JavaScript ou com movimento reduzido, nada fica oculto e nada anima.
 * Os estilos de cada fase estão em globals.css (`[data-play]`).
 */
export function PlayFigure({
  children,
  replayLabel = "Repetir animação",
  aside,
  className = "",
}: {
  children: ReactNode;
  replayLabel?: string;
  /** Conteúdo fixo à direita da linha de controles (ex.: rótulo de demonstração). */
  aside?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Disparado depois da hidratação, para só então armar a animação.
    const arm = window.setTimeout(() => {
      setCanPlay(true);
      const { top, bottom } = element.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) return; // já visível: fica estático
      setPhase("armed");
    }, 0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPhase((p) => (p === "armed" ? "playing" : p));
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.2 },
    );
    observer.observe(element);

    return () => {
      window.clearTimeout(arm);
      observer.disconnect();
    };
  }, []);

  const replay = useCallback(() => {
    setPhase("armed");
    // Dois quadros: o navegador precisa pintar o estado "armado" antes de tocar.
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("playing")));
  }, []);

  return (
    <div className={className}>
      <div ref={ref} data-play={phase === "static" ? undefined : phase}>
        {children}
      </div>
      {/* Altura reservada: o botão aparece após a hidratação sem deslocar o layout. */}
      <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-x-4">
        <button
          type="button"
          onClick={replay}
          hidden={!canPlay}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {replayLabel}
        </button>
        {aside}
      </div>
    </div>
  );
}
