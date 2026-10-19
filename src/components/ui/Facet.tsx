import type { HTMLAttributes } from "react";

type FacetProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li" | "figure";
  /** Tamanho do corte do canto: sm 16 px, md 28 px, lg 44 px. */
  size?: "sm" | "md" | "lg";
  /** Cor de fundo do miolo (classe de cor do Tailwind, ex.: "bg-graphite-2"). */
  innerClassName?: string;
};

const sizes = { sm: "[--f:16px]", md: "[--f:28px]", lg: "[--f:44px]" } as const;

/**
 * Moldura de faceta: borda cromada em degradê e o canto superior direito
 * chanfrado, como a tecla de vidro do cubo. Substitui o retângulo arredondado
 * nas ilustrações e demonstrações. O estilo vive em `.facet` (globals.css).
 */
export function Facet({
  as: Tag = "div",
  size = "md",
  innerClassName = "bg-surface",
  className = "",
  children,
  ...props
}: FacetProps) {
  return (
    <Tag className={`facet ${sizes[size]} ${className}`} {...props}>
      <div className={`facet-inner ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
