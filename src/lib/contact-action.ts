"use server";

import {
  hasErrors,
  readContactInput,
  validateContact,
  type ContactState,
} from "@/lib/contact";

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_TIMEOUT_MS = 30_000;
const SEND_ERROR =
  "Não conseguimos enviar sua mensagem agora. Tente novamente em alguns minutos.";

function timeoutMs(): number {
  const parsed = Number(process.env.CONTACT_WEBHOOK_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, MAX_TIMEOUT_MS)
    : DEFAULT_TIMEOUT_MS;
}

/**
 * Recebe o formulário de contato.
 *
 * A entrega depende de CONTACT_WEBHOOK_URL (variável só do servidor). Sem ela,
 * responde "unavailable"; com ela, só responde "success" depois de um HTTP 2xx
 * do destino. Nunca simula sucesso. Os logs trazem apenas o tipo do erro:
 * nunca a URL do destino nem os dados do visitante.
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const input = readContactInput(formData);

  // Honeypot: campo invisível que só robôs preenchem. Nada é entregue.
  if (formData.get("website")) {
    return { status: "error", message: SEND_ERROR, values: input };
  }

  const errors = validateContact(input);
  if (hasErrors(errors)) {
    return { status: "invalid", errors, values: input };
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return {
      status: "unavailable",
      message: "O envio pelo formulário ainda não está disponível.",
      values: input,
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, source: "noxora-site" }),
      signal: AbortSignal.timeout(timeoutMs()),
      cache: "no-store",
      // Não segue redirecionamentos: os dados do visitante só vão ao destino configurado.
      redirect: "error",
    });

    if (!response.ok) {
      console.error(`[contact] destino respondeu HTTP ${response.status}`);
      return { status: "error", message: SEND_ERROR, values: input };
    }
  } catch (error) {
    const kind = error instanceof Error ? error.name : "desconhecido";
    console.error(`[contact] falha ao entregar (${kind})`);
    return { status: "error", message: SEND_ERROR, values: input };
  }

  return {
    status: "success",
    message: "Mensagem enviada. Vamos responder pelo e-mail informado.",
  };
}
