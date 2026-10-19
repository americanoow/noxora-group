import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";
import { submitContact } from "@/lib/contact-action";
import {
  hasErrors,
  readContactInput,
  validateContact,
  type ContactState,
} from "@/lib/contact";

const valid = {
  name: "Maria Souza",
  email: "maria@empresa.com.br",
  company: "",
  message: "Precisamos integrar a loja virtual ao ERP da empresa.",
};

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test.describe("validateContact", () => {
  test("aceita dados válidos", () => {
    expect(validateContact(valid)).toEqual({});
  });

  test("limites de nome, empresa e mensagem", () => {
    expect(validateContact({ ...valid, name: "A" }).name).toMatch(/pelo menos 2/);
    expect(validateContact({ ...valid, name: "x".repeat(101) }).name).toMatch(/no máximo 100/);
    expect(validateContact({ ...valid, company: "x".repeat(121) }).company).toMatch(/no máximo 120/);
    expect(validateContact({ ...valid, message: "x".repeat(19) }).message).toMatch(/pelo menos 20/);
    expect(validateContact({ ...valid, message: "x".repeat(2001) }).message).toMatch(/no máximo 2000/);
  });

  test("formatos de e-mail", () => {
    for (const email of ["", "maria", "maria@", "maria@empresa", "a b@c.com", "a@b.c"]) {
      expect(validateContact({ ...valid, email }).email, email).toBeTruthy();
    }
    expect(validateContact({ ...valid, email: "x".repeat(250) + "@a.com" }).email).toBeTruthy();
  });

  test("readContactInput aplica trim e ignora valores que não são texto", () => {
    const data = new FormData();
    data.set("name", "  Maria  ");
    data.set("email", new Blob(["x"]), "arquivo.txt");
    const input = readContactInput(data);
    expect(input.name).toBe("Maria");
    expect(input.email).toBe("");
    expect(hasErrors(validateContact(input))).toBe(true);
  });
});

test.describe("submitContact", () => {
  test.describe.configure({ mode: "serial" });

  let server: Server;
  let url = "";
  let received: { body: string }[] = [];
  let mode: "ok" | "erro500" | "lento" = "ok";

  test.beforeAll(async () => {
    server = createServer((request: IncomingMessage, response) => {
      let body = "";
      request.on("data", (chunk) => (body += chunk));
      request.on("end", () => {
        received.push({ body });
        if (mode === "lento") {
          setTimeout(() => response.writeHead(200).end("ok"), 1500);
        } else {
          response.writeHead(mode === "ok" ? 200 : 500).end("x");
        }
      });
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/hook`;
  });

  test.afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test.beforeEach(() => {
    received = [];
    mode = "ok";
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_TIMEOUT_MS;
  });

  const run = (values: Record<string, string>) =>
    submitContact({ status: "idle" } as ContactState, formData(values));

  test("dados inválidos devolvem erros e os valores, sem entregar nada", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    const result = await run({ ...valid, email: "errado" });

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.email).toBeTruthy();
      expect(result.values.name).toBe("Maria Souza");
    }
    expect(received).toHaveLength(0);
  });

  test("sem destino configurado responde indisponível e preserva os valores", async () => {
    const result = await run(valid);

    expect(result.status).toBe("unavailable");
    if (result.status === "unavailable") expect(result.values.message).toBe(valid.message);
  });

  test("o honeypot preenchido não entrega e não vira sucesso", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    const result = await run({ ...valid, website: "http://spam.example" });

    expect(result.status).toBe("error");
    expect(received).toHaveLength(0);
  });

  test("sucesso só depois de um HTTP 2xx do destino, com o payload esperado", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    const result = await run({ ...valid, company: "Empresa Exemplo" });

    expect(result.status).toBe("success");
    expect(received).toHaveLength(1);
    expect(JSON.parse(received[0].body)).toEqual({
      ...valid,
      company: "Empresa Exemplo",
      source: "noxora-site",
    });
  });

  test("HTTP 500 do destino vira erro, mantém os valores e não vaza dados no log", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    mode = "erro500";
    const logs: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => void logs.push(args.join(" "));
    try {
      const result = await run(valid);
      expect(result.status).toBe("error");
      if (result.status === "error") expect(result.values.email).toBe(valid.email);
    } finally {
      console.error = original;
    }

    const output = logs.join("\n");
    expect(output).toContain("500");
    expect(output).not.toContain(url);
    expect(output).not.toContain(valid.email);
    expect(output).not.toContain(valid.message);
  });

  test("destino inalcançável vira erro e o caminho de exceção não vaza dados no log", async () => {
    // Porta fechada: o fetch lança, e o log não pode conter a URL, o host, o e-mail nem a mensagem.
    process.env.CONTACT_WEBHOOK_URL = "http://127.0.0.1:9/segredo-do-destino";
    const logs: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => void logs.push(args.join(" "));
    try {
      const result = await run(valid);
      expect(result.status).toBe("error");
      if (result.status === "error") expect(result.values.email).toBe(valid.email);
    } finally {
      console.error = original;
    }

    const output = logs.join(" | ");
    expect(output).toContain("[contact]");
    for (const secret of ["segredo-do-destino", "127.0.0.1", ":9", valid.email, valid.message]) {
      expect(output).not.toContain(secret);
    }
  });

  test("redirecionamento do destino não é seguido: nada chega ao segundo host", async () => {
    const other: string[] = [];
    const second = createServer((request, response) => {
      request.on("data", () => undefined);
      request.on("end", () => {
        other.push("recebeu");
        response.writeHead(200).end("ok");
      });
    });
    await new Promise<void>((resolve) => second.listen(0, "127.0.0.1", resolve));
    const secondUrl = `http://127.0.0.1:${(second.address() as AddressInfo).port}/outro`;
    const redirecting = createServer((request, response) => {
      request.on("data", () => undefined);
      request.on("end", () => response.writeHead(307, { Location: secondUrl }).end());
    });
    await new Promise<void>((resolve) => redirecting.listen(0, "127.0.0.1", resolve));
    process.env.CONTACT_WEBHOOK_URL = `http://127.0.0.1:${(redirecting.address() as AddressInfo).port}/hook`;

    const original = console.error;
    console.error = () => undefined;
    try {
      const result = await run(valid);
      expect(result.status).toBe("error");
      expect(other).toHaveLength(0);
    } finally {
      console.error = original;
      await new Promise<void>((resolve) => redirecting.close(() => resolve()));
      await new Promise<void>((resolve) => second.close(() => resolve()));
    }
  });

  test("chamada direta: arquivo no lugar do nome e mensagem acima do limite são rejeitados", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    const data = formData(valid);
    data.set("name", new Blob(["x"]), "arquivo.txt");
    const withFile = await submitContact({ status: "idle" } as ContactState, data);
    expect(withFile.status).toBe("invalid");

    const tooLong = await run({ ...valid, message: "x".repeat(2001) });
    expect(tooLong.status).toBe("invalid");
    expect(received).toHaveLength(0);
  });

  test("o tempo limite configurado tem teto", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    process.env.CONTACT_WEBHOOK_TIMEOUT_MS = "1e9";
    mode = "lento";
    // Com o teto de 30 s o teste não esperaria 1e9 ms; a resposta lenta (1,5 s) termina como sucesso.
    const result = await run(valid);
    expect(result.status).toBe("success");
  });

  test("tempo esgotado vira erro, nunca sucesso", async () => {
    process.env.CONTACT_WEBHOOK_URL = url;
    process.env.CONTACT_WEBHOOK_TIMEOUT_MS = "200";
    mode = "lento";
    const original = console.error;
    console.error = () => undefined;
    try {
      const result = await run(valid);
      expect(result.status).toBe("error");
    } finally {
      console.error = original;
    }
  });
});
