import { expect, test } from "@playwright/test";
import { resolveSiteUrl } from "@/lib/site-url";

test.describe("resolveSiteUrl (F01)", () => {
  test("em desenvolvimento, ausente ou vazia cai em localhost", () => {
    expect(resolveSiteUrl(undefined, "development")).toBe("http://localhost:3000");
    expect(resolveSiteUrl("", "development")).toBe("http://localhost:3000");
    expect(resolveSiteUrl("   ", "development")).toBe("http://localhost:3000");
  });

  test("em produção, ausente ou vazia interrompe com mensagem clara", () => {
    for (const value of [undefined, "", "   "]) {
      expect(() => resolveSiteUrl(value, "production")).toThrow(
        /NEXT_PUBLIC_SITE_URL não está definida/,
      );
    }
  });

  test("URL inválida ou de protocolo não web falha em qualquer ambiente", () => {
    for (const environment of ["development", "production"]) {
      expect(() => resolveSiteUrl("noxora.com.br", environment)).toThrow(/inválida/);
      expect(() => resolveSiteUrl("ftp://noxora.com.br", environment)).toThrow(
        /http ou https/,
      );
      expect(() => resolveSiteUrl("javascript:alert(1)", environment)).toThrow(
        /http ou https/,
      );
    }
  });

  test("normaliza para a origem, sem barra final, caminho ou espaços", () => {
    expect(resolveSiteUrl("https://www.noxora.com.br/", "production")).toBe(
      "https://www.noxora.com.br",
    );
    expect(
      resolveSiteUrl("  https://noxora.com.br/pagina?x=1#a ", "production"),
    ).toBe("https://noxora.com.br");
    expect(resolveSiteUrl("http://localhost:3100", "production")).toBe(
      "http://localhost:3100",
    );
  });
});
