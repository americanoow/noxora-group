import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight, Bell, Check, ChevronRight, Database, FileCheck2, FileText, Globe2, LockKeyhole, Mail, MoreHorizontal, Package, Search, ShoppingBag } from "lucide-react";
import { serviceScenes as copy } from "@/content/service-scenes";

// Adaptações de Safari, Animated Beam e Animated List (Magic UI / 21st.dev)
// e dos detalhes de confirmação/botão do Uiverse. Créditos: THIRD_PARTY_NOTICES.md.
const delay = (step: number) => ({ "--scene-delay": `calc(var(--duration-base) * ${step})` }) as CSSProperties;

function Browser({ children, address }: { children: ReactNode; address: string }) {
  return (
    <div className="scene-browser">
      <div className="scene-browser-bar">
        <span className="scene-window-dots"><i /><i /><i /></span>
        <span className="scene-address"><LockKeyhole size={12} />{address}</span>
        <MoreHorizontal size={16} />
      </div>
      {children}
    </div>
  );
}

/** Desenho editorial de arquitetura: uma imagem vetorial, sem wireframes. */
function Architecture() {
  return (
    <svg viewBox="0 0 400 240" className="scene-architecture" fill="none" focusable="false">
      <path d="M0 210L400 170V240H0Z" fill="currentColor" opacity=".1" />
      <path d="M74 198V88L234 38V157Z" fill="currentColor" opacity=".75" />
      <path d="M234 38L340 90V206L234 157Z" fill="currentColor" opacity=".3" />
      <path d="M74 88L185 134L340 90L234 38Z" fill="currentColor" opacity=".95" />
      <path d="M90 111L140 130V186L90 172Z" fill="var(--color-ink)" />
      <path d="M155 137L185 147V199L155 190Z" fill="var(--color-ink)" />
      <path d="M252 86L322 112V158L252 134Z" fill="var(--color-ink)" />
      <path d="M98 112V172M114 119V179M130 125V182M270 94V139M290 101V147M310 108V153" stroke="currentColor" opacity=".5" />
      <path d="M40 216L185 240L372 213M40 216V130M372 213V132" stroke="currentColor" opacity=".35" />
      <circle cx="40" cy="111" r="14" stroke="currentColor" opacity=".25" />
    </svg>
  );
}

export function WebsitesDemo() {
  return (
    <div aria-hidden="true" className="service-scene scene-web" data-scene="website">
      <div className="scene-desktop scene-enter">
        <Browser address={copy.web.address}>
          <div className="scene-site-content">
            <div className="scene-site-nav"><span>{copy.web.brand}</span><MoreHorizontal size={16} /></div>
            <div className="scene-site-heading"><p>{copy.web.eyebrow}</p><strong>{copy.web.title}</strong></div>
            <Architecture />
            <div className="scene-site-footer"><span>{copy.web.caption}</span><ArrowUpRight size={18} /></div>
          </div>
        </Browser>
      </div>
      <div className="scene-phone scene-enter" style={delay(2)}>
        <span className="scene-phone-speaker" />
        <div className="scene-phone-inner"><span>{copy.web.brand}</span><Architecture /><strong>{copy.web.mobileTitle}</strong><span className="scene-mobile-cta">{copy.web.mobileCta}<ArrowUpRight size={14} /></span></div>
      </div>
      <span className="scene-web-caption">{copy.web.caption}</span>
    </div>
  );
}

function Confirmation({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return (
    <div className={`scene-notice ${className}`}>
      <span className="scene-check"><Check size={18} strokeWidth={2.5} /></span>
      <span className="min-w-0"><strong>{title}</strong><span>{description}</span></span>
      <Bell size={16} className="scene-notice-bell" />
    </div>
  );
}

export function SystemsDemo() {
  return (
    <div aria-hidden="true" className="service-scene scene-system" data-scene="system">
      <Browser address={copy.system.address}>
        <div className="scene-system-header"><span><Package size={17} />{copy.system.title}</span><Search size={17} /></div>
        <div className="scene-order-list">
          {copy.system.orders.map((order, index) => (
            <div key={order.name} className={`scene-order ${index === 1 ? "scene-order-selected" : ""}`}>
              <span><FileText size={17} /><strong>{order.name}</strong></span>
              <span className="scene-order-status">{order.status}{index === 1 ? <Check className="scene-draw-check" size={15} /> : <ChevronRight size={14} />}</span>
            </div>
          ))}
        </div>
        <div className="scene-system-bottom"><span className="scene-live-dot" />{copy.system.note}</div>
      </Browser>
      <div className="scene-system-notice scene-enter" style={delay(8)}>
        <Confirmation title={copy.system.done} description={copy.system.detail} />
      </div>
    </div>
  );
}

/** Caminho quadrático e duas camadas de traço, como o Animated Beam.
 * Coordenadas fixas no viewBox evitam medições e observadores adicionais. */
function Beam({ path, step }: { path: string; step: number }) {
  return (
    <g style={delay(step)}>
      <path d={path} className="scene-beam-track" />
      <path d={path} pathLength="1" className="scene-beam-pulse" />
    </g>
  );
}

export function IntegrationsDemo() {
  const inputIcons = [ShoppingBag, Mail, Globe2];
  return (
    <div aria-hidden="true" className="service-scene scene-integrations" data-scene="integrations">
      <svg viewBox="0 0 500 320" preserveAspectRatio="none" className="scene-connections" fill="none" focusable="false">
        <Beam path="M70 72Q170 72 250 160" step={0} />
        <Beam path="M70 160Q170 160 250 160" step={2} />
        <Beam path="M70 248Q170 248 250 160" step={4} />
        <Beam path="M250 160Q350 160 430 160" step={6} />
      </svg>
      {copy.integrations.inputs.map((label, index) => {
        const Icon = inputIcons[index];
        return (
          <div key={label} className="scene-network-input" style={{ top: `${22.5 + index * 27.5}%` }}>
            <span className="scene-network-icon"><Icon size={22} strokeWidth={1.5} /></span><span>{label}</span>
          </div>
        );
      })}
      <div className="scene-network-center">
        <span className="scene-orbit"><i /></span>
        <Image src="/images/noxora-icon.png" alt="" width={128} height={122} sizes="128px" className="scene-cube" />
      </div>
      <div className="scene-network-output"><span className="scene-network-icon"><Database size={26} strokeWidth={1.5} /></span><span>{copy.integrations.destination}</span></div>
      <span className="scene-integrations-done scene-enter" style={delay(10)}><Check size={15} />{copy.integrations.done}</span>
    </div>
  );
}

export function AutomationDemo() {
  const icons = [Mail, FileCheck2, Bell];
  return (
    <div aria-hidden="true" className="service-scene scene-automation" data-scene="automation">
      <div className="scene-automation-heading"><span className="scene-live-dot" />{copy.automation.title}<span>{copy.automation.tag}</span></div>
      <div className="scene-event-list">
        {copy.automation.events.map((event, index) => {
          const Icon = icons[index];
          return (
            <div key={event.title} className="scene-event scene-enter" style={delay(index * 4)}>
              <span className="scene-event-icon"><Icon size={20} strokeWidth={1.5} /></span>
              <div><strong>{event.title}</strong><span>{event.description}</span></div>
              <Check size={16} className="scene-draw-check" />
            </div>
          );
        })}
      </div>
      <div className="scene-auto-notice scene-enter" style={delay(11)}><Confirmation title={copy.automation.done} description={copy.automation.detail} /></div>
    </div>
  );
}
