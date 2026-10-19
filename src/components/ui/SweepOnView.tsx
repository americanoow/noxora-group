"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marca o bloco com `data-sweep="play"` quando ele entra na tela, uma vez. O
 * CSS (globals.css) usa o atributo para tocar um reflexo de uma passada.
 * Com movimento reduzido ou sem JavaScript o atributo nunca aparece.
 */
export function SweepOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.sweep = "play";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
