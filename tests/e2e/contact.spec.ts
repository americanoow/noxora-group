import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) =>
  page.getByRole("region", { name: "Seu próximo projeto começa com uma conversa." });
const form = (page: Page) => page.getByRole("form", { name: "Envie uma mensagem" });

// O servidor usa os canais padrão (WhatsApp, e-mail, Instagram), sem destino do formulário.
test.describe("canais de contato", () => {
  test("mostra o WhatsApp, o e-mail da Noxora e o Instagram", async ({ page }) => {
    await page.goto("/#contato");
    const contact = section(page);

    const email = contact.getByRole("link", { name: /Enviar e-mail/ });
    await expect(email).toContainText("groupnoxora@gmail.com");
    await expect(email).toHaveAttribute("href", "mailto:groupnoxora@gmail.com");
    await expect(contact.getByText("Em breve")).toHaveCount(0);
    await expect(contact.getByText("Número em definição")).toHaveCount(0);

    const whatsapp = contact.getByRole("link", { name: /WhatsApp/ });
    await expect(whatsapp).toContainText("(21) 99494-1194");
    await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\/5521994941194\?text=/);
    await expect(whatsapp).toHaveAttribute("target", "_blank");
    await expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");

    const instagram = contact.getByRole("link", { name: /Instagram/ });
    await expect(instagram).toContainText("@noxoragroup");
    await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/noxoragroup/");
    await expect(instagram).not.toHaveAttribute("target", "_blank");
    await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    await expect(instagram).not.toContainText("abre em nova aba");
    await page.route("https://www.instagram.com/noxoragroup/", async (route) => {
      await route.fulfill({ contentType: "text/html", body: "<title>Instagram de teste</title>" });
    });
    await instagram.click();
    await expect(page).toHaveURL("https://www.instagram.com/noxoragroup/");
    expect(page.context().pages()).toHaveLength(1);
  });

  test("os canais permanecem acessíveis sem JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto("/#contato");
      await expect(page.getByRole("link", { name: /Instagram/ })).toBeVisible();
      await expect(page.getByRole("link", { name: /Enviar e-mail/ })).toHaveAttribute("href", "mailto:groupnoxora@gmail.com");
      await page.route("https://www.instagram.com/noxoragroup/", async (route) => {
        await route.fulfill({ contentType: "text/html", body: "<title>Instagram de teste</title>" });
      });
      await page.getByRole("link", { name: /Instagram/ }).click();
      await expect(page).toHaveURL("https://www.instagram.com/noxoragroup/");
      expect(context.pages()).toHaveLength(1);
    } finally {
      await context.close();
    }
  });
});

test.describe("composição do contato", () => {
  test("os três contatos ficam lado a lado e o formulário vem embaixo", async ({ page, isMobile }) => {
    test.skip(isMobile, "No celular as peças empilham.");
    await page.goto("/#contato");
    const tiles = section(page).getByRole("listitem");
    await expect(tiles).toHaveCount(3);
    // Mede só depois da animação de entrada, que desloca as caixas: primeiro nada fica
    // "escondido" esperando a vez, depois as transições em curso terminam (as pausadas, de
    // figuras fora da tela, não terminam nunca e não deslocam estas caixas).
    await page.waitForFunction(() => document.querySelectorAll("#contato [data-reveal='hidden']").length === 0);
    await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.playState === "running" && a.effect!.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => null))));

    const boxes = await Promise.all((await tiles.all()).map((tile) => tile.boundingBox()));
    const tops = boxes.map((box) => Math.round(box!.y));
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(2);
    expect(boxes[0]!.x).toBeLessThan(boxes[1]!.x);
    expect(boxes[1]!.x).toBeLessThan(boxes[2]!.x);

    const bottom = Math.max(...boxes.map((box) => box!.y + box!.height));
    const formBox = await form(page).boundingBox();
    expect(formBox!.y).toBeGreaterThanOrEqual(bottom);
  });
});

test.describe("formulário de contato", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contato");
  });

  test("campos têm rótulos e tipos corretos", async ({ page }) => {
    const f = form(page);
    await expect(f.getByLabel("Nome")).toHaveAttribute("autocomplete", "name");
    await expect(f.getByLabel("E-mail")).toHaveAttribute("type", "email");
    await expect(f.getByLabel("Empresa")).toBeVisible();
    await expect(f.getByLabel("Como podemos ajudar?")).toBeVisible();
  });

  test("a borda dos campos vazios tem contraste de pelo menos 3:1 (WCAG 1.4.11)", async ({
    page,
  }) => {
    const ratio = await page.evaluate(() => {
      const parse = (c: string) => c.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const input = document.querySelector<HTMLInputElement>("#contact-name")!;
      const border = parse(getComputedStyle(input).borderTopColor);
      let el: HTMLElement | null = input.parentElement;
      let bg = [0, 0, 0];
      while (el) {
        const c = getComputedStyle(el).backgroundColor;
        if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
          bg = parse(c);
          break;
        }
        el = el.parentElement;
      }
      const [a, b] = [lum(border), lum(bg)];
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  test("envio vazio mostra erros, marca inválidos e foca o primeiro campo", async ({ page }) => {
    const f = form(page);
    await f.getByRole("button", { name: "Enviar mensagem" }).click();

    const name = f.getByLabel("Nome");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Informe seu nome.");
    await expect(f.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(f.getByText("Conte um pouco sobre o seu projeto.")).toBeVisible();
    await expect(f.getByLabel("Empresa")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("e-mail inválido e mensagem curta têm mensagens específicas", async ({ page }) => {
    const f = form(page);
    await f.getByLabel("Nome").fill("Maria Souza");
    await f.getByLabel("E-mail").fill("maria@empresa");
    await f.getByLabel("Como podemos ajudar?").fill("Curto");
    await f.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(f.getByLabel("E-mail")).toBeFocused();
    await expect(f.getByText(/Informe um e-mail válido/)).toBeVisible();
    await expect(f.getByText(/pelo menos 20 caracteres/)).toBeVisible();
  });

  test("corrigir um campo remove o erro dele", async ({ page }) => {
    const f = form(page);
    await f.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(f.getByText("Informe seu nome.")).toBeVisible();

    await f.getByLabel("Nome").fill("Maria");
    await expect(f.getByText("Informe seu nome.")).toHaveCount(0);
    await expect(f.getByLabel("Nome")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("sem destino configurado, avisa, não simula sucesso e mantém os dados", async ({ page }) => {
    const f = form(page);
    await f.getByLabel("Nome").fill("Maria Souza");
    await f.getByLabel("E-mail").fill("maria@empresa.com.br");
    await f.getByLabel("Como podemos ajudar?").fill("Precisamos integrar a loja virtual ao ERP.");
    await f.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(f.getByText("O envio pelo formulário ainda não está disponível.")).toBeVisible();
    await expect(f.getByText(/Mensagem enviada/)).toHaveCount(0);
    await expect(f.getByLabel("Nome")).toHaveValue("Maria Souza");
    await expect(f.getByLabel("E-mail")).toHaveValue("maria@empresa.com.br");
    await expect(f.getByLabel("Como podemos ajudar?")).toHaveValue(
      "Precisamos integrar a loja virtual ao ERP.",
    );
  });

  test("sem conexão no envio, mostra erro recuperável e mantém o formulário e o rascunho", async ({
    page,
    context,
  }) => {
    const f = form(page);
    await f.getByLabel("Nome").fill("Maria Souza");
    await f.getByLabel("E-mail").fill("maria@empresa.com.br");
    await f.getByLabel("Como podemos ajudar?").fill("Precisamos integrar a loja virtual ao ERP.");

    await context.setOffline(true);
    await f.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(f.getByText(/Verifique sua conexão/)).toBeVisible();
    await expect(f.getByText(/Mensagem enviada/)).toHaveCount(0);
    // O formulário continua na tela, com o que foi digitado.
    await expect(f.getByLabel("Nome")).toHaveValue("Maria Souza");
    await expect(f.getByLabel("E-mail")).toHaveValue("maria@empresa.com.br");
    await expect(f.getByLabel("Como podemos ajudar?")).toHaveValue(
      "Precisamos integrar a loja virtual ao ERP.",
    );

    // Voltando a conexão, dá para tentar de novo.
    await context.setOffline(false);
    await f.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(f.getByText("O envio pelo formulário ainda não está disponível.")).toBeVisible();
  });

  test("o campo isca não é lido por leitores de tela nem recebe foco", async ({ page }) => {
    const bait = page.locator("#contact-website");
    await expect(bait).toHaveAttribute("tabindex", "-1");
    await expect(bait.locator("xpath=ancestor::div[@aria-hidden='true']")).toHaveCount(1);
  });
});

test.describe("formulário sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("valida no servidor e devolve os valores digitados", async ({ page }) => {
    await page.goto("/#contato");
    const f = form(page);
    await f.getByLabel("Nome").fill("Maria Souza");
    await f.getByLabel("E-mail").fill("maria@empresa.com.br");
    await f.getByLabel("Como podemos ajudar?").fill("Curta");
    await f.getByRole("button", { name: "Enviar mensagem" }).click();

    // F03: a página volta com o erro e sem perder o que foi digitado.
    await expect(form(page).getByText(/pelo menos 20 caracteres/)).toBeVisible();
    await expect(form(page).getByLabel("Nome")).toHaveValue("Maria Souza");
    await expect(form(page).getByLabel("E-mail")).toHaveValue("maria@empresa.com.br");
    await expect(form(page).getByLabel("Como podemos ajudar?")).toHaveValue("Curta");
  });
});
