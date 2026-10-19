import { expect, test, type Page } from "@playwright/test";

const benefits = (page: Page) =>
  page.getByRole("region", { name: "Menos atrito na operação. Mais espaço para crescer." });
const projects = (page: Page) =>
  page.getByRole("region", { name: "Problemas reais, soluções sob medida." });

test.describe("Como ajudamos", () => {
  test("mostra o antes e depois em um gráfico e cinco rótulos curtos", async ({ page }) => {
    await page.goto("/");
    const section = benefits(page);

    // O gráfico é um grupo nomeado; os nomes e as frases são texto real, não só ícones.
    const graphic = section.getByRole("group", {
      name: "De processos desconectados a uma operação integrada",
    });
    await expect(graphic).toBeVisible();
    await expect(graphic.getByRole("heading", { level: 3 })).toHaveText([
      "Hoje: processos desconectados",
      "Com a Noxora: operação integrada",
    ]);
    for (const name of ["Planilhas", "E-mails", "Mensagens", "Pedidos"]) {
      const labels = graphic.getByText(name, { exact: true });
      await expect(labels).toHaveCount(2);
      for (const label of await labels.all()) await expect(label).toBeVisible();
    }
    await expect(graphic.getByText("Solução Noxora")).toBeVisible();
    await expect(graphic.getByText("Informações espalhadas. Tarefas repetitivas.")).toBeVisible();
    await expect(graphic.getByText("Informações conectadas. Processos automatizados.")).toBeVisible();
    // Ícones e traços são decorativos.
    await expect(graphic.locator("svg:not([aria-hidden='true'])")).toHaveCount(0);

    await expect(section.getByRole("listitem")).toHaveText([
      "Menos trabalho manual",
      "Operações integradas",
      "Processos digitais",
      "Produtos digitais",
      "Clientes bem atendidos",
    ]);
  });

  test("é curto: não há parágrafos corridos", async ({ page }) => {
    await page.goto("/");
    const section = benefits(page);

    // O único <p> é o rótulo "Como ajudamos" acima do título; não há texto corrido.
    await expect(section.locator("p")).toHaveCount(1);
    const words = (await section.innerText()).split(/\s+/).filter(Boolean).length;
    expect(words).toBeLessThanOrEqual(60);
  });

  test("é compacto (cabe em menos altura que a versão anterior)", async ({ page, isMobile }) => {
    await page.goto("/");
    const height = await page.locator("#beneficios").evaluate((el) => el.getBoundingClientRect().height);
    // Antes: 1213 px no desktop e 2068 px no celular.
    expect(height).toBeLessThan(isMobile ? 1500 : 1000);
  });

  test("não usa rolagem presa (sticky) nem rola só um dos lados", async ({ page }) => {
    await page.goto("/");
    const sticky = await page.evaluate(() =>
      [...document.querySelectorAll("#beneficios *")].filter(
        (el) => getComputedStyle(el).position === "sticky",
      ).length,
    );
    expect(sticky).toBe(0);
  });

  test("não promete resultados numéricos", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#beneficios").innerText();
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b\d+\s?x\b/i);
  });
});

test.describe("Projetos", () => {
  test("sem cases reais, mostra um estado gráfico honesto e não inventa projetos", async ({
    page,
  }) => {
    await page.goto("/");
    const section = projects(page);

    await expect(section.getByRole("article")).toHaveCount(0);
    await expect(section.getByText("Casos reais em breve")).toBeVisible();
    await expect(
      section.getByRole("list", { name: "Como cada projeto será apresentado" }).getByRole("listitem"),
    ).toHaveText(["Problema", "Solução", "Tecnologias"]);
    await expect(section.getByRole("link", { name: "Pedir uma apresentação" })).toHaveAttribute(
      "href",
      "#contato",
    );
  });

  test("a composição de janelas é decorativa e sem texto legível", async ({ page }) => {
    await page.goto("/");
    const stage = projects(page).locator('[aria-hidden="true"]').first();
    await expect(stage).toBeAttached();
    expect((await stage.innerText()).trim()).toBe("");
  });
});

test.describe("ritmo visual", () => {
  test("as seções alternam de superfície", async ({ page }) => {
    await page.goto("/");
    const backgrounds = await page.evaluate(() =>
      ["inicio", "solucoes", "beneficios", "projetos", "contato"].map((id) => {
        const el = document.getElementById(id)!;
        return getComputedStyle(el).backgroundColor;
      }),
    );
    const [, solucoes, beneficios, projetos] = backgrounds;
    // Soluções e Projetos usam grafite; Como ajudamos fica sobre o preto.
    expect(solucoes).toBe("rgb(20, 20, 22)");
    expect(projetos).toBe("rgb(20, 20, 22)");
    expect(beneficios).toBe("rgba(0, 0, 0, 0)");
  });

  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`as novas seções cabem em ${width}px sem rolagem horizontal`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
