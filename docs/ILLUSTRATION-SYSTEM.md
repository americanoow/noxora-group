# Sistema de ilustração e interação

Status: **aprovado em 18/10/2026; Fase 3A implementada (hero e APIs e integrações).** Escrito para a Direção A ("Estúdio de Luz")**, recomendada em `docs/CREATIVE-DIRECTION.md`. Se você escolher B ou C, mudam os itens marcados **[A]**; a estrutura (geometria, camadas, acessibilidade, orçamento) permanece. Nada foi implementado. Data: 18/10/2026.

Objetivo: que hero, serviços e demonstrações pareçam parte de **um** sistema, não uma coleção de efeitos.

## 1. Princípios

1. **Finalidade narrativa.** Cada elemento gráfico explica algo ou guia o olhar. Se não faz nenhum dos dois, sai.
2. **Coerência.** Mesma grade, mesmas espessuras, mesma luz, mesmos materiais em todas as peças.
3. **Leitura primeiro.** A ilustração nunca compete com o texto: o texto fica sobre preto e nunca sobre o pico de luz.
4. **Leve.** SVG e CSS no lugar de imagem; transform e opacity no lugar de filtros.
5. **Progressiva.** Tudo é compreensível sem JavaScript e sem animação.

## 2. Geometria

- **Base de 8 px** nos mockups de interface; proporção das peças de serviço **4:3** (320×240 como unidade lógica) e do hero responsiva, com `aspect-ratio` reservado para evitar deslocamento de layout.
- **Traços:** 1 px (filete), 1,5 px (diagrama), 2 px (ênfase). Em SVG, `vector-effect: non-scaling-stroke` para manter a espessura em qualquer escala.
- **Faceta:** quadros de mockup e demonstração têm **um** canto superior direito chanfrado (cerca de 14% do menor lado). Implementação por `clip-path` em polígono; a borda cromada acompanha o corte com um pseudo-elemento ou SVG. Os demais cantos usam raio `md` (12 px) dos tokens.
- **Conectores:** ortogonais com curva de 8 px nas quinas, ou curvas suaves entre nós; **nunca** diagonais soltas. **Nós:** 40 px (secundário) e 56 px (principal).
- **Alinhamento:** os planos de uma pilha deslocam-se em múltiplos de 8 px (de 16 a 48 px) e têm no máximo 2° de rotação.

## 3. Materiais

| Material | Uso | Definição | Contraste |
| --- | --- | --- | --- |
| **Obsidiana** | Fundo e planos principais | `ink` #000 e `surface` #0A0A0A | texto principal 18,2:1; secundário 7,7:1 |
| **Grafite** | Seções alternadas e planos secundários | `graphite-1` #141416, `graphite-2` #1C1C20, `graphite-3` #26262B | secundário 7,2 / 6,6 / 5,9:1 |
| **Cromo** | Bordas em degradê, filetes, texto de destaque, o trilho | gradiente de 100° com paradas `#fff`, `#c7ccd3`, `#fff`, `#aab1ba`, `#f4f4f5` (o mesmo de `.chrome-text`); borda de 1 px em máscara | borda decorativa; texto cromado ≥ 14:1 |
| **Vidro** | Fichas conceituais flutuantes | fundo `rgb(255 255 255 / .04)`, borda de 1 px em cromo a 40%, sem `backdrop-filter` | texto 14 px ou maior em `fg` |
| **Papel** | Painel claro para contraste (P4), no máximo um por tela | `paper` #F4F4F5 com texto #09090B | 18,1:1; secundário #52525B a 7,0:1 |

**Controles sobre grafite:** `control` (#71717A) cai a 3,1:1 sobre `graphite-3` (limite). Sobre grafite use o novo **`control-strong` #8A8A93** (5,4 / 5,0 / 4,4:1 sobre `graphite-1/2/3`). `graphite-3` é o teto: acima de #2E2E34 o `control` falha em 3:1.

## 4. Luz e cor

- **Luz-chave** vem do alto à esquerda (cerca de 35° da vertical); **luz de contorno** fraca embaixo à direita. Toda peça respeita essa direção, o que faz hero, serviços e demonstrações parecerem iluminados pela mesma fonte.
- **Temperaturas [A]:** neutra (prata, #D4D8DE a 14,7:1), **gelo** (#8FB4FF, 10,1:1) e **âmbar** raro (#F5C88A, 13,5:1). São cores de **reflexo**, nunca preenchimento nem cor de marca.
- **Implementação:** `radial-gradient` e `conic-gradient` com opacidade de até 0,35; **sem** `filter: blur` grande nem `backdrop-filter` (custo de GPU).
- **Regras:** (1) no máximo **um foco de luz por tela**; (2) texto **nunca** sobre o pico do gradiente, e o contraste de texto sobre qualquer ponto do gradiente é conferido no pior caso; (3) a luz é decorativa e some sem prejudicar a leitura.

## 5. Profundidade

Cinco níveis de empilhamento, do fundo para a frente:

| Nível | Conteúdo |
| --- | --- |
| L0 | Luz de fundo (gradientes) e textura de grão |
| L1 | Trilhos e linhas **atrás** do objeto principal |
| L2 | Objeto principal (cubo ou janela de produto) |
| L3 | Trilho **à frente** do objeto (a oclusão cria a profundidade) |
| L4 | Sobreposições de interface (rótulos, indicadores) |

**Sombras:** `ring` e `lift` já existentes, mais `float` (sombra preta profunda e curta) para fichas flutuantes. **Textura:** um tile de grão de 64×64 px (≤ 3 KB) a 4–6% de opacidade, só em planos grandes.

## 6. Mockups e demonstrações

- **Regra de texto:** todo texto informativo renderiza em **14 px ou mais**. Texto menor só existe como **barra de esqueleto** (retângulo), nunca como letras ilegíveis.
- **Dados:** genéricos e fictícios ("Pedido 0001", "Cliente exemplo"). **Proibidos:** nomes e logos de empresas reais, depoimentos e números apresentados como resultado (nada de "98%" ou "3x mais rápido"). Valores de exemplo só dentro de demonstração e sempre sob o rótulo.
- **Rótulo obrigatório** "Demonstração conceitual", visível e lido por leitor de tela, em toda ilustração que simula um sistema.
- **Moldura:** barra de título mínima com o selo da Noxora, canto em faceta, sem os três pontos de janela.
- **Ícones de interface:** `lucide-react` em 20–24 px. Ícone grande nunca é a ilustração principal.

## 7. Componentes React

- **Local:** `src/components/illustrations/` (uma pasta por peça, mais `shared/` para `ChromeDefs`, `Facet`, `GlowLayer` e o `Rail`). Componentes de servidor por padrão; só a demonstração interativa e o que precisar de estado é cliente.
- **API:** `{ decorative?: boolean; title?: string; animated?: boolean }`. `animated` liga a animação de entrada; sem ele (ou com movimento reduzido) a peça mostra o estado final estático.
- **SVG inline** para o que anima ou tem texto; `next/image` para derivados rasterizados do cubo.
- **Acessibilidade:** decorativa → `aria-hidden="true"` e `focusable="false"`, com o significado carregado pelo texto adjacente; informativa → `role="img"` com `<title>` e `<desc>` ligados por `aria-labelledby`.
- **Ids de gradiente únicos:** um `ChromeDefs` compartilhado por página (ou `useId`) evita colisão entre instâncias do mesmo SVG.

## 8. Movimento

- **Entrada** em uma passada (hero ~1 s no total; peças de serviço ~600 ms): luz acende, objeto entra (fade e escala 0,96→1), trilhos se desenham (`stroke-dashoffset`), fichas entram em sequência de 80–120 ms.
- **Loops com pausa.** Os diagramas tocam ao entrar na tela e **recomeçam a cada ciclo** (`loopMs`, com pausa antes de repetir) enquanto estiverem visíveis; o botão "Repetir" reinicia na hora. Os reflexos (cubo, trilho) são CSS infinito com pausa longa (9 s e 12 s). Tudo só existe com JavaScript e sem pausa (`<html data-motion="on">`); o botão "Pausar animações" do rodapé (`MotionToggle`) para tudo (WCAG 2.2.2) e o movimento reduzido desliga os loops. Se a figura nunca atingir a faixa de visibilidade, toca em 4 s. Decisão do responsável em 19/10/2026 (antes: uma passada).
- **Só `transform` e `opacity`**; sem layout em animação.
  - Exceção consciente: o reflexo sobre o cubo (`sheen-loop`) anima `mask-position`, que não roda no compositor. São 1,6 s a cada 9 s, em uma imagem; não toca layout.

### Catálogo de animações (19/10/2026)

Todas recomeçam em loop enquanto visíveis (ver Movimento), terminam no estado que o HTML já traz e ficam estáticas com movimento reduzido, sem JavaScript ou pausadas. Nenhuma esconde texto nem o LCP. Impressão mostra tudo no estado final.

| Onde | O que acontece | Gatilho |
|---|---|---|
| Hero e selo do Contato | Faixa de luz prata atravessa o cubo (a mesma imagem, mascarada; só toca o vidro) | Carga (após 1,9 s) / ao entrar na tela |
| Soluções, APIs | Sinal vai do sistema à API; a API reage; responde aos outros sistemas, que respondem ao receber | Ao entrar na tela, com "Repetir" |
| Soluções, Websites e Sistemas | Moldura, painel e controles se encaixam em camadas | Ao entrar na tela |
| Soluções, Automação | Documento chega, passa pela regra e termina organizado no destino | Ao entrar na tela, com "Repetir" |
| Como ajudamos | Blocos dispersos e girados se alinham, se ligam e formam o núcleo "Solução Noxora" | Ao entrar na tela |
| Nome "NOXORA." do cabeçalho | As letras sobem em sequência na carga (uma vez); em loop, um brilho percorre as letras (0,9 s a cada 10 s) e termina no ponto, em azul-gelo | Carga / loop |
| Divisores | Reflexo curto percorre o trilho cromado | Ao entrar na tela |
| Projetos | O projeto fora de foco esmaece e se desloca discretamente; altura estável | Troca de projeto |
- **Movimento reduzido:** estado final estático, sem deslocamento. **Sem JavaScript:** estado final visível; nada fica oculto à espera de script.
- **Sem efeitos de mouse que atrapalhem** (nada de parallax pelo cursor nem tilt no hero).

## 9. Orçamento de desempenho

| Item | Orçamento | Como medir |
| --- | --- | --- |
| Imagem do cubo no celular (elemento de LCP) | ≤ 150 KB transferidos, `loading="eager"` e `fetchPriority="high"` | Rede no Chrome DevTools MCP e `lighthouse_audit` |
| Cada ilustração de serviço (SVG inline) | ≤ 20 KB não comprimidos | tamanho do componente no build |
| Todas as ilustrações abaixo da dobra | carregamento tardio (`next/dynamic` e IntersectionObserver); fora do JS inicial | `next analyze` e `next analyze export` |
| JS adicional no carregamento inicial | ≤ 15 KB gzip além do atual | comparação de bundle antes e depois |
| Layout shift | **0** causado por ilustração (proporção reservada) | CLS no `lighthouse_audit` |
| Fontes novas | no máximo 1 (monoespaçada, só para rótulos técnicos, se adotada) | tamanho em `next/font` |

Valores são **metas de projeto**, não medições. O baseline atual e o resultado de cada fase serão medidos e registrados; Core Web Vitals só são afirmados com dados.

## 10. Especificação das peças

### Hero **[A]**

Camadas (L0 a L4), composição em grade de 12 colunas: texto nas colunas 1–6; palco do cubo nas 6–12, sangrando para fora do container.

- **L0:** cone de luz do alto à esquerda (gradiente cônico, ≤ 0,3) e piso reflexivo (elipse em degradê + **reflexo espelhado esmaecido do mesmo PNG**, sem baixar outro arquivo).
- **L1:** dois trilhos cromados finos (SVG) atrás do cubo.
- **L2:** o cubo (PNG transparente já existente).
- **L3:** um trilho passa à frente do cubo. As fichas de texto ("API · 200 OK" etc.) foram removidas a pedido do responsável: o hero não traz rótulos sobre a ilustração.
- **Celular:** cubo acima do texto, a 80% da largura, cortado pela borda inferior da seção; textos centralizados; botões em largura total.
- **Sem JavaScript e sem animação:** composição completa e estática. **LCP:** a imagem do cubo; o `h1` não depende de script.

### Serviços (quatro peças, pilha de 2 a 3 planos com faceta)

| Serviço | Composição | Micro-interação (uma passada) |
| --- | --- | --- |
| **Websites** | Janela de desktop e janela de celular sobrepostas, com página de esqueleto (cabeçalho, bloco de destaque, botão) em ambas | O celular desliza para dentro; o botão do esqueleto acende |
| **Sistemas** | Painel de gestão com tabela de 4 linhas, 3 indicadores e filtro | Linhas aparecem em sequência; um indicador "preenche" |
| **APIs e integrações** | 5 a 6 nós (sistemas) ligados por conectores, com um nó central "API" | Um pulso de luz percorre os conectores, uma vez |
| **Automações** | Fluxo evento → decisão (losango) → ação, com 2 ramos | O ponto de luz percorre o caminho escolhido e acende a ação |

Cada peça tem **legenda em texto ao lado** (benefício comercial e aplicação), estado estático idêntico ao final da animação, e o rótulo de demonstração conceitual quando simula um sistema.

### Demonstração interativa: "Tecnologia aplicada ao seu negócio."

- **Padrão:** abas WAI-ARIA (`tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`). Setas, `Home` e `End` movem o foco; `Enter` e `Espaço` ativam; toque funciona sem hover. O painel recebe `tabindex="0"`.
- **Quatro abas:** Websites, Sistemas, Integrações, Automações; a demonstração do painel muda com transição de opacidade e de 8 px de deslocamento (CSS).
- **Sem JavaScript:** os quatro painéis aparecem empilhados e visíveis; o script os transforma em abas (aprimoramento progressivo).
- **Celular:** abas em faixa rolável horizontal com `scroll-snap`, ou lista vertical se a largura não permitir; o painel ocupa a largura toda.
- **Desempenho:** painel inicial no HTML; os demais carregam sob demanda. **Rótulo** "Demonstração conceitual" visível em cada painel.

### Trilho cromado

Um SVG vertical fixo atrás do conteúdo (ou por seção), com um ponto de luz em cada seção que acende ao entrar na tela. Decorativo (`aria-hidden`); some com movimento reduzido ou em telas estreitas se atrapalhar a leitura. Nunca cruza texto.

## 11. Checklist de aceitação por peça

- [ ] Estado estático idêntico ao final da animação e visível sem JavaScript.
- [ ] Texto informativo ≥ 14 px; contraste ≥ 4,5:1 no pior ponto sobre a luz.
- [ ] Decorativa com `aria-hidden`, ou informativa com `title` e `desc`.
- [ ] Rótulo "Demonstração conceitual" quando simula um sistema; nenhum nome, logo ou resultado inventado.
- [ ] Dentro do orçamento de peso; sem layout shift.
- [ ] Movimento reduzido sem deslocamento; loops desligados (sem `data-motion`, sem botão de pausa).
- [ ] Mesma direção de luz, mesmas espessuras e materiais do sistema.

## 12. O que muda em B ou C

- **B (Planta Técnica):** o hero troca a luz e o reflexo por malha e vista explodida; os materiais reduzem-se a obsidiana, grafite e linha cromada; legendas em fonte monoespaçada tornam-se centrais; o orçamento fica mais folgado.
- **C (Metal Fluido):** entram máscaras e gradientes grandes (orçamento de SVG sobe e exige medição por peça), o contraste de texto sobre superfícies cromadas passa a ser checado ponto a ponto, e a decisão sobre canvas ou WebGL precisa de análise própria.
