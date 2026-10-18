# Redesign: relatório da Fase 2 (design system e componentes-base)

Data: 17/10/2026. Plano: `docs/DESIGN-REDESIGN.md`. Sem deploy e sem commit (a linha de base não foi autorizada); a árvore de trabalho inteira continua sem commit.

## Escopo entregue

1. **Tokens do design system** em `src/styles/globals.css`: superfícies, bordas, texto, escala tipográfica, espaçamento de seção, raios, sombras, durações e curva de movimento.
2. **Componentes-base:** `Card`, `Badge`, `Reveal` (novos) e `Button` redefinido (`primary`, `secondary`, `ghost`).
3. **Correção F01** da revisão independente: `lib/site-url.ts`.
4. **Remoção da dependência `motion`**, que não era usada.
5. **Migração dos componentes existentes** para os novos tokens (sem redesenhá-los; isso é das fases 3 a 5).
6. **Documentação alinhada ao estado real:** `ARCHITECTURE.md`, `CLAUDE.md`, decisões D1 a D5 no plano.

## Arquivos

**Novos:** `src/components/ui/{Card,Badge,Reveal}.tsx`, `src/lib/site-url.ts`, `tests/e2e/{design-system,seo-origin}.spec.ts`, `tests/unit/site-url.spec.ts`, este relatório.

**Alterados:**
- `src/styles/globals.css` (reescrito).
- `src/components/ui/Button.tsx`, `src/components/ui/SectionHeader.tsx`.
- `src/content/site.ts`.
- `src/components/layout/{Footer,MobileNav}.tsx`.
- `src/components/sections/{Hero,Services,Portfolio,ProjectCard,Contact}.tsx`.
- `playwright.config.ts`, `.env.example`.
- `package.json` e `package-lock.json` (apenas a remoção de `motion`).
- `docs/ARCHITECTURE.md`, `docs/DESIGN-REDESIGN.md`, `CLAUDE.md`.

## Decisões técnicas

- **Tokens renomeados:** `surface-raised` virou `surface-3`; `line-strong` foi removido. `line` passou a #27272A, decorativo (1,41:1). Quem delimita um controle usa o novo `control` #71717A (4,10:1 sobre #0A0A0A; 3,91:1 sobre #111), o que resolve a causa do F02 para os componentes atuais.
- **Contrastes calculados** pela fórmula WCAG: texto principal 19,3:1; secundário 8,2:1 sobre preto e 7,4:1 sobre #111.
- **Texto mínimo de 14 px:** todos os `text-xs` viraram `text-sm`; a escala não tem tamanho menor. Há teste automatizado percorrendo os nós de texto visíveis.
- **Bug corrigido no foco:** a regra `:focus-visible` definia `border-radius: 4px`, que "quadrava" botões em pílula ao receber foco. Removida; há teste.
- **Movimento:** a oscilação infinita de 18 s do cubo foi removida (risco apontado na revisão independente). A animação de entrada do hero vem na Fase 3.
- **`Reveal`:** segurança por padrão. O servidor entrega o conteúdo visível; só depois da hidratação o que está abaixo da dobra é escondido, e nunca com movimento reduzido. Está aplicado ao `SectionHeader`, o que o exercita em todas as seções.
- **F01 (decisão com efeito colateral):** em produção, URL ausente, vazia ou inválida **falha o build**. Quem rodar `npm run build` sem `.env.local` verá um erro com instrução. O Playwright define a variável no próprio servidor de teste.
- **Testes:** `playwright.config.ts` ganhou o projeto `unit` (sem navegador) para funções puras.

## Verificações

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | sem erros ou avisos |
| `npm run typecheck` | ok |
| Build com `NEXT_PUBLIC_SITE_URL` vazia | **falha** (exit 1) com a mensagem esperada |
| Build com URL inválida (`noxora`) | **falha** com "NEXT_PUBLIC_SITE_URL inválida" |
| Build com URL válida | ok |
| `npm run test:e2e` | **37 passaram, 5 pulados de propósito** (menu mobile só no projeto mobile; testes de Tab e de foco só no desktop) |
| Revisão visual | capturas em 1440×900: topo, Soluções e Contato com hover |

**Cobertura nova:**
- Valores exatos dos tokens, lidos do CSS computado.
- Nenhum texto visível abaixo de 14 px.
- Foco sem alteração de raio.
- `Reveal`: oculta abaixo da dobra e revela ao rolar; não esconde o que já está visível; com movimento reduzido nada é escondido; sem JavaScript tudo permanece visível.
- Origem pública em canonical, `og:url`, `og:image`, JSON-LD, `robots.txt` e `sitemap.xml`.
- `resolveSiteUrl`: desenvolvimento, produção, vazio, inválido, protocolo não web e normalização.

Três falhas iniciais dos testes novos eram de expectativa, não de produto (minificação `#000000` para `#000`, seletor do wrapper do `Reveal`, barra final do canonical). Foram corrigidas nos testes; nenhum código de produto mudou por causa delas.

## Pontos para o Codex olhar

1. `Reveal.tsx`: ciclo de vida do effect (limpeza remove `data-reveal`, o que mantém o conteúdo visível sob `StrictMode`) e a heurística de "já visível ao carregar".
2. `Card.tsx`: tipagem polimórfica com `HTMLAttributes<HTMLElement>`.
3. `site-url.ts`: o erro no build é aceitável para o fluxo local de vocês? A alternativa seria avisar em vez de falhar.
4. `globals.css`: conferir `--chrome-line-opacity` e a variável `--reveal-delay`.

## Limitações e pendências

- **Sem commit.** A árvore inteira continua sem ponto de retorno; a linha de base não foi autorizada.
- **F04 (menu mobile em telas baixas)** segue aberto: entra na Fase 3, com o Header.
- **`Image priority`** (depreciado) segue no hero até a Fase 3.
- **Axe:** não será adicionado sem aprovação da dependência.
- **`Card`, `Badge` e `Button` `ghost`** ainda não têm uso na página; entram nas Fases 3 a 5.
- **README.md** continua desatualizado (aponta `app/page.tsx`); item de baixa severidade da revisão anterior.
- **Fase 6/7:** Core Web Vitals não foram medidos.
