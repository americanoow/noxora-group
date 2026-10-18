import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
  /** Degrau de superfície: `base` (#111) ou `raised` (#171717). */
  tone?: "base" | "raised";
  /** Hover sobe um degrau de superfície e acende o filete metálico. */
  interactive?: boolean;
  /** Filete metálico no topo, sempre presente. Use em poucos cards. */
  highlight?: boolean;
};

/** Superfície com borda sutil. Não define padding: o conteúdo decide. */
export function Card({
  as: Tag = "div",
  tone = "base",
  interactive = false,
  highlight = false,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    "relative overflow-hidden rounded-xl border border-line shadow-ring",
    tone === "raised" ? "bg-surface-3" : "bg-surface-2",
    interactive
      ? "transition-[background-color,border-color] duration-(--duration-base) ease-out-soft hover:bg-surface-3 hover:border-control/50"
      : "",
    interactive || highlight ? "chrome-line" : "",
    highlight ? "[--chrome-line-opacity:0.6]" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes} {...props} />;
}
