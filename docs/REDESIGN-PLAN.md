# Plano revisado do redesign

Status: **aprovado com ajustes em 18/10/2026. Fase 3A implementada; aguarda a validação visual do responsável (portão 3B).**

**Decisões do responsável (18/10/2026):**

- **D6:** Direção **A** como principal, com os diagramas técnicos e as demonstrações da **B** e, da **C**, apenas a assinatura (trilhos cromados, pequenos detalhes líquidos, transições).
- **D7:** testar as duas tipografias e comparar. **Feito** (`docs/reviews/assets/fase-3a/tipografia-comparacao.png`); a escolha segue **pendente**.
- **D8:** APIs e integrações primeiro. **Implementado.**
- **D9:** prata e gelo; âmbar só como reflexo discreto (usado em um único ponto: a luz da ficha "Fluxo ativo").
- **D10:** PNG original preservado, derivados só quando necessário. **Não foram necessários**: a imagem chega com 46 KB e o reflexo reaproveita o mesmo arquivo.
- **D11:** CSS e SVG; sem Motion até haver necessidade medida.
- **Requisitos adicionais:** cada serviço com ilustração própria e tecnicamente coerente; interfaces demonstrativas; diagramas interativos; componentes exclusivos; **textos mais curtos e mais gráfico do que texto** (pedido durante a Fase 3A).

Durante a fase o responsável pediu para manter a introdução original e depois retirou o pedido; o hero cinematográfico foi mantido. A introdução original continua no commit `fb65d08` e o experimento anterior à retratação na branch `proto/hero-estudio-de-luz`, se ainda existir.
Depende de: `docs/CREATIVE-DIRECTION.md` (as três direções e a recomendação) e `docs/ILLUSTRATION-SYSTEM.md` (linguagem de ilustração). Escrito para a **Direção A**; os itens que dependem da escolha estão marcados.

## 1. Relação com o plano anterior (`docs/DESIGN-REDESIGN.md`)

| Continua valendo | Substituído por este plano |
| --- | --- |
| Fase 2 (design system, componentes-base, F01), decisões D1 a D5, critérios de acessibilidade e de processo, honestidade de conteúdo, ausência da seção Sobre, WebGL descartado por padrão | A proposta visual (seções 2.2 a 2.6 do plano anterior: hero de imagem ao lado do texto, grade 2×2, demonstrações em abas escuras) e as **fases 3 a 7** |

O `DESIGN-REDESIGN.md` ganha um aviso apontando para este documento quando a direção for aprovada.

## 2. Código existente: reutilizar, mudar, criar

| Reutilizar | Mudar | Criar |
| --- | --- | --- |
| Tokens de superfície, texto, `control`, `line`; escala tipográfica; `Reveal`; `Button`; `Container`; `Badge`; `site-url`; `src/content/`; infraestrutura de testes; menu mobile (comportamento) | `Header` (estado rolado, F04); `Hero` (nova composição); `Services` (ilustrações); `Benefits` (editorial); `Portfolio` e `ProjectCard` (categoria, imagem grande); `Contact` (+ formulário depois dos canais); `Footer`; `Card` (variante com faceta e borda cromada); `SectionHeader`; `globals.css` (tokens novos) | `src/components/illustrations/` (hero, quatro serviços, `shared/`); `ui/Facet`; `sections/Demos` (abas); trilho cromado; derivados do cubo (reflexo e versões leves); `src/content/hero.ts` e textos das demonstrações; testes de abas, ilustração e orçamento |

## 3. Design system: mudanças propostas

### Tokens novos (valores a validar no protótipo; contrastes já medidos)

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `graphite-1` / `-2` / `-3` | #141416 / #1C1C20 / #26262B | Superfícies de seções alternadas | texto secundário 7,2 / 6,6 / 5,9:1 |
| `control-strong` | #8A8A93 | Borda de controle sobre grafite | 5,4 / 5,0 / 4,4:1 sobre `graphite-1/2/3` |
| `paper` / `paper-ink` | #F4F4F5 / #09090B | Painel claro de contraste | 18,1:1 |
| `light-ice` | #8FB4FF | Luz/reflexo frio **[A]** | 10,1:1 sobre preto |
| `light-amber` | #F5C88A | Luz/reflexo quente raro **[A]** | 13,5:1 sobre preto |
| `gradient-chrome-edge`, `gradient-chrome-fill` | gradientes de cromo | Bordas e preenchimentos metálicos | decorativo |
| `shadow-float` | sombra preta profunda e curta | Fichas flutuantes | n/a |
| `grain` | tile de 64 px (≤ 3 KB) | Textura em planos grandes | n/a |

`graphite-3` é o teto de claridade das superfícies de controle (acima de #2E2E34 o `control` falha em 3:1).

### Regras que mudam (em `AGENTS.md` e `docs/design.md`)

| Regra atual | Regra proposta |
| --- | --- |
| "Brilho metálico só no cubo, no destaque do hero e em filetes de cards" | "Luz e brilho têm finalidade narrativa: no máximo **um foco de luz por tela**; texto nunca sobre o pico de luz; luz decorativa nunca carrega informação" |
| "Sem neon, glassmorphism ou brilho em todos os componentes" | **Mantida**, com a ressalva de que vidro existe só como material **em ilustrações** (fichas), nunca como estilo padrão de container; sem `backdrop-filter` |
| "Animação em CSS ou `Reveal`; sem animação infinita…" | **Mantida.** Acrescenta: diagramas rodam uma vez ao entrar na tela; repetem só por interação |
| (inexistente) | **Texto informativo ≥ 14 px; texto menor só como barra de esqueleto.** Ilustração decorativa `aria-hidden`; demonstração rotulada "Demonstração conceitual" |

As regras só mudam **depois da sua aprovação**; até lá valem as atuais.

### Tipografia

Mantém Manrope e Space Grotesk. O protótipo testará uma serifa de exibição só no `h1` (variável de CSS) para a sua decisão D7. Fonte monoespaçada só se adotada para rótulos técnicos (orçamento: 1 fonte).

### Dependências

**Nenhuma nova no início.** Motion: CSS cobre entrada, hover, troca de abas e fluxo de traço em SVG. A biblioteca só entra se uma interação **medida** não puder ser feita em CSS, e então carregada sob demanda (orçamento de JS no `ILLUSTRATION-SYSTEM.md`). `@axe-core/playwright` continua sem aprovação.

### Ativos

Derivados do `public/images/noxora-icon.png` (reflexo espelhado esmaecido, versões AVIF e WebP em tamanhos para celular e desktop) **sem alterar o original**. Se a marca fornecer outros ângulos do cubo (D10), a composição é revista.

## 4. Composição e ritmo, seção a seção **[A]**

A superfície alterna para criar ritmo; nenhuma seção repete a anterior.

| # | Seção | Superfície | Composição | Ilustração e interação | Acessibilidade e desempenho |
| --- | --- | --- | --- | --- | --- |
| 1 | **Header** | Transparente → `surface` com filete cromado ao rolar | Wordmark, 3 links (Soluções, Projetos, Contato), CTA | Estado rolado com componente cliente mínimo | Painel mobile com altura máxima e rolagem interna (F04); foco visível |
| 2 | **Hero** | Preto absoluto | Texto à esquerda, palco do cubo à direita sangrando; trilhos, sem fichas de texto | Entrada orquestrada de ~1 s, uma vez | LCP é o cubo; eager e `fetchPriority`; estático sem JS; estático com movimento reduzido |
| 3 | **Soluções** | Grafite `graphite-1` | Cabeçalho editorial à esquerda; quatro peças em grade **assimétrica** (duas largas, duas estreitas), cada uma com ilustração e legenda | Micro-animação de uma passada por peça, ao entrar | Legenda em texto; decorativas `aria-hidden`; carregamento tardio |
| 4 | **Tecnologia aplicada ao seu negócio.** (demonstrações) | Preto, com painel "papel" na demonstração | Janela grande com faceta; abas à esquerda no desktop e em faixa no celular | Abas acessíveis trocam a demonstração | Sem JS: quatro painéis visíveis; rótulo "Demonstração conceitual" |
| 5 | **Como ajudamos** | Preto com muito espaço negativo | **Gráfico antes/depois** (ferramentas soltas → operação conectada) e cinco rótulos curtos; sem cartões nem colunas fixas | O trilho cromado acende um ponto por item | Texto sobre preto; sem animação obrigatória |
| 6 | **Projetos** | Grafite `graphite-2` | **Vitrine em carrossel manual** (prévia grande, categoria, problema, solução e tecnologias; demonstrações conceituais rotuladas até haver casos reais; aviso honesto sem itens) | Hover discreto; sem cases fictícios | Estrutura configurável por dados; imagens com proporção reservada |
| 7 | **Contato** | Preto com o **selo** do cubo | Três canais primeiro, **formulário depois** (D1); fecho da página | Trilho cromado termina no selo | Formulário acessível; nunca exibir sucesso sem confirmação real |
| 8 | **Footer** | `surface` | Wordmark, links, Instagram | n/a | n/a |

O título "Tecnologia aplicada ao seu negócio." fica na seção 4. A seção de soluções atual, que hoje usa o título "Tecnologia aplicada ao que move a sua empresa.", ganha outro: proposta "Soluções sob medida para cada etapa do seu negócio."

## 5. Plano revisado em fases, com portões

Cada fase termina com: `npm run check`, relatório curto em `docs/reviews/`, revisão independente (seção 7), correção do que for achado e commit.

| Fase | Entrega | Portão |
| --- | --- | --- |
| **3A. Protótipo de alta fidelidade** ✅ | **Header** (estado rolado e F04), **Hero** (nova composição, derivados do cubo, `fetchPriority`, `src/content/hero.ts`) e **um serviço ilustrado** (APIs e integrações, D8) em página de prova | Você valida o visual |
| **3B. Validação visual** | Capturas desktop e mobile (incluindo 568×320 e 667×375), medição de LCP, CLS e peso com `lighthouse_audit`, verificação de movimento reduzido e sem JavaScript, revisão com `web-design-guidelines` | **Aprovação do protótipo** antes de seguir |
| **4. Como ajudamos, Projetos e Contato** ✅ | **Executada em 18/10/2026 por pedido do responsável** (que aprovou a introdução e a aba Soluções como estão): Como ajudamos como um único gráfico antes/depois com cinco rótulos (revisto no mesmo dia para ficar mais óbvio e curto); Projetos com estado gráfico honesto e cartão de projeto real redesenhado; Contato com selo do cubo, três peças de canal lado a lado e **formulário** abaixo (validação, envio, erro, valores preservados) | Revisão independente (Codex e revisor de segurança) |
| **5. Ilustrações restantes e demonstração interativa** | As três ilustrações de serviço que faltam (Websites, Sistemas, Automações) e a demonstração "Tecnologia aplicada ao seu negócio.". **Adiadas:** o responsável gostou da aba Soluções como está; retomar só com a sua confirmação | Revisão independente |
| **6. Ritmo e refinamento** | Trilho cromado e selo, transições entre seções, imagem de compartilhamento (OG) com a composição do cubo, microinterações | Revisão visual |
| **7. Testes, desempenho e acessibilidade** | Suíte completa, medição final, auditoria manual de acessibilidade (axe só se você aprovar a dependência) | Aceite final |

Conforme combinado: **protótipo → validação visual → demais seções**, e só então a revisão independente da página completa.

## 6. Verificação e testes novos

- **Estrutura e conteúdo:** `h1` único com a nova headline, rótulos de demonstração presentes, nenhum nome, logo ou número de resultado inventado.
- **Acessibilidade:** abas por teclado (setas, `Home`, `End`, `Enter`, `Espaço`), `aria-selected` e `aria-controls`; decorativas com `aria-hidden`; menu mobile alcançável por inteiro em 568×320 e 667×375 (F04); foco nunca coberto pelo header.
- **Progressividade:** com movimento reduzido nada se move; sem JavaScript todo o conteúdo e as quatro demonstrações ficam visíveis.
- **Layout:** sem overflow horizontal em 320, 390, 768, 1024 e 1440 px; proporção das ilustrações reservada (CLS 0 causado por elas).
- **Desempenho:** orçamento do `ILLUSTRATION-SYSTEM.md` verificado por `next analyze` e `lighthouse_audit`; resultado registrado em cada relatório de fase, com os números reais.
- Os testes existentes continuam; os que citam o texto antigo do hero e da seção de soluções serão atualizados.

## 7. Revisão independente

- **Por fase:** revisor de contexto limpo, somente leitura, com capacidade suficiente (segurança e acessibilidade). Já usado na adoção do toolkit.
- **Codex:** o plugin `codex-flow` está instalado e oferece revisão (`codex_review`). Antes de depender dele, verificar a saúde e o login com `codex_health`; sem Codex disponível, o revisor de contexto limpo substitui e a limitação é registrada. Nenhuma revisão Codex foi executada ainda.
- **Critério de término:** achados relevantes resolvidos ou justificados, checagens afetadas passando, cobertura e riscos residuais registrados. Rodadas extras só com nova evidência.

## 8. Commits

Um ou mais commits por fase (código e documentação separados), na branch atual, com checagens verdes antes de cada um. Nada é publicado sem autorização.

## 9. Riscos e mitigação

| Risco | Probabilidade | Mitigação |
| --- | --- | --- |
| Virar "preto com brilho" sem personalidade | Média | Regras de luz (um foco por tela), dispositivos próprios (faceta, trilho, camadas, selo) e validação visual no portão 3B |
| Peso e CPU das ilustrações | Média | Orçamento por peça, SVG sem filtros, carregamento tardio, animação só ao entrar na tela, medição em cada fase |
| Um único ângulo do cubo limita a composição | Alta | Composição por camadas e oclusão; pedir outros ângulos (D10) |
| Texto sobre luz com contraste insuficiente | Baixa | Regra "texto nunca sobre o pico de luz"; conferir o pior caso por ponto |
| Demonstração parecer cliente ou resultado real | Média | Rótulo obrigatório, dados fictícios genéricos, teste que busca números de resultado |
| Ilustrações dependerem de JavaScript | Baixa | Estado final estático no HTML; abas como aprimoramento progressivo |
| Escopo crescer (ilustração infinita) | Média | Portões; quatro peças de serviço, um hero, uma demonstração, nada além |

## 10. Critérios de aceitação

- **Visual:** a página tem ritmo (pelo menos três superfícies e três composições diferentes ao longo da rolagem), identidade reconhecível (faceta, trilho, camadas e selo presentes) e o hero comunica a proposta comercial de imediato.
- **Conteúdo:** copy comercial clara para um leigo; demonstrações rotuladas; nada inventado.
- **Acessibilidade (WCAG 2.2 AA):** contrastes medidos, teclado completo, foco visível e não coberto, movimento reduzido respeitado, conteúdo visível sem JavaScript.
- **Desempenho:** dentro do orçamento; LCP, CLS e peso medidos e registrados (sem declarar aprovação de Core Web Vitals sem dados).
- **Processo:** relatório e revisão independente por fase, commits com checagens verdes, nenhuma publicação sem autorização.

## 11. Decisões (detalhe em `CREATIVE-DIRECTION.md`, seção 7; resolvidas em 18/10/2026, exceto D7)

- **D6** direção (recomendada: A); **D7** serifa no título do hero (recomendado: testar no protótipo); **D8** serviço do protótipo (recomendado: APIs e integrações); **D9** luz colorida (recomendado: prata e gelo, âmbar raro); **D10** novos ângulos do cubo ou derivados do PNG atual (recomendado: derivados); **D11** Motion (recomendado: só se medido).
