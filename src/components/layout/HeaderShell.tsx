"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Casca do header fixo: transparente sobre o hero e, ao rolar, ganha
 * superfície e o filete cromado. O conteúdo (links, CTA) é renderizado no
 * servidor e passado como filho; aqui só vive o estado de rolagem.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header fixed inset-x-0 top-0 z-40 border-b border-transparent [--header-h:4rem] transition-[background-color,border-color,backdrop-filter] duration-(--duration-base) ease-out-soft sm:[--header-h:4.5rem] data-[scrolled=true]:border-line data-[scrolled=true]:bg-ink/80 data-[scrolled=true]:backdrop-blur-md"
    >
      {children}
    </header>
  );
}
