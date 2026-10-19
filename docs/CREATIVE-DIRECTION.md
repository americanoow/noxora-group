# Direção criativa: Noxora, "Liquid Engineering"

Status: **aprovada em 18/10/2026 com ajustes (D6 a D11 respondidas, ver `docs/REDESIGN-PLAN.md`).** Fase 3A implementada; relatório em `docs/reviews/2026-10-18-redesign-fase-3a.md`.
Documentos irmãos: `docs/ILLUSTRATION-SYSTEM.md` (linguagem de ilustração e interação) e `docs/REDESIGN-PLAN.md` (plano revisado).

## 1. Por que mudar

O que foi construído até a Fase 2 (design system, hero com a imagem do cubo, serviços em grade, canais de contato) é correto e acessível, mas é o **dark minimalista convencional** que você descreveu: preto, texto claro, cartões escuros com borda cinza e um cubo ao lado do texto. Todas as seções têm o mesmo peso, a mesma superfície e o mesmo formato. Falta ilustração própria, profundidade, ritmo e algo que o visitante lembre depois.

| Vale preservar | Precisa mudar |
| --- | --- |
| Preto AMOLED como base; logo "NOXORA."; cubo de vidro; prata e chrome como assinatura | Hero como "imagem ao lado do texto": vira composição com camadas, luz e conexões |
| Tokens de superfície, texto e `control` (contraste), escala tipográfica, `Reveal`, `Button`, `site-url`, estrutura de `src/content/` e a infraestrutura de testes | Serviços como grade 2×2 de texto com ícone: cada um ganha ilustração própria |
| Regras de acessibilidade (14 px mínimo, foco visível, teclado, movimento reduzido, conteúdo visível sem JavaScript) | Todas as seções com a mesma superfície e o mesmo cartão: entra variação de superfície e de composição |
| Honestidade de conteúdo: nada de clientes, depoimentos ou resultados inventados; demonstrações rotuladas como conceituais | A regra "brilho metálico só no cubo, no destaque do hero e em filetes": sai e dá lugar a uma regra de luz com finalidade narrativa (seção 4 e `REDESIGN-PLAN.md`) |

## 2. Análise das referências (18/10/2026)

Método: navegador headless, capturas de 1440×900 em várias posições de rolagem e de 390×844 no celular, mais medições do DOM (tamanhos, fontes, quantidade de SVG, imagens, vídeos e canvas). A captura extra da Linear falhou nesta rodada; para ela valem também as capturas da Fase 1 (17/10). Só princípios foram extraídos; nenhum código, texto ou ativo foi copiado.

### Resend (referência principal)

**Observado:** página de cerca de 12.300 px de altura; fundo #000; título principal de 96 px em fonte serifada de exibição (Domaine) sobre corpo em Inter; 109 SVGs inline, 73 imagens, 5 vídeos e 1 canvas. Cada seção grande abre com um pequeno objeto 3D de vidro (envelope, esfera, átomo) com um brilho colorido por baixo, seguido de um título centralizado com uma palavra em gradiente. As funcionalidades aparecem como **fragmentos reais de interface cortados por esmaecimento** (status de entrega, logs, métricas, editor) com uma coluna dupla de ícone, título, texto e link logo abaixo. Há uma janela de produto com árvore de arquivos, código e pré-visualização ao vivo, e um painel claro ("papel") que rompe o preto. No celular: objeto no topo, texto centralizado, botão largo.

**Princípios (P) que valem para a Noxora:**

- **P1.** A ilustração é o argumento: a página mostra o produto em vez de descrevê-lo.
- **P2.** Profundidade vem de camadas, esmaecimentos e uma luz clara, não de bordas.
- **P3.** Um objeto-símbolo por seção cria ritmo e memória.
- **P4.** Superfícies de contraste (um painel claro) quebram a monotonia do preto.
- **P5.** A cor aparece como luz, pontual e semântica, nunca como preenchimento.
- **P6.** O investimento em ativos é alto (renders, vídeo): é a parte que **não** dá para igualar só com CSS e SVG.

### Linear (referência secundária)

**Observado:** fundo #08090A; título principal de 64 px alinhado à esquerda em Inter Variable; 231 SVGs, nenhum canvas nem vídeo, 39 imagens (quase tudo vetorial). Logo abaixo do título entra um recorte grande da interface do produto; mais adiante, figuras isométricas em **linha fina**, legendadas como "FIG 0.1", em três colunas separadas por filetes; cabeçalhos de seção em duas colunas (título à esquerda, descrição à direita).

**Princípios:** **P7.** Rigor tipográfico e de grade passa confiança. **P8.** Ilustração em linha, leve e legível, explica um conceito técnico para quem não é técnico (a legenda diz o que se vê).

### O que não vamos copiar

Os objetos 3D de vidro com brilho colorido por seção (assinatura da Resend), o título serifado centralizado com palavra em gradiente, a faixa de logotipos de clientes, o layout "janela de código + preview" e as figuras "FIG 0.x" da Linear. A Noxora adota os **princípios** e responde com dispositivos próprios (seção 4).

**Limite honesto:** a Resend usa renders 3D, vídeo e canvas para os objetos. A Noxora tem **uma imagem** do cubo (um único ângulo) e não vamos fingir um modelo 3D. A profundidade virá de composição (camadas, oclusão, luz, reflexo e conexões) feita em CSS, SVG e React. Se a marca puder fornecer outros ângulos ou renders do cubo, a qualidade sobe muito (ver decisão D10).

## 3. Conceito: "Liquid Engineering"

Engenharia de software, sistemas conectados e superfícies metálicas fluidas. Cada tensão que você pediu vira uma regra visual:

| Tensão | Como aparece |
| --- | --- |
| Geometria precisa × material líquido | Interfaces e diagramas em grade rígida (ângulos retos, traço fino); o cubo e as bordas cromadas são o material fluido que as toca |
| Interface técnica × forma orgânica | Mockups de software com cantos em **faceta** (chanfro herdado do cubo) em vez de retângulos arredondados genéricos |
| Preto absoluto × cromo | Fundo #000 domina; o cromo aparece como filete, borda em degradê, reflexo e luz |
| Tipografia editorial × diagrama | Títulos grandes e calmos; rótulos técnicos pequenos só dentro de ilustrações, com a regra de 14 px (seção 5 do `ILLUSTRATION-SYSTEM.md`) |

**Anti-metas:** parecer template de agência; efeito sem função; todas as seções iguais; luz competindo com texto; animação obrigatória ou infinita; ilustração que só funciona com JavaScript; promessa de resultado em demonstração.

## 4. Dispositivos de identidade da Noxora

Elementos próprios que dão unidade à página e a distinguem das referências:

1. **Faceta.** Silhueta chanfrada derivada da tecla de vidro: um canto cortado em diagonal nos quadros de mockup e demonstração. Substitui o retângulo arredondado como "moldura" nas ilustrações.
2. **Trilho cromado.** Um fio fino de metal líquido que atravessa a página e liga as seções como um cabo de dados, com um ponto de luz em cada seção. Conta a história de "tudo conectado" (integrações e automações). Barato (um SVG) e exclusivo.
3. **Camadas.** Toda ilustração é uma pilha de 2 ou 3 planos deslocados com borda cromada em degradê (desktop sobre mobile, painel sobre painel), criando profundidade sem imagem pesada.
4. **Temperatura de luz.** A luz muda de tom por seção como reflexo no cromo: neutro (prata), gelo (azul frio) e, raramente, âmbar. Nunca vira cor de marca nem preenchimento.
5. **Selo.** O cubo reaparece em escala menor em pontos-chave (ex.: fecho da página, junto ao contato), reforçando a marca.

## 5. Três direções

### Direção A: "Estúdio de Luz" (cinematográfica, a mais próxima da Resend)

- **Ideia:** a página é um estúdio fotográfico escuro. Cada seção é uma "cena" com a luz vindo de um lado e uma temperatura diferentes.
- **Hero:** cubo grande como protagonista, com cone de luz de cima, piso reflexivo (reflexo espelhado esmaecido do mesmo asset) e trilhos finos que passam **por trás** do cubo e saem **à frente** como cabos ligando três "fichas de vidro" conceituais em profundidades diferentes. A oclusão (cubo no meio das camadas) dá a profundidade.
- **Ilustração:** janelas de produto em camadas com borda cromada em degradê e cantos em faceta; painéis claros ("papel") ocasionais para contraste.
- **Ritmo:** preto com grande ilustração, grafite, composição editorial, demonstração técnica; luz muda por seção.
- **Interação:** abas acessíveis que trocam a demonstração; nós dos diagramas reagem a hover e foco; entrada orquestrada do hero.
- **Tecnologia:** CSS, SVG e React; derivados do PNG existente; sem WebGL; Motion só se medido e justificado.
- **Forças:** responde ao pedido (Resend como referência principal); memorável sem depender de ativos novos; texto sempre sobre preto, então a leitura é segura; custo e risco médios.
- **Riscos:** virar "preto com brilho" se faltar disciplina (regra: um foco de luz por tela); depende de **um** ângulo do cubo.

### Direção B: "Planta Técnica" (técnica, a mais próxima da Linear)

- **Ideia:** a página como um conjunto de pranchas de engenharia numeradas, em preto e grafite com malha fina.
- **Hero:** cubo menor, como selo, sobre a malha; ao lado, o cubo em **vista explodida** em linha isométrica, com cotas e legendas "FIG 01" em fonte monoespaçada.
- **Ilustração:** isométrica em linha fina, quase monocromática, com realce cromado em pontos de interesse.
- **Ritmo:** seções como prancha 01 a 05, colunas separadas por filetes.
- **Interação:** hover e foco revelam anotações; abas trocam de "prancha".
- **Tecnologia:** SVG puro, muito leve (a mais barata das três em desempenho).
- **Forças:** nítida, leve, fácil de acessibilizar; as legendas explicam conceitos para leigos.
- **Riscos:** menos expressiva e memorável do que você pediu; mais perto da referência secundária; o cubo orgânico entra em atrito com a linguagem geométrica de linha; pode soar fria para empresas tradicionais.

### Direção C: "Metal Fluido" (expressiva, a mais original)

- **Ideia:** o cromo líquido como matéria da página: fitas de metal que emergem do cubo, atravessam as seções e viram as ilustrações.
- **Hero:** o cubo imerso em fitas de cromo (SVG com gradientes e máscaras) que saem do hero e continuam pela página.
- **Ilustração:** objetos líquidos conectados; superfícies de grandes faixas metálicas escuras; reflexos com mais iridescência.
- **Interação:** fitas reagem à rolagem; nós "derretem" entre estados.
- **Tecnologia:** SVG grande com gradientes e máscaras; provável necessidade de canvas ou WebGL depois.
- **Forças:** a mais autoral e inconfundível; maior potencial de marca.
- **Riscos:** **alto.** Desempenho (SVGs pesados e animados), legibilidade (texto sobre superfícies cromadas, contraste variável), acessibilidade, esforço elevado e dependência de habilidade de ilustração: "líquido" convincente sem 3D é difícil e corre o risco de parecer kitsch. Público tradicional pode estranhar.

### Comparação

| Critério | A. Estúdio de Luz | B. Planta Técnica | C. Metal Fluido |
| --- | --- | --- | --- |
| Aderência ao pedido (Resend principal) | **Alta** | Média | Média |
| Memorabilidade | Alta | Média | **Muito alta** |
| Clareza para um leigo | Alta (demos rotuladas) | **Muito alta** (legendas) | Média |
| Legibilidade e contraste | Alta (texto sobre preto) | **Muito alta** | Baixa a média (texto sobre cromo) |
| Desempenho (peso e CPU) | Média | **Alta** (leve) | Baixa |
| Dependência de ativos novos | Baixa (derivados do PNG) | Baixa | **Alta** |
| Esforço de implementação | Médio | Médio a baixo | Alto |
| Risco geral | Médio | Baixo | **Alto** |
| Coerência com a marca (cubo orgânico + cromo) | Alta | Média (linha × orgânico) | Alta |

## 6. Recomendação: Direção A, com dois empréstimos

**Escolha: A, "Estúdio de Luz".** Justificativa:

1. É a que mais se aproxima do que você pediu (Resend como principal, "cinematográfico", camadas, luz, profundidade) sem exigir ativos que não temos.
2. Mantém o texto sobre preto e controla o brilho com regras (um foco de luz por tela; texto nunca sobre o pico de luz), o que protege WCAG AA e público de várias idades.
3. Cabe no orçamento de desempenho: tudo em CSS, SVG e React, sem WebGL.
4. É a única que torna o cubo, e não só o cromo, o protagonista.

**Empréstimos:** da **B**, a técnica de **anotação** (legendas e cotas) nas demonstrações, que torna os diagramas compreensíveis para quem não conhece tecnologia; da **C**, o **trilho cromado** como um fio de metal líquido controlado (um gesto, não a página inteira).

**Recusado:** a C inteira (risco e custo altos agora; pode voltar como evolução depois de medir) e a identidade de "prancha" da B como linguagem principal.

## 7. Decisões que preciso de você

Recomendado em **negrito**; sigo com ele se você só aprovar a direção.

- **D6. Direção:** **A**, B, C ou uma combinação (diga quais partes).
- **D7. Tipografia editorial:** **manter Space Grotesk e Manrope** e testar no protótipo uma serifa de exibição apenas no título do hero (uma variável de CSS permite comparar), ou adotar a serifa já. A Resend usa serifa no título; a V1 do site usava Instrument Serif.
- **D8. Serviço do protótipo:** **APIs e integrações** (é o mais exigente: nós, conexões e animação, e o que melhor testa o trilho) ou Websites (o mais simples).
- **D9. Luz colorida:** **prata e gelo, com âmbar raro e apenas como reflexo**, ou somente prata. Os tons de reflexo propostos têm contraste de 10:1 a 14:1 sobre preto.
- **D10. Ativos do cubo:** você pode fornecer outros ângulos, versão de maior resolução ou render com profundidade? Se sim, a composição melhora muito. Se não, **gero derivados do PNG atual** (reflexo, versões leves em AVIF/WebP) sem alterar o original da marca.
- **D11. Movimento:** **CSS primeiro; a biblioteca Motion só entra se uma interação medida não puder ser feita em CSS** (e então carregada sob demanda).
