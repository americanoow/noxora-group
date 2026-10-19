# Redesign: relatório da Fase 3A (protótipo de alta fidelidade)

Data: 18/10/2026. Plano: `docs/REDESIGN-PLAN.md`. Direção: `docs/CREATIVE-DIRECTION.md` (A, "Estúdio de Luz", com diagramas da B e assinatura da C). Sem deploy.

## Escopo entregue

1. **Header** com estado rolado (transparente no topo, superfície e filete ao rolar) e a correção **F04** do menu mobile em telas baixas.
2. **Hero** de alta fidelidade com a copy aprovada: palco em camadas (luz-chave em cone, trilhos cromados atrás e à frente do cubo, três fichas conceituais, reflexo no piso), entrada de uma passada.
3. **Ilustração completa de APIs e integrações**: API central e seis sistemas genéricos, conectores em SVG, pulsos de luz que percorrem cada ligação uma vez, botão "Repetir animação" e rótulo "Demonstração conceitual".
4. **Elementos compartilhados:** `Facet` (moldura com canto chanfrado e borda cromada), `RailDivider` (trilho entre seções), `PlayFigure` (figura animada ao entrar na tela), tokens `graphite-1/2/3`, `control-strong`, `light-ice`, `light-amber`, `shadow-float`.
5. **Textos enxutos**, a pedido do responsável durante a fase: descrição do hero em uma frase; a seção de soluções só com título; legendas de uma linha.

Os outros três serviços aparecem como linhas simples (sem ilustração): entram na Fase 4.

**Arquivos:** novos `src/components/illustrations/{hero/HeroStage,api/ApiIntegrationFigure}.tsx`, `src/components/ui/{Facet,RailDivider,PlayFigure}.tsx`, `src/components/layout/HeaderShell.tsx`, `src/content/{hero,api-demo}.ts`, `tests/e2e/prototype-3a.spec.ts`. Alterados `globals.css`, `Header`, `MobileNav`, `Hero`, `Services`, e os testes que citavam os textos antigos. Docs de direção, plano, design, arquitetura, qualidade e setup atualizados.

## Capturas

Desktop: [hero](assets/fase-3a/desktop-hero.png) e [soluções](assets/fase-3a/desktop-servicos.png). Celular: [hero](assets/fase-3a/mobile-hero.png) e [soluções](assets/fase-3a/mobile-servicos.png). [Menu em 568×320](assets/fase-3a/menu-568x320.png). **Comparação tipográfica (D7):** [tipografia-comparacao.png](assets/fase-3a/tipografia-comparacao.png) (A: Space Grotesk atual; B: Instrument Serif só no título do hero, injetada apenas na captura).

Minha leitura da comparação: a serifa (B) é mais editorial e próxima do tom premium da referência; a atual (A) é mais técnica e já combina com os diagramas. Se a serifa vencer, convém usá-la também nos títulos de seção para manter coerência, ao custo de uma fonte a mais. **A decisão é sua.**

## Verificações

| Item | Resultado |
| --- | --- |
| `npm run check` (lint, tipos, lint tipado, regras locais, e2e) | saída 0; **84 passaram, 6 pulados** de propósito (testes só de desktop ou só de celular) |
| Baseline antes de mexer | 37 passaram, 5 pulados |
| Lighthouse mobile (automatizado) | Acessibilidade, Boas práticas e SEO: 100; 54 aprovadas, 0 falhas |
| Desempenho (laboratório) | tabela completa em `docs/quality.md`: LCP celular 512 → 564 ms e desktop 108 → 200 ms (script); 1.551 → 943 ms no trace do DevTools; CLS 0,00; JS +0,7 KB; imagem do cubo 46 KB |
| Movimento reduzido, sem JavaScript, 568×320 | testados e capturados |
| RTK | hook ativo na sessão: 13 comandos, 84,8% menos saída |

## Problemas encontrados e corrigidos na revisão visual

Antes da revisão do Codex, as capturas mostraram: ficha cortada na borda no celular; reflexo do cubo vazando para trás do título (texto sobre luz); ficha "200 OK" cobrindo o nó CRM no celular; título com palavra órfã; legenda distante do cubo; trilho atravessando o texto de uma ficha; divisor fora de posição por conflito de classes; e fichas translúcidas deixando o brilho do vidro do cubo passar por baixo do texto. Todos corrigidos e re-capturados.

## Revisão independente (Codex)

- O plugin `codex-flow` **não iniciou** (`spawn EINVAL`, falha de execução do `codex.cmd` no Windows com Node 24). Usei a CLI direta: `codex review --uncommitted`, com o login ChatGPT já existente. Essa versão da CLI **não aceita instruções junto com `--uncommitted`**, então rodou a revisão padrão. O sandbox dela era `workspace-write`; conferi depois: **nenhum arquivo foi alterado**. O shell dela falhou ao criar processos, e ela usou um REPL Node para inspecionar; a cobertura efetiva é, portanto, menor do que a de uma revisão com shell, e **não sei quais arquivos ela leu**.
- Uma rodada, **dois achados P2, ambos confirmados e corrigidos**:
  1. **Ficha "Pedido 0001 aprovado" cortada entre 1024 e 1100 px.** Meu teste de overflow olha só `scrollWidth`. Corrigido reduzindo o sangramento do palco abaixo de 1280 px. Novo teste (1024 a 1920 px) reprovava antes e passa agora.
  2. **Movimento reduzido mantinha os atrasos de entrada:** as fichas ficavam invisíveis por até ~1,2 s e depois apareciam de repente. Corrigido zerando `animation-delay` e `transition-delay` na regra global.
- **Falha do meu teste, achada por causa do segundo item:** o teste de movimento reduzido passava mesmo com o defeito, porque `toHaveCSS` repete por até 5 s e esperava o fim do atraso. Reescrito com leitura única e imediata, e exigindo as 3 fichas; reprova antes da correção e passa depois.
- **Ressalva do teste F04:** só o caso 568×320 discrimina o defeito original. Em 667×375 o teste passa mesmo sem a correção, porque a remoção do item "Sobre" já encurtou o menu.

## Não validado e limitações

- **Portão 3B:** o visual ainda precisa da sua aprovação; a escolha tipográfica (D7) também.
- Sem teste em Safari, Firefox ou aparelhos reais; sem leitor de tela real; sem axe; Lighthouse automatizado não prova WCAG completo.
- Core Web Vitals só em laboratório. A causa de ~90 ms a mais de LCP no desktop **não foi isolada** (hipóteses não testadas: rasterização dos gradientes de luz e início das animações).
- Um único ângulo do cubo: a profundidade vem de camadas, oclusão e reflexo, não de 3D.
- As fichas do hero ("API · 200 OK", "Pedido 0001 aprovado", "Fluxo ativo") são exemplos genéricos, identificados como "Ilustração conceitual".
- Só uma das quatro ilustrações de serviço existe.

## Recomendações

1. Aprovar ou ajustar o protótipo (portão 3B) e escolher a tipografia.
2. Fase 4: as três ilustrações restantes (Websites, Sistemas, Automações) e a demonstração interativa "Tecnologia aplicada ao seu negócio.".
