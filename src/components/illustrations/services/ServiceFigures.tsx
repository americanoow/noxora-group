import type { CSSProperties, ReactNode } from "react";
import { Check, FileText, FolderCheck, Inbox, ListFilter } from "lucide-react";

/**
 * Miniaturas das soluções. Decorativas (aria-hidden): o significado está no
 * título e na frase ao lado. O estado padrão é o final; a animação de uma
 * passada é ligada por `PlayFigure` (data-play, ver globals.css).
 * Sem texto, nomes ou números.
 */
const stage = "@container relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-ink select-none";

const step = (ms: number, x = "0px", y = "10px") =>
  ({ "--d": `${ms}ms`, "--lx": x, "--ly": y }) as CSSProperties;

function Layer({
  className,
  delay,
  x,
  y,
  children,
}: {
  className: string;
  delay: number;
  x?: string;
  y?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`nx-layer absolute ${className}`} style={step(delay, x, y)}>
      {children}
    </div>
  );
}

/** Website: a moldura, o painel e os controles se encaixam em camadas. */
export function WebFigure() {
  return (
    <div aria-hidden="true" className={stage}>
      <Layer delay={0} className="inset-[9%] rounded-md border border-white/20 bg-graphite-2" />
      <Layer delay={150} y="-8px" className="top-[15%] left-[14%] flex gap-1">
        <span className="size-1.5 rounded-full bg-white/30" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/15" />
      </Layer>
      <Layer delay={300} x="-12px" y="0px" className="top-[30%] left-[14%] flex h-[34%] w-[44%] flex-col justify-center gap-[10%] rounded bg-white/[0.08] px-[5%]">
        <span className="h-[12%] w-10/12 rounded-full bg-white/60" />
        <span className="h-[12%] w-7/12 rounded-full bg-white/30" />
      </Layer>
      <Layer delay={450} x="12px" y="0px" className="top-[30%] right-[14%] h-[34%] w-[26%] rounded bg-light-ice/30" />
      <Layer delay={620} y="12px" className="bottom-[17%] left-[14%] h-[10%] w-[24%] rounded-full bg-fg" />
      <Layer delay={720} y="12px" className="bottom-[17%] left-[41%] h-[10%] w-[18%] rounded-full border border-control" />
    </div>
  );
}

/** Sistema: moldura, menu lateral, indicadores, gráfico e controles. */
export function SystemFigure() {
  return (
    <div aria-hidden="true" className={stage}>
      <Layer delay={0} className="inset-[9%] rounded-md border border-white/20 bg-graphite-2" />
      <Layer delay={150} x="-12px" y="0px" className="top-[9%] bottom-[9%] left-[9%] w-[14%] rounded-l-md border-r border-white/15 bg-white/[0.05]" />
      <Layer delay={300} y="-8px" className="top-[16%] left-[27%] flex w-[60%] gap-[4%]">
        <span className="h-4 flex-1 rounded bg-white/[0.12]" />
        <span className="h-4 flex-1 rounded bg-white/[0.12]" />
        <span className="h-4 flex-1 rounded bg-white/[0.12]" />
      </Layer>
      <Layer delay={450} y="12px" className="top-[40%] left-[27%] flex h-[30%] w-[60%] items-end gap-[4%] rounded bg-white/[0.06] p-[3%]">
        {[40, 70, 52, 88, 62].map((h, i) => (
          <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-light-ice/20 to-light-ice/70" style={{ height: `${h}%` }} />
        ))}
      </Layer>
      <Layer delay={620} y="10px" className="bottom-[14%] left-[27%] h-[7%] w-[40%] rounded-full bg-white/[0.18]" />
      <Layer delay={720} y="10px" className="right-[13%] bottom-[13%] h-[9%] w-[16%] rounded-full bg-fg" />
    </div>
  );
}

function FlowNode({ children }: { children: ReactNode }) {
  return (
    <div className="facet [--f:10px]">
      <div className="facet-inner grid size-7 place-items-center bg-graphite-3 text-chrome sm:size-11">{children}</div>
    </div>
  );
}

/** Automação: um documento chega, passa por uma regra e termina organizado no destino. */
export function AutomationFigure() {
  return (
    <div aria-hidden="true" className={stage}>
      {/* Ligações entre as três etapas */}
      <span className="absolute top-1/2 left-[16%] h-px w-[34%] bg-white/25" />
      <span className="absolute top-1/2 left-1/2 h-px w-[34%] bg-white/25" />

      {/* Origem */}
      <div className="absolute top-1/2 left-[16%] -translate-x-1/2 -translate-y-1/2">
        <FlowNode>
          <Inbox className="size-3.5 sm:size-5" strokeWidth={1.5} />
        </FlowNode>
      </div>

      {/* Regra */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="nx-respond absolute -inset-1.5 rounded-lg border border-light-ice/60" style={{ "--d": "1700ms" } as CSSProperties} />
        <FlowNode>
          <ListFilter className="size-3.5 text-light-ice sm:size-5" strokeWidth={1.5} />
        </FlowNode>
      </div>

      {/* Destino organizado */}
      <div className="absolute top-1/2 left-[84%] -translate-x-1/2 -translate-y-1/2">
        <FlowNode>
          <FolderCheck className="size-3.5 sm:size-5" strokeWidth={1.5} />
        </FlowNode>
        <span className="nx-done absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-light-ice text-ink">
          <Check className="size-3" strokeWidth={3} />
        </span>
      </div>

      {/* O documento que percorre o caminho */}
      <div className="absolute top-1/2 left-[16%] -translate-x-1/2 -translate-y-1/2">
        <span className="nx-doc grid size-5 place-items-center sm:size-6 rounded bg-paper text-paper-ink shadow-float">
          <FileText className="size-3.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
