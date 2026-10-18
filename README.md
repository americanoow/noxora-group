# Noxora

Site institucional da Noxora: tecnologia sob medida (websites, sistemas, integrações e automações) para empresas e startups. O produto e o escopo estão em [PRODUCT.md](PRODUCT.md).

## Executar

Pré-requisitos: Node.js 24 e npm. Veja [docs/onboarding.md](docs/onboarding.md) para o passo a passo completo.

```bash
npm ci
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL é obrigatória no build
npm run dev                  # http://localhost:3000
```

Verificação completa (lint, tipos, lint tipado, regras locais e testes com build de produção):

```bash
npm run check
```

Variáveis de ambiente (`.env.example`): `NEXT_PUBLIC_SITE_URL` (obrigatória em produção), `CONTACT_EMAIL` e `WHATSAPP_NUMBER` (habilitam os canais de contato). Todas são lidas no build.

## Documentação

- [Produto e escopo](PRODUCT.md)
- [Preparação local](docs/onboarding.md)
- [Estrutura e decisões técnicas](docs/ARCHITECTURE.md)
- [Design e acessibilidade](docs/design.md)
- [Verificações de qualidade](docs/quality.md)
- [Instruções para agentes](AGENTS.md)
- [Setup do toolkit e evidências](docs/setup.md)
- [Plano do redesign](docs/DESIGN-REDESIGN.md) e [relatórios de revisão](docs/reviews/)

## Próxima entrega

Fase 3 do redesign: Header e Hero. Critério observável: hero com a nova headline e composição do cubo, e menu mobile alcançável por inteiro em telas baixas (568×320 e 667×375).
