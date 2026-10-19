import { expect, test, type Page } from "@playwright/test";

const benefits = (page: Page) =>
  page.getByRole("region", { name: "Menos atrito na operação. Mais espaço para crescer." });
const projects = (page: Page) =>
  page.getByRole("region", { name: "Problemas reais, soluções sob medida." });

test.describe("Como ajudamos", () => {
  test("mostra os cinco benefícios, cada um com cena e uma linha de texto", async ({ page }) => {
    await page.goto("/");
    const section = benefits(page);

    for (const title of [
      "Reduzir trabalhos manuais",
      "Integrar operações",
      "Digitalizar processos",
      "Criar produtos digitais",
      "Melhorar a experiência dos clientes",
    ]) {
      await expect(section.getByRole("heading", { name: title })).toBeAttached();
    }
    await expect(section.getByRole("listitem")).toHaveCount(5);
    // As cenas são decorativas: o significado vai no texto.
    await expect(section.locator('[aria-hidden="true"].aspect-\\[4\\/3\\], [aria-hidden="true"].aspect-\\[16\\/9\\]')).toHaveCount(5);
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
