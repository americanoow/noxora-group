/**
 * Número de WhatsApp da Noxora: WHATSAPP_NUMBER (somente dígitos, com DDI, por
 * exemplo 5511999999999) ou, se ausente ou vazio, o número público padrão.
 * Retorna null quando o valor não é um número válido, para que a interface não
 * exiba um link quebrado.
 *
 * Lido apenas em Server Components: o número entra no HTML como link, mas a
 * configuração não depende de variáveis NEXT_PUBLIC_.
 */
export function getWhatsAppDigits(fallback = ""): string | null {
  const digits = (process.env.WHATSAPP_NUMBER?.trim() || fallback).replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function getWhatsAppUrl(message: string, fallback = ""): string | null {
  const digits = getWhatsAppDigits(fallback);
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

/** "5521994941194" -> "(21) 99494-1194"; números fora do padrão brasileiro saem com "+". */
export function formatPhone(digits: string): string {
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : `+${digits}`;
}
