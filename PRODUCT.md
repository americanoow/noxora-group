# Noxora

Site institucional (landing page) da Noxora. Fatos vêm dos briefings do responsável; o que não foi confirmado está em "Suposições e pendências".

## Problema e objetivo

A Noxora é formada por três profissionais de tecnologia que desenvolvem soluções digitais para empresas e startups: websites e aplicações web, sistemas sob medida, APIs e integrações, automação de processos e soluções digitais personalizadas.

O site precisa ser moderno e marcante, mas também fácil de entender para um empresário que não conhece programação. Objetivo: apresentar as soluções com clareza, transmitir confiança e converter visitantes em conversas com potenciais clientes.

## Público

Decisores de negócios de diferentes portes, de diferentes idades e níveis de familiaridade com tecnologia. Muitos não conhecem programação.

## Fluxos da versão atual

1. **Entender a proposta:** o visitante lê o hero e entende o que a Noxora faz.
2. **Conhecer as soluções e os benefícios:** cada solução explica o benefício comercial, não só a tecnologia.
3. **Ver projetos:** a seção é uma vitrine configurada em `src/content/projects.ts`: três websites de autoria confirmada pelo responsável (Bazar Oliveira, Clínica Multidisciplinar e PeB Estúdio Fotográfico), com capturas e links. A vitrine mostra somente esses três trabalhos construídos. Sem nenhum item, mostra um aviso honesto.
4. **Entrar em contato:** três canais (e-mail, WhatsApp, Instagram `@noxoragroup`). Canal ainda não definido aparece como "em definição", sem link fictício. Depois dos canais há um **formulário** com validação, estado de envio e erro; só confirma o envio depois que o destino confirma, e sem destino configurado avisa que está indisponível.

## MVP

Hero, Soluções, Como ajudamos, Projetos, Contato por canais e formulário, metadados e SEO técnico, ícones e imagem de compartilhamento.

## Planejado (aprovado, ainda não implementado)

- Redesign inspirado em clareza editorial e componentes sóbrios, com identidade própria (plano em `docs/DESIGN-REDESIGN.md`).
- Seção de demonstrações "Tecnologia aplicada ao seu negócio.", sempre identificadas como conceituais.

## Fora de escopo agora

- Seção Sobre e perfis da equipe (adiada pelo responsável).
- Cases, clientes, depoimentos ou números de resultado que não sejam reais e comprovados.
- WebGL ou modelo 3D: o cubo é uma imagem (avaliado e descartado; ver plano).
- Blog, área logada, banco de dados.

## Requisitos

- Idioma pt-BR; mobile-first; acessibilidade WCAG 2.2 AA; respeito a `prefers-reduced-motion`.
- Identidade: fundo preto AMOLED (#000000), acento chrome/prata, logo "NOXORA.", cubo de vidro líquido.
- Nenhum resultado numérico prometido sem evidência. Nenhum segredo em código client.

## Restrições e decisões técnicas

Next.js 16.4.2 (App Router), TypeScript estrito, Tailwind CSS 4, sem persistência. Detalhes e motivos em `docs/ARCHITECTURE.md`.

## Suposições e pendências

| Item | Estado | Impacto |
| --- | --- | --- |
| E-mail de contato | groupnoxora@gmail.com, informado pelo responsável | cartão com link para enviar e-mail |
| WhatsApp de contato | não fornecido | cartão aparece como "em definição" |
| Domínio público | não definido | `NEXT_PUBLIC_SITE_URL` é obrigatória para build de produção |
| Destino do formulário (webhook) | não definido | o formulário avisa que o envio está indisponível e nunca simula sucesso |
| Símbolo circular "N" | arquivo não fornecido | wordmark em texto permanece |
| Integrantes da equipe | não fornecidos | seção Sobre adiada |
| Projetos reais autorizados | três websites informados e autorizados em 19/10/2026 | somente os três sites construídos aparecem na vitrine; sem atribuir resultados comerciais ou tecnologias não confirmadas |
| Política de privacidade (LGPD) | inexistente | necessária antes de coletar dados por formulário |
| `docs/BRAND.md` e `docs/ROADMAP.md` | vazios | critérios de marca e roadmap ainda não registrados |

## Critérios de aceite do produto

- Um visitante leigo identifica, no hero, o que a Noxora faz e qual ação tomar.
- Cada solução apresenta benefício comercial e aplicação, sem afirmar resultado não comprovado.
- Nenhum canal de contato leva a link fictício; canal pendente é identificado.
- Toda a página é utilizável por teclado, com foco visível, em 320 px a 1440 px.
- Critérios técnicos de verificação ficam em `docs/quality.md`.

## Próxima entrega

Portão 3B: validação visual da Fase 3A pelo responsável (hero, header e a ilustração de APIs e integrações), com a escolha tipográfica (D7). Depois, a Fase 4: as quatro ilustrações de serviço e a demonstração interativa.

## Manutenção

Atualize este documento quando objetivo, escopo, restrições ou critérios mudarem. Decisões técnicas e evidências ficam em `docs/ARCHITECTURE.md`.
