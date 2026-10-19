import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  FileSpreadsheet,
  FileText,
  Layers,
  Mail,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { beforeAfter } from "@/content/benefits";
import { Facet } from "@/components/ui/Facet";

/**
 * "Antes e depois": as mesmas quatro ferramentas, soltas à esquerda e ligadas
 * por um núcleo à direita. Uma única imagem explica o que a Noxora faz. O
 * bloco inteiro é uma imagem para leitores de tela (role="img" com descrição);
 * os rótulos "Hoje" e "Com a Noxora" fazem parte dessa descrição.
 */
const tools: { icon: LucideIcon }[] = [
  { icon: FileSpreadsheet },
  { icon: Mail },
  { icon: MessageCircle },
  { icon: FileText },
];

const at = (x: number, y: number, w = 400, h = 300): CSSProperties => ({
  left: `${(x / w) * 100}%`,
  top: `${(y / h) * 100}%`,
});

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-4 left-4 z-10 rounded-full border border-line bg-black/80 px-3 py-1 text-sm font-medium text-fg">
      {children}
    </span>
  );
}

/** Soltas: inclinadas, espalhadas e com ligações quebradas. */
function Chaos() {
  const spots = [
    { x: 84, y: 108, rotate: -9 },
    { x: 306, y: 104, rotate: 11 },
    { x: 138, y: 214, rotate: 6 },
    { x: 290, y: 226, rotate: -7 },
  ];
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-dashed border-line bg-surface/70">
      <Label>{beforeAfter.before}</Label>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" focusable="false">
        {["M110 114 L168 168", "M284 110 L 244 130", "M170 214 L 236 224", "M300 130 L 296 196"].map((d) => (
          <path key={d} d={d} fill="none" stroke="rgb(161 161 170 / 0.45)" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" />
        ))}
      </svg>
      {tools.map(({ icon: Icon }, index) => (
        <div
          key={index}
          className="absolute grid size-12 place-items-center rounded-lg border border-white/15 bg-graphite-2 text-muted sm:size-14"
          style={{ ...at(spots[index].x, spots[index].y), transform: `translate(-50%, -50%) rotate(${spots[index].rotate}deg)` }}
        >
          <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

/** Conectadas: alinhadas, com um núcleo e ligações firmes. */
function Order() {
  const spots = [
    { x: 80, y: 90 },
    { x: 320, y: 90 },
    { x: 80, y: 210 },
    { x: 320, y: 210 },
  ];
  const links = ["M106 90 Q200 90 200 122", "M294 90 Q200 90 200 122", "M106 210 Q200 210 200 178", "M294 210 Q200 210 200 178"];
  return (
    <Facet size="lg" innerClassName="bg-graphite-2" className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(60%_60%_at_50%_50%,rgb(143_180_255/0.14),transparent_72%)]">
        <Label>{beforeAfter.after}</Label>
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" focusable="false">
          {links.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgb(212 216 222 / 0.55)" strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </svg>
        {tools.map(({ icon: Icon }, index) => (
          <div key={index} className="absolute -translate-x-1/2 -translate-y-1/2" style={at(spots[index].x, spots[index].y)}>
            <div className="facet [--f:12px]">
              <div className="facet-inner grid size-12 place-items-center bg-graphite-3 text-chrome sm:size-14">
                <Icon className="size-5 sm:size-6" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={at(200, 150)}>
          <div className="facet [--f:16px]">
            <div className="facet-inner grid size-16 place-items-center bg-ink text-light-ice shadow-[0_0_30px_4px_rgb(143_180_255/0.3)] sm:size-[4.5rem]">
              <Layers className="size-7 sm:size-8" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Facet>
  );
}

export function BeforeAfter() {
  return (
    <div
      role="img"
      aria-label={`${beforeAfter.label}. ${beforeAfter.description}`}
      className="grid items-center gap-4 select-none lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
    >
      <Chaos />
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-light-ice/40 bg-ink text-light-ice shadow-[0_0_24px_2px_rgb(143_180_255/0.25)]">
        <ArrowRight className="size-5 rotate-90 lg:rotate-0" strokeWidth={1.75} />
      </span>
      <Order />
    </div>
  );
}
