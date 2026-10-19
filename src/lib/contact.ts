/**
 * Validação do formulário de contato.
 * Sem dependências e sem segredos: roda igual no cliente e no servidor.
 */

export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 2000 },
} as const;

export type ContactField = "name" | "email" | "company" | "message";

export type ContactInput = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField, string>>;

/**
 * Estado devolvido pela Server Action. Falhas carregam os valores digitados
 * para que o formulário os reapresente (inclusive sem JavaScript).
 */
export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactInput }
  | { status: "success"; message: string }
  | { status: "unavailable"; message: string; values: ContactInput }
  | { status: "error"; message: string; values: ContactInput };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readContactInput(formData: FormData): ContactInput {
  const read = (key: ContactField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  return {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    message: read("message"),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, company, message } = contactLimits;

  if (!input.name) {
    errors.name = "Informe seu nome.";
  } else if (input.name.length < name.min) {
    errors.name = `O nome precisa ter pelo menos ${name.min} caracteres.`;
  } else if (input.name.length > name.max) {
    errors.name = `O nome pode ter no máximo ${name.max} caracteres.`;
  }

  if (!input.email) {
    errors.email = "Informe seu e-mail.";
  } else if (
    input.email.length > email.max ||
    !EMAIL_PATTERN.test(input.email)
  ) {
    errors.email = "Informe um e-mail válido, como nome@empresa.com.br.";
  }

  if (input.company.length > company.max) {
    errors.company = `O nome da empresa pode ter no máximo ${company.max} caracteres.`;
  }

  if (!input.message) {
    errors.message = "Conte um pouco sobre o seu projeto.";
  } else if (input.message.length < message.min) {
    errors.message = `Escreva pelo menos ${message.min} caracteres para entendermos o contexto.`;
  } else if (input.message.length > message.max) {
    errors.message = `A mensagem pode ter no máximo ${message.max} caracteres.`;
  }

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}
