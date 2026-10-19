# Redesign: relatório da Fase 4 (Como ajudamos, Projetos e Contato)

Data: 18/10/2026. Plano: `docs/REDESIGN-PLAN.md`. Sem deploy.

## Pedido do responsável e escopo

O responsável aprovou a introdução e a aba Soluções como estão e pediu: mudar **Projetos** e **Contato**; deixar o site mais gráfico do que textual, de modo que o cliente veja profissionalismo e confie; e trocar o jeito de mostrar **Como ajudamos**, porque a coluna fixa com rolagem só de um lado não agradou.

**Entregue:**

1. **Como ajudamos:** cinco cenas ilustradas em uma grade assimétrica (5 + 7, depois 4 + 4 + 4), cada benefício com sua própria composição (tarefas que se resolvem, três áreas ligadas por um núcleo, papel que vira registro, um app sobre uma camada de dados, uma jornada que termina bem) e uma linha de texto. Molduras diferentes por cartão (faceta, painel sobre luz, grafite, contorno). Sem `sticky`, sem coluna rolando sozinha.
2. **Projetos:** como não há cases reais (e não inventamos), o estado vazio virou uma composição gráfica de três janelas de software em camadas, ligadas por um trilho cromado, com "Casos reais em breve", o fluxo Problema → Solução → Tecnologias (como cada caso será apresentado) e o botão "Pedir uma apresentação". O cartão de projeto real foi redesenhado: imagem primeiro, categoria, problema e solução em uma linha cada, tecnologias como rótulos.
3. **Contato:** selo do cubo, três canais como peças gráficas e o **formulário** em moldura de faceta (decisão D1: depois dos canais). Validação no cliente e no servidor, estado "Enviando…", erro de entrega, "indisponível" sem destino, valores preservados em qualquer falha (inclusive sem JavaScript), campo isca, região viva para leitores de tela.
4. **Textos enxutos:** descrições de benefícios e de canais reduzidas a uma linha; sem parágrafos nas seções novas.

**Não feito (adiado, ver decisão abaixo):** as três ilustrações de serviço restantes e a demonstração interativa "Tecnologia aplicada ao seu negócio.".

**Arquivos:** novos `src/lib/{contact,contact-action}.ts`, `src/components/sections/ContactForm.tsx`, `src/components/illustrations/{benefits/BenefitScenes,projects/ProjectStage}.tsx`, `tests/e2e/phase-4.spec.ts`, `tests/unit/contact.spec.ts`; reescritos `Benefits`, `Portfolio`, `ProjectCard`, `Contact`, `src/content/{benefits,contact,projects}.ts`, `tests/e2e/contact.spec.ts`; ajustes em `globals.css` (tokens `paper`), `.env.example`, `playwright.config.ts` e na documentação.

## Capturas

Desktop: [Como ajudamos](assets/fase-4/desktop-beneficios.png), [Projetos](assets/fase-4/desktop-projetos.png), [Contato](assets/fase-4/desktop-contato.png). Celular: [Como ajudamos](assets/fase-4/mobile-beneficios.png), [Projetos](assets/fase-4/mobile-projetos.png), [Contato](assets/fase-4/mobile-contato.png).

## Verificações

| Item | Resultado |
| --- | --- |
| `npm run check` | saída 0; **138 passaram, 6 pulados** de propósito (baseline desta fase: 84 passaram) |
| Formulário no Next real, com destino de teste (3 cenários) | **Com JavaScript e destino 2xx:** sucesso, campos limpos, 1 entrega. **Com JavaScript e HTTP 500:** erro, **sem** sucesso, valores preservados, 1 tentativa. **Sem JavaScript e destino 2xx:** sucesso, campos limpos, 1 entrega |
| Lighthouse mobile | Acessibilidade, Boas práticas e SEO: 100; 58 aprovadas, 0 falhas (automatizado) |
| Desempenho | tabela e ressalvas em `docs/quality.md`; trace do celular: LCP 1.024 ms, CLS 0,00 |

## Problemas encontrados e corrigidos

- **Rolagem horizontal em 320, 390 e 1024 px** (as novas seções vazavam): a fila "Problema → Solução → Tecnologias" não quebrava linha e, em coluna única, o item de grade assumia a largura mínima do conteúdo. Corrigido com `min-w-0` e quebra de linha; os testes de largura reprovavam antes. O timeout do menu mobile que apareceu junto era consequência do alargamento.
- **Cena de integração apertada no celular** (núcleo sobrepondo um nó) e **ícone do sorriso cortado** na cena de experiência: corrigidos.
- **"Em breve" duplicado** nos canais pendentes: a descrição só aparece quando há canal.
- **Conflito de classes** entre o tamanho do corte da faceta e uma sobrescrita local: removida a sobrescrita.

## Revisões independentes

**Revisor de segurança do formulário (somente leitura, método do `docs/prompts/security-review.md`):** nenhum achado crítico ou alto. Dispositivos verificados pelo revisor: o destino vem só da configuração do servidor (sem SSRF por campo), a validação roda no servidor mesmo com chamada direta, o log traz só o tipo do erro, os valores devolvidos entram como `defaultValue` (sem XSS), `success` só depois de HTTP 2xx, nenhum segredo no cliente.

| Achado | Veredito | Disposição |
| --- | --- | --- |
| MÉDIA (hipótese): sem limite de frequência; corpo grande lido antes de validar | Parcialmente confirmado | **Corpo:** a documentação instalada do Next confirma o teto de **1 MB** por padrão nas Server Actions e a comparação de Origin e Host. **Frequência:** **não implementada**; exige limite no host ou no edge (um contador em memória não funciona em ambiente sem estado). **Pendência registrada** |
| BAIXA: `fetch` seguia redirecionamentos | Confirmado | **Corrigido** (`redirect: "error"`); teste novo reprova sem a correção (retorna sucesso) |
| BAIXA: tempo limite configurável sem teto | Confirmado | **Corrigido** (teto de 30 s); teste novo |
| BAIXA: caminho de exceção nunca testado contra vazamento no log | Confirmado | **Corrigido:** teste com destino inalcançável confere que URL, host, porta, e-mail e mensagem não aparecem |
| BAIXA: faltavam testes de chamada direta (arquivo no lugar do nome, mensagem de 2001 caracteres) | Confirmado | **Corrigido** |
| BAIXA: honeypot contornável e 2xx não prova entrega real | Inerente ao desenho | Documentado; sem limite de frequência o honeypot é a única barreira contra robôs ingênuos |

**Codex (`codex review --uncommitted`, login ChatGPT existente; o plugin `codex-flow` continua sem iniciar por `spawn EINVAL`):** uma rodada, **um achado P2, procedente e corrigido**. Ressalvas de cobertura: o shell do Codex falhou ao criar processos, então ela inspecionou por outros meios e disse não ter rodado os testes e2e; os arquivos que leu não são conhecidos.

- **P2: falha de rede no navegador descartava o formulário.** Com a conexão caindo no envio, a chamada da Server Action rejeita fora do `try/catch` do servidor; a rejeição ia para a fronteira de erro do React, que desmontava o formulário e fazia o visitante perder o rascunho. **Corrigido** com um envoltório no cliente que devolve o estado de erro com os valores digitados (mensagem: "Verifique sua conexão e tente novamente"). Teste e2e novo, que simula a rede offline e depois reconecta; **reprova sem a correção** (o formulário some) e passa com ela.
- **Regressão que a própria correção causou, pega pelo teste existente:** a primeira versão do envoltório quebrou o envio **sem JavaScript** (o envio nativo exige que a ação do `useActionState` seja a Server Action direta). O teste "formulário sem JavaScript" reprovou. Solução: dois caminhos no componente: sem JavaScript vale a Server Action direta; com JavaScript o envio é interceptado e passa pelo envoltório. Os três cenários reais acima foram refeitos depois.

## Provas de que os testes reprovam o defeito

Mutações temporárias, revertidas depois: chamar a Server Action sem o envoltório reprova o teste de rede offline; reintroduzir `sticky` em Como ajudamos reprova o teste de rolagem presa; trocar a borda dos campos por `line` reprova o teste de contraste (1,14:1 contra o mínimo de 3:1); remover `redirect: "error"` reprova o teste de redirecionamento.

## Não validado e limitações

- **Sem limite de frequência** no formulário (pendência de infraestrutura) e sem proteção além do campo isca.
- O caminho de sucesso foi provado com um destino de teste local, **não** com o destino real: um webhook que responda 200 e descarte a mensagem seria tratado como sucesso.
- O destino do formulário (`CONTACT_WEBHOOK_URL`) ainda não existe; até lá o formulário avisa que está indisponível. Falta também a política de privacidade (LGPD).
- Sem teste em Safari, Firefox ou aparelhos reais; sem leitor de tela real; sem axe; Core Web Vitals só em laboratório.
- O LCP do script varia centenas de milissegundos entre execuções; diferenças menores que ~150 ms não são conclusivas. Um CLS de 0,026 apareceu uma vez e não se reproduziu; causa não identificada.
- Cenas de benefícios são estáticas (sem animação de entrada), por escolha de escopo.

## Decisões e recomendações

1. **Ilustrações restantes e demonstração interativa:** o responsável aprovou a aba Soluções como está. Se quiser que Websites, Sistemas e Automações também ganhem ilustração própria, e a demonstração interativa, isso é a próxima fase; confirme antes.
2. **Confiança do cliente:** hoje ela vem da qualidade visual e do rigor (acessibilidade, desempenho). Uma faixa "Como trabalhamos" (por exemplo, entender, desenhar, construir, evoluir) reforçaria a credibilidade, mas **afirma como a Noxora trabalha**: preciso que o responsável confirme o processo real antes de eu escrever. Nada disso foi inventado.
3. **Destino do formulário:** definir onde as mensagens chegam (e-mail, planilha, CRM) e configurar `CONTACT_WEBHOOK_URL` no ambiente do servidor; definir limite de frequência no host.

## Adendo (19/10/2026): ajuste pedido após a revisão visual

O responsável pediu três mudanças, feitas sobre a Fase 4:

1. **Hero:** removidas as fichas "API · 200 OK", "Pedido 0001 aprovado" e "Fluxo ativo". O palco ficou só com luz, trilhos e cubo.
2. **Como ajudamos:** as cinco cenas deram lugar a um único gráfico antes/depois (quatro ferramentas soltas → as mesmas quatro ligadas por um núcleo) e cinco rótulos curtos. Sem parágrafos, sem números. Altura da seção: 875 px no desktop e 1.162 px no celular (antes 1.213 e 2.068 px).
3. **Contato:** três peças de canal lado a lado (empilham no celular) e o formulário abaixo. A seção ficou mais alta no desktop (a mudança priorizou os contatos, não a altura); no celular ficou menor.

Verificação: `npm run check` com 143 testes passando e 7 pulados de propósito. A revisão do Codex não pôde ser feita nesta rodada (o terminal dele falhou com `helper_unknown_error` antes de ler o diff); foi usado um revisor independente do Claude no lugar.

### Segundo ajuste (19/10/2026): nomes dentro do gráfico

O gráfico de Como ajudamos passou a rotular cada ícone (Planilhas, E-mails, Mensagens, Pedidos), com títulos "Hoje: processos desconectados" e "Com a Noxora: operação integrada", frases de rodapé e o núcleo "Solução Noxora" (sob medida, sem sugerir um produto único). Nomes e frases são texto real; ícones e traços têm `aria-hidden`; o bloco deixou de ser `role="img"` e virou um grupo nomeado. Capturas em `docs/reviews/assets/fase-4/como-ajudamos-*.png` (1440, 768, 390 e 320 px): sem rótulos sobrepostos, sem texto abaixo de 14 px e sem rolagem horizontal.

### Terceiro ajuste (19/10/2026): vitrine de Projetos

A seção Projetos virou uma vitrine de prévias visuais em carrossel manual. Não havia projeto real nem captura de tela no repositório (`public/projects/` vazio), então entraram **três demonstrações conceituais** (website comercial, sistema de gestão, automação de processos), cada uma com mockup desenhado em código, sem texto, nome, número ou resultado, e com o rótulo visível "Demonstração conceitual". Título da seção: "Veja como transformamos problemas em soluções." (o anterior, "Problemas reais...", sugeria casos reais).

- **Modelo:** `Project` em `src/content/projects.ts` (`kind: "real" | "concept"`, `image` ou `mockup`, `demoUrl`, `caseStudyUrl`). Projeto real entra no início da lista.
- **Quantidade:** 0 = aviso "Casos reais em breve"; 1 = destaque sem controles; 2 ou mais = carrossel. Testado por páginas de apoio `/fixtures/projetos/{0,1,2,5}`, ativas só com `NOXORA_FIXTURES=1` (404 nos demais builds).
- **Carrossel:** rolagem nativa com `scroll-snap` (swipe, teclado, leitor de tela), setas, pontos (alvo de 32 px), indicador "Projeto N de M", sem autoplay, sem loop, movimento reduzido instantâneo, controles só com JavaScript.
- **Removidos:** `ProjectCard` e `ProjectStage` (ilustração genérica).
- **Teste instável corrigido:** o teste "contatos lado a lado" media a caixa durante a animação de entrada e falhava sob carga; passou a esperar as animações terminarem (10 de 10 execuções).
- Capturas: `docs/reviews/assets/fase-4/projetos-{desktop,mobile}-{1,2,3}.png`.
- **Revisão independente (revisor do Claude; o Codex não executa neste ambiente):** sem achados críticos. Corrigidos: barra de controles estourava a largura em 360 px com 4 ou mais projetos (`flex-wrap` + teste a 360 px com 5 projetos); atalhos do navegador (Alt+Seta, Ctrl+Home) eram interceptados; dois testes podiam agir antes da hidratação; a rota dinâmica de fixtures devolvia 200 com corpo de 404 em caminhos inválidos, então virou quatro páginas estáticas (verificado em build sem `NOXORA_FIXTURES`: `/fixtures/projetos/0`, `2`, `3` e `abc` respondem 404). O 404 sem a variável foi checado à mão; nenhum teste automático o cobre, porque o build de teste sempre liga a variável. Aceitos como estão: o leitor de tela anuncia posições intermediárias ao saltar vários projetos de uma vez; cores avulsas nos mockups decorativos.

### Quarto ajuste (19/10/2026): animações

Sete animações pedidas mais uma extra (reflexo no cubo do selo do Contato), todas de uma passada, com estado final por padrão e estáticas com movimento reduzido ou sem JavaScript; catálogo em `docs/ILLUSTRATION-SYSTEM.md`. As soluções Websites, Sistemas e Automação ganharam miniaturas animadas no lugar dos ícones. "Troca suave de projetos" esmaece e desloca o projeto fora de foco sem alterar a altura.

- **Desvios do pedido:** a "logo" foi tratada como o cubo (hero e selo do Contato); o texto "NOXORA." do cabeçalho não foi animado. O reflexo do cubo usa `mask-position` (fora do compositor), documentado como exceção.
- **Correções feitas no caminho:** overflow em 320 px causado pelas novas miniaturas (`grid-cols-1`); nós da automação apertados em telas estreitas.
- **Testes:** `animations.spec.ts`. Descoberto na escrita: figuras abaixo da dobra em viewport baixa (720 px) só tocam quando ficam bem visíveis; os testes rolam até a figura.
- **Limitação:** timing e aparência foram verificados por valores calculados e capturas pontuais, não por vídeo; Safari e aparelhos reais não foram testados (máscara e `cqw` em especial).

### Quinto ajuste (19/10/2026): animações em loop

Por pedido do responsável as animações passaram a recomeçar em loop, o que **muda a regra anterior** ("sem animação infinita"); `AGENTS.md`, `docs/design.md` e `docs/ILLUSTRATION-SYSTEM.md` foram atualizados. Para manter WCAG 2.2.2 e o estado final seguro: loops só com JavaScript e sem pausa (`<html data-motion>`), botão "Pausar animações" no rodapé, movimento reduzido sem loops, figuras só em loop enquanto visíveis (pausa longa entre ciclos), reflexos CSS a cada 9 s (cubo) e 12 s (trilho).

Achados da revisão independente tratados: estado "armado" só abaixo da dobra com rede de segurança de 4 s e regra de impressão (nada escondido); transição do carrossel nas propriedades certas (`translate`, `scale`); testes frágeis (seletor da API restrito ao cartão, só a figura centralizada, espera de hidratação). Não tratado: custo de repintura de `mask-position` no reflexo do cubo (documentado; medir antes de mudar). A pausa fica no rodapé, não no cabeçalho.
