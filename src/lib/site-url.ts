const DEV_FALLBACK = "http://localhost:3000";

/**
 * Resolve a origem pública do site (canonical, Open Graph, sitemap, JSON-LD).
 *
 * - Aceita só http(s) absoluto; devolve a origem, sem barra final nem caminho.
 * - Em desenvolvimento, valor ausente ou vazio cai em localhost.
 * - Em produção, ausente, vazio ou inválido interrompe o build com uma
 *   mensagem clara. Um valor localhost explícito é aceito (os testes e o build
 *   local dependem disso): conferir o domínio definitivo é responsabilidade de quem publica.
 */
export function resolveSiteUrl(
  raw: string | undefined,
  environment: string | undefined = process.env.NODE_ENV,
): string {
  const value = raw?.trim() ?? "";

  if (!value) {
    if (environment !== "production") return DEV_FALLBACK;
    throw new Error(
      "NEXT_PUBLIC_SITE_URL não está definida. Informe a URL pública do site " +
        "(ex.: https://www.seudominio.com.br) antes de gerar o build de produção.",
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL inválida: "${value}". Use uma URL absoluta, como https://www.seudominio.com.br.`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL deve usar http ou https. Valor recebido: "${value}".`,
    );
  }

  return url.origin;
}
