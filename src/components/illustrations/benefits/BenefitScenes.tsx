import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Headphones,
  Layers,
  Smile,
  Store,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * Cinco cenas decorativas (aria-hidden) para "Como ajudamos". Todas usam o
 * mesmo vocabulário do sistema de ilustração: facetas, barras de esqueleto no
 * lugar de texto ilegível, cromo e luz gelo. O significado vai no texto do
 * cartão, nunca na cena.
 */
function Scene({
  children,
  ratio = "aspect-[4/3]",
}: {
  children: ReactNode;
  ratio?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`@container relative ${ratio} w-full overflow-hidden select-none`}
    >
      {children}
    </div>
  );
}

const pct = (x: number, y: number, w = 400, h = 300): CSSProperties => ({
  left: `${(x / w) * 100}%`,
  top: `${(y / h) * 100}%`,
});

const bar = "h-2.5 rounded-full bg-white/[0.12]";

/** Reduzir trabalhos manuais: tarefas que se resolvem, uma a uma, sozinhas. */
export function ManualScene() {
  const rows = ["done", "done", "doing"] as const;
  return (
    <Scene>
      <div className="facet absolute inset-x-[9%] top-[12%] [--f:18px]">
        <div className="facet-inner grid gap-4 bg-surface p-5">
          {rows.map((state, index) => (
            <div key={index} className="flex items-center gap-3">
              {state === "done" ? (
                <span className="grid size-7 shrink-0 place-items-center rounded-md border border-chrome/60 text-chrome">
                  <Check className="size-4" strokeWidth={2} />
                </span>
              ) : (
                <span className="size-7 shrink-0 rounded-full border-2 border-light-ice/70 border-t-transparent" />
              )}
              <span className={`${bar} flex-1`} />
              <span className={`${bar} w-10 ${state === "done" ? "bg-chrome/40" : ""}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[9%] bottom-[10%] flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-sm font-medium text-fg shadow-float">
        <Zap className="size-4 text-light-ice" strokeWidth={1.75} />
        Automático
      </div>
    </Scene>
  );
}

/** Integrar operações: três áreas ligadas por um mesmo núcleo. */
export function IntegrateScene() {
  const nodes = [
    { x: 90, y: 66, label: "Vendas", icon: Store },
    { x: 390, y: 66, label: "Financeiro", icon: Wallet },
    { x: 240, y: 214, label: "Atendimento", icon: Headphones },
  ];
  return (
    <Scene ratio="aspect-[16/9]">
      <svg viewBox="0 0 480 270" className="absolute inset-0 h-full w-full" focusable="false">
        {["M114 66 Q240 66 240 102", "M366 66 Q240 66 240 102", "M240 190 V166"].map((d) => (
          <path key={d} d={d} fill="none" stroke="rgb(212 216 222 / 0.45)" strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx="240" cy="134" r="56" fill="none" stroke="rgb(143 180 255 / 0.25)" strokeDasharray="3 7" />
      </svg>
      {nodes.map(({ x, y, label, icon: Icon }) => (
        <div key={label} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5" style={pct(x, y, 480, 270)}>
          <div className="facet [--f:12px]">
            <div className="facet-inner grid size-12 place-items-center bg-graphite-2 text-chrome @max-sm:size-10">
              <Icon className="size-5" strokeWidth={1.5} />
            </div>
          </div>
          <span className="hidden text-sm whitespace-nowrap text-muted @sm:block">{label}</span>
        </div>
      ))}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(240, 134, 480, 270)}>
        <div className="facet [--f:16px]">
          <div className="facet-inner grid size-16 place-items-center bg-graphite-3 text-light-ice @max-sm:size-12">
            <Layers className="size-7" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </Scene>
  );
}

/** Digitalizar processos: o papel vira um registro estruturado. */
export function DigitalizeScene() {
  return (
    <Scene>
      <div className="absolute top-[18%] left-[6%] w-[36%] -rotate-[5deg] rounded-md bg-paper p-3 shadow-float">
        <div className="grid gap-2">
          <span className="h-2 w-2/3 rounded-full bg-paper-ink/60" />
          <span className="h-2 rounded-full bg-paper-ink/25" />
          <span className="h-2 rounded-full bg-paper-ink/25" />
          <span className="h-2 w-4/5 rounded-full bg-paper-ink/25" />
          <span className="mt-1 size-6 rounded-full border-2 border-paper-ink/40" />
        </div>
      </div>
      <ArrowRight className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-chrome" strokeWidth={1.5} />
      <div className="facet absolute top-[18%] right-[6%] w-[38%] [--f:14px]">
        <div className="facet-inner grid gap-2.5 bg-surface p-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="h-2 w-1/4 rounded-full bg-chrome/40" />
              <span className={`${bar} flex-1`} />
              <Check className="size-3.5 shrink-0 text-light-ice" strokeWidth={2.5} />
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/** Criar produtos digitais: um app pronto sobre uma camada de dados. */
export function ProductScene() {
  return (
    <Scene>
      <div className="facet absolute top-[20%] right-[8%] w-[34%] rotate-[5deg] [--f:14px]">
        <div className="facet-inner flex h-24 items-end gap-1.5 bg-graphite-2 p-3">
          {[40, 65, 50, 85].map((h) => (
            <span key={h} className="flex-1 rounded-sm bg-chrome/40" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute top-[6%] left-[36%] aspect-[9/16] h-[88%] -translate-x-1/2 rounded-[1.5rem] border border-chrome/40 bg-ink p-2.5 shadow-float">
        <div className="grid h-full grid-rows-[auto_1fr_auto] gap-2.5 rounded-[1.05rem] bg-surface p-2.5">
          <span className="h-2.5 w-1/3 rounded-full bg-chrome/50" />
          <div className="grid content-start gap-2.5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="size-6 shrink-0 rounded-full bg-white/[0.1]" />
                <span className="grid flex-1 gap-1.5">
                  <span className="h-2 rounded-full bg-white/[0.14]" />
                  <span className="h-1.5 w-2/3 rounded-full bg-white/[0.08]" />
                </span>
              </div>
            ))}
          </div>
          <span className="h-7 rounded-full bg-fg" />
        </div>
      </div>
    </Scene>
  );
}

/** Melhorar a experiência: uma jornada clara que termina bem. */
export function ExperienceScene() {
  const stops = [30, 112, 194, 276];
  return (
    <Scene>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" focusable="false">
        <path d="M30 170 H340" stroke="rgb(212 216 222 / 0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M30 170 H276" stroke="rgb(143 180 255 / 0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      {stops.map((x) => (
        <span key={x} className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-chrome bg-ink" style={pct(x, 170)} />
      ))}
      {[112, 276].map((x) => (
        <span key={x} className="absolute grid w-[26%] -translate-x-1/2 -translate-y-full gap-1.5 rounded-md border border-white/15 bg-surface p-2.5" style={pct(x, 138)}>
          <span className="h-2 rounded-full bg-white/[0.16]" />
          <span className="h-2 w-2/3 rounded-full bg-white/[0.1]" />
        </span>
      ))}
      <span className="absolute grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-light-ice/60 bg-graphite-2 text-light-ice shadow-[0_0_28px_4px_rgb(143_180_255/0.25)]" style={pct(340, 170)}>
        <Smile className="size-7" strokeWidth={1.5} />
      </span>
    </Scene>
  );
}
