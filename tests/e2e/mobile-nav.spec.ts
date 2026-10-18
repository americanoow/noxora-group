import { expect, test } from "@playwright/test";

test.describe("menu mobile", () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, "Menu mobile só aparece em telas pequenas.");
    await page.goto("/");
  });

  test("abre e fecha com o botão, atualizando aria-expanded", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Abrir menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const close = page.getByRole("button", { name: "Fechar menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");

    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const label of ["Soluções", "Projetos", "Contato"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await close.click();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("Esc fecha o menu e devolve o foco ao botão", async ({ page }) => {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Contato", exact: true }).focus();

    await page.keyboard.press("Escape");

    const toggle = page.getByRole("button", { name: "Abrir menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("escolher um link fecha o menu e navega para a seção", async ({ page }) => {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Projetos", exact: true }).click();

    await expect(page).toHaveURL(/#projetos$/);
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
