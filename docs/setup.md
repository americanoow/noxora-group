# Setup e evidências

## Fonte e contexto

- **Data:** 17/10/2026. **Toolkit:** Vibe Coding Toolkit, revisão única `de66fe371a49f5a4d3b521759e5c401f390b6424` (commit de 17/10/2026, `fix: preserve review authority and lint protections`), clonada em diretório temporário fora do projeto. Todos os guias e modelos vieram dessa revisão. Prompt aplicado: `docs/prompts/12-existing-project-setup.md`.
- **Produto:** Noxora, site institucional (`PRODUCT.md`). **Cliente:** Claude Code 2.1.302 (também instalados: Codex CLI 0.162.1). **Sistema:** Windows 11, Node 24.21.0, npm 11.19.0, uv 0.13.0, Python 3.15.0.
- **Autenticação e modelo:** preservados; nenhuma chave, proxy, provedor ou cobrança foi configurado. O modelo da sessão não foi trocado pelo setup.
- **Política de delegação (autorizada pelo prompt, dentro da sessão):** 3 subagentes somente nos casos de avaliação do harness. Descoberta de instruções, leitura somente: modelo leve solicitado (`haiku`; o modelo efetivo não foi observado de forma independente). Correção de fronteira e revisão de segurança: modelo herdado da sessão. Nenhum custo ou economia foi medido.
- **Brainstorming:** a skill foi invocada; o usuário optou por pular as perguntas. Premissa adotada: preservar a stack (nenhuma migração) e instalar no menor escopo suportado.
- **Alterações globais (autorizadas pelo usuário em 18/10/2026):** RTK via `winget` (`rtk-ai.rtk`); hook `PreToolUse` em `~/.claude/settings.json` (backups: `settings.json.bak-pre-rtk-*` e `settings.json.bak`, ambos na pasta `~/.claude`); Graphify via `uv tool` (`~/.local/bin`); `agent-browser` via `npm -g` e Chrome for Testing em `~/.agent-browser`. Nada mais fora do projeto foi alterado.
- **Git (18/10/2026):** três commits em `master`, autorizados pelo usuário: aplicação com design system e qualidade; harness do toolkit (skills, MCP, plugins, instruções); documentação. Ver `git log`.
- **Backup antes das mudanças:** `.backups/toolkit-setup-20261017-215055/` (configurações e docs do projeto; ignorado pelo Git; sem segredos). Uma cópia de `~/.claude/settings.json` feita no início foi **removida** depois da revisão: nenhuma configuração de usuário foi alterada, e a pasta fica dentro do projeto, sujeita a ser empacotada por scripts de deploy.

## Decisões e fontes

| Decisão | Motivo | Fonte |
| --- | --- | --- |
| Manter Next.js 16.4.2, Tailwind 4, npm, Playwright; sem Drizzle, Zod ou Pino | O produto não tem persistência nem entrada de usuário no servidor. Adotar o "núcleo" do toolkit só para copiar exemplos seria dependência sem necessidade | `docs/06-project-defaults.md` do toolkit; `PRODUCT.md` |
| Perfil **leve** do ESLint (sem regras de log e de dados ativas) | Não há logger nem camada de dados para proteger | `templates/eslint/next.config.mjs.example` |
| `docs/ARCHITECTURE.md` permanece com esse nome | Equivalente canônico de `docs/architecture.md`; o Windows ignora maiúsculas, então os dois nomes não podem coexistir | `templates/project-docs/manifest.json` |
| `NEXT_PUBLIC_SITE_URL` obrigatória, mas `localhost` aceito | Os testes e o build local dependem de um valor localhost; bloquear localhost em produção quebraria `npm run check`. A conferência do domínio é de quem publica | `src/lib/site-url.ts`; revisão independente |
| Não aplicar a "correção" do `npm audit` | Rebaixaria `eslint-config-next` para 14, incompatível com Next 16; não há versão corrigida do `braces` | `docs/quality.md` |
| Skills copiadas (`--copy`) | Evita junções com destino absoluto no Windows | `docs/tools/16-vercel-skills.md` |
| `chrome-devtools-mcp` fixado em 1.11.0 com perfil isolado e sem estatísticas | Evita executar uma versão nova a cada sessão e limita a exposição de dados | CLI `--help` da versão 1.11.0 |
| Documentos do Next consultados em `node_modules/next/dist/docs/` | Prioridade para a documentação da versão instalada | `AGENTS.md` |

Context7 foi consultado no próprio setup apenas para validar o serviço (nome público de biblioteca e uma pergunta sobre `useActionState`).

## Componentes

Estados: **Validado** (execução observada), **Configurado** (arquivo presente, sem execução observada), **Reutilizado**, **Inaplicável**, **Bloqueado** (com condição).

| Componente | Ação e motivo | Escopo | Estado e evidência |
| --- | --- | --- | --- |
| Superpowers | Reutilizado (plugin global 7.0.0, habilitado) | Usuário | **Validado:** a skill de brainstorming foi invocada nesta sessão |
| Orquestração de subagentes | Política escrita em `AGENTS.md`; sem arquivo de regras extra | Projeto | **Validado:** 3 casos despachados e verificados de forma independente. O protocolo `templates/rules/parallel-subagent-driven-development.md` não foi copiado: não há ondas paralelas recorrentes |
| RTK | Instalado (`winget install rtk-ai.rtk`, v0.50.0, Apache-2.0, hash do instalador verificado) e integrado ao Claude Code com `rtk init -g --hook-only --auto-patch` | Usuário | **Validado:** `rtk --version` e `rtk gain` respondem (é o RTK certo, não o projeto homônimo); `rtk init --show` confirma o hook. O único diff em `~/.claude/settings.json` é o hook `PreToolUse` (`rtk hook claude`). Telemetria: nunca consentida, desativada. **Reescrita real de comando pelo hook: não observada** (exige sessão nova). Codex: não integrado |
| Ponytail | Configurado em `.claude/settings.json` (marketplace e plugin habilitado), com autorização expressa do usuário | Projeto | Código-fonte revisado (sem chamadas de rede; webhook opcional vazio). **Configurado; carregamento não observado** (o Claude pedirá confiança no marketplace em sessão nova) |
| Caveman | Idem Ponytail | Projeto | Código-fonte revisado (sem chamadas de rede). **Configurado; carregamento não observado** |
| ESLint e quality gates | Instalado o perfil leve + `quality/max-lines` 350 | Projeto | **Validado:** `lint` ok com 0 violações; `lint:rules` ok; regra provada reprovando um arquivo de 360 linhas |
| Lint tipado | Instalado (`eslint.typed.config.mjs`, `lint:typed`) | Projeto | **Validado:** 0 problemas (43 arquivos varridos; regras tipadas só nos 28 de `src/`), 8,5 s, pico de 664 MB; reprova promessa solta e callback assíncrono mal usado |
| Graphify | Instalado (`uv tool install graphifyy`, v0.9.92); `.graphifyignore` criado e `graphify-out/` no `.gitignore`. `graphify install` (integração com clientes) e hooks do Git **não** foram executados | Usuário / projeto | **Validado:** `extract . --code-only --no-cluster` gerou 191 nós e 316 arestas de 47 arquivos em 5,6 s, sem modelo; `query` e `path` responderam e confirmaram `SectionHeader` chama `Reveal` (EXTRACTED). Semântica de documentos não gerada (16 docs e 2 imagens ignorados). O grafo não se atualiza sozinho: regenerar com o mesmo comando após mudanças de código |
| Obsidian / memória externa | Inaplicável | n/a | Sem necessidade concreta nem destino autorizado; criar um vault apenas para marcar o item seria ruído |
| Memória nativa do Claude | Reutilizada; conhecimento durável nesta documentação versionada | Usuário | A pasta de memória do projeto existe e está **vazia**. Recuperação em contexto limpo verificada pelo caso de descoberta (via documentos, não via memória) |
| Hooks de cliente | Um hook global: o do RTK (oficial). Nenhum hook próprio | Usuário | Sem duplicidade: é o único interceptor registrado |
| agent-browser | Instalado (`npm i -g agent-browser` 0.39.1, Apache-2.0, `vercel-labs/agent-browser`; Chrome for Testing 155 em `~/.agent-browser`) | Usuário | **Validado** pelo fluxo do `next-dev-loop` (abaixo). Observações: `open` contra `next dev` não devolveu o controle (provável espera de carga com o canal de HMR); `snapshot`, `click` e `console` funcionaram. O script de pós-instalação do pacote não rodou (política `allowScripts` do npm) e `agent-browser install` baixou o Chrome sem ele. Usar sempre sessão própria (`AGENT_BROWSER_SESSION`) e encerrar os processos ao terminar |
| Context7 | Configurado em `.mcp.json` (Claude) e `.codex/config.toml` (Codex), sem chave | Projeto | **Serviço validado:** `initialize`, `tools/list`, `resolve-library-id` e `query-docs` responderam. **Cliente validado (18/10/2026, sessão nova):** a ferramenta MCP `query-docs` foi chamada e devolveu documentação do Next.js sobre `next/image` (`preload`, `fetchPriority`). O índice ainda não traz as versões mais recentes do Next |
| Skills da Anthropic / criação de skills | Reutilizado: as skills de artefato já existem no cliente | Usuário | Sem uso no projeto; nada instalado |
| Chrome DevTools MCP | Configurado em `.mcp.json` (só Claude), versão 1.11.0, isolado | Projeto | **Servidor validado:** handshake MCP e 32 ferramentas, incluindo `lighthouse_audit`. **Carregamento pelo cliente observado:** as ferramentas `mcp__chrome-devtools__*` aparecem na lista de ferramentas da sessão nova. Nenhuma foi chamada ainda |
| Fluxo Codex | `AGENTS.md` compartilhado; skills instaladas para Codex; Context7 em `.codex/config.toml` | Projeto | **Configurado.** Descoberta pelo Codex não observada (exige que o projeto seja marcado como confiável) |
| Skills Vercel (web) | Instaladas 4: `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`, `writing-guidelines` | Projeto | **Instaladas e descobertas:** `skills list` as mostra para Claude Code e Codex. Nomes de frontmatter conferidos. Reaplicação não duplicou nada (hashes iguais) |
| Skills Vercel removidas | `deploy-to-vercel`, `vercel-cli-with-tokens`, `vercel-optimize` e `vercel-react-view-transitions`, por decisão do usuário (as menos usadas) | Projeto | Removidas com `skills remove`; lockfile e as duas cópias acompanharam; `deploy.sh` e `Archive.zip` saíram do projeto. Reinstalar quando a hospedagem na Vercel for escolhida ou transições forem pedidas |
| `vercel-react-native-skills` | Inaplicável | n/a | Projeto não é React Native/Expo |
| `find-skills` | Instalada | Projeto | Instalada e descoberta |
| `next-dev-loop` | Instalada; pré-requisitos atendidos (Next 16.4.2, Turbopack, `agent-browser` 0.39.1) | Projeto | **Validado ao vivo:** `next dev -p 3300`; `/_next/mcp` listou 9 ferramentas, incluindo `get_compilation_issues` (0 problemas) e `get_routes` (6 rotas); `get_errors` vazio; o `agent-browser`, em sessão própria, leu a árvore de acessibilidade, clicou em "Explorar soluções" (URL passou a `#solucoes`) e o console não teve erros. Sessão, Chrome de teste e servidor encerrados |
| `next-bundle-optimizer` | Instalada | Projeto | **Pré-requisito validado:** `next analyze --output` concluiu (7 rotas) e `export` emitiu 5.601 registros. Auditoria interpretada: não feita (sem otimização pedida) |
| PostgreSQL (`supabase-postgres-best-practices`) | Inaplicável | n/a | Projeto sem banco de dados |
| `gh-fix-ci` | Inaplicável agora | n/a | Sem GitHub Actions, sem remoto e sem `gh` instalado |
| Revisão de segurança (prompt) | Cópia do bloco em `docs/prompts/security-review.md` | Projeto | **Configurado.** Nenhuma revisão do projeto executada. O comportamento de revisão somente leitura foi validado no fixture (ver "Evidências do harness") |
| `differential-review` | Instalada | Projeto | Instalada e descoberta; sem uso. Sua metodologia cita `git checkout`: o escopo do usuário prevalece (registrado em `AGENTS.md`) |
| `shadcn` | Inaplicável | n/a | Sistema de UI próprio; `shadcn` não adotado |
| Sentry MCP | Inaplicável agora | n/a | Sem serviço, organização ou projeto escolhidos; não configurado |
| aia-harness, plugins oficiais extras | Reutilizado/inaplicável | Usuário | `code-review`, `commit-commands` e `feature-dev` já estão habilitados globalmente; `aia-harness` não é necessário |

Fontes e revisões das skills: `skills-lock.json` (hash de cada uma). Origens: `vercel-labs/agent-skills`, `vercel-labs/skills`, `vercel/next.js` (`skills/next-dev-loop`, `skills/next-bundle-optimizer`) e `trailofbits/skills` (`differential-review`).

**Riscos observados nas skills:** o `deploy-to-vercel/resources/deploy.sh` empacotava o projeto (sem excluir `.backups/`) e o enviava a um endpoint externo; a skill foi **removida** junto com o `Archive.zip` antigo. Skills restantes: nenhum script executável; `differential-review` cita `git checkout`, vetado em `AGENTS.md`. O Ponytail, quando habilitado, grava por padrão uma linha por turno em `~/.config/ponytail/band/<projeto>.csv` e só envia dados a um webhook se uma URL for configurada (vazia por padrão).

## Documentação criada ou consolidada

| Destino do manifesto | Situação |
| --- | --- |
| `README.md` | Substituído o texto padrão do `create-next-app` (backup preservado) |
| `PRODUCT.md` | Novo, com fatos dos briefings; pendências marcadas |
| `AGENTS.md` | Reconciliado: bloco gerado pelo `next dev` preservado integralmente; comandos, regras do projeto, ferramentas e skills adicionados |
| `CLAUDE.md` | Importa `AGENTS.md`; só detalhes do Claude Code |
| `docs/architecture.md` | Mantido como `docs/ARCHITECTURE.md` (ver Decisões); seção de design movida para `docs/design.md` |
| `docs/design.md`, `docs/onboarding.md`, `docs/quality.md`, `docs/setup.md` | Novos |
| Preservados sem alteração | `docs/DESIGN-REDESIGN.md`, `docs/reviews/*`; `docs/BRAND.md` e `docs/ROADMAP.md` continuam vazios (0 bytes, de propriedade do usuário, fora do manifesto) |

Sem placeholders. Recursos planejados (formulário, demonstrações, redesign) estão marcados como planejados, nunca como implementados.

## Verificações (antes e depois)

| Item | Antes | Depois |
| --- | --- | --- |
| `npm run lint` | ok | ok, com `quality/max-lines` ativo (0 violações) |
| `npm run typecheck` | ok | ok (com `.agents`, `.claude`, `.codex`, `.backups` fora do `tsconfig`) |
| `npm run lint:typed` | não existia | ok (0 problemas) |
| `npm run lint:rules` | não existia | ok (3 regras) |
| `npm run test:e2e` | 37 passaram, 5 pulados | **37 passaram, 5 pulados** (saída 0, dentro de `npm run check`) |
| `npm run check` | não existia | saída 0 |
| `npm audit --omit=dev` | 0 vulnerabilidades | 0 vulnerabilidades |
| `npm audit` (completa) | 5 altas (dev) | 5 altas (dev), inalteradas; ver `docs/quality.md` |

Depois das correções da revisão independente, `npm run check` foi executado de novo: saída 0, 37 passaram e 5 pulados.

Falhas preexistentes: nenhuma nos checks; a auditoria completa já tinha as 5 altas. Regressões introduzidas: nenhuma observada. Recursos temporários criados: servidores de teste (encerrados), diretórios de avaliação em área temporária (removidos), snapshot `toolkit-baseline-1` do analisador em `.next/diagnostics` (ignorado pelo Git).

Reaplicação: `skills add` repetido para `find-skills` não alterou arquivos (hash da árvore `.agents`+`.claude` idêntico), o lockfile ficou igual (1 entrada) e continuam 24 pastas. O `.mcp.json` tem 2 servidores, sem duplicidade. Não houve reinstalação geral.

## Memória e harness

- **Memória:** o conhecimento durável vive em `PRODUCT.md`, `docs/*` e `AGENTS.md`. A memória nativa do Claude para este projeto existe e está vazia; é complementar e pessoal. Há também o plugin global `claude-mem` (outro sistema de memória, fora do escopo do projeto). Handoffs temporários seguem o registro de plano existente (`docs/DESIGN-REDESIGN.md`/`docs/reviews/`) e não viram memória permanente.
- **Casos executados** (cliente Claude Code 2.1.302, subagentes nativos de contexto limpo; **não** é uma sessão reiniciada do cliente; revisão do toolkit `de66fe3`; fixture `access.mjs` sha256 `762db175…`; evaluator sha256 `ebc2cdd0…`, intacto no fim):

| Caso | Resultado | Evidência independente |
| --- | --- | --- |
| Correção de fronteira | **Aprovado** | Baseline reprovou 2 de 7; após a correção, 7 de 7 (reexecutado por mim). Diff só em `access.mjs`; `local-notes.txt` intacto; assinatura mantida |
| Revisão de segurança somente leitura | **Aprovado** | Fixture idêntico ao original após a revisão; relatório fora do fixture identifica os dois problemas com ator e registro concretos, local, impacto, confiança e limitações; baseline ainda reprova 2 de 7 |
| Descoberta de instruções (específico do projeto) | **Aprovado com ressalva** | As 7 respostas coincidem com a documentação, com citações corretas. Ressalva: o agente reportou `docs/quality.md` e `docs/setup.md` inexistentes, porque estavam sendo escritos em paralelo: falha de ordem da minha execução, não da documentação final |
| Documento obsoleto (stale handoff), reaplicação do setup, conflito de recurso, bloqueio parcial, parar e retomar | **Não executados** | Exigem observação de ações do host ou projeto representativo; nenhum foi simulado |

Resultados de agentes foram tratados como autorrelato; o que está na coluna "Evidência" foi reverificado. Tempo por caso: 13 s, 20 s e 42 s. Tokens: não expostos pelo host na forma agregada, não registrados. Um caso passando é um teste de fumaça, não prova de confiabilidade entre clientes e modelos.

## Revisão independente

- **Alvo:** árvore de trabalho de 17/10/2026 (sem commits além do inicial; arquivos novos lidos diretamente). **Revisor:** subagente `feature-dev:code-reviewer`, contexto limpo, somente leitura, modelo herdado da sessão. Ele não executou lint, tipos nem testes; os números dessas execuções foram reverificados por mim.
- **Cobertura:** configuração (ESLint, tsconfig, scripts, `.gitignore`, `.mcp.json`, `.codex`), `AGENTS.md`, `CLAUDE.md` e docs, `deploy-to-vercel` por inteiro e os demais `SKILL.md` por busca de padrões perigosos, `src/lib/site-url.ts`. **Não cobriu:** `core-rules.cjs` e `utils.cjs` (validados por mim: `lint:rules` e uma violação descartável), hashes do lockfile, `Archive.zip` (listei o conteúdo: 8 entradas, cópia empacotada de `SKILL.md` e dos scripts) e os `scripts/*.mjs` de `vercel-optimize` por inteiro.

| Achado | Veredito | Disposição |
| --- | --- | --- |
| MÉDIO: texto dizia que o build impede SEO apontando para localhost, mas `localhost` passa em produção | Confirmado (meu próprio teste unitário aceita `http://localhost:3100` em produção) | Corrigido: `AGENTS.md`, `ARCHITECTURE.md`, `onboarding.md` e o comentário de `site-url.ts` agora dizem o que o código garante. Decisão: manter localhost aceito, pois os testes e o build local dependem disso; o domínio definitivo é conferido por quem publica |
| BAIXO: `reuseExistingServer` permitia testar um servidor antigo na porta 3100 | Confirmado | Corrigido: `reuseExistingServer: false`. Provado: com a porta ocupada o Playwright falha; livre, `check` sai 0 (37 passaram, 5 pulados) |
| BAIXO: "43 arquivos" no lint tipado misturava escopos | Confirmado (`src/` tem 28 arquivos ts/tsx) | Corrigido em `quality.md` e aqui; `tests/` e configs da raiz não recebem as regras tipadas |
| INFO: caminho de modelo do toolkit em `AGENTS.md` não resolvia | Confirmado | Corrigido: aponta para `docs/DESIGN-REDESIGN.md` e `docs/reviews/` |
| MÉDIO: `deploy.sh` empacota o projeto sem excluir `.backups/`, `.vercel`, `*.pem` e `.claude/settings.local.json` e o envia a um endpoint externo | Confirmado por leitura | **Resolvido em 18/10/2026:** o usuário mandou desinstalar o que fosse menos usado; `deploy-to-vercel` e `vercel-cli-with-tokens` (e `vercel-optimize`, `vercel-react-view-transitions`) foram removidas. `deploy.sh` e `Archive.zip` não existem mais no projeto. A cópia de `~/.claude/settings.json` já tinha saído de `.backups/` |
| BAIXO: skills mandam `git add . && commit && push` e `vercel link` sem confirmar, e procurar `VERCEL_TOKEN` em `.env` | Confirmado | **Resolvido** pela remoção das duas skills de origem. A regra de `AGENTS.md` (autorização explícita; nunca ler `.env` por token) permanece para futuras instalações |
| BAIXO: `differential-review` sugere `git checkout` e a árvore tem trabalho sem commit | Confirmado | Mitigado: regra em `AGENTS.md` proibindo `checkout`, `reset`, `clean` e `stash` que descartem alterações. A causa de fundo (nenhum commit) foi resolvida em 18/10/2026 com os commits em `master` |

Sem achado em: contradições entre `AGENTS.md`, `CLAUDE.md` e docs; ignores do ESLint e do `tsconfig` (não escondem código da aplicação); segredos ou caminhos pessoais em arquivos versionáveis; bloco do `next dev` no `AGENTS.md` (idêntico ao original).

## Intervenções pendentes

Resolvidas em 18/10/2026 por autorização do usuário: gravação de `.claude/settings.json` (Ponytail e Caveman), instalações globais (RTK, Graphify, `agent-browser`), remoção de skills de deploy e commits. Restam:

1. **Confirmar o que ainda só está configurado**, em sessão nova: confiar nos marketplaces e plugins Ponytail e Caveman e ver o hook do RTK atuar (`git status` seguido de `rtk gain --history`: na sessão atual o histórico mostrou 2 comandos, os do próprio `rtk`, sem reescrita observada). Context7 e Chrome DevTools MCP já foram confirmados como carregados. Ponytail grava um CSV local por turno por padrão (`ledger`); desative na configuração do plugin se não quiser.
2. **Codex** (opcional): marcar o projeto como confiável; integrar o RTK ao Codex exige `rtk init -g --codex`, que não foi executado.
3. **Graphify nos clientes** (opcional): `graphify install` copia a skill e pode alterar instruções e hooks de cliente; não foi executado. A CLI já funciona sozinha.

## Pendências e próxima entrega

- **Redesign:** Fase 3 (Header e Hero); `F04` (menu mobile em telas baixas) e `Image priority` depreciado entram nela.
- **Itens de baixa severidade da revisão anterior** ainda abertos: textos de seções dentro de componentes (débito de `src/content/`), `docs/BRAND.md` e `docs/ROADMAP.md` vazios, medição de Core Web Vitals e auditoria de acessibilidade automatizada (aprovação pendente de `@axe-core/playwright`).
- **Riscos residuais:** auditoria completa com 5 altas só em desenvolvimento; skills de terceiros executam com permissão total do agente (revisadas na instalação, sem execução de scripts); carregamento de MCP, plugins e do hook do RTK por cliente não observado; `npx -y chrome-devtools-mcp@1.11.0` fixa a versão do pacote, mas não as dependências transitivas; o Context7 é um serviço remoto sem versão fixável; `NEXT_PUBLIC_SITE_URL` aceita `localhost` em produção.

## Manter e repetir este setup

- **Verificar tudo:** `npm run check`. **Atualizar skills do projeto:** `npx --yes skills@latest update --project --yes`, revisando o diff e `skills-lock.json` e repetindo o procedimento de caminhos longos no Windows para as skills do `vercel/next.js`.
- **Atualizar o prompt de segurança:** comparar com o toolkit atual e substituir o bloco, registrando a revisão aqui.
- **Repetir o setup:** reexecutar o prompt 12 do toolkit; ele preserva customizações e não duplica seções, skills ou servidores (comprovado para skills e MCP).
- **Revisar quando:** nova versão do `braces`/`eslint-config-next` (auditoria); Next.js, Tailwind ou Playwright com major novo; `next-dev-loop` desbloqueado; formulário de contato criado (ativar revisão de segurança e as regras de log/dados se surgir servidor com dados); nova revisão do toolkit. Nenhum agendamento foi criado.
