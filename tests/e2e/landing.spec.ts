import { expect, test } from "@playwright/test";

test.describe("estrutura e SEO", () => {
  test("tem título, idioma, h1 único e seções principais", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Noxora/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(
      "Tecnologia que resolve problemas reais.",
    );

    for (const name of [
      "Soluções sob medida para cada etapa do seu negócio.",
      "Problemas reais, soluções sob medida.",
      "Vamos conversar sobre o seu projeto.",
    ]) {
      await expect(page.getByRole("region", { name })).toBeVisible();
    }
    await expect(page.locator("#sobre")).toHaveCount(0);
    await expect(page.locator('a[href="#sobre"]')).toHaveCount(0);
  });

  test("expõe metadados, robots e sitemap", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /sites, sistemas personalizados/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    expect((await request.get("/robots.txt")).ok()).toBe(true);
    expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  });

  test("portfólio vazio não exibe cases fictícios", async ({ page }) => {
    await page.goto("/");
    const portfolio = page.getByRole("region", {
      name: "Problemas reais, soluções sob medida.",
    });
    await expect(portfolio.getByRole("article")).toHaveCount(0);
    await expect(portfolio).toContainText("Estamos preparando os estudos de caso");
  });
});

test.describe("hero", () => {
  test("CTAs levam às seções certas", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("region", { name: /Tecnologia que resolve/ });

    await expect(
      hero.getByRole("link", { name: "Conversar sobre um projeto" }),
    ).toHaveAttribute("href", "#contato");
    await expect(
      hero.getByRole("link", { name: "Conhecer nossas soluções" }),
    ).toHaveAttribute("href", "#solucoes");
  });
});

test.describe("teclado", () => {
  test("link de pular conteúdo é o primeiro foco e leva ao main", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Navegação por Tab é testada no desktop.");
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

