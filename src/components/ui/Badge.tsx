import type { ComponentPropsWithoutRef } from "react";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: "outline" | "solid";
};

const variants = {
  outline: "border-line text-muted",
  solid: "border-line bg-surface-3 text-fg",
} as const;

/** Rótulo curto e não interativo (categoria, tecnologia, aviso). Mínimo de 14 px. */
export function Badge({
  variant = "outline",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
