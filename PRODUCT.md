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
3. **Ver projetos:** a seção mostra trabalhos reais configurados em `src/content/projects.ts`; sem cases reais, mostra um aviso honesto.
4. **Entrar em contato:** três canais (e-mail, WhatsApp, Instagram `@noxoragroup`). Canal ainda não definido aparece como "em definição", sem link fictício.

## MVP

Hero, Soluções, Como ajudamos, Projetos, Contato por canais, metadados e SEO técnico, ícones e imagem de compartilhamento.

## Planejado (aprovado, ainda não implementado)

- Redesign inspirado em clareza editorial e componentes sóbrios, com identidade própria (plano em `docs/DESIGN-REDESIGN.md`).
- Seção de demonstrações "Tecnologia aplicada ao seu negócio.", sempre identificadas como conceituais.
- Formulário de contato depois dos canais, com validação, estado de envio e erro. Nunca exibe sucesso sem confirmação real.

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
| E-mail e WhatsApp de contato | não fornecidos | cartões aparecem como "em definição" |
| Domínio público | não definido | `NEXT_PUBLIC_SITE_URL` é obrigatória para build de produção |
| Destino do formulário (webhook) | não definido | formulário só pode entregar mensagens depois disso |
| Símbolo circular "N" | arquivo não fornecido | wordmark em texto permanece |
| Integrantes da equipe | não fornecidos | seção Sobre adiada |
| Projetos reais autorizados | nenhum informado | seção Projetos mostra aviso |
| Política de privacidade (LGPD) | inexistente | necessária antes de coletar dados por formulário |
| `docs/BRAND.md` e `docs/ROADMAP.md` | vazios | critérios de marca e roadmap ainda não registrados |

## Critérios de aceite do produto

- Um visitante leigo identifica, no hero, o que a Noxora faz e qual ação tomar.
- Cada solução apresenta benefício comercial e aplicação, sem afirmar resultado não comprovado.
- Nenhum canal de contato leva a link fictício; canal pendente é identificado.
- Toda a página é utilizável por teclado, com foco visível, em 320 px a 1440 px.
- Critérios técnicos de verificação ficam em `docs/quality.md`.

## Próxima entrega

Fase 3 do redesign: Header e Hero, com a headline "Tecnologia que resolve problemas reais.", nova composição do cubo e correção do menu mobile em telas baixas.

## Manutenção

Atualize este documento quando objetivo, escopo, restrições ou critérios mudarem. Decisões técnicas e evidências ficam em `docs/ARCHITECTURE.md` e `docs/setup.md`.
