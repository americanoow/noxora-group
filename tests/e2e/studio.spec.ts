import { expect, test } from "@playwright/test";

test("soluções abrem por teclado e mantêm somente um painel aberto", async ({ page }) => {
  await page.goto("/#solucoes");
  const section = page.locator("#solucoes");
  await expect(section.locator("details[open]")).toHaveCount(1);
  const systems = section.locator("summary").nth(1);
  await systems.focus();
  await systems.press("Enter");
  await expect(section.locator("details").nth(1)).toHaveAttribute("open", "");
  await expect(section.locator("details[open]")).toHaveCount(1);
  await expect(section.getByText("Gestão de pedidos", { exact: true })).toBeVisible();
  await expect(section.getByRole("link", { name: "Conversar sobre esta solução" })).toBeVisible();
});

test("todos os trabalhos são descobertos por rolagem e seus detalhes funcionam", async ({ page }) => {
  await page.goto("/#projetos");
  const projects = page.locator("#projetos article");
  await expect(projects).toHaveCount(2);
  for (const project of await projects.all()) {
    await project.scrollIntoViewIfNeeded();
    await expect(project.getByRole("heading", { level: 3 })).toBeVisible();
    const image = project.getByRole("img");
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await project.locator("summary").click();
    await expect(project.getByText("Objetivo", { exact: true })).toBeVisible();
    await expect(project.getByRole("link", { name: /Visitar site/ })).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("leitura sem movimento e sem transbordamento nas larguras principais", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator("#beneficios h3")).toHaveText(["Entender", "Desenhar", "Desenvolver", "Acompanhar"]);
    await page.locator("#solucoes summary").nth(3).click();
    await expect(page.locator("#solucoes details[open]")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".service-body").last().evaluate((node) => getComputedStyle(node).animationDuration)).toMatch(/^(0s|1e-05s|0.00001s)$/);
  }
});

test("soluções e projetos permanecem utilizáveis sem JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/#solucoes");
  await page.locator("#solucoes summary").nth(2).click();
  await expect(page.getByText("Loja virtual com ERP", { exact: true })).toBeVisible();
  await expect(page.locator("#projetos article")).toHaveCount(2);
  await context.close();
});


test("a coleção mostra todos os itens em diferentes quantidades", async ({ page }) => {
  for (const count of [0, 1, 2, 5]) {
    await page.goto(`/fixtures/projetos/${count}`);
    await expect(page.locator("#projetos article")).toHaveCount(count);
    await expect(page.getByRole("button", { name: "Próximo projeto" })).toHaveCount(0);
    if (count > 0) {
      await page.locator("#projetos article").last().scrollIntoViewIfNeeded();
      await expect(page.locator("#projetos article").last()).toBeVisible();
    }
  }
});
