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
- Redesign: [nova direção criativa](docs/CREATIVE-DIRECTION.md) e [sistema de ilustração](docs/ILLUSTRATION-SYSTEM.md)

## Próxima entrega

Portão 3B: validação visual da Fase 3A pelo responsável (hero, header e a ilustração de APIs e integrações), com a escolha tipográfica (D7). Depois, a Fase 4: as quatro ilustrações de serviço e a demonstração interativa.
