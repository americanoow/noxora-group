import { expect, test } from "@playwright/test";

test("brilho acompanha somente a solução aberta, com pausa longa e controle global", async ({ page }) => {
  await page.goto("/#solucoes");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const rows = page.locator(".solution-spotlight");
  const first = rows.first();
  const message = first.locator(".service-body .service-benefit");
  await message.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-sweep", "play");
  await expect(message).toHaveCSS("animation-name", "solution-text-shine");
  const timing = await message.evaluate((node) => {
    const animation = node.getAnimations().find((a) => (a as CSSAnimation).animationName === "solution-text-shine")!;
    return { duration: animation.effect!.getTiming().duration, repeats: animation.effect!.getTiming().iterations };
  });
  expect(timing).toEqual({ duration: 12000, repeats: Infinity });
  await rows.nth(1).locator("summary").click();
  await expect(first.locator("details")).not.toHaveAttribute("open");
  await expect(message).toHaveCSS("animation-name", "none");
  const nextMessage = rows.nth(1).locator(".service-body .service-benefit");
  await nextMessage.scrollIntoViewIfNeeded();
  await expect(nextMessage).toHaveCSS("animation-name", "solution-text-shine");
  await page.getByRole("button", { name: "Pausar animações", exact: true }).click();
  await expect(nextMessage).toHaveCSS("animation-name", "none");
});

test("CTA mostra reflexo no foco e mantém navegação nativa", async ({ page }) => {
  await page.goto("/#solucoes");
  const link = page.locator(".service-entry[open] .solution-cta");
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await expect(link).toHaveAttribute("href", "#contato");
  await expect.poll(() => link.evaluate((node) => getComputedStyle(node, "::after").animationName)).toBe("solution-cta-shine");
  await link.press("Enter");
  await expect(page).toHaveURL(/#contato$/);
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("mensagem permanece legível sem animação", async ({ page }) => {
    await page.goto("/#solucoes");
    const message = page.locator(".service-entry[open] .service-body .service-benefit");
    await message.scrollIntoViewIfNeeded();
    await expect(message).toBeVisible();
    await expect(message).toHaveCSS("opacity", "1");
    await expect(message).toHaveCSS("animation-name", "none");
    await expect.poll(() => page.locator(".solution-toggle").first().evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe("none");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("mantém a mensagem estática e permite expandir outra solução", async ({ page }) => {
    await page.goto("/#solucoes");
    await page.locator(".service-entry summary").nth(1).click();
    await expect(page.locator(".service-entry[open]")).toHaveCount(1);
    const message = page.locator(".service-entry[open] .service-body .service-benefit");
    await expect(message).toContainText("Software no formato do seu processo.");
    await expect(message).toHaveCSS("animation-name", "none");
  });
});


test("botão e texto chamam atenção automaticamente antes de qualquer clique", async ({ page, isMobile }) => {
  await page.goto("/#solucoes");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const row = page.locator(".solution-spotlight").nth(1);
  await row.locator("summary").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute("data-sweep", "play");
  const button = row.locator(".solution-toggle");
  await expect.poll(() => button.evaluate((node) => {
    const ring = getComputedStyle(node, "::before");
    const halo = getComputedStyle(node, "::after");
    return { ring: ring.animationName, halo: halo.animationName, repeat: ring.animationIterationCount };
  })).toEqual({ ring: "solution-ring", halo: "solution-discovery-halo", repeat: "infinite" });
  const label = row.locator(isMobile ? "summary h3" : "summary .service-benefit");
  await expect(label).toBeVisible();
  await expect(label).toHaveCSS("animation-name", "solution-text-shine");
  const labelDelay = await label.evaluate((node) => getComputedStyle(node).animationDelay);
  expect(labelDelay).toBe(await button.evaluate((node) => getComputedStyle(node, "::before").animationDelay));
  await row.locator("summary").click();
  await expect(row.locator("details")).toHaveAttribute("open", "");
  await expect.poll(() => button.evaluate((node) => getComputedStyle(node, "::after").animationName)).toBe("none");
});
