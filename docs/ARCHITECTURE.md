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
│   ├── illustrations/   hero/HeroStage (palco do cubo), services/ServiceDemos (quatro demonstrações de Soluções), benefits/ExampleFlow ("Ver exemplo"), projects/ProjectPreview (mockups de website, painel e fluxo)
│   ├── layout/          Header (server), HeaderShell e MobileNav (client), Footer
│   ├── sections/        Hero, Services, Benefits, Portfolio, ProjectSlide, ProjectCarousel (client), Contact, ContactForm (client)
│   └── ui/              Container, Button/ButtonLink, Card, Badge, Facet, RailDivider, Reveal, PlayFigure (com a fila `playQueue`), SweepOnView, MotionToggle, useMotionEnabled, SectionHeader, Wordmark
├── content/             Textos e dados tipados (site, serviços, benefícios, projetos, contato)
├── lib/                 site-url.ts (origem pública validada), contact.ts (validação), contact-action.ts (Server Action), whatsapp.ts (número, link e formatação do canal)
└── styles/             globals.css (tokens, base, ilustrações) e interactions.css (movimento e respostas a controles)
tests/
├── e2e/                 Playwright, projetos desktop e mobile
└── unit/                Playwright sem navegador, para funções puras
eslint-rules/            Regras locais do toolkit (quality/max-lines etc.) e base do perfil leve do Next
scripts/                 verify-quality-rules.mjs (autoverificação das regras locais)
docs/                    Documentação (ver índice em README.md)
```

Seções da página: Hero, Soluções, Como ajudamos, Projetos e Contato. **Navegação:** Soluções, Projetos e Contato. A seção Sobre e os perfis dos sócios foram removidos e seguem adiados. O formulário de contato vem depois dos canais, na seção Contato.

## Fronteiras e fluxo

Server Components por padrão; componentes client só onde há estado ou API do navegador: `MobileNav`, `HeaderShell` (estado de rolagem), `Reveal`, `PlayFigure` (animação ao entrar na tela), `ExampleFlow` (sequência de "Como ajudamos", na mesma fila) e `ContactForm` (validação e estado de envio). Dados e textos dos canais vêm de `src/content/` (lidos no build); a configuração do ambiente é lida em módulos de servidor e nunca chega ao cliente via `NEXT_PUBLIC_*`, exceto a URL pública do site, que é pública por natureza.

Interface e design system: `docs/design.md`; os valores ficam em `src/styles/globals.css`.

## Decisões

- **Conteúdo.** Dados e textos dos canais ficam em `src/content/contact.ts`; projetos, serviços e benefícios também são listas tipadas em `src/content/`. Títulos e descrições de algumas seções ainda estão nos componentes; centralizá-los é um débito conhecido (revisão independente, baixa severidade).
- **Vitrine de projetos.** `src/content/projects.ts` guarda o modelo (`id`, `title`, `category`, `kind` real ou conceitual, `summary` (frase curta da apresentação), `description`, `problem`, `solution` (mostrados em "Ver detalhes"), `technologies`, `image` ou `mockup`, `demoUrl`, `caseStudyUrl`). Hoje a vitrine exibe somente os três websites reais autorizados, com capturas locais; os exemplos conceituais foram removidos por decisão do responsável. Os reais usam objetivo, sem alegar histórico do cliente ou resultado comercial; tecnologias não confirmadas ficam vazias e não são exibidas. A seção se adapta à quantidade: 0 mostra o aviso "Casos reais em breve"; 1 mostra o destaque sem controles; 2 ou mais viram carrossel manual (`ProjectCarousel`). O carrossel usa rolagem nativa com `scroll-snap` (gesto de arrastar, teclado e leitor de tela sem código extra), sem autoplay e sem loop; setas, pontos e indicador só existem com JavaScript (sem ele, todos os projetos continuam acessíveis pela rolagem). Projeto real: adicione no início da lista, com captura em `public/projects/`. As páginas `/fixtures/projetos/{0,1,2,5}` (quatro páginas estáticas) existem só quando o build roda com `NOXORA_FIXTURES=1` (definido em `playwright.config.ts`); em qualquer outro build, ou caminho, respondem 404 de verdade.
- **Contato direto, por três cartões:** e-mail, WhatsApp e Instagram. O e-mail padrão é `groupnoxora@gmail.com`, informado pelo responsável, com link `mailto:`. O Instagram usa o perfil `@noxoragroup`, com abertura em nova aba e aviso acessível. O WhatsApp padrão é (21) 99494-1194 (`wa.me/5521994941194`), com abertura em nova aba.
- **Configuração dos canais.** `CONTACT_EMAIL` pode substituir o e-mail padrão por outro endereço válido. Ausente ou vazia, mantém `groupnoxora@gmail.com`; inválida, o canal some. `WHATSAPP_NUMBER` substitui o número padrão do WhatsApp quando contém um número válido; inválido, o canal some. Ambos são lidos no build. Os canais funcionam sem JavaScript. O e-mail não configura o destino do formulário, que continua dependendo de `CONTACT_WEBHOOK_URL`.
- **Formulário de contato.** `lib/contact.ts` valida igual no cliente e no servidor; `lib/contact-action.ts` é a Server Action. Com JavaScript, valida antes de enviar, foca o primeiro campo inválido, mostra "Enviando…" e **intercepta o envio** por um envoltório que trata queda de rede (sem ele, a rejeição desmontaria o formulário e o rascunho se perderia); sem JavaScript vale a Server Action direta, exigida pelo envio nativo; sem JavaScript, a action valida e a página volta com o erro **e os valores digitados** (F03). A entrega é um POST JSON para `CONTACT_WEBHOOK_URL` (só servidor, lida em tempo de execução, nunca `NEXT_PUBLIC_*`), com tempo limite (padrão 8 s). **Sucesso só depois de HTTP 2xx do destino**; sem destino, "indisponível"; falha de entrega, erro com os valores preservados. Campo isca (honeypot) descarta robôs sem entregar. Logs trazem só o tipo do erro: nunca a URL, o e-mail ou a mensagem. **Sem limite de frequência** (pendência registrada em `docs/quality.md`). Bordas dos campos usam `control` (contraste ≥ 3:1).
- **URL do site.** `lib/site-url.ts` valida `NEXT_PUBLIC_SITE_URL`: em desenvolvimento, ausente cai em `http://localhost:3000`; **em produção, ausente, vazia ou inválida interrompe o build** com mensagem clara. Isso impede esquecer a variável (ausente, vazia ou inválida); **não** impede um valor `localhost` escolhido de propósito, então confira o domínio definitivo na publicação.
- **Movimento sem biblioteca.** `Reveal` usa `IntersectionObserver`; o HTML do servidor é totalmente visível. `useMotionEnabled` compartilha a regra de pausa, preferência de movimento e visibilidade da aba entre `Reveal`, `PlayFigure`, `SweepOnView` e `MotionToggle`. `PlayFigure` pede a vez em uma fila (`playQueue.ts`), de modo que só uma demonstração automática toca por vez, e repete apenas enquanto visível, com pausa longa entre ciclos; "Repetir" reinicia só a figura do botão; `SweepOnView` ativa e remove `data-sweep` conforme a viewport. Loops CSS exigem `data-motion="on"`; `MotionToggle` atualiza `data-motion-active` para suspender animações em segundo plano. Pausar ou reduzir movimento restaura as figuras completas, sem timers de repetição. Sem JavaScript, não há loops nem conteúdo oculto.
- **Hero.** Palco em camadas (L0 luz, L1 trilhos atrás, L2 o cubo, L3 trilho à frente; sem fichas de texto) com a imagem do cubo (`public/images/noxora-icon.png`, PNG transparente) servida por `next/image` com `preload`, `loading="eager"` e `fetchPriority="high"` (decisão por medição: o `preload` recuperou o LCP no celular). O reflexo reaproveita o mesmo arquivo. É uma imagem, não um modelo 3D; WebGL foi avaliado e descartado. A entrada animada nunca esconde texto nem o cubo.
- **Fontes** via `next/font` (Manrope nos textos e Space Grotesk nos títulos), auto-hospedadas e com `display: swap`.
- **Qualidade.** Perfil leve do toolkit para Next: presets oficiais do Next + `quality/max-lines` (350). Perfil tipado separado (`lint:typed`) para `no-floating-promises` e `no-misused-promises`. Detalhes em `docs/quality.md`.
- **Decisão de nomes:** este arquivo mantém o nome `ARCHITECTURE.md` (equivalente canônico de `docs/architecture.md` do toolkit). Como o sistema de arquivos do Windows ignora maiúsculas, não há como manter os dois nomes.

## Variáveis de ambiente

Ver `.env.example`. Todas são lidas **no build**; alterá-las exige novo build.

| Variável | Efeito |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Obrigatória em produção (ver acima) |
| `CONTACT_EMAIL` | Substitui o e-mail público padrão; ausente ou vazia, usa groupnoxora@gmail.com |
| `WHATSAPP_NUMBER` | Substitui o WhatsApp padrão (somente dígitos, com DDI e DDD) |
| `CONTACT_WEBHOOK_URL` | Destino do formulário. **Lida em tempo de execução, só no servidor.** Sem ela o formulário avisa que está indisponível |
| `CONTACT_WEBHOOK_TIMEOUT_MS` | Opcional: tempo limite da entrega (padrão 8000) |

Para rodar `npm run build` localmente, copie `.env.example` para `.env.local` (a URL de exemplo já aponta para localhost).

## Manutenção

Atualize este mapa quando diretórios, dependências relevantes, contratos ou fronteiras mudarem; remova decisões que deixaram de valer. Comandos: `docs/onboarding.md`.


## Demonstrações com referências 21st.dev e Uiverse — 23/10/2026

Websites agora usa navegador e celular com ilustração editorial de arquitetura; Sistemas mostra uma lista de pedidos e uma confirmação; Integrações conecta três entradas ao cubo e ao sistema com Animated Beam e uma órbita curta; Automação apresenta eventos sequenciais e uma notificação de conclusão. São demonstrações conceituais, com dados genéricos em `src/content/service-scenes.ts`.

As referências Safari, Animated Beam, Animated List, Orbiting Circles, notificação, check e botão foram adaptadas ao CSS e ao PlayFigure existente, sem novas dependências. Créditos e licenças em THIRD_PARTY_NOTICES.md. Estilos isolados em service-scenes.css; nenhuma alteração no hero ou no contato. Estado estático completo sem JavaScript e com movimento reduzido; pausa global e execução somente enquanto visível preservadas. Context7 não está disponível nesta sessão; foram consultadas a documentação Next instalada e as fontes oficiais dos componentes.
