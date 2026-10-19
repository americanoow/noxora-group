# Redesign premium da Noxora: diagnóstico e plano

> **Aviso (18/10/2026):** a direção visual foi aprovada com ajustes. A proposta visual deste documento (seções 2.2 a 2.6) e as fases 3 a 7 foram **substituídas** por `docs/REDESIGN-PLAN.md`, `docs/CREATIVE-DIRECTION.md` e `docs/ILLUSTRATION-SYSTEM.md`. Este plano permanece como histórico das fases 1 e 2 e das decisões D1 a D5.

Status: **plano aprovado em 17/10/2026, em execução.** Fase 2 concluída (ver `docs/reviews/2026-10-17-redesign-fase-2.md`).

**Decisões do responsável (17/10/2026):**

- **D1 — Contato:** manter os três canais (e-mail, WhatsApp, Instagram) e **acrescentar o formulário depois deles**.
- **D2 — Sobre:** **fica fora por enquanto.** A seção e o item de menu não serão restaurados nesta rodada; o menu continua Soluções, Projetos e Contato.
- **D3 — Símbolo N:** ainda sem arquivo; o wordmark de texto permanece.
- **D4 — Headline:** usar "Tecnologia que resolve problemas reais." (aplicada na Fase 3).
- **D5 — Commit e dependência `@axe-core/playwright`:** commits **autorizados em 18/10/2026** ("faça commits quando achar necessário"); o estado foi commitado em `master`. A dependência axe **continua sem aprovação**.

Onde o texto abaixo menciona a seção Sobre, leia como adiada.

Referências de design: Linear e Resend, usadas apenas como princípios. Nada de código, layout completo, texto ou ativo delas será copiado.

## 1. Diagnóstico

### 1.1 Estado do projeto

- **Stack:** Next.js 16.4.2 (App Router, Turbopack, `cacheComponents`), React 19.3, Tailwind 4, TypeScript estrito, `lucide-react`, Playwright. A dependência `motion` está instalada e **não é usada**.
- **Git:** só existe o commit `a370506` (create-next-app). **Todo o trabalho da Landing V1 estava sem commit nesta data (17/10; commitado em 18/10)**, incluindo a mudança de `app/` para `src/app/`. Hoje não há ponto de retorno.
- **Alterações feitas fora desta tarefa, preservadas e tratadas como estado oficial:**
  - fontes trocadas para Manrope (corpo) e Space Grotesk (títulos);
  - seção Sobre removida, e o menu sem o item "Sobre";
  - formulário de contato e Server Action removidos, substituídos por três canais (e-mail, WhatsApp, Instagram `@noxoragroup`);
  - `package.json` e `package-lock.json` com modificações anteriores.
- **Revisão independente existente:** `docs/reviews/2026-10-17-revisao-independente-marco-v1.md` aponta F01 a F04. Parte já ficou sem efeito com a remoção do formulário (F02, F03). **F01 (URL do site quebra o build quando vazia) e F04 (menu mobile corta o CTA em telas baixas) continuam válidos** e entram neste plano.
- **Documentação:** `CLAUDE.md` e `ARCHITECTURE.md` existem, mas descrevem o formulário e a seção Sobre que não existem mais. `BRAND.md` e `ROADMAP.md` têm 0 bytes.

### 1.2 Ativos de marca disponíveis

| Ativo | Situação |
| --- | --- |
| Cubo de vidro líquido | `public/images/noxora-icon.png`, 1283×1226, PNG transparente, 1,5 MB. É **uma imagem, não um modelo 3D**. |
| Logo NOXORA. | Existe só como texto (`Wordmark`). Sem SVG. |
| Favicon e ícone Apple | `src/app/icon.png` e `apple-icon.png`, derivados do cubo. |
| **Símbolo circular "N"** | **Não existe no repositório.** O briefing o lista como elemento a preservar. Preciso do arquivo (SVG ou PNG transparente). Até lá, não será inventado nem desenhado. |

### 1.3 Design atual: o que funciona e o que falta

**Mantém:** preto #000, tipografia forte, cubo como peça central, paleta contida, copy objetiva.

**Falta em relação ao objetivo:**

1. **Hierarquia visual plana.** As quatro seções têm o mesmo peso e o mesmo ritmo (título, grade, lista). Não há momento de destaque depois do hero.
2. **Serviços em grade 2×2 uniforme.** Só texto e ícone pequeno; nada mostra o que a solução faz. Falta elemento gráfico por card.
3. **Sem demonstrações visuais.** O visitante leigo precisa imaginar o resultado.
4. **Portfólio vazio** (correto, pois não há cases reais) e sem estrutura pronta para imagens grandes e categoria. `ProjectCard` não tem categoria.
5. **Tokens incompletos.** Só cores e duas fontes. Faltam escala tipográfica, espaçamentos, raios, sombras, durações e estados.
6. **Movimento.** Uma oscilação infinita de 18 s no cubo; nenhuma animação de entrada. A revisão independente apontou o movimento perpétuo como risco.
7. **Header** sem tratamento visual além do blur; menu mobile sem rolagem interna (F04).
8. **Bibliotecas:** `motion` sem uso; `Image priority` está depreciado no Next 16 (o guia instalado manda usar `loading="eager"` ou `fetchPriority="high"`).
9. **Acessibilidade:** foco branco 2 px é bom; o botão secundário e os chips usam borda `white/10` e `white/22`, adequada para divisórias decorativas, mas **não para controles interativos** (WCAG 1.4.11 exige 3:1). Textos de 12 px (`text-xs`) em chips e eyebrows são pequenos demais para o objetivo "legível por qualquer decisor".

### 1.4 O que observei nas referências

Inspecionei as duas páginas iniciais no navegador (capturas de 1440×900). Princípios extraídos, sem detalhes de implementação:

- **Linear:** headline grande e curta alinhada à esquerda, muito espaço vazio, borda de 1 px quase invisível, tipografia sem decoração, produto mostrado logo abaixo do hero como uma interface real recortada, ilustrações em linha fina com legenda técnica ("FIG 0.1") e colunas separadas por filetes.
- **Resend:** objeto 3D escuro e sóbrio ao lado do texto, luz rasante como único efeito, botão principal com superfície elevada e borda suave, bloco de demonstração como um painel com abas.

O que a Noxora ganha com isso: confiança por contenção. O que ela deve ter de próprio: o cubo líquido e a superfície chrome, usados com parcimônia.

## 2. Proposta visual

**Conceito:** "vidro sobre preto". A página é quase toda silenciosa (preto, texto, filetes). Brilho metálico só aparece em três lugares: o cubo, o filete superior de alguns cards e o texto de destaque do hero. Se tudo brilha, nada brilha.

### 2.1 Design system (tokens em `@theme`)

**Cores** (valores do briefing; contrastes calculados):

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `ink` | #000000 | fundo | n/a |
| `surface` | #0A0A0A | seções, cards | n/a |
| `surface-2` | #111111 | cards em destaque, painéis | n/a |
| `surface-3` | #171717 | hover, itens elevados | n/a |
| `line` | #27272A | divisórias e bordas decorativas | 1,41:1 (decorativo, aceitável) |
| `control` | #71717A | **borda de campos e botões secundários** | 4,10:1 sobre #0A0A0A; 3,91:1 sobre #111 |
| `fg` | #F5F5F7 | texto principal | 19,3:1 sobre #000 |
| `muted` | #A1A1AA | texto secundário | 8,2:1 sobre #000; 7,4:1 sobre #111 |
| `chrome-*` | gradiente prata | destaque do hero e filetes | texto claro, sempre acima de 7:1 |

**Tipografia:** manter Manrope (corpo) e Space Grotesk (títulos), já adotadas. Escala fixa: `display` 56/64 px, `h1` 40, `h2` 32 a 44, `h3` 20, `body` 17 a 18, `small` 14. **Mínimo de 14 px em qualquer texto**, o que elimina os 12 px atuais.

**Espaçamento:** base de 4 px; ritmo de seção `py-24` (mobile `py-16`); container 72rem com gutter 20/32 px.

**Raios:** `sm` 8, `md` 12, `lg` 16, `xl` 24, `full` para botões.

**Sombras:** só duas. `ring` (anel de 1 px interno, sem desfoque) e `lift` (sombra preta curta para cards elevados). Sem glow colorido.

**Movimento:** durações 150 / 250 / 600 ms; curva única `cubic-bezier(0.22, 1, 0.36, 1)`; deslocamentos de no máximo 12 px.

**Estados interativos:** foco = anel branco 2 px com offset 3 px (já existe); hover = sobe um degrau de superfície; ativo = volta um degrau; desabilitado = 60% de opacidade com cursor bloqueado.

### 2.2 Estrutura da página

| # | Seção | Resumo |
| --- | --- | --- |
| 1 | Header | Wordmark, 4 links, CTA. Fundo transparente que ganha `surface` com filete ao rolar. |
| 2 | Hero | Texto à esquerda, cubo à direita, luz rasante chrome atrás. |
| 3 | Soluções | Grade Bento assimétrica com 4 cards e miniatura gráfica em cada um. |
| 4 | Demonstrações | "Tecnologia aplicada ao seu negócio." Três painéis conceituais com abas. |
| 5 | Como ajudamos | Reaproveita os 5 benefícios, em formato mais compacto. |
| 6 | Projetos | Configurável por dados; estado vazio honesto. |
| 7 | Contato | "Seu próximo projeto começa com uma conversa." Os três canais e, logo abaixo, o formulário (D1). |
| 8 | Footer | Wordmark, links, Instagram. |
| — | Sobre | Adiada (D2). Não entra nesta rodada. |

### 2.3 Hero

- **Copy do briefing:** eyebrow "TECNOLOGIA & SOLUÇÕES EM SOFTWARE", headline "Tecnologia que resolve problemas reais.", descrição e CTAs conforme o texto fornecido.
- **Composição desktop:** texto em 7 colunas, cubo em 5 colunas, levemente sangrando para fora do container; faixa de luz rasante em gradiente cônico muito sutil atrás dele (CSS puro).
- **Mobile:** texto primeiro, cubo abaixo a 80% da largura, recortado pela borda inferior da seção para sugerir continuidade. CTAs em largura total.
- **Animação:** entrada única, ~600 ms (texto sobe 12 px com fade, cubo entra com fade e escala de 0,96 para 1). **Sem oscilação infinita.** Sob `prefers-reduced-motion`, nada se move.
- **Imagem:** `fetchPriority="high"` e `loading="eager"` no lugar de `priority`. Será gerada uma variante menor (~900 px) para mobile; o PNG de 1,5 MB deixa de ser a fonte direta do hero.
- **Decisão sobre WebGL: não.** O ativo é uma imagem. Um modelo 3D teria de ser criado e otimizado do zero (e seria "fingir que existe" um modelo). Três.js adicionaria centenas de KB de JavaScript, custo de GPU e risco para LCP, para um ganho que a imagem já entrega. Reavaliar apenas se a marca fornecer um modelo `.glb` real.

### 2.4 Soluções (Bento)

Grade de 6 colunas, assimétrica. Cada card tem: título, benefício comercial em destaque, explicação em duas linhas, e uma **miniatura em HTML/CSS** (sem ícone gigante):

1. **Websites e aplicações:** moldura de navegador com blocos de página (cabeçalho, bloco de destaque, botão). Card largo, 4 colunas.
2. **Sistemas sob medida:** painel com linhas de tabela e um filtro. 2 colunas.
3. **APIs e integrações:** três nós ligados por linhas finas (sistema A, API, sistema B). 2 colunas.
4. **Automação de processos:** sequência "gatilho, regra, ação" em três passos. 4 colunas.

Hover: o card sobe um degrau de superfície, o filete superior chrome se acende e a miniatura se desloca 4 px. As miniaturas são decorativas (`aria-hidden`); o conteúdo útil está no texto.

### 2.5 Demonstrações

Seção "Tecnologia aplicada ao seu negócio.", com três painéis (Website comercial, Automação empresarial, Sistema de gestão), em abas acessíveis (`role="tablist"`).

- Cada painel é uma **interface montada em HTML/CSS**, não uma captura de projeto.
- **Todo painel traz o selo "Demonstração conceitual"**, visível e lido por leitor de tela.
- Sem logos, nomes de clientes, depoimentos ou números de resultado. Dados fictícios genéricos ("Pedido 0001", "Cliente exemplo") e rotulados.
- Quando houver mockups reais de projetos, entram em `src/content/projects.ts` e o selo some só nesses itens.

### 2.6 Portfólio

`Project` ganha `category`, `summary` e `images[0]` obrigatória para exibição em destaque. Cartão com imagem grande 16:10, categoria, problema, solução, tecnologias e link. Lista vazia continua mostrando o aviso atual; **nenhum case fictício**.

### 2.7 Movimento

- **Reveal ao entrar na viewport:** um componente client mínimo (`Reveal`, ~1 KB) com `IntersectionObserver`. O conteúdo é visível por padrão; só se oculta depois da hidratação e apenas o que está fora da tela, evitando flash e garantindo leitura sem JavaScript.
- Hover de cards e botões: CSS.
- **Remover a dependência `motion`**, que não será necessária. Sem scroll hijacking, parallax ou efeitos de mouse.

## 3. Componentes

### 3.1 Reaproveitar sem alteração

`Container`, `Wordmark` (ajuste só quando o símbolo chegar), `site.ts`, `services.ts`, `benefits.ts` (textos), `whatsapp.ts`, estrutura de `projects.ts`, `contact.ts` (canais), `robots.ts`, `sitemap.ts`.

### 3.2 Modificar

| Arquivo | Mudança |
| --- | --- |
| `globals.css` | Tokens completos, utilitários `chrome-text` e `chrome-line`, regras de movimento |
| `layout.tsx` | Mantém fontes; corrige F01 |
| `site.ts` | Validação da URL do site (F01); nova copy do hero |
| `Header.tsx`, `MobileNav.tsx` | Estado "rolado"; painel com altura máxima e rolagem interna (F04) |
| `Hero.tsx` | Nova composição, entrada animada, `fetchPriority` |
| `Button.tsx` | Variante `secondary` com borda `control`; superfície elevada no primário |
| `SectionHeader.tsx` | Eyebrow a 14 px; escala nova |
| `Services.tsx` | Bento com miniaturas |
| `Benefits.tsx` | Versão mais compacta |
| `Portfolio.tsx`, `ProjectCard.tsx` | Categoria e imagem grande |
| `Contact.tsx` | Nova copy; ver D1 |
| `Footer.tsx` | Instagram e links |
| `opengraph-image.tsx` | Novo texto e cubo |
| Testes | Atualizar textos; adicionar os novos |
| `CLAUDE.md`, `ARCHITECTURE.md` | Alinhar com o estado real |

### 3.3 Criar

`ui/Card`, `ui/Badge`, `ui/Reveal`, `lib/site-url.ts` (criados na Fase 2); `ui/Tabs`, `sections/Demos`, `sections/ContactForm`, `lib/contact.ts` e `lib/contact-action.ts`, `sections/bento/*` (quatro miniaturas), nas fases seguintes.

## 4. Decisões que preciso de você

Estas decisões mudam o escopo. **Recomendo o padrão em negrito; sigo com ele se você apenas aprovar o plano.**

- **D1 — Contato (resolvida: canais + formulário depois deles).** O briefing pede formulário com validação, loading e feedback. O estado atual removeu o formulário e deixou três canais, com teste afirmando que não há formulário. Opções: **(a) manter os três canais e acrescentar o formulário** (o formulário só envia com `CONTACT_WEBHOOK_URL` real; sem ela avisa que está indisponível, nunca finge sucesso), ou (b) só os canais. Se (a), incorporo as correções F02 (borda de campo a 3:1) e F03 (preservar dados sem JavaScript).
- **D2 — Sobre (resolvida: adiada).** O briefing pede a seção com três integrantes; o estado atual a removeu. Opções: **(a) restaurar com valores da empresa e três espaços de integrante claramente marcados como pendentes**, ou (b) deixar fora. Em ambos os casos, nenhuma credencial será inventada.
- **D3 — Símbolo circular N.** Não está no repositório. Opção: **você envia o arquivo e eu o aplico no header e no footer; até lá, o wordmark de texto permanece**.
- **D4 — Headline.** O briefing atual traz "Tecnologia que resolve problemas reais.", diferente do texto da V1 ("Seu negócio evolui. A tecnologia acompanha."). **Usarei a nova**, e ajustarei o título da seção de Projetos ("Problemas reais, soluções sob medida.") para não repetir a expressão.
- **D5 — Commit de segurança (resolvida em 18/10/2026: commitado).** Antes, todo o trabalho estava sem commit. **Recomendo commitar o estado atual como linha de base antes da Fase 2**, em um commit só. Só faço com a sua autorização.

## 5. Plano de implementação

Cada fase termina com lint, typecheck, build, testes, relatório curto e correção do que for achado. Commits só após sua aprovação.

| Fase | Entrega | Arquivos principais |
| --- | --- | --- |
| **0** ✅ | Commits de linha de base (D5), autorizados em 18/10/2026 | `12f1f50`, `1232013` e commit de docs |
| **1** | Este documento e alinhamento de `CLAUDE.md` e `ARCHITECTURE.md` | `docs/` |
| **2** ✅ | Design system: tokens, `Card`, `Badge`, `Reveal`, `Button` novo; correção F01; remoção de `motion` | `globals.css`, `ui/*`, `site.ts`, `lib/site-url.ts`, `package.json` |
| **3** | Header (com F04) e Hero | `Header`, `MobileNav`, `Hero`, imagem otimizada |
| **4** | Soluções (Bento) e Demonstrações | `Services`, `bento/*`, `Demos`, `Tabs` |
| **5** | Portfólio e Contato (canais + formulário). Sobre adiada | `Portfolio`, `ProjectCard`, `Contact`, `ContactForm`, `projects.ts` |
| **6** | Microinterações e refinamento visual, Open Graph | `Reveal` aplicado, `opengraph-image.tsx` |
| **7** | Testes, performance e acessibilidade | `tests/e2e/*`, auditoria axe, Lighthouse |

**Decisão sobre testes:** `@axe-core/playwright` (dependência de desenvolvimento) para auditar acessibilidade na Fase 7 **continua dependendo de aprovação específica**; sem ela, a auditoria será manual e por testes de Playwright.

## 6. Critérios de aceitação

**Visual e conteúdo**
- Fundo #000000 em toda a página; brilho metálico só no cubo, no destaque do hero e nos filetes de card.
- Hero com a copy do briefing e o cubo legível em 320, 390, 768, 1024 e 1440 px, sem sobrepor texto nem bloquear cliques.
- Bento com os quatro cards, cada um com benefício comercial, explicação e miniatura.
- Demonstrações identificadas como "Demonstração conceitual"; nenhum cliente, depoimento ou número inventado.
- Portfólio sem cases fictícios; estrutura aceita um projeto real só editando `projects.ts`.

**Acessibilidade (WCAG 2.2 AA)**
- Texto com 4,5:1 ou mais; controles e seus limites com 3:1 ou mais; nenhum texto abaixo de 14 px.
- Todo o fluxo por teclado, foco sempre visível e nunca coberto pelo header fixo.
- Menu mobile alcançável por inteiro em 568×320, 667×375 e retrato.
- `prefers-reduced-motion: reduce` elimina todo deslocamento e animação de entrada.
- Zero violações no axe nas páginas e estados principais.

**Técnico**
- `npm run lint`, `npm run typecheck`, `npm run build` e `npm run test:e2e` limpos, sem tolerar falhas.
- Build não quebra com `NEXT_PUBLIC_SITE_URL` vazio ou inválido, e nunca publica `localhost` em produção (F01).
- JavaScript de cliente limitado a menu, `Reveal`, abas e (se D1 = a) formulário.
- LCP do hero e CLS medidos com Lighthouse em perfil mobile; meta: LCP abaixo de 2,5 s e CLS abaixo de 0,1 no ambiente de teste. Não será declarado "aprovado em Core Web Vitals" sem dados de campo.
- Imagem do hero entregue em tamanho adequado ao dispositivo, abaixo de 150 KB no mobile.
- Nenhum segredo em componentes client.

**Processo**
- Relatório de cada fase em `docs/reviews/` para o Codex.
- Nenhum deploy sem autorização.
