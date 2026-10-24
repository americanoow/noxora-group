import { expect, test } from "@playwright/test";

test("as quatro cenas cabem no painel em celular e computador", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#solucoes");
    for (const panel of await page.locator("#solucoes details").all()) {
      if (await panel.getAttribute("open") === null) await panel.locator("summary").click();
      const scene = panel.locator("[data-scene]");
      await scene.scrollIntoViewIfNeeded();
      await expect(scene).toBeVisible();
      const geometry = await scene.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height, scroll: node.scrollWidth, client: node.clientWidth };
      });
      expect(geometry.width).toBeGreaterThan(180);
      expect(geometry.height).toBeGreaterThan(180);
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
      await expect(scene).toHaveAttribute("aria-hidden", "true");
      await expect(panel.getByText("Demonstração conceitual", { exact: true })).toBeVisible();
      const link = panel.getByRole("link", { name: "Conversar sobre esta solução" });
      await expect(link).toHaveAttribute("href", "#contato");
      await expect(link).toHaveCSS("display", /^(inline-)?flex$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test("beam, sequência de eventos e checks respondem a repetir e à pausa", async ({ page }) => {
  await page.goto("/#solucoes");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const integrations = page.locator("#solucoes details").nth(2);
  await integrations.locator("summary").click();
  await integrations.locator(".scene-integrations").scrollIntoViewIfNeeded();
  await integrations.getByRole("button", { name: /Repetir a animação/ }).click();
  await expect.poll(() => integrations.locator(".scene-beam-pulse").first().evaluate((node) => node.getAnimations().length)).toBeGreaterThan(0);
  const automation = page.locator("#solucoes details").nth(3);
  await automation.locator("summary").click();
  await automation.getByRole("button", { name: /Repetir a animação/ }).click();
  await expect(automation.locator(".scene-event")).toHaveCount(3);
  await expect(automation.locator(".scene-notice")).toContainText("Rotina concluída");
  await automation.locator("summary").click();
  await expect.poll(() => automation.locator(".service-scene").evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
  await page.getByRole("button", { name: "Pausar animações", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  expect(await page.locator(".service-scene").evaluateAll((nodes) => nodes.reduce((sum, node) => sum + node.getAnimations({ subtree: true }).length, 0))).toBe(0);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("mostra resultados completos em todas as cenas", async ({ page }) => {
    await page.goto("/#solucoes");
    const panels = page.locator("#solucoes details");
    await expect(panels.first().locator(".scene-browser")).toHaveCSS("border-top-style", "solid");
    for (const index of [1, 2, 3]) {
      await panels.nth(index).locator("summary").click();
      const result = panels.nth(index).locator(index === 2 ? ".scene-integrations-done" : ".scene-notice");
      await expect(result).toBeVisible();
      await expect(result).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".scene-beam-pulse").first()).toHaveCSS("opacity", "0");
  });
});
