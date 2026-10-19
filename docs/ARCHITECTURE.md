# Arquitetura

Landing page única da Noxora em Next.js 16 (App Router, Turbopack, `cacheComponents`), React 19, Tailwind CSS 4 e TypeScript estrito. A página é gerada estaticamente no build. Produto e escopo: `PRODUCT.md`. Plano do redesign em andamento: `docs/DESIGN-REDESIGN.md`.

## Stack real

Next.js 16.4.2, React 19.3.0, Tailwind CSS 4 (via `@tailwindcss/turbopack`), TypeScript 5 estrito, `lucide-react`, Playwright. Node 24 e npm; o `package-lock.json` é a fonte das versões. Sem banco de dados, sem autenticação, sem biblioteca de animação (a dependência `motion` foi removida).

## Mapa do código

```
src/
├── app/                 Rotas e arquivos de metadados
│   ├── layout.tsx       Fontes, metadados globais, viewport, link "pular para o conteúdo"
│   ├── page.tsx         Composição das seções + JSON-LD (Organization)
│   ├── icon.png, apple-icon.png, opengraph-image.tsx, robots.ts, sitemap.ts
├── components/
│   ├── illustrations/   hero/HeroStage (palco do cubo em camadas), api/ApiIntegrationFigure
│   ├── layout/          Header (server), HeaderShell e MobileNav (client), Footer
│   ├── sections/        Hero, Services, Benefits, Portfolio, ProjectCard, Contact
│   └── ui/              Container, Button/ButtonLink, Card, Badge, Facet, RailDivider, Reveal e PlayFigure (client), SectionHeader, Wordmark
├── content/             Textos e dados tipados (site, serviços, benefícios, projetos, contato)
├── lib/                 site-url.ts (origem pública validada), whatsapp.ts (link do canal quando configurado)
└── styles/globals.css   Design system: tokens (@theme), base e utilitários
tests/
├── e2e/                 Playwright, projetos desktop e mobile
└── unit/                Playwright sem navegador, para funções puras
eslint-rules/            Regras locais do toolkit (quality/max-lines etc.) e base do perfil leve do Next
scripts/                 verify-quality-rules.mjs (autoverificação das regras locais)
.agents/skills/          Skills do projeto, 8 (cópias em .claude/skills; origem em skills-lock.json)
.claude/settings.json    Plugins do projeto (Ponytail e Caveman)
.mcp.json, .codex/       MCP do projeto: Context7 e Chrome DevTools MCP (só no Claude); Context7 no Codex
graphify-out/            Grafo de código gerado (ignorado pelo Git; regenerar quando necessário)
docs/                    Documentação (ver índice em README.md); prompts/ e reviews/
```

Seções da página: Hero, Soluções, Como ajudamos, Projetos e Contato. **Navegação:** Soluções, Projetos e Contato. A seção Sobre e os perfis dos sócios foram removidos e seguem adiados. O formulário de contato **não existe hoje**; volta na Fase 5 do redesign, depois dos canais.

## Fronteiras e fluxo

Server Components por padrão; componentes client só onde há estado ou API do navegador: `MobileNav`, `HeaderShell` (estado de rolagem), `Reveal` e `PlayFigure` (animação ao entrar na tela). Dados e textos dos canais vêm de `src/content/` (lidos no build); a configuração do ambiente é lida em módulos de servidor e nunca chega ao cliente via `NEXT_PUBLIC_*`, exceto a URL pública do site, que é pública por natureza.

Interface e design system: `docs/design.md`; os valores ficam em `src/styles/globals.css`.

## Decisões

- **Conteúdo.** Dados e textos dos canais ficam em `src/content/contact.ts`; projetos, serviços e benefícios também são listas tipadas em `src/content/`. Títulos e descrições de algumas seções ainda estão nos componentes; centralizá-los é um débito conhecido (revisão independente, baixa severidade).
- **Portfólio sem cases fictícios.** `projects` começa vazio e a seção mostra um estado vazio honesto. Para publicar um projeto, adicione um item em `src/content/projects.ts` e as imagens em `public/projects/`.
- **Contato direto, por três cartões:** e-mail, WhatsApp e Instagram. O Instagram usa o perfil `@noxoragroup`, com abertura em nova aba e aviso acessível. E-mail e telefone ainda não definidos aparecem como pendentes, sem links fictícios.
- **Configuração dos canais.** `CONTACT_EMAIL` ativa o link `mailto:` quando contém um endereço válido. `WHATSAPP_NUMBER` ativa o WhatsApp quando contém um número válido. Ambos são lidos no build; os cartões pendentes continuam visíveis quando a configuração está ausente ou inválida. Os canais funcionam sem JavaScript. O endereço de e-mail e o telefone não foram inventados.
- **URL do site.** `lib/site-url.ts` valida `NEXT_PUBLIC_SITE_URL`: em desenvolvimento, ausente cai em `http://localhost:3000`; **em produção, ausente, vazia ou inválida interrompe o build** com mensagem clara. Isso impede esquecer a variável (ausente, vazia ou inválida); **não** impede um valor `localhost` escolhido de propósito, então confira o domínio definitivo na publicação.
- **Movimento sem biblioteca.** `Reveal` (client, ~1 KB) usa `IntersectionObserver`. O HTML do servidor é totalmente visível; só depois da hidratação o que está abaixo da dobra é escondido, e nunca com `prefers-reduced-motion: reduce`. Sem JavaScript nada fica oculto. Não há animação infinita.
- **Hero.** Palco em camadas (L0 luz, L1 trilhos atrás, L2 o cubo, L3 trilhos e fichas à frente) com a imagem do cubo (`public/images/noxora-icon.png`, PNG transparente) servida por `next/image` com `preload`, `loading="eager"` e `fetchPriority="high"` (decisão por medição: o `preload` recuperou o LCP no celular). O reflexo reaproveita o mesmo arquivo. É uma imagem, não um modelo 3D; WebGL foi avaliado e descartado. A entrada animada nunca esconde texto nem o cubo.
- **Fontes** via `next/font` (Manrope nos textos e Space Grotesk nos títulos), auto-hospedadas e com `display: swap`.
- **Qualidade.** Perfil leve do toolkit para Next: presets oficiais do Next + `quality/max-lines` (350). Perfil tipado separado (`lint:typed`) para `no-floating-promises` e `no-misused-promises`. Detalhes em `docs/quality.md`.
- **Arquivos de agentes fora do build.** `.agents/`, `.claude/`, `.codex/` e `.backups/` ficam fora do `tsconfig` e do ESLint; contêm instruções e scripts de terceiros que não fazem parte da aplicação.
- **Decisão de nomes:** este arquivo mantém o nome `ARCHITECTURE.md` (equivalente canônico de `docs/architecture.md` do toolkit). Como o sistema de arquivos do Windows ignora maiúsculas, não há como manter os dois nomes.

## Variáveis de ambiente

Ver `.env.example`. Todas são lidas **no build**; alterá-las exige novo build.

| Variável | Efeito |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Obrigatória em produção (ver acima) |
| `CONTACT_EMAIL` | Habilita o canal de e-mail |
| `WHATSAPP_NUMBER` | Habilita o canal de WhatsApp (somente dígitos, com DDI e DDD) |

Para rodar `npm run build` localmente, copie `.env.example` para `.env.local` (a URL de exemplo já aponta para localhost).

## Manutenção

Atualize este mapa quando diretórios, dependências relevantes, contratos ou fronteiras mudarem; remova decisões que deixaram de valer. Comandos: `AGENTS.md` e `docs/onboarding.md`.
