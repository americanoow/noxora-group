/**
 * Monta o link do WhatsApp a partir de WHATSAPP_NUMBER (somente dígitos, com DDI,
 * por exemplo 5511999999999). Retorna null quando o número não está configurado,
 * para que a interface não exiba um link quebrado.
 *
 * Lido apenas em Server Components: o número entra no HTML como link, mas a
 * configuração não depende de variáveis NEXT_PUBLIC_.
 */
export function getWhatsAppUrl(message: string): string | null {
  const digits = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
