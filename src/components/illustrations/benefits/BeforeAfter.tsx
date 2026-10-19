import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  FileSpreadsheet,
  Layers,
  Mail,
  MessageCircle,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { beforeAfter } from "@/content/benefits";
import { Facet } from "@/components/ui/Facet";

/**
 * "Hoje" e "Com a Noxora": os mesmos quatro pontos do dia a dia, soltos à
 * esquerda e ligados a uma solução à direita. Os nomes fazem parte do
 * desenho e são texto real (lido por leitores de tela); só ícones e traços
 * são decorativos. A "Solução Noxora" é sob medida, não um produto único.
 */
const icons: LucideIcon[] = [FileSpreadsheet, Mail, MessageCircle, ShoppingCart];

const W = 400;
const H = 260;
const at = (x: number, y: number): CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
});

/** Ícone centrado no ponto, com o nome logo abaixo (o texto nunca gira). */
function Node({
  x,
  y,
  name,
  labelDelay,
  children,
}: {
  x: number;
  y: number;
  name: string;
  /** Só no painel animado: o nome aparece quando o bloco já se alinhou (ms). */
  labelDelay?: number;
  children: ReactNode;
}) {
  return (
    <div className="absolute size-12 -translate-x-1/2 -translate-y-1/2 sm:size-14" style={at(x, y)}>
      {children}
      <span
        className={`absolute top-full left-1/2 mt-1.5 -translate-x-1/2 text-sm font-medium whitespace-nowrap text-fg ${labelDelay === undefined ? "" : "nx-label"}`}
        style={labelDelay === undefined ? undefined : ({ "--d": `${labelDelay}ms` } as CSSProperties)}
      >
        {name}
      </span>
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <h3 className="px-4 pt-4 font-display text-base font-semibold text-fg sm:px-5 sm:text-lg">
        {title}
      </h3>
      <div className="@container relative aspect-[400/260] w-full">{children}</div>
      <div className="px-4 pb-4 text-center text-sm text-muted sm:px-5 sm:text-base">{note}</div>
    </div>
  );
}

/** Soltas: inclinadas, espalhadas e com ligações quebradas. */
function Chaos() {
  const spots = [
    { x: 74, y: 56, rotate: -9 },
    { x: 322, y: 46, rotate: 11 },
    { x: 128, y: 168, rotate: 6 },
    { x: 306, y: 172, rotate: -7 },
  ];
  const stubs = ["M100 62 L150 98", "M296 52 L244 84", "M156 172 L214 188", "M280 182 L246 194"];
  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-dashed border-line bg-surface/70 lg:max-w-none">
      <Panel title={beforeAfter.before.title} note={beforeAfter.before.note}>
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" focusable="false">
          {stubs.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgb(161 161 170 / 0.5)" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" />
          ))}
        </svg>
        {beforeAfter.tools.map((name, index) => {
          const Icon = icons[index];
          return (
            <Node key={name} x={spots[index].x} y={spots[index].y} name={name}>
              <div
                aria-hidden="true"
                className="grid size-full place-items-center rounded-lg border border-white/15 bg-graphite-2 text-muted"
                style={{ transform: `rotate(${spots[index].rotate}deg)` }}
              >
                <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
              </div>
            </Node>
          );
        })}
      </Panel>
    </div>
  );
}

/** Conectadas: alinhadas e ligadas à solução central. */
function Order() {
  const spots = [
    { x: 64, y: 56 },
    { x: 336, y: 56 },
    { x: 64, y: 176 },
    { x: 336, y: 176 },
  ];
  const links = ["M90 56 Q200 56 200 116", "M310 56 Q200 56 200 116", "M90 176 Q200 176 200 116", "M310 176 Q200 176 200 116"];
  // Onde cada bloco começa (em unidades do desenho) antes de se alinhar: dispersos e girados.
  const scattered = [
    { dx: 52, dy: 46, r: "-12deg" },
    { dx: -72, dy: 54, r: "14deg" },
    { dx: 84, dy: -42, r: "8deg" },
    { dx: -62, dy: -48, r: "-10deg" },
  ];
  return (
    <Facet size="lg" innerClassName="bg-graphite-2" className="mx-auto w-full max-w-lg lg:max-w-none">
      <div className="bg-[radial-gradient(60%_50%_at_50%_50%,rgb(143_180_255/0.14),transparent_72%)]">
        <Panel title={beforeAfter.after.title} note={beforeAfter.after.note}>
          <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" focusable="false">
            {links.map((d, index) => (
              <path
                key={d}
                d={d}
                pathLength="1"
                fill="none"
                stroke="rgb(212 216 222 / 0.6)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="nx-link"
                style={{ "--d": `${850 + index * 90}ms` } as CSSProperties}
              />
            ))}
          </svg>
          {beforeAfter.tools.map((name, index) => {
            const Icon = icons[index];
            return (
              <Node key={name} x={spots[index].x} y={spots[index].y} name={name} labelDelay={900}>
                <div
                  aria-hidden="true"
                  className="nx-align facet size-full [--f:12px]"
                  style={
                    {
                      "--dx": scattered[index].dx,
                      "--dy": scattered[index].dy,
                      "--r": scattered[index].r,
                    } as CSSProperties
                  }
                >
                  <div className="facet-inner grid size-full place-items-center bg-graphite-3 text-chrome">
                    <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
                  </div>
                </div>
              </Node>
            );
          })}
          <div
            className="nx-node absolute -translate-x-1/2 -translate-y-1/2"
            style={{ ...at(200, 116), "--d": "1100ms" } as CSSProperties}
          >
            <div className="facet [--f:16px]">
              <div className="facet-inner flex w-24 flex-col items-center gap-1.5 bg-ink px-2 py-3 text-center text-light-ice shadow-[0_0_30px_4px_rgb(143_180_255/0.3)] sm:w-36 sm:px-3">
                <Layers aria-hidden="true" className="size-6 sm:size-7" strokeWidth={1.5} />
                <span className="font-display text-sm leading-tight font-semibold text-fg sm:text-base">
                  {beforeAfter.after.core}
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Facet>
  );
}

export function BeforeAfter() {
  return (
    <div
      role="group"
      aria-label={beforeAfter.label}
      className="grid items-center gap-4 select-none lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
    >
      <Chaos />
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-full border border-light-ice/40 bg-ink text-light-ice shadow-[0_0_24px_2px_rgb(143_180_255/0.25)]"
      >
        <ArrowRight className="size-5 rotate-90 lg:rotate-0" strokeWidth={1.75} />
      </span>
      <Order />
    </div>
  );
}
