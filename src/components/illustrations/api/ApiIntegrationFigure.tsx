import type { CSSProperties } from "react";
import {
  CreditCard,
  Database,
  Globe,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { apiDemo } from "@/content/api-demo";

// Espaço lógico 640 x 480 (4:3). Os nós são HTML (texto sempre >= 14 px) e os
// conectores são SVG; ambos usam as mesmas coordenadas, em porcentagem.
const W = 640;
const H = 480;

type NodeId = (typeof apiDemo.nodes)[number]["id"];

const nodes: Record<NodeId, { x: number; y: number; icon: LucideIcon; link: string }> = {
  site: { x: 110, y: 90, icon: Globe, link: "M138 90 H280 Q296 90 296 106 V184" },
  loja: { x: 530, y: 90, icon: ShoppingCart, link: "M502 90 H360 Q344 90 344 106 V184" },
  erp: { x: 70, y: 224, icon: Database, link: "M98 224 H264" },
  crm: { x: 570, y: 224, icon: Users, link: "M542 224 H376" },
  pagamentos: { x: 150, y: 400, icon: CreditCard, link: "M178 400 H280 Q296 400 296 384 V296" },
  estoque: { x: 490, y: 400, icon: Package, link: "M462 400 H360 Q344 400 344 384 V296" },
};

const pos = (x: number, y: number) => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
});

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * APIs e integrações: sistemas trocando informações por uma API central.
 * Decorativa (aria-hidden); o significado está no texto ao lado e no rótulo
 * "Demonstração conceitual". O estado padrão é o final; a animação de uma
 * passada é controlada por `PlayFigure` (data-play).
 */
export function ApiIntegrationFigure() {
  return (
    <div
      aria-hidden="true"
      className="@container relative aspect-[4/3] w-full select-none"
    >
      {/* Grade técnica discreta */}
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:12.5%_16.66%] [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        focusable="false"
      >
        {apiDemo.nodes.map((node, index) => (
          <g key={node.id}>
            <path
              d={nodes[node.id].link}
              pathLength="1"
              fill="none"
              stroke="rgb(212 216 222 / 0.42)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="nx-link"
              style={delay(index * 90)}
            />
            <path
              d={nodes[node.id].link}
              pathLength="1"
              fill="none"
              stroke="#e8f0ff"
              strokeWidth="5"
              strokeLinecap="round"
              className="nx-pulse"
              style={delay(index * 140)}
            />
          </g>
        ))}
      </svg>

      {/* Sistemas de exemplo */}
      {apiDemo.nodes.map((node, index) => {
        const { x, y, icon: Icon } = nodes[node.id];
        return (
          <div
            key={node.id}
            className="nx-node absolute -translate-x-1/2 -translate-y-1/2"
            style={{ ...pos(x, y), ...delay(index * 90) }}
          >
            <div className="facet [--f:12px]">
              <div className="facet-inner grid size-12 place-items-center bg-graphite-2 text-chrome @sm:size-14">
                <Icon className="size-5 @sm:size-6" strokeWidth={1.5} />
              </div>
            </div>
            <span className="absolute top-full left-1/2 mt-1.5 hidden -translate-x-1/2 text-sm whitespace-nowrap text-muted @sm:block">
              {node.label}
            </span>
          </div>
        );
      })}

      {/* API central */}
      <div
        className="nx-node absolute -translate-x-1/2 -translate-y-1/2"
        style={{ ...pos(320, 240), ...delay(320) }}
      >
        <div className="nx-ring absolute -inset-3 rounded-2xl border border-light-ice/50" />
        <div className="facet [--f:24px]">
          <div className="facet-inner grid size-[5.5rem] place-items-center bg-graphite-3 @sm:size-28">
            <span className="chrome-text font-display text-xl font-semibold tracking-tight @sm:text-2xl">
              {apiDemo.core}
            </span>
          </div>
        </div>
      </div>

      {/* Resposta da API */}
      <div
        className="nx-node absolute z-10 hidden items-center gap-2 rounded-md @sm:flex border border-white/15 bg-surface px-2.5 py-1 text-sm font-medium whitespace-nowrap text-fg shadow-float"
        style={{ ...pos(404, 170), ...delay(700) }}
      >
        <span className="size-1.5 rounded-full bg-light-ice shadow-[0_0_8px_2px_rgb(143_180_255/0.5)]" />
        {apiDemo.status}
      </div>
    </div>
  );
}
