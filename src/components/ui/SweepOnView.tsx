"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { useMotionEnabled } from "./useMotionEnabled";

/**
 * Ativa o movimento só enquanto o bloco está visível e o movimento permitido.
 * Ao sair da tela, pausar ou reduzir movimento, restaura o estado estático.
 */
export function SweepOnView({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.sweep = "play";
        } else delete element.dataset.sweep;
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.sweep;
    };
  }, [enabled]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}
