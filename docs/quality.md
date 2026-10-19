# Qualidade

## Comandos

| Comando | O que prova |
| --- | --- |
| `npm run lint` | ESLint com presets oficiais do Next (core-web-vitals + TypeScript) e `quality/max-lines` (350 linhas) |
| `npm run typecheck` | `tsc --noEmit` com TypeScript estrito |
| `npm run lint:typed` | Perfil tipado: `@typescript-eslint/no-floating-promises` e `no-misused-promises` só em `src/**/*.{ts,tsx}` (28 arquivos); `tests/` e configurações da raiz não recebem essas regras |
| `npm run lint:rules` | Autoverificação das regras locais (`eslint-rules/`) com o `RuleTester` do ESLint |
| `npm run test:e2e` | Playwright: constrói o site em produção, sobe na porta 3100 com ambiente próprio e roda os projetos `desktop`, `mobile` e `unit`. **Falha se a porta 3100 já estiver em uso** (não reaproveita servidor antigo) |
| `npm run check` | Todos os anteriores em sequência. Não publica, não conecta a produção, não aplica migrações |

O build de produção (`npm run build`) exige `NEXT_PUBLIC_SITE_URL`; os testes Playwright definem a variável no próprio servidor de teste. Execute o teste de um arquivo com `npx playwright test <arquivo>`; rode a suíte completa antes de concluir.

## Regras de base

- TypeScript estrito e presets oficiais do framework.
- Limite de 350 linhas por arquivo de código; refatore por responsabilidade real, preservando APIs, erros, validação e acessibilidade.
- Nenhum segredo em código client; configuração só em módulos de servidor.
- Acessibilidade WCAG 2.2 AA e regras de interface em `docs/design.md`.
- As regras `quality/no-direct-console` e `quality/no-direct-data-access` existem em `eslint-rules/`, mas **não estão ativas**: o projeto não tem logger de servidor nem camada de dados. Ative-as quando esses contratos existirem.

## Estratégia de testes

Cobrem comportamento visível e regressões, não repetem o código:

- **e2e (`desktop` e `mobile`):** estrutura e SEO (h1 único, `lang`, regiões nomeadas, metadados, robots, sitemap, origem pública), canais de contato sem links fictícios, portfólio vazio sem cases, navegação por teclado, menu mobile, tokens do design system, texto mínimo de 14 px, foco sem alterar o raio e comportamento do `Reveal` (com movimento reduzido e sem JavaScript).
- **Fase 3A (`prototype-3a.spec.ts`):** hero (texto aprovado, composição decorativa, cubo com prioridade alta, nada invisível com movimento reduzido nem durante os atrasos), header transparente e com superfície ao rolar, menu mobile alcançável em 568×320, 667×375 e 390×844 (F04), ausência de rolagem horizontal de 320 a 1440 px, fichas do hero dentro da viewport de 1024 a 1920 px, e a ilustração de APIs e integrações (legenda curta, rótulo conceitual, sem nomes de empresas nem números de resultado, botão Repetir, estado final, movimento reduzido e sem JavaScript).
- **Fase 4:** `phase-4.spec.ts` (cinco benefícios com cena decorativa, ausência de `sticky`, nenhum número de resultado, Projetos sem cases e com o fluxo Problema → Solução → Tecnologias, alternância de superfícies, sem rolagem horizontal de 320 a 1440 px) e `contact.spec.ts` (canais sem links fictícios, formulário: rótulos, contraste da borda ≥ 3:1, validação, foco no primeiro inválido, valores preservados com e sem JavaScript, campo isca fora da árvore de acessibilidade).
- **unit:** `contact.spec.ts` (validação, e a Server Action contra um destino HTTP local: inválido, indisponível, honeypot, sucesso só com 2xx e payload exato, HTTP 500, destino inalcançável, redirecionamento não seguido, tempo esgotado e teto do tempo, sem vazamento de URL, host, e-mail ou mensagem no log) e `resolveSiteUrl` (desenvolvimento, produção, vazio, inválido, protocolo não web, normalização).

**Não existem:** auditoria automatizada de acessibilidade (axe), medição de Core Web Vitals, teste com leitor de tela real, teste em Safari/Firefox (os dois projetos usam Chromium), teste de envio real para um destino de produção (o caminho de sucesso foi provado com destino de teste). Não declare conformidade WCAG integral nem aprovação de Core Web Vitals sem esses dados.

### Capacidades adotadas e o que cada uma provou (17/10/2026)

| Capacidade | Evidência de execução | Pendente |
| --- | --- | --- |
| `next-bundle-optimizer` | `next analyze --output --snapshot` concluiu em 57 s (7 rotas) e `next analyze export` emitiu 5.601 registros JSONL. Somente análise; nenhum código alterado | Interpretar o baseline quando houver uma otimização pedida |
| `next-dev-loop` | Validado ao vivo (18/10/2026): `/_next/mcp` com `get_compilation_issues` (0 problemas) e `get_routes` (6 rotas); `agent-browser` 0.39.1 leu a página, clicou em um CTA (URL passou a `#solucoes`) e o console ficou sem erros | Repetir após mudanças relevantes de runtime; `open` contra `next dev` não devolve o controle (usar `snapshot`) |
| Chrome DevTools MCP | Servidor fixado em 1.11.0 respondeu ao handshake MCP e listou 32 ferramentas, incluindo `lighthouse_audit` e traces de desempenho | Uso real por um cliente; as ferramentas apareceram na lista da sessão, mas não foram chamadas |
| Graphify | Grafo só de código: 191 nós, 316 arestas, 47 arquivos, 5,6 s; `query` e `path` confirmaram uma relação conhecida | Grafo desatualiza a cada mudança: regenerar antes de confiar nele; semântica de documentos não gerada |
| RTK | `rtk gain` responde (versão correta) e `rtk init --show` confirma o hook | Reescrita real de comandos só observável em sessão nova |
| Context7 | Endpoint remoto e a ferramenta MCP no cliente (sessão de 18/10/2026) responderam com documentação real do Next.js | Índice lista versões até 16.2.9, anteriores ao 16.4.2 do projeto; confirmar contra `node_modules/next/dist/docs/` |
| Revisão de segurança | Prompt em `docs/prompts/security-review.md` | Nenhuma revisão executada neste projeto |

Instalação e descoberta não provam execução: a coluna "Evidência" só registra o que foi observado.

### Lint tipado

Duas regras (`no-floating-promises`, `no-misused-promises`) com severidade `error`, em `eslint.typed.config.mjs`, sobre `src/`. Medido neste runner (Windows, Node 24): 0 problemas em 43 arquivos varridos (as regras tipadas valem para os 28 de `src/`), 8,5 s dentro do processo (cerca de 16 s com `npx`) e pico de 664 MB. Como não havia violações, a severidade começou em `error`. Provado reprovando: uma promessa solta e um callback assíncrono onde se esperava `void` produzem 2 erros e saída 1; um arquivo de 360 linhas produz erro de `quality/max-lines`.

### Desempenho e acessibilidade automatizada (Fase 3A, laboratório)

Medido em 18/10/2026 no build de produção local (`next start`), antes (commit `fb65d08`) e depois da Fase 3A. Três execuções por perfil, mediana; CDP com cache desligado; celular com CPU 4× e rede de 9 Mbps e 40 ms. **Laboratório, não dados de campo:** Core Web Vitals reais continuam sem medição.

| Métrica | Antes | Depois |
| --- | --- | --- |
| LCP celular (script CDP) | 512 ms | 564 ms |
| LCP desktop (script CDP) | 108 ms | 200 ms |
| LCP celular (trace do DevTools, CPU 4× e Fast 4G) | 1.551 ms (atraso de renderização 952 ms) | 943 ms (390 ms) |
| CLS | 0,00 | 0,00 |
| JS / CSS / documento / fontes | 143,2 / 7,3 / 10,8 / 46,4 KB | 143,9 / 9,3 / 15,4 / 46,4 KB |
| Imagem do cubo (elemento de LCP) | 57,7 KB no celular, 46,4 KB no desktop | 46,4 KB nos dois |

Leitura honesta: o LCP do script subiu de 50 a 90 ms (ainda longe de 2,5 s) e o do trace do DevTools caiu. Os dois usam metodologias diferentes e não devem ser somados. O `preload` do cubo recuperou o celular (636 → 548 ms antes do ajuste final); a causa dos ~90 ms restantes no desktop **não foi isolada** (hipóteses não testadas: rasterização dos gradientes de luz, início das animações). Metas do `ILLUSTRATION-SYSTEM.md` atendidas: imagem ≤ 150 KB, JS adicional ≤ 15 KB, CLS 0.

Lighthouse mobile (Chrome DevTools MCP, auditoria automatizada): Acessibilidade 100, Boas práticas 100, SEO 100, 54 auditorias aprovadas e 0 falhas. Isso **não** equivale a conformidade WCAG completa.

**Fase 4 (mesmo método, 18/10/2026):** LCP celular, script CDP: 776 / 624 / 692 ms em três rodadas de três execuções (variação de 596 a 976 ms; Fase 3A: 564 ms). LCP desktop: 240 / 248 / 260 ms (Fase 3A: 200 ms). Trace do DevTools no celular: **1.024 ms**, CLS 0,00 (Fase 3A: 943 ms; baseline original: 1.551 ms). JS 146,7 KB (+2,8 KB, o formulário e a Server Action), CSS 10,4 KB, documento 22,9 KB, imagem do hero 46 KB. Lighthouse mobile: Acessibilidade, Boas práticas e SEO em 100, 58 auditorias aprovadas e 0 falhas.

Um **CLS de 0,026** apareceu em uma das execuções desktop da primeira rodada e **não se reproduziu** em duas rodadas completas nem em 14 execuções extras com registro das fontes do deslocamento; a causa não foi identificada. O LCP do script oscila bastante entre execuções (centenas de ms), então diferenças menores que ~150 ms entre fases não são conclusivas.

## Revisão após implementação ou correções

Dimensione a revisão ao risco e ao diff real; use revisão independente em trabalho não trivial quando disponível. Registre o alvo exato, chamadores, contratos e testes conectados, achados confirmados e cobertura. Rodadas extras exigem nova evidência ou risco não resolvido; respeite contagem pedida pelo usuário sem inventar ciclos. Termine quando os achados relevantes estiverem resolvidos ou justificados, as checagens afetadas passarem e a verificação integrada e os riscos residuais estiverem registrados. Revisão independente indisponível ou checagem bloqueada fica como limitação explícita. Relatórios existentes: `docs/reviews/`.

## Revisão de segurança

- **Prompt reutilizável:** `docs/prompts/security-review.md` (cópia do toolkit, revisão registrada no cabeçalho). Modo repositório por padrão; modo diff com `base`, `head`, tipo de comparação e `dirty`.
- **Skill:** `differential-review`, para mudanças sensíveis (por exemplo, o formulário de contato e seu webhook, quando existirem). Escopo e limites do prompt prevalecem sobre exemplos da skill, como `git checkout`.
- **Relatório:** somente leitura, redigido, **fora do repositório**, em local privado. Não publique achados sensíveis nem os grave na documentação. Registre aqui só data, escopo e situação.
- **Faixa para o modo diff:** o histórico começa em `a370506` e tem os commits de 18/10/2026 (`git log`). Informe `base` e `head` reais; alterações sem commit entram só com `dirty=include`, e `head` precisa ser o `HEAD` atual.

## Dependências e entrega

| Auditoria (17/10/2026) | Resultado |
| --- | --- |
| `npm audit --omit=dev` (produção) | 0 vulnerabilidades |
| `npm audit` (completa) | 5 altas, todas na cadeia de desenvolvimento do `eslint-config-next`: `braces` (GHSA-vfj7-8cjw-p6xm, negação de serviço por esgotamento de pilha) e `micromatch`, `fast-glob`, `@next/eslint-plugin-next`, `eslint-config-next` |

**Decisão:** não aplicar a correção que o `npm audit` oferece, porque ela **rebaixa** `eslint-config-next` para a versão 14 (incompatível com o Next 16). Não há correção compatível: o `braces` 3.0.3 é a versão mais recente e ainda está afetada. A exposição é só de ferramenta de lint em máquina de desenvolvimento, processando padrões de glob locais, sem entrada de visitantes. **Revisitar** quando houver nova versão do `braces` ou do `eslint-config-next`.

Passar em lint e build não significa auditoria limpa. As verificações são comandos explícitos; hooks do Git, bloqueios de push e exigência de branch não são padrão. Atualize este documento junto com scripts e regras que mudarem.
