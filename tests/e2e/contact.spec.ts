import { expect, test } from "@playwright/test";

test.describe("canais de contato", () => {
  test("mostra os canais pendentes sem links fictícios e disponibiliza o Instagram", async ({ page }) => {
    await page.goto("/#contato");
    const contact = page.getByRole("region", { name: "Vamos conversar sobre o seu projeto." });

    await expect(contact.getByRole("listitem")).toHaveCount(3);
    await expect(contact.getByRole("heading", { name: "E-mail", exact: true })).toBeVisible();
    await expect(contact.getByRole("heading", { name: "WhatsApp", exact: true })).toBeVisible();
    await expect(contact.getByText("Endereço em definição")).toBeVisible();
    await expect(contact.getByText("Número em definição")).toBeVisible();
    await expect(contact.locator('a[href^="mailto:"], a[href^="https://wa.me/"]')).toHaveCount(0);
    await expect(contact.getByRole("form")).toHaveCount(0);

    const instagram = contact.getByRole("link", { name: /Abrir Instagram/ });
    await expect(instagram).toContainText("@noxoragroup");
    await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/noxoragroup/");
    await expect(instagram).toHaveAttribute("target", "_blank");
    await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("os canais permanecem acessíveis sem JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto("/#contato");
      await expect(page.getByRole("link", { name: /Abrir Instagram/ })).toBeVisible();
      await expect(page.getByText("Endereço em definição")).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
