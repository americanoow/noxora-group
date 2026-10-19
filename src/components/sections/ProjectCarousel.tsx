"use client";

import { Children, useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel manual de projetos, sem autoplay e sem loop. A rolagem é a nativa
 * do navegador com `scroll-snap`: o gesto de arrastar no celular, o teclado e
 * o leitor de tela funcionam sem código extra. Os controles (setas e pontos)
 * só aparecem com JavaScript; sem ele, todos os projetos continuam acessíveis
 * pela rolagem horizontal. Com um só projeto, nada aqui é renderizado.
 */
const subscribeNever = () => () => {};

export function ProjectCarousel({ titles, children }: { titles: readonly string[]; children: ReactNode }) {
  const slides = Children.toArray(children);
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  // Falso no servidor e na primeira pintura; verdadeiro depois da hidratação.
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const last = slides.length - 1;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const goTo = useCallback((index: number) => {
    const el = scroller.current;
    const slide = el?.children[Math.max(0, Math.min(last, index))] as HTMLElement | undefined;
    if (!el || !slide) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }, [last]);

  // A posição é lida da rolagem real, então vale para seta, ponto, teclado e gesto.
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = scroller.current;
      if (!el) return;
      const nearest = Array.from(el.children).reduce(
        (best, child, index) => {
          const distance = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: 0, distance: Infinity },
      );
      setActive(nearest.index);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    // Atalhos do navegador (Alt+Seta para voltar, Ctrl+Home...) não são nossos.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goTo(next);
  };

  const arrow =
    "grid size-12 place-items-center rounded-full border border-control bg-surface-2 text-fg transition-[background-color,border-color,opacity] duration-(--duration-base) hover:border-fg/70 hover:bg-surface-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:border-control aria-disabled:hover:bg-surface-2";

  return (
    <div role="region" aria-roledescription="carrossel" aria-label="Projetos" className="mt-10">
      <div
        ref={scroller}
        role="group"
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        aria-label="Projetos. Use as setas do teclado para trocar de projeto."
        data-ready={ready || undefined}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 data-ready:[scrollbar-width:none] data-ready:pb-0 data-ready:[&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="projeto"
            aria-label={`${index + 1} de ${slides.length}: ${titles[index]}`}
            data-active={ready ? index === active : undefined}
            className="w-full shrink-0 snap-center transition-[opacity,translate,scale] duration-(--duration-slow) ease-out-soft data-[active=false]:translate-y-2 data-[active=false]:scale-[0.98] data-[active=false]:opacity-30"
          >
            {slide}
          </div>
        ))}
      </div>

      {ready ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <p aria-live="polite" className="min-w-16 text-sm font-medium text-muted tabular-nums">
            Projeto {active + 1} de {slides.length}
          </p>

          <ul className="flex items-center" aria-label="Escolher projeto">
            {slides.map((_, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir para o projeto ${index + 1}: ${titles[index]}`}
                  aria-current={index === active ? "true" : undefined}
                  className="group grid size-8 place-items-center rounded-full"
                >
                  <span
                    className={`block h-2 rounded-full transition-[width,background-color] duration-(--duration-base) ${
                      index === active ? "w-6 bg-fg" : "w-2 bg-control group-hover:bg-fg/70"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Projeto anterior"
              aria-disabled={active === 0}
              onClick={() => active > 0 && goTo(active - 1)}
              className={arrow}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Próximo projeto"
              aria-disabled={active === last}
              onClick={() => active < last && goTo(active + 1)}
              className={arrow}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
