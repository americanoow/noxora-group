"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Menu mobile no padrão "disclosure": um botão com aria-expanded controla a
 * lista de links. Fecha com Esc (devolvendo o foco ao botão), ao clicar fora
 * e ao escolher um link.
 */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="motion-button inline-flex size-11 items-center justify-center rounded-full border border-control text-fg"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>

      <nav
        id={panelId}
        aria-label="Principal"
        hidden={!open}
        className="motion-menu absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain border-b border-line bg-ink px-5 pt-2 pb-6"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-lg text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contato"
          onClick={() => setOpen(false)}
          className={buttonClasses("primary", "lg", "mt-6 w-full")}
        >
          Conversar sobre um projeto
        </a>
      </nav>
    </div>
  );
}
