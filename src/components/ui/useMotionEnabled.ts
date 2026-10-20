"use client";

import { useSyncExternalStore } from "react";

const read = () =>
  document.documentElement.dataset.motion === "on" &&
  !document.hidden &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function subscribe(callback: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  preference.addEventListener("change", callback);
  document.addEventListener("visibilitychange", callback);
  return () => {
    observer.disconnect();
    preference.removeEventListener("change", callback);
    document.removeEventListener("visibilitychange", callback);
  };
}

/** Uma única regra para pausa, preferência do sistema e aba em segundo plano. */
export function useMotionEnabled() {
  return useSyncExternalStore(subscribe, read, () => false);
}
