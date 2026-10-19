import Image from "next/image";

const CUBE = { src: "/images/noxora-icon.png", width: 1283, height: 1226 } as const;

// Espaço lógico do palco: largura do PNG do cubo, com folga embaixo para o reflexo.
const W = 1283;
const H = 1330;

/**
 * Palco do hero, em camadas (ver docs/ILLUSTRATION-SYSTEM.md):
 *   L1 trilhos atrás do cubo, L2 o cubo, L3 trilhos à frente.
 * Tudo é decorativo (aria-hidden).
 * O cubo é a imagem da marca, sem modelo 3D: a profundidade vem da oclusão,
 * da luz e do reflexo no piso (o mesmo arquivo, espelhado e esmaecido).
 */
export function HeroStage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="hero-stage relative"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        {/* Piso: brilho elíptico sob o cubo */}
        <div className="absolute top-[80%] left-[6%] h-[12%] w-[88%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(212_216_222/0.2),rgb(143_180_255/0.06)_60%,transparent)]" />

        {/* L1: trilhos atrás do cubo */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 z-10 h-full w-full overflow-visible"
          focusable="false"
        >
          <defs>
            <linearGradient id="hero-rail-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#d4d8de" stopOpacity="0" />
              <stop offset="0.35" stopColor="#d4d8de" stopOpacity="0.6" />
              <stop offset="0.65" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#d4d8de" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -80 1010 C 170 1010 330 800 650 690 S 1090 420 1380 330"
            pathLength="1"
            fill="none"
            stroke="url(#hero-rail-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="hero-rail"
          />
          <path
            d="M -80 1010 C 170 1010 330 800 650 690 S 1090 420 1380 330"
            pathLength="1"
            fill="none"
            stroke="#e8f0ff"
            strokeWidth="6"
            strokeLinecap="round"
            className="hero-bead"
            style={{ "--d": "1500ms" } as React.CSSProperties}
          />
          <path
            d="M -80 1230 C 260 1230 430 1090 720 1010 S 1110 830 1380 770"
            pathLength="1"
            fill="none"
            stroke="url(#hero-rail-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="hero-rail"
            style={{ "--d": "500ms" } as React.CSSProperties}
          />
        </svg>

        {/* L2: o cubo (elemento de LCP no celular: carga imediata e prioridade alta) */}
        <Image
          src={CUBE.src}
          alt=""
          width={CUBE.width}
          height={CUBE.height}
          preload
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 620px, 78vw"
          className="absolute top-0 left-0 z-20 h-auto w-full"
        />

        {/* Reflexo no piso: o mesmo arquivo, espelhado e esmaecido. A caixa corta o
            reflexo no fim do palco para que ele nunca fique sob o texto. */}
        <div className="absolute inset-x-0 top-[88%] bottom-0 z-[15] overflow-hidden">
          <Image
            src={CUBE.src}
            alt=""
            width={CUBE.width}
            height={CUBE.height}
            fetchPriority="low"
            sizes="(min-width: 1024px) 620px, 78vw"
            className="absolute top-0 left-0 h-auto w-full -scale-y-100 opacity-[0.4] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
          />
        </div>

        {/* L3: trilho à frente do cubo */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 z-30 h-full w-full overflow-visible"
          focusable="false"
        >
          <path
            d="M 330 870 C 240 930 190 1010 150 1130"
            pathLength="1"
            fill="none"
            stroke="url(#hero-rail-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            className="hero-rail"
            style={{ "--d": "900ms" } as React.CSSProperties}
          />
        </svg>
      </div>
    </div>
  );
}
