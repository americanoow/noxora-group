# Design e acessibilidade

## Direção

Público: decisores de negócios com níveis variados de familiaridade técnica (ver `PRODUCT.md`). A interface precisa ser marcante e, ao mesmo tempo, legível para quem não conhece programação. Direção aprovada em 18/10/2026: **"Liquid Engineering", Estúdio de Luz** (`docs/CREATIVE-DIRECTION.md`), com diagramas técnicos da Planta Técnica nas demonstrações e o trilho cromado da Metal Fluido só como assinatura. Composição cinematográfica, com profundidade, luz e reflexo; texto curto e mais gráfico do que texto. Sem neon, gradientes coloridos genéricos, glassmorphism como estilo de container ou brilho em todos os componentes.

Referências de princípio (sem copiar código, layout ou texto): clareza editorial e navegação mínima do Linear; componentes sóbrios e bordas sutis do Resend. A decisão de não usar WebGL e o plano em fases estão em `docs/DESIGN-REDESIGN.md`.

## Sistema existente

Fonte da verdade dos valores: `src/styles/globals.css` (`@theme`). Este documento não repete os valores, para não competir com o arquivo.

- **Superfícies:** `ink` (#000), `surface`, `surface-2`, `surface-3`, em degraus; hover sobe um degrau.
- **Bordas:** `line` é **decorativa** (contraste ~1,4:1) e nunca delimita controle; controles interativos usam `control` (≥ 3:1 sobre as superfícies, WCAG 1.4.11).
- **Texto:** `fg` (principal) e `muted` (secundário, ≥ 7:1 sobre as superfícies). **Nenhum texto abaixo de 14 px.**
- **Tipografia:** Manrope (corpo), Space Grotesk (títulos); escala `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`.
- **Forma e espaço:** `py-section`, raios `sm`/`md`/`lg`/`xl`, sombras `ring` e `lift` (sem brilho colorido).
- **Movimento:** durações `fast`/`base`/`slow` e uma curva; deslocamentos de no máximo 12 px.
- **Utilitários:** `.chrome-text` (texto metálico), `.chrome-line` (filete no topo de card).
- **Componentes base** (`src/components/ui/`): `Button`/`ButtonLink` (`primary`, `secondary`, `ghost`), `Card`, `Badge`, `Reveal`, `SectionHeader`, `Container`, `Wordmark`, e os da Fase 3A: `Facet` (moldura com canto chanfrado e borda cromada), `RailDivider` (trilho cromado entre seções) e `PlayFigure` (figura animada ao entrar na tela, com botão Repetir). Ilustrações em `src/components/illustrations/` (palco do hero e APIs e integrações). Tokens novos: `graphite-1/2/3`, `control-strong` (controle sobre grafite), `light-ice`, `light-amber`, `shadow-float`.

## Interação

- HTML semântico, navegação por teclado completa e foco visível sem alterar o raio do elemento (anel branco de 2 px, offset de 3 px). Foco nunca fica coberto pelo header fixo (`scroll-padding-top`).
- Rótulos em todos os controles e campos; erro de validação ao lado do campo e anunciado; operações assíncronas mostram progresso e resultado. Nunca exibir sucesso sem confirmação real.
- Movimento: CSS ou `Reveal`; sem animação infinita, parallax, efeitos de mouse que atrapalhem ou scroll hijacking. `prefers-reduced-motion: reduce` elimina deslocamento e animação de entrada. Sem JavaScript, nenhum conteúdo fica oculto.
- Links externos abrem em nova aba com `rel="noopener noreferrer"` e aviso acessível.

## Layout e revisão

- Mobile-first. Larguras de referência para revisão: 320, 390, 768, 1024 e 1440 px; telas baixas: 568×320 e 667×375.
- Estados existentes: portfólio vazio (aviso honesto), canal de contato pendente ("Em breve"), menu mobile aberto.
- Estados da Fase 3A: header transparente no topo e com superfície ao rolar; menu mobile com rolagem interna em telas baixas; ilustração animada, estática (sem JavaScript ou movimento reduzido) e repetida pelo botão.
- Estados da Fase 4: formulário com campo inválido (erro ao lado do campo, foco no primeiro), enviando, erro de entrega, indisponível e sucesso; seção Projetos como vitrine (carrossel manual de demonstrações conceituais rotuladas; um projeto sem controles; nenhum, aviso honesto); Como ajudamos como gráfico antes/depois com cinco rótulos, sem coluna fixa; Contato com três peças de canal lado a lado e formulário abaixo.
- Revisões concluídas: capturas em desktop e celular nas fases 2 e 3A; Lighthouse mobile da Fase 3A (acessibilidade, boas práticas e SEO 100, auditoria automatizada); LCP e CLS medidos em laboratório (ver `docs/quality.md`). **Não existe** auditoria axe, dado de campo de Core Web Vitals nem teste com leitor de tela real.
- Antes de concluir mudanças de interface: use a skill `web-design-guidelines`; para prosa, `writing-guidelines`.

## Manutenção

Mudanças visuais e de interação atualizam a fonte dos tokens/componentes e este documento quando uma regra muda.
