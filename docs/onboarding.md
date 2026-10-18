# Preparação local

## Pré-requisitos

- Node.js 24 e npm 11 (versões observadas; o projeto não declara `engines`).
- Git. Chrome estável é necessário só para o Chrome DevTools MCP; os testes usam o Chromium do Playwright.
- Ferramentas globais opcionais (instaladas e validadas nesta máquina em 18/10/2026; em outra máquina, repita): RTK (`winget install rtk-ai.rtk`, depois `rtk init -g --hook-only --auto-patch`), Graphify (`uv tool install graphifyy`) e `agent-browser` (`npm i -g agent-browser` e `agent-browser install`). Detalhes e versões em `docs/setup.md`. Nenhuma é necessária para rodar, buildar ou testar o site.

## Primeira execução

```bash
npm ci
npx playwright install chromium   # uma vez por máquina, para os testes
cp .env.example .env.local        # NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev
```

Variáveis (nomes em `.env.example`; **nunca** versione `.env.local`):

- `NEXT_PUBLIC_SITE_URL`: URL pública do site. Obrigatória no build de produção; em desenvolvimento, ausente cai em `http://localhost:3000`.
- `CONTACT_EMAIL`: habilita o canal de e-mail. `WHATSAPP_NUMBER`: habilita o WhatsApp (só dígitos, com DDI e DDD). Sem elas, os cartões aparecem como "em definição".

Variáveis são lidas no build: alterar exige novo build. Não há banco de dados.

## Verificar

```bash
npm run check
```

Executa lint, tipos, lint tipado, autoverificação das regras locais e os testes Playwright (que constroem e sobem o site na porta 3100 com ambiente próprio; se algo já escutar nessa porta, o Playwright falha em vez de testar um servidor antigo). Resultado esperado: todos os comandos com saída 0; os testes reportam alguns pulados de propósito (menu mobile só no projeto mobile; teclado e foco só no desktop).

## Agentes

Leia [AGENTS.md](../AGENTS.md); [CLAUDE.md](../CLAUDE.md) importa as mesmas instruções. Skills, MCP e escopos configurados estão em [setup.md](setup.md).

## Problemas conhecidos

- **`npm run build` falha com "NEXT_PUBLIC_SITE_URL não está definida"**: comportamento intencional (impede esquecer a variável; um valor `localhost` deliberado continua aceito, então confira o domínio definitivo ao publicar). Defina a variável ou copie `.env.example` para `.env.local`.
- **Skills do repositório `vercel/next.js` no Windows**: o guia do toolkit alerta para `Filename too long` ao clonar esse repositório. A instalação de 17/10/2026 aplicou `core.longpaths` só ao processo (variáveis `GIT_CONFIG_COUNT`, `GIT_CONFIG_KEY_n`, `GIT_CONFIG_VALUE_n`), sem alterar a configuração global do Git, e concluiu sem erro. A falha em si não foi reproduzida; repita o mesmo procedimento ao atualizar essas skills.
- **Auditoria de dependências**: `npm audit` reporta 5 vulnerabilidades altas na cadeia de desenvolvimento do `eslint-config-next` (`braces`); a produção tem zero. Ver `docs/quality.md`.
