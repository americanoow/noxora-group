# Revisão independente do marco — Noxora Landing V1

Data: 17/10/2026. Base Git: `a370506` (`Initial commit from Create Next App`).

## Parecer

**Exige correções. Não aprovar o marco no estado revisado.** Foram confirmados quatro problemas: um de severidade alta e três de severidade média. Os testes existentes passam, mas não cobrem os cenários que revelaram essas falhas.

Não houve alteração da implementação por esta revisão. Este relatório é o único arquivo criado no projeto pela revisão; os comandos de validação também regeneraram saídas ignoradas de build, TypeScript e Playwright. Nenhum deploy ou envio para serviço de contato real foi realizado.

## Escopo e método

- Inspeção de `git status`, histórico, diff da árvore e do índice contra `HEAD`, incluindo arquivos novos que não aparecem em `git diff HEAD`.
- Leitura de todos os componentes, conteúdo, utilitários, rotas, estilos e testes em `src/` e `tests/`, configurações, lockfile, `.env.example`, instruções e documentação. Inspeção dos formatos e dimensões dos assets de marca.
- Consulta à documentação da versão instalada em `node_modules/next/dist/docs/`, especialmente Server Actions, fontes, imagens, metadados, ícones e acessibilidade.
- Execução de lint, TypeScript, build de produção, Playwright e verificações adicionais em Chromium. Webhook substituído por um receptor HTTP local com dados sintéticos; sem instalar dependências nem salvar novos testes no repositório.
- Critério de classificação: **confirmado** significa reprodução ou evidência direta no código/artefato; **risco** indica consequência possível, sem ocorrência demonstrada. Alta bloqueia build ou uma capacidade importante; média afeta uso, recuperação ou acessibilidade; baixa corresponde a manutenção e documentação.

Houve alterações concorrentes de marca durante a revisão: `Wordmark.tsx`, `Hero.tsx`, imagens e documentação foram atualizados fora desta revisão. As versões intermediárias dos ícones não foram tratadas como defeitos do estado final. A última inspeção encontrou PNGs válidos: `icon.png` 512×512, `apple-icon.png` 180×180 e `public/images/noxora-icon.png` 1283×1226, com transparência. As quatro falhas abaixo estão em arquivos que permaneceram estáveis durante as reproduções.

## Validação executada

| Verificação | Resultado e alcance |
| --- | --- |
| `npm run lint` | Exit 0; sem erros ou avisos. |
| `npm run typecheck` | Exit 0. |
| `npm run test:e2e` | 26 passaram e 4 foram pulados; inclui build de produção. O encerramento do servidor de teste precisou de intervenção no processo criado pela própria execução; runner terminou com exit 0. |
| `npm run test:e2e -- --workers=2` | 26 passaram, 4 pulados, exit 0, reutilizando o servidor conhecido da execução anterior. |
| Rebuild e E2E após as alterações concorrentes | Build concluído. Uma rodada teve 24 passes, 4 skips e 2 falhas de infraestrutura `ENOENT` ao fechar contextos/salvar traces em `test-results/`; nenhuma dessas duas falhas apontou uma asserção do site. |
| E2E final com saída isolada em `%TEMP%` | **26 passaram, 4 pulados, exit 0**, em 20,7 s, usando a versão recompilada de Hero/Wordmark/ícones. Runner: `node node_modules/@playwright/test/cli.js test --workers=2 --output=<diretorio-temporario-exclusivo>`. |
| Build com `NEXT_PUBLIC_SITE_URL=""` | **Exit 1**, `ERR_INVALID_URL` em `src/app/layout.tsx`, coleta de configuração de `/` e `/_not-found`. |
| Build posterior com ambiente padrão | Exit 0; rotas `/`, ícones, Open Graph, robots e sitemap estáticas. |
| Validação compartilhada do contato | 18 asserções adicionais passaram: limites de nome, empresa e mensagem, formatos de e-mail e trim de FormData. Execução em memória do módulo real, sem persistir testes. |
| Webhook local, com JavaScript | HTTP 200: uma entrega e limpeza após sucesso. HTTP 500 e timeout de 8 s: uma tentativa, mensagem de erro e valores preservados. Honeypot preenchido: zero entregas. |
| Contato sem JavaScript | Envio válido funciona; erro de validação e HTTP 500 apagam os campos, conforme F03. |
| SEO em produção local | Canonical, `og:url`, `og:image`, Twitter, JSON-LD, robots e sitemap conferidos; domínio incorreto na ausência de configuração, conforme F01. `/opengraph-image` respondeu 200 com PNG válido. |
| Layout e navegação | Sem overflow horizontal da página em larguras de 320, 360, 390, 640, 767, 768, 800, 820, 1024 e 1440 px na primeira versão visual. Menu em 568×320 e 667×375 reproduz F04. |
| Contraste e movimento | Cores computadas dos campos conferidas. `prefers-reduced-motion: reduce` desliga `drift`; sem a preferência, animação de 18 s infinita. |

Os quatro skips são esperados: três testes de menu mobile no projeto desktop e um teste de Tab no projeto mobile. Os dois projetos usam Chromium; não equivalem a testes de Safari/WebKit, Firefox ou aparelhos físicos. Não foram executados axe, Lighthouse, auditoria online de dependências, teste de carga ou leitor de tela real. Não há afirmação de conformidade integral WCAG nem de aprovação de Core Web Vitals.

A repetição isolada evitou o desaparecimento de arquivos temporários observado na rodada anterior; uma colisão/limpeza concorrente de artefatos é a explicação provável, sem atribuição a um processo específico. A comparação de hashes com o último snapshot não encontrou novas alterações dos arquivos revisados. Os artefatos finais também foram conferidos: o HTML referencia `noxora-icon.png`, e os dois ícones produzidos pelo build são PNGs com as dimensões esperadas. Todos os servidores iniciados por esta revisão foram encerrados.

## Problemas confirmados

### F01 — Alta — Configuração da URL quebra o build quando vazia e publica SEO de localhost quando ausente

**Arquivos:** [site.ts](../../src/content/site.ts), linha 7; [layout.tsx](../../src/app/layout.tsx), `metadataBase`; [.env.example](../../.env.example), linhas 1–2; [robots.ts](../../src/app/robots.ts), [sitemap.ts](../../src/app/sitemap.ts) e [page.tsx](../../src/app/page.tsx), `organizationJsonLd`.

**Evidência:** o fallback usa `??`, que aceita string vazia. O próprio exemplo contém `NEXT_PUBLIC_SITE_URL=`. Executar o build com essa variável vazia terminou com exit 1 e a seguinte causa:

```text
TypeError: Invalid URL
metadataBase: new URL(site.url)
code: ERR_INVALID_URL
input: ''
```

Com a variável ausente, o build passa, mas o HTML de produção contém canonical e `og:url` iguais a `http://localhost:3000`; a imagem social aponta para esse mesmo host. `robots.txt` publica `Sitemap: http://localhost:3000/sitemap.xml` e o sitemap contém `<loc>http://localhost:3000</loc>`. Isso também afeta a URL da organização no JSON-LD. São duas manifestações da mesma falta de validação da configuração; nenhum domínio real de produção foi auditado.

**Impacto:** copiar o exemplo e deixá-lo sem preenchimento bloqueia build/render; omitir a variável permite gerar artefatos de produção com URLs públicas impróprias. A suíte atual aprova esses artefatos porque verifica presença/status dos metadados, sem conferir sua origem.

**Recomendação:** centralizar normalização e validação de uma URL HTTP(S) absoluta; tratar vazio e espaços explicitamente. Permitir fallback local apenas em desenvolvimento e exigir domínio configurado para publicação, com erro de configuração compreensível. Preencher o exemplo de desenvolvimento com uma URL válida e documentar a exigência de produção. Testar ausência, vazio, URL inválida e uma origem pública fictícia, conferindo canonical, imagens sociais, JSON-LD, robots e sitemap.

### F02 — Média — Contorno dos campos vazios não atende ao contraste não textual

**Arquivos:** [ContactForm.tsx](../../src/components/sections/ContactForm.tsx), linhas 235–236; [globals.css](../../src/styles/globals.css), tokens `line-strong`, `ink` e `surface`.

**Evidência:** no navegador, os inputs usam fundo `rgb(0, 0, 0)`, borda `rgba(255, 255, 255, 0.22)` e formulário `rgb(11, 11, 13)`. A borda se compõe aproximadamente como `#383838`: contraste de **1,79:1** com o interior e cerca de **1,68:1** com a superfície externa. O fundo do campo contra a superfície tem apenas **1,07:1**. Campos vazios não têm placeholder ou outro indicador interno de contraste suficiente para identificar a área editável.

**Impacto:** visitantes com baixa visão têm dificuldade para localizar os limites de inputs e textarea antes de focá-los. O foco branco e os rótulos legíveis não corrigem a identificação visual do controle no estado inicial. O critério [WCAG 2.2, 1.4.11 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) exige 3:1 para a informação visual necessária à identificação desses controles.

**Recomendação:** criar um token de borda de controles com pelo menos 3:1 contra as superfícies adjacentes, ou alterar o preenchimento para fornecer esse contraste. Não é necessário aumentar o contraste de todas as divisórias decorativas. Conferir estado vazio, preenchido, hover, foco e erro, inclusive em dispositivo sem hover. O texto `muted` sobre `surface` passa: medição de aproximadamente 7,67:1.

### F03 — Média — Formulário perde os dados em tentativas sem JavaScript que precisam de correção ou reenvio

**Arquivos:** [ContactForm.tsx](../../src/components/sections/ContactForm.tsx), linhas 70–74 e 239–270; [contact.ts](../../src/lib/contact.ts), `ContactState`; [contact-action.ts](../../src/lib/contact-action.ts), retornos `invalid` e `error`.

**Reprodução:** abrir um contexto Playwright com `javaScriptEnabled: false`, preencher nome, e-mail e uma mensagem curta, e enviar. O servidor apresenta corretamente o erro de tamanho da mensagem, mas os valores retornados de `inputValue()` de nome, e-mail e mensagem são todos `""`. Repetir com dados válidos e webhook local respondendo HTTP 500 também mostra o erro de entrega com todos os campos vazios.

**Causa:** os controles são não controlados, sem valores restaurados no HTML. A resposta da action carrega erros/status, mas não os valores que precisam ser reapresentados. A interceptação por `onSubmit` que preserva os campos com JavaScript não existe nesse caminho.

**Impacto:** o usuário precisa redigitar todo o contato após um erro simples ou uma indisponibilidade. O envio sem JavaScript funciona no caminho feliz, mas sua recuperação está incompleta em relação ao progressive enhancement declarado em `docs/ARCHITECTURE.md`.

**Recomendação:** devolver os valores necessários no estado de falha e reidratá-los nos controles renderizados pelo servidor; limpar apenas após entrega bem-sucedida. Adicionar testes sem JavaScript para erro de validação, indisponibilidade e HTTP 500, verificando preservação dos campos e possibilidade de reenvio. Manter os testes atuais de preservação com JavaScript.

### F04 — Média — Menu mobile não permite alcançar todo o painel em telas baixas

**Arquivo:** [MobileNav.tsx](../../src/components/layout/MobileNav.tsx), linha 65, e CTA nas linhas 80–85; contexto sticky em [Header.tsx](../../src/components/layout/Header.tsx).

**Evidência:** o painel usa posicionamento absoluto sob o header sticky, sem altura máxima nem rolagem própria. Em **568×320**, o CTA final tem `y=340`, `height=48`: fica totalmente fora da viewport. Em **667×375**, fica em `y=348`, `height=48`: os últimos 21 px são cortados. A medição se mantém após rolar a página com wheel. O painel tem `overflow-y: visible` e `max-height: none`; rolar o documento não traz seu rodapé para a tela.

**Impacto:** em paisagem ou com área útil reduzida, o visitante perde acesso visual/tátil ao CTA do menu. Há outros links de contato na página, portanto não se trata de bloqueio total do contato. A suíte só exercita mobile em retrato e não detecta esse caso.

**Recomendação:** limitar a altura do painel ao espaço restante da viewport, considerando a altura real do header e unidades dinâmicas, e permitir rolagem vertical interna. Verificar também foco por teclado, mudança de orientação, fechamento e telas com zoom. Incluir pelo menos 568×320 e 667×375 na regressão.

## Riscos e lacunas — consequências não confirmadas

| Área | Evidência e limite | Recomendação específica |
| --- | --- | --- |
| Abuso do contato | `contact-action.ts` não possui limite de frequência; honeypot só bloqueia quem preenche `website`. Ausência de controle confirmada; spam, custos ou indisponibilidade não foram demonstrados. Não foi realizado teste de carga. | Antes de habilitar o webhook publicamente, definir limite no servidor/infraestrutura e confirmar proteção do destino. Evitar depender somente do campo oculto. |
| Duplicação após timeout | A action informa erro após 8 s sem comprovar se o destino já processou a mensagem. Não há idempotência no contrato atual; duplicação não foi observada no teste de um envio por clique. | Se o receptor puder criar leads antes de responder, definir chave de idempotência e comportamento de retry com essa integração. |
| Observabilidade | O catch registra o objeto de erro completo. Os testes de 500 e timeout não expuseram dados sintéticos nem URL do webhook no HTML; isso não cobre todos os erros de configuração/conexão. | Limitar os logs a tipo/código e identificador de operação; evitar registrar payloads, credenciais e URLs com tokens em cenários de erro. |
| Acessibilidade além da suíte | Sem axe e leitor de tela real. A animação `drift` é infinita sem preferência de redução de movimento e não possui controle na página. A redução pelo sistema foi confirmada; conformidade integral não foi demonstrada. | Avaliar pausa ou duração curta para o movimento e validar experiência com leitor de tela, teclado, zoom e cores forçadas. Não considerar `prefers-reduced-motion` uma auditoria completa. |
| Performance | Fontes auto-hospedadas, página estática e apenas dois componentes client são escolhas favoráveis. O novo PNG do hero tem 1.552.467 bytes na origem, mas é servido por `next/image`: esse número isolado não prova transferência excessiva ou falha de LCP. Não foram medidos CWV. | Medir a versão final com rede/CPU representativas, conferir tamanho otimizado e LCP em desktop/mobile. Rever a prioridade da imagem quando fica abaixo da dobra no mobile. |
| Publicação e conteúdo | Sem configuração, não há WhatsApp e o formulário declara indisponibilidade; equipe e portfólio ainda têm estados pendentes explícitos. Domínio, integração e política de privacidade são pendências já documentadas. | Validar pelo menos um canal real de contato, domínio e conteúdo antes da publicação. Não foram presumidos cases reais nem emitida conclusão jurídica sobre privacidade. |

## Arquitetura, documentação e cobertura

A divisão server/client é adequada à página atual. A validação é compartilhada e repetida no servidor; o webhook vem de configuração do servidor, sem destino controlável pelo visitante nos fluxos revisados. O timeout é limitado, os links externos inspecionados usam `noopener noreferrer` e o JSON-LD escapa `<`. Não se confirmou vazamento do endpoint no HTML nem XSS/SSRF a partir dos campos de contato nos cenários inspecionados.

As seguintes melhorias são de baixa severidade e não representam novos bloqueadores independentes:

- **Contrato de conteúdo divergente:** `CLAUDE.md` e `docs/ARCHITECTURE.md:25` dizem que todo texto editável fica em `src/content/`, mas títulos, descrições e mensagens de Hero, About, Contact, Portfolio e Footer permanecem nos componentes; mensagens também estão em `src/lib/`. Centralizar o conteúdo previsto ou descrever explicitamente a fronteira adotada.
- **Critérios do marco ausentes:** `docs/BRAND.md` e `docs/ROADMAP.md` têm zero bytes. Não é possível verificar fidelidade a decisões de marca ou critérios de aceite não registrados. Documentar os critérios e pendências antes de usar esta revisão como aceite de escopo.
- **README desatualizado:** ainda orienta editar `app/page.tsx`, mas a implementação está em `src/app/page.tsx`. Documentar scripts, variáveis, execução de testes e conexão de contato, com referência à arquitetura.
- **Revisão anterior contraditória:** `docs/reviews/2026-10-17-landing-v1.md:81` afirma não haver imagem raster acima da dobra, embora haja hero raster no desktop. Atualizar essa justificativa de performance e manter separadas medições e suposições.
- **Dependência não utilizada:** `motion` e seus transitivos permanecem no lockfile, sem importação na aplicação. Remover se não houver uso planejado. Não foi atribuído aumento de JavaScript do navegador a uma dependência não importada.
- **API depreciada:** `Hero.tsx:53` usa `priority`; o guia instalado de `next/image` deprecia essa propriedade desde Next 16 em favor de `preload`. Planejar migração conforme a intenção de carregamento; não foi observada quebra funcional dessa propriedade.
- **Cobertura insuficiente:** `tests/e2e/landing.spec.ts:24–33` não verifica o conteúdo/origem de canonical, sitemap e URLs sociais; `contact-form.spec.ts` cobre o webhook ausente, sem sucesso/500/timeout; `mobile-nav.spec.ts` não cobre paisagem. Incorporar as reproduções F01–F04 e um receptor local isolado à suíte. `reuseExistingServer` também exige que a execução local use servidor com o ambiente esperado; a primeira execução desta revisão construiu seu próprio servidor.

## Condições para reapreciação

1. Corrigir F01–F04 e incorporar testes que falhem nas versões defeituosas.
2. Executar lint, tipos, build e E2E em uma árvore estável; repetir os cenários de configuração, recuperação sem JavaScript, contraste e painel em paisagem.
3. Conferir o HTML e assets produzidos contra o domínio/ambiente pretendido e validar o canal de contato antes de publicar.
4. Registrar critérios de aceite e tratamento das pendências conhecidas. Passar na suíte atual, por si só, não resolve as quatro falhas reproduzidas.
