# Preparação local

## Pré-requisitos

- Node.js 24 e npm 11 (versões observadas; o projeto não declara `engines`).
- Git. Os testes usam o Chromium do Playwright.

## Primeira execução

```bash
npm ci
npx playwright install chromium   # uma vez por máquina, para os testes
cp .env.example .env.local        # NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev
```

Variáveis (nomes em `.env.example`; **nunca** versione `.env.local`):

- `NEXT_PUBLIC_SITE_URL`: URL pública do site. Obrigatória no build de produção; em desenvolvimento, ausente cai em `http://localhost:3000`.
- `CONTACT_EMAIL`: substitui o e-mail público padrão, `groupnoxora@gmail.com`. Ausente ou vazia, mantém o padrão; um valor inválido deixa o canal pendente. `WHATSAPP_NUMBER`: habilita o WhatsApp (só dígitos, com DDI e DDD); sem ela, o número aparece como "em definição".

Variáveis são lidas no build: alterar exige novo build. Não há banco de dados.

## Verificar

```bash
npm run check
```

Executa lint, tipos, lint tipado, autoverificação das regras locais e os testes Playwright (que constroem e sobem o site na porta 3100 com ambiente próprio; se algo já escutar nessa porta, o Playwright falha em vez de testar um servidor antigo). Resultado esperado: todos os comandos com saída 0; os testes reportam alguns pulados de propósito (menu mobile só no projeto mobile; teclado e foco só no desktop).

## Problemas conhecidos

- **`npm run build` falha com "NEXT_PUBLIC_SITE_URL não está definida"**: comportamento intencional (impede esquecer a variável; um valor `localhost` deliberado continua aceito, então confira o domínio definitivo ao publicar). Defina a variável ou copie `.env.example` para `.env.local`.
- **Auditoria de dependências**: `npm audit` reporta 5 vulnerabilidades altas na cadeia de desenvolvimento do `eslint-config-next` (`braces`); a produção tem zero. Ver `docs/quality.md`.
