"use client";

import { BellRing, Check, Inbox, ListChecks, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { requestTurn } from "@/components/ui/playQueue";
import { useMotionEnabled } from "@/components/ui/useMotionEnabled";
import { exampleFlow } from "@/content/benefits";

const STEP_MS = 1500;
const icons = [Inbox, ListChecks, BellRing];

/**
 * Do pedido recebido à equipe avisada, em uma faixa de três passos (em coluna
 * no celular). O HTML do servidor e o estado de repouso mostram os três passos
 * completos: nada fica oculto, com ou sem JavaScript. Ao entrar na tela, com
 * movimento ligado, a sequência toca uma vez: cada passo se acende e a ligação
 * até o próximo se preenche. "Repetir" recomeça só esta demonstração. Só mudam
 * cor, preenchimento e opacidade, então o layout nunca se mexe; com movimento
 * reduzido não há reprodução automática, só o destaque troca de passo.
 */
export function ExampleFlow() {
  const { steps } = exampleFlow;
  // null = repouso (completo); 0..2 = passo em exibição.
  const [active, setActive] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [played, setPlayed] = useState(false);
  const running = useRef(false);
  const timers = useRef<number[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 0);
    return () => {
      window.clearTimeout(id);
      // O array é reatribuído em start(): lê o valor atual na desmontagem.
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    setPlayed(true);
    setActive(0);
    timers.current = [
      window.setTimeout(() => setActive(1), STEP_MS),
      window.setTimeout(() => setActive(2), STEP_MS * 2),
      window.setTimeout(() => {
        setActive(null);
        running.current = false;
      }, STEP_MS * 3),
    ];
  }, []);

  // Uma sequência ao entrar na área visível (só com movimento ligado), na fila das demonstrações:
  // se uma figura de Soluções ainda está tocando, esta espera a sua vez.
  useEffect(() => {
    const element = list.current;
    if (!element || !enabled || played) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        requestTurn(start, STEP_MS * 3 + 600);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, played, start]);

  const busy = active !== null;

  return (
    <div>
      {/* Anúncio para leitores de tela, sem repetir o texto na página. */}
      <p aria-live="polite" className="sr-only">
        {busy ? steps[active].note : ""}
      </p>

      <ol ref={list} aria-label={exampleFlow.label} className="grid gap-10 md:grid-cols-3 md:gap-0">
        {steps.map((step, index) => {
          const Icon = icons[index];
          const lit = active === index;
          const reached = active === null || index <= active;
          const linked = active === null || index < active;
          return (
            <li
              key={step.id}
              aria-current={lit ? "step" : undefined}
              className="relative pl-8 md:pt-9 md:pr-8 md:pl-0"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-0 size-3 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 md:top-0 ${
                  reached ? "border-fg bg-fg" : "border-control bg-ink"
                } ${lit ? "shadow-[0_0_0_5px_rgb(255_255_255/0.12)]" : ""}`}
              />
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-6 -bottom-10 left-[5px] w-px bg-line md:top-[5px] md:right-0 md:bottom-auto md:left-6 md:h-px md:w-auto"
                >
                  <span
                    className={`block size-full origin-top bg-fg transition-transform duration-500 md:origin-left ${
                      linked ? "scale-100" : "scale-0"
                    }`}
                  />
                </span>
              ) : null}

              <h3
                className={`flex items-center gap-2 font-display text-lg font-semibold transition-colors duration-500 ${
                  busy && !lit ? "text-muted" : "text-fg"
                }`}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-chrome" strokeWidth={1.5} />
                {step.title}
              </h3>

              <div className="mt-4">
                {"message" in step ? (
                  <p className="max-w-xs rounded-2xl rounded-tl-sm bg-graphite-2 px-4 py-3 text-base text-fg">
                    {step.message}
                  </p>
                ) : null}
                {"fields" in step ? (
                  <dl className="grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-base">
                    {step.fields.map(([name, value]) => (
                      <div key={name} className="col-span-2 grid grid-cols-subgrid">
                        <dt className="text-muted">{name}</dt>
                        <dd className="font-medium text-fg">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {"alert" in step ? (
                  <div className="grid max-w-xs gap-2 text-base">
                    <p className="text-fg">{step.alert}</p>
                    <p className="inline-flex items-center gap-1.5 text-fg">
                      <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                      {step.status}
                    </p>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Altura reservada: o botão aparece após a hidratação sem deslocar o layout (no celular, abaixo do rótulo). */}
      <div className="mt-8 flex flex-col items-start sm:min-h-11 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
        <p className="text-sm text-muted">{exampleFlow.concept}</p>
        <div className="min-h-11 sm:-mr-3">
          <button
            type="button"
            onClick={start}
            hidden={!ready}
            aria-disabled={busy}
            className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg aria-disabled:cursor-default sm:ml-0"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {played ? exampleFlow.again : exampleFlow.first}
          </button>
        </div>
      </div>
    </div>
  );
}
