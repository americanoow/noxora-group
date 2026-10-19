import Image from "next/image";
import { ArrowRight, Bell, CheckCheck, Database, Inbox, Zap, type LucideIcon } from "lucide-react";
import type { Project } from "@/content/projects";

/**
 * Prévia visual de um projeto. Projeto real usa a captura de tela; sem captura,
 * uma composição desenhada em código (website, painel ou fluxo). As composições
 * são esqueletos: sem texto, nomes, números ou dados, e decorativas (aria-hidden).
 */
const line = "h-2 rounded-full bg-white/[0.14]";
const soft = "rounded-md bg-white/[0.07]";

function Window({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`facet [--f:24px] ${className}`}>
      <div className="facet-inner bg-surface-2 shadow-float">
        <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="ml-3 h-2 w-24 rounded-full bg-white/10" />
        </div>
        {children}
      </div>
    </div>
  );
}

function WebsiteMockup() {
  return (
    <Window className="w-[86%]">
      <div className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="size-5 rounded-md bg-chrome/70" />
          <div className="flex gap-3">
            <span className="h-2 w-8 rounded-full bg-white/15" />
            <span className="h-2 w-8 rounded-full bg-white/15" />
            <span className="h-2 w-8 rounded-full bg-white/15" />
          </div>
        </div>
        <div className="grid grid-cols-[1.2fr_1fr] items-center gap-4">
          <div className="grid gap-2.5">
            <span className="h-3.5 w-11/12 rounded-full bg-white/70" />
            <span className="h-3.5 w-8/12 rounded-full bg-white/70" />
            <span className={`${line} mt-1 w-10/12`} />
            <span className={`${line} w-7/12`} />
            <div className="mt-2 flex gap-2">
              <span className="h-7 w-20 rounded-full bg-fg" />
              <span className="h-7 w-16 rounded-full border border-control" />
            </div>
          </div>
          <div className="aspect-square rounded-xl bg-[radial-gradient(70%_70%_at_40%_35%,rgb(143_180_255/0.45),rgb(143_180_255/0.05)_70%)] ring-1 ring-white/10" />
        </div>
        <div className="hidden grid-cols-3 gap-2.5 sm:grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${soft} grid gap-2 p-3`}>
              <span className="size-4 rounded-full bg-chrome/60" />
              <span className={`${line} w-9/12`} />
              <span className={`${line} w-6/12`} />
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

function SystemMockup() {
  const bars = [38, 62, 48, 80, 58, 92, 70];
  return (
    <Window className="w-[90%]">
      <div className="grid grid-cols-[3.2rem_1fr] sm:grid-cols-[4rem_1fr]">
        <div className="grid content-start justify-items-center gap-3 border-r border-line py-4">
          <span className="size-5 rounded-md bg-chrome/70" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`size-4 rounded ${i === 0 ? "bg-light-ice/70" : "bg-white/15"}`} />
          ))}
        </div>
        <div className="grid gap-3 p-3.5 sm:p-4">
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${soft} grid gap-2 p-3`}>
                <span className="h-1.5 w-8 rounded-full bg-white/20" />
                <span className="h-4 w-3/4 max-w-12 rounded-full bg-white/60" />
              </div>
            ))}
          </div>
          <div className={`${soft} flex h-16 items-end gap-2 p-3 sm:h-28`}>
            {bars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-light-ice/20 to-light-ice/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="grid gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`items-center gap-3 ${i === 2 ? "hidden sm:flex" : "flex"}`}>
                <span className="size-4 rounded-full bg-white/15" />
                <span className={`${line} flex-1`} />
                <span className="h-4 w-12 rounded-full bg-light-ice/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

function FlowNode({ icon: Icon, glow = false }: { icon: LucideIcon; glow?: boolean }) {
  return (
    <div className="facet [--f:14px]">
      <div
        className={`facet-inner grid size-14 place-items-center sm:size-16 ${
          glow ? "bg-ink text-light-ice shadow-[0_0_30px_4px_rgb(143_180_255/0.3)]" : "bg-graphite-3 text-chrome"
        }`}
      >
        <Icon className="size-6 sm:size-7" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function FlowLink() {
  return (
    <span className="flex flex-1 items-center">
      <span className="h-0.5 flex-1 bg-gradient-to-r from-white/40 to-white/15" />
      <ArrowRight className="-ml-1 size-4 shrink-0 text-chrome/70" strokeWidth={1.75} />
    </span>
  );
}

function AutomationMockup() {
  return (
    <div className="grid w-full gap-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <FlowNode icon={Inbox} />
        <FlowLink />
        <FlowNode icon={Zap} glow />
        <FlowLink />
        <FlowNode icon={Database} />
      </div>
      <div className="flex items-center justify-end gap-2 pl-[38%] sm:gap-3">
        <FlowLink />
        <FlowNode icon={Bell} />
        <FlowLink />
        <FlowNode icon={CheckCheck} />
      </div>
    </div>
  );
}

const mockups = { website: WebsiteMockup, system: SystemMockup, automation: AutomationMockup };

export function ProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    const { src, alt, width, height } = project.image;
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="aspect-[16/10] w-full rounded-xl object-cover"
      />
    );
  }

  const Mockup = project.mockup ? mockups[project.mockup] : null;
  if (!Mockup) return null;
  return (
    <div
      aria-hidden="true"
      data-preview=""
      className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-ink sm:aspect-[16/11] px-[5%] select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgb(143_180_255/0.14),transparent_72%)]" />
      <div className="relative grid w-full place-items-center">
        <Mockup />
      </div>
    </div>
  );
}
