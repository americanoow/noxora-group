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
- Movimento: CSS ou `Reveal`. Loops permitidos por decisão do responsável (19/10/2026), com pausa longa entre ciclos, só enquanto visíveis e só com JavaScript (`<html data-motion="on">`); `MotionToggle` no rodapé pausa tudo (WCAG 2.2.2) e `prefers-reduced-motion` desliga os loops. Sem parallax, scroll hijacking nem efeitos de mouse que atrapalhem. `prefers-reduced-motion: reduce` elimina deslocamento, animação de entrada e loops. Sem JavaScript, nenhum conteúdo fica oculto e nada anima em loop.
- Links externos abrem em nova aba com `rel="noopener noreferrer"` e aviso acessível.
- Nome no cabeçalho: as letras se afastam horizontalmente do centro até 12 px e voltam juntas. A expansão e o retorno duram 1,2 s e repetem a cada 6 s. O nome permanece legível, sem movimento vertical. Sem JavaScript, com animações pausadas ou movimento reduzido, as letras ficam imóveis; o nome no rodapé permanece estático.
- Botões e canais de contato sobem até 4 px ao passar o mouse ou receber foco; ícones acompanham a ação. Links do cabeçalho e rodapé recebem sublinhado. Cards de soluções elevam a composição sem se tornarem controles; os ícones dos benefícios respondem ao mouse. No toque, botões respondem ao pressionar, sem depender de hover.
- Hero: o texto faz um encaixe de 10 px sem desaparecer. O cubo sobe 8 px e retorna em uma passagem curta a cada 9 s, só enquanto visível. O menu mobile abre com deslocamento de 8 px e mantém fechamento por Escape e retorno de foco.
- A pausa cancela entradas, loops, transições e a rolagem suave do carrossel. Mudanças de preferência de movimento e visibilidade da aba são acompanhadas em tempo real. Ilustrações pausadas voltam ao estado final; o cubo, o selo e os trilhos deixam de repetir fora da tela. Regras de interação ficam em `src/styles/interactions.css`, usando os tokens globais.
- A vitrine exibe somente os três projetos reais construídos, com captura em destaque, tipo, nome, uma frase factual curta (`summary`) e o link externo "Visitar site". Objetivo e solução ficam em "Ver detalhes", um `<details>` nativo (teclado, leitor de tela e sem JavaScript). O rótulo "Projeto Noxora" identifica a autoria confirmada pelo responsável. Tecnologias não confirmadas não são exibidas. Não há vídeo, player nem aviso de vídeo.

## Layout e revisão

- Mobile-first. Larguras de referência para revisão: 320, 390, 768, 1024 e 1440 px; telas baixas: 568×320 e 667×375.
- Estados existentes: portfólio vazio (aviso honesto), canal de contato pendente ("Em breve"), menu mobile aberto.
- Estados da Fase 3A: header transparente no topo e com superfície ao rolar; menu mobile com rolagem interna em telas baixas; ilustração animada, estática (sem JavaScript ou movimento reduzido) e repetida pelo botão.
- Estados da Fase 4: formulário com campo inválido (erro ao lado do campo, foco no primeiro), enviando, erro de entrega, indisponível e sucesso; seção Projetos como vitrine (carrossel manual dos sites reais; um projeto sem controles; nenhum, aviso honesto); Soluções em dois níveis, sempre com título e benefício antes da figura: websites (desktop e celular, com pares de blocos que se acendem) e sistemas (pedido que avança de coluna) com o mesmo destaque (uma moldura chanfrada cada), e integrações (informação que percorre três ferramentas) e automação (um relatório, duas ações confirmadas) mais compactas e abertas, só com uma linha de separação. "Demonstração conceitual" fica junto de cada figura, e "Repetir" é um botão discreto, sem moldura, com área de toque de 44 px. As figuras de uma mesma tela tocam uma de cada vez (fila em `playQueue.ts`), com pausa longa (18 s) entre ciclos; Como ajudamos como uma demonstração ampla, "Do pedido recebido à equipe avisada" (título e apoio curto; uma faixa de três passos no desktop e uma coluna no celular, sem caixas internas além da mensagem). A sequência toca uma vez ao entrar na tela, com destaque discreto (cor e preenchimento, sem mudar o layout), e "Repetir" recomeça só ela; repouso, sem JavaScript e movimento reduzido mostram os três passos completos. Não há frase lateral nem etiquetas de benefícios; Contato compacto, com três peças de canal enxutas lado a lado e o formulário como único bloco chanfrado. A luz da cena do hero passa atrás do cubo a cada 14 s (só com movimento ligado), sem tocar o texto; o cubo é uma imagem estática, então só a cena e a posição animam.
- Revisões concluídas: capturas em desktop e celular nas fases 2 e 3A; Lighthouse mobile da Fase 3A (acessibilidade, boas práticas e SEO 100, auditoria automatizada); LCP e CLS medidos em laboratório (ver `docs/quality.md`). **Não existe** auditoria axe, dado de campo de Core Web Vitals nem teste com leitor de tela real.
- Antes de concluir mudanças de interface: use a skill `web-design-guidelines`; para prosa, `writing-guidelines`.

## Manutenção

Mudanças visuais e de interação atualizam a fonte dos tokens/componentes e este documento quando uma regra muda.


## Atualização de 23/10/2026

Soluções passa a usar um acordeão nativo (um painel por vez), com benefício, aplicações e demonstração. Como ajudamos dá lugar a quatro etapas de trabalho. Projetos aparecem em sequência editorial, com imagens amplas e alternância no desktop. Reveal, pausa global e movimento reduzido permanecem; abertura e contato preservados. Referências 21st.dev e Uiverse usadas como direção de movimento; nenhum código externo ou dependência adicionada.


## Demonstrações com referências 21st.dev e Uiverse — 23/10/2026

Websites agora usa navegador e celular com ilustração editorial de arquitetura; Sistemas mostra uma lista de pedidos e uma confirmação; Integrações conecta três entradas ao cubo e ao sistema com Animated Beam e uma órbita curta; Automação apresenta eventos sequenciais e uma notificação de conclusão. São demonstrações conceituais, com dados genéricos em `src/content/service-scenes.ts`.

As referências Safari, Animated Beam, Animated List, Orbiting Circles, notificação, check e botão foram adaptadas ao CSS e ao PlayFigure existente, sem novas dependências. Créditos e licenças em THIRD_PARTY_NOTICES.md. Estilos isolados em service-scenes.css; nenhuma alteração no hero ou no contato. Estado estático completo sem JavaScript e com movimento reduzido; pausa global e execução somente enquanto visível preservadas. Context7 não está disponível nesta sessão; foram consultadas a documentação Next instalada e as fontes oficiais dos componentes.


As imagens dos projetos com captura e URL agora são links para o site correspondente, em nova aba, com aviso acessível e foco visível. O botão Visitar site permanece disponível.


Exceção de navegação — Instagram (23/10/2026): o canal Instagram do Contato abre na mesma aba, por navegação nativa, para não depender da abertura de uma nova janela. Seu aviso acessível deixa de anunciar nova aba. WhatsApp e projetos mantêm o comportamento anterior.


Tipografia móvel (23/10/2026): abaixo de 640 px, títulos das seções Soluções e Projetos em 30 px, títulos dos serviços e projetos em 24 px e descrições em 18 px com entrelinha de 1,65. Eyebrows, aplicações e ações dessas seções em 16 px. Desktop e tipografia interna das demonstrações preservados.


Refino de leitura dos projetos no celular (23/10/2026): títulos dos projetos ampliados de 24 para 30 px; descrições e conteúdo dos detalhes de 18 para 20 px, com entrelinha 1,65 e texto chrome para maior contraste. A escala de Soluções permanece como no ajuste anterior.


Brilho das soluções (23/10/2026): referências Shimmer Button e Animated Shiny Text adaptadas à paleta chrome. A solução aberta recebe anel no botão de expandir e reflexo na frase de benefício, com passagem curta a cada 12 segundos enquanto o bloco está visível. O CTA recebe uma faixa luminosa no hover, foco ou pressionamento. Sem JavaScript, pausado ou com movimento reduzido, permanece o destaque estático.


Convite à descoberta (23/10/2026): o brilho automático do botão de expandir foi transferido para os tópicos fechados, antes do clique. Anel prateado de 2 px, halo e pequeno pulso no símbolo +, em ciclos de 12 segundos com atrasos de 3 segundos entre tópicos. Ao abrir, esse convite para; permanecem o benefício destacado e o efeito do CTA. Visibilidade, pausa, movimento reduzido e ausência de JavaScript continuam respeitados.


Texto junto ao + (23/10/2026): nos tópicos fechados, as frases de benefício recebem reflexo prateado e um filete luminoso sincronizados ao botão. Abaixo de 1024 px, onde a frase lateral não é exibida, o reflexo passa pelo título do tópico. Tamanhos e hierarquia tipográfica preservados; sem movimento reduzido, sem pausa e somente enquanto visível.
