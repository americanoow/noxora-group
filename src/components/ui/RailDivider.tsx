/**
 * Divisor entre composições: um fio de metal líquido com um ponto de luz no
 * centro. Decorativo; é a "costura" que liga as seções (trilho cromado).
 */
export function RailDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full bg-[linear-gradient(90deg,transparent,rgb(212_216_222/0.5)_30%,rgb(255_255_255/0.85)_50%,rgb(212_216_222/0.5)_70%,transparent)] ${className}`}
    >
      <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg shadow-[0_0_0_4px_rgb(143_180_255/0.14),0_0_18px_2px_rgb(143_180_255/0.35)]" />
    </div>
  );
}
