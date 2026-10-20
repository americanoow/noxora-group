import { expect, test } from "@playwright/test";

test("botões, navegação e cards respondem ao mouse e ao teclado", async ({ page, isMobile }) => {
  test.skip(isMobile, "Hover só é aplicado a dispositivos com mouse.");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-active", "true");
  const cta = page.getByRole("link", { name: "Conversar sobre um projeto", exact: true });
  await cta.hover();
  await expect.poll(() => cta.evaluate((el) => getComputedStyle(el).translate)).toBe("0px -4px");
  const nav = page.getByRole("banner").getByRole("link", { name: "Soluções", exact: true });
  await nav.focus();
  await expect.poll(() => nav.evaluate((el) => getComputedStyle(el, "::after").transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await expect(nav).toBeFocused();
  const card = page.locator("#solucoes li.motion-card").first();
  await card.hover();
  await expect.poll(() => card.evaluate((el) => getComputedStyle(el).translate)).toBe("0px -4px");
  // Uma peça informativa continua sem fingir ser botão.
  await expect(card).not.toHaveAttribute("tabindex");
});

test("o cubo e os reflexos só repetem enquanto estão na tela", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator(".motion-stage");
  await expect(stage).toHaveAttribute("data-sweep", "play");
  await expect.poll(() => page.locator(".hero-object").evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0);
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(stage).not.toHaveAttribute("data-sweep");
  expect(await page.locator(".hero-object").evaluate((el) => el.getAnimations().length)).toBe(0);
  expect(await page.locator(".hero-sheen").evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.locator("#inicio").scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute("data-sweep", "play");
});

test("pausa e alteração de movimento reduzido restauram as figuras completas", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-active", "true");
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator("[data-play]")).toHaveCount(0);
  await expect(page.locator("[data-sweep]")).toHaveCount(0);
  expect(await page.locator(".nx-layer").first().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await page.getByRole("button", { name: "Retomar animações" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion-active", "false");
  await expect(page.locator("[data-play]")).toHaveCount(0);
  await expect(page.locator("[data-sweep]")).toHaveCount(0);
  expect(await page.locator(".wm-letter").first().evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion-active", "true");
});

test("o menu mobile abre com movimento curto e mantém Escape e foco", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Menu só existe no layout mobile.");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion-active", "true");
  const button = page.getByRole("button", { name: "Abrir menu" });
  await button.click();
  const menu = page.getByRole("navigation", { name: "Principal" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Contato", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(button).toBeFocused();
});
