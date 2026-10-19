/**
 * Palco do estado vazio de "Projetos": janelas de software em camadas
 * (site, painel e fluxo) ligadas por um trilho cromado. Tudo é esqueleto:
 * nenhum projeto, cliente ou número é sugerido. Decorativo (aria-hidden).
 */
const line = "h-2 rounded-full bg-white/[0.12]";

export function ProjectStage() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/11] w-full select-none"
    >
      {/* Luz atrás das janelas */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_55%_45%,rgb(143_180_255/0.13),transparent_70%)]" />

      {/* Trilho cromado ligando as janelas */}
      <svg viewBox="0 0 640 440" className="absolute inset-0 h-full w-full overflow-visible" focusable="false">
        <path
          d="M90 380 C 190 380 210 250 330 250 S 470 150 600 150"
          fill="none"
          stroke="rgb(212 216 222 / 0.45)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="330" cy="250" r="5" fill="#fff" />
      </svg>

      {/* Janela 1: website */}
      <div className="facet absolute top-[4%] left-[2%] z-10 w-[60%] -rotate-[2deg] [--f:24px]">
        <div className="facet-inner bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-2 w-16 rounded-full bg-chrome/50" />
            <span className="ml-auto h-2 w-10 rounded-full bg-white/[0.12]" />
            <span className="h-2 w-10 rounded-full bg-white/[0.12]" />
          </div>
          <div className="grid gap-3 p-4">
            <div className="h-16 rounded-md bg-[linear-gradient(120deg,rgb(255_255_255/0.1),rgb(255_255_255/0.03))]" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid gap-2">
                  <span className="h-8 rounded-md bg-white/[0.07]" />
                  <span className={line} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Janela 2: painel de gestão */}
      <div className="facet absolute top-[34%] right-[2%] z-20 w-[52%] rotate-[1.5deg] [--f:24px]">
        <div className="facet-inner bg-graphite-2 p-4">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid gap-2 rounded-md bg-ink/60 p-2.5">
                <span className="h-1.5 w-2/3 rounded-full bg-white/[0.14]" />
                <span className="h-3 w-1/2 rounded-full bg-chrome/50" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-20 items-end gap-2">
            {[35, 55, 42, 70, 52, 88, 64].map((h, i) => (
              <span key={i} className="flex-1 rounded-sm bg-chrome/35" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Janela 3: fluxo */}
      <div className="facet absolute bottom-[3%] left-[8%] z-30 w-[34%] [--f:16px]">
        <div className="facet-inner flex items-center justify-between bg-surface px-4 py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <span className={`size-5 rounded-full border-2 ${i === 2 ? "border-light-ice bg-light-ice/30" : "border-chrome/70"}`} />
              {i < 2 ? <span className="mx-1.5 h-px flex-1 bg-chrome/40" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
