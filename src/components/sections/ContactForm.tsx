"use client";

import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  contactLimits,
  hasErrors,
  readContactInput,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactState,
} from "@/lib/contact";
import { submitContact } from "@/lib/contact-action";
import { buttonClasses } from "@/components/ui/Button";

const initialState: ContactState = { status: "idle" };
const fieldOrder: readonly ContactField[] = ["name", "email", "company", "message"];

/**
 * Chamada da Server Action a partir do navegador (caminho com JavaScript). Se a
 * conexão cair, a promessa rejeita fora do try/catch do servidor; sem este
 * envoltório, o erro iria para a fronteira de erro do React e o formulário (com
 * o rascunho) seria descartado. Sem JavaScript, o formulário usa a Server Action
 * direta (`serverAction`), pois o envio nativo exige a ação do servidor.
 */
async function submit(previous: ContactState, formData: FormData): Promise<ContactState> {
  try {
    return await submitContact(previous, formData);
  } catch {
    return {
      status: "error",
      message: "Não conseguimos enviar sua mensagem. Verifique sua conexão e tente novamente.",
      values: readContactInput(formData),
    };
  }
}

/**
 * Formulário de contato. Funciona sem JavaScript (a Server Action valida de
 * novo e devolve os valores digitados) e, com JavaScript, valida antes de
 * enviar, foca o primeiro campo inválido e mostra o estado de envio.
 * O resultado só é "sucesso" depois que o destino confirma (ver contact-action).
 */
export function ContactForm({ whatsappUrl }: { whatsappUrl: string | null }) {
  // Dois caminhos: sem JavaScript vale a Server Action direta (melhoria progressiva);
  // com JavaScript, o envio é interceptado e passa pelo envoltório que trata queda de rede.
  const [serverState, serverAction, serverPending] = useActionState(submitContact, initialState);
  const [clientState, clientAction, clientPending] = useActionState(submit, initialState);
  const state = clientState.status !== "idle" ? clientState : serverState;
  const pending = clientPending || serverPending;
  const [clientErrors, setClientErrors] = useState<ContactErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const values = "values" in state ? state.values : undefined;
  const errors: ContactErrors = hasErrors(clientErrors)
    ? clientErrors
    : state.status === "invalid"
      ? state.errors
      : {};

  useEffect(() => {
    if (state.status === "invalid") focusFirstInvalid(formRef.current, state.errors);
    // O caminho com JavaScript não reinicia o formulário sozinho: só limpa no sucesso.
    if (clientState.status === "success") formRef.current?.reset();
  }, [state, clientState.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateContact(readContactInput(new FormData(event.currentTarget)));
    if (hasErrors(found)) {
      event.preventDefault();
      setClientErrors(found);
      focusFirstInvalid(event.currentTarget, found);
      return;
    }
    setClientErrors({});
    // Com JavaScript, o envio nativo é substituído pelo caminho protegido.
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => clientAction(data));
  }

  function clearError(field: ContactField) {
    if (!clientErrors[field]) return;
    setClientErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  return (
    <form
      ref={formRef}
      action={serverAction}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="contato-form-title"
      aria-busy={pending}
      className="relative grid gap-5 p-6 sm:grid-cols-2 sm:p-9"
    >
      <div className="sm:col-span-2">
        <h3 id="contato-form-title" className="font-display text-h3 font-semibold text-fg">
          Envie uma mensagem
        </h3>
        <p className="mt-1 text-sm text-muted">
          Campos com <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> são obrigatórios.
        </p>
      </div>

      <Field
        name="name"
        label="Nome"
        required
        autoComplete="name"
        maxLength={contactLimits.name.max}
        defaultValue={values?.name}
        error={errors.name}
        onInput={clearError}
      />
      <Field
        name="email"
        label="E-mail"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        maxLength={contactLimits.email.max}
        defaultValue={values?.email}
        error={errors.email}
        onInput={clearError}
      />
      <Field
        name="company"
        label="Empresa"
        autoComplete="organization"
        maxLength={contactLimits.company.max}
        defaultValue={values?.company}
        error={errors.company}
        onInput={clearError}
        className="sm:col-span-2"
      />
      <Field
        name="message"
        label="Como podemos ajudar?"
        multiline
        required
        maxLength={contactLimits.message.max}
        hint={`Mínimo de ${contactLimits.message.min} caracteres.`}
        defaultValue={values?.message}
        error={errors.message}
        onInput={clearError}
        className="sm:col-span-2"
      />

      {/* Honeypot contra robôs: fora da tela e da ordem de tabulação. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Não preencha este campo</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
        >
          <Send aria-hidden="true" className="size-4" />
          {pending ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>

      {/* Região viva sempre presente: leitores de tela anunciam o resultado. */}
      <div aria-live="polite" aria-atomic="true" className="sm:col-span-2">
        <Status state={state} whatsappUrl={whatsappUrl} />
      </div>
    </form>
  );
}

function Status({
  state,
  whatsappUrl,
}: {
  state: ContactState;
  whatsappUrl: string | null;
}) {
  if (state.status === "idle" || state.status === "invalid") return null;

  if (state.status === "success") {
    return (
      <p className="flex items-start gap-3 rounded-md border border-success/40 bg-success/10 p-4 text-sm text-success">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        {state.message}
      </p>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p>
        {state.message}{" "}
        {whatsappUrl ? (
          <>
            Se preferir, fale pelo{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fg underline underline-offset-4"
            >
              WhatsApp<span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}

type FieldProps = {
  name: ContactField;
  label: string;
  type?: "text" | "email";
  multiline?: boolean;
  required?: boolean;
  maxLength: number;
  autoComplete?: string;
  inputMode?: "email" | "text";
  hint?: string;
  defaultValue?: string;
  error?: string;
  className?: string;
  onInput: (field: ContactField) => void;
};

function Field({
  name,
  label,
  type = "text",
  multiline = false,
  required = false,
  maxLength,
  autoComplete,
  inputMode,
  hint,
  defaultValue,
  error,
  className = "",
  onInput,
}: FieldProps) {
  const id = `contact-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  // Borda de controle com contraste ≥ 3:1 (token `control`), nunca `line`.
  const controlClasses = `w-full rounded-md border bg-ink px-4 py-3 text-base text-fg transition-colors ${
    error ? "border-danger" : "border-control hover:border-fg/60"
  }`;

  const shared = {
    id,
    name,
    required,
    maxLength,
    autoComplete,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onInput: () => onInput(name),
  } as const;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-muted">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-muted">(opcional)</span>
        )}
      </label>
      {multiline ? (
        <textarea {...shared} rows={5} className={`${controlClasses} resize-y`} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} className={controlClasses} />
      )}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function focusFirstInvalid(form: HTMLFormElement | null, errors: ContactErrors) {
  const first = fieldOrder.find((field) => errors[field]);
  if (!first || !form) return;
  form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}
