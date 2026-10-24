import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) =>
  page.getByRole("region", { name: "Veja como transformamos problemas em soluções." });
const carousel = (page: Page) => section(page).getByRole("region", { name: "Projetos" });

test.describe("vitrine de projetos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("mostra somente os dois sites reais construídos pela Noxora", async ({ page }) => {
    const slides = section(page).getByRole("article");
    await expect(slides).toHaveCount(2);
    await expect(slides.getByText("Projeto Noxora", { exact: true })).toHaveCount(2);
    await expect(slides.getByText("Demonstração conceitual")).toHaveCount(0);
    await expect(section(page).getByRole("heading", { level: 3 })).toHaveText([
      "Bazar Oliveira",
      "PeB Estúdio Fotográfico",
    ]);
    // Nada de cliente, depoimento ou resultado numérico.
    const text = await section(page).innerText();
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b\d+\s?x\b/i);
    expect(text).not.toMatch(/depoimento/i);
    await expect(section(page)).not.toContainText("primeiros projetos reais");
    const urls = [
      "https://bazar-oliveira-page.vercel.app/",
      "https://pebestudiofotografico.vercel.app/",
    ];
    for (const [index, url] of urls.entries()) {
      const slide = slides.nth(index);
      const link = slide.getByRole("link", { name: /Visitar site/ });
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      const image = slide.getByRole("img");
      const imageLink = slide.getByRole("link", { name: /pela imagem/ });
      await expect(imageLink).toHaveAttribute("href", url);
      await expect(imageLink).toHaveAttribute("target", "_blank");
      await expect(imageLink).toHaveAttribute("rel", "noopener noreferrer");
      await expect(imageLink.getByRole("img")).toHaveCount(1);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(slide.getByText("Demonstração conceitual")).toHaveCount(0);
    }
  });

  test("a apresentação inicial é curta: nome, tipo, frase factual, captura e acesso", async ({ page }) => {
    const slides = section(page).getByRole("article");
    const summaries = [
      "Catálogo por categorias, busca de produtos e pedidos pelo WhatsApp.",
      "Galeria de fotografias, pacotes e contato direto pelo WhatsApp.",
    ];
    for (const [index, summary] of summaries.entries()) {
      const slide = slides.nth(index);
      await expect(slide.getByText(summary, { exact: true })).toBeAttached();
      await expect(slide.getByText("Website", { exact: true })).toBeAttached();
      // Objetivo e solução ficam recolhidos em "Ver detalhes".
      await expect(slide.locator("details")).not.toHaveAttribute("open", "");
      await expect(slide.getByText("Objetivo", { exact: true })).toBeHidden();
    }
  });

  test("Ver detalhes abre objetivo e solução, por mouse e por teclado", async ({ page }) => {
    const slide = section(page).getByRole("article").first();
    const summary = slide.getByText("Ver detalhes");
    await expect(summary).toBeVisible();
    await summary.click();
    await expect(slide.getByText("Objetivo", { exact: true })).toBeVisible();
    await expect(slide.getByText("Apresentar os materiais e facilitar a escolha dos produtos para retirada na loja.")).toBeVisible();
    await expect(slide.getByText("Catálogo por categorias, busca de produtos e carrinho com envio do pedido pelo WhatsApp.")).toBeVisible();
    // Teclado: Enter fecha de novo.
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(slide.getByText("Objetivo", { exact: true })).toBeHidden();
  });

  test("não há vídeo, player nem aviso de vídeo em breve", async ({ page }) => {
    await expect(section(page).locator("video, iframe")).toHaveCount(0);
    await expect(section(page)).not.toContainText(/vídeo|assistir/i);
  });

  test("a vitrine usa capturas dos sites, sem prévias conceituais", async ({ page }) => {
    await expect(section(page).locator("article [data-preview]")).toHaveCount(0);
    await expect(section(page).getByRole("img")).toHaveCount(2);
  });

  test("a página não ganha rolagem horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("movimento reduzido: conteúdo do projeto visível", () => {
  test.use({ reducedMotion: "reduce" });

  test("texto e captura aparecem sem esperar animação", async ({ page }) => {
    await page.goto("/");
    const reveal = section(page).locator(".pj-reveal, .pj-preview");
    await expect.poll(() => reveal.evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === "1"))).toBe(true);
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("os dois projetos continuam presentes e sem controles inúteis", async ({ page }) => {
    await page.goto("/");
    await expect(section(page).getByRole("article")).toHaveCount(2);
    await expect(carousel(page).getByRole("button")).toHaveCount(0);
  });
});

// Páginas de apoio, ativas só no build de teste (NOXORA_FIXTURES=1).
test.describe("quantidade de projetos", () => {
  const fixture = (count: number) => `/fixtures/projetos/${count}`;

  test("0 projetos: aviso honesto, sem carrossel e sem cases inventados", async ({ page }) => {
    await page.goto(fixture(0));
    await expect(section(page).getByText("Casos reais em breve")).toBeVisible();
    await expect(section(page).getByRole("article")).toHaveCount(0);
    await expect(carousel(page)).toHaveCount(0);
    await expect(section(page).getByRole("link", { name: /Pedir uma apresentação/ })).toHaveAttribute(
      "href",
      "#contato",
    );
  });

  test("1 projeto: destaque sem nenhum controle de carrossel", async ({ page }) => {
    await page.goto(fixture(1));
    await expect(section(page).getByRole("article")).toHaveCount(1);
    await expect(carousel(page)).toHaveCount(0);
    await expect(section(page).getByRole("button")).toHaveCount(0);
    await expect(section(page).getByText(/Projeto \d de \d/)).toHaveCount(0);
  });

  test("nenhuma quantidade gera rolagem horizontal da página, nem em 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const count of [0, 1, 2, 5]) {
      await page.goto(fixture(count));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
});
