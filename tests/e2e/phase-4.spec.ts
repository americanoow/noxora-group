import { expect, test } from "@playwright/test";

test("etapas apresentam o processo sem prometer resultados", async ({ page }) => {
  await page.goto("/#beneficios");
  const section = page.locator("#beneficios");
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Entender", "Desenhar", "Desenvolver", "Acompanhar"]);
  await expect(section.getByRole("link")).toHaveAttribute("href", "#contato");
  expect(await section.innerText()).not.toMatch(/\d+\s?%/);
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
    // Preto, superfície e grafite criam o ritmo das seções centrais.
    expect(solucoes).toBe("rgb(0, 0, 0)");
    expect(projetos).toBe("rgb(20, 20, 22)");
    expect(beneficios).toBe("rgb(10, 10, 10)");
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
