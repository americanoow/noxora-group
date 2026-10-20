"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useMotionEnabled } from "./useMotionEnabled";

/**
 * Liga e pausa as animações em loop do site (WCAG 2.2.2). O estado vive em
 * `<html data-motion>`: "on" com os loops ativos, "paused" quando a pessoa
 * pausa. Sem JavaScript, ou com movimento reduzido, o atributo nunca vira
 * "on" e nenhum loop roda (os estilos em globals.css dependem dele).
 */
const read = () => document.documentElement.dataset.motion ?? "off";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => observer.disconnect();
}

export function MotionToggle() {
  const motion = useSyncExternalStore(subscribe, read, () => "off");
  const enabled = useMotionEnabled();

  useEffect(() => {
    document.documentElement.dataset.motionActive = String(enabled);
  }, [enabled]);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.motion = "on";
  }, []);

  if (motion === "off") return null;
  const paused = motion === "paused";
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => {
        document.documentElement.dataset.motion = paused ? "on" : "paused";
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted transition-colors hover:text-fg"
    >
      {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      {paused ? "Retomar animações" : "Pausar animações"}
    </button>
  );
}
