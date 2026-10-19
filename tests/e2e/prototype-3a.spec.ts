import { expect, test, type Page } from "@playwright/test";

const hero = (page: Page) =>
  page.getByRole("region", { name: /Tecnologia que resolve/ });

test.describe("hero (Fase 3A)", () => {
  test("mostra eyebrow, headline, descrição e CTAs aprovados", async ({ page }) => {
    await page.goto("/");
    const region = hero(page);

    await expect(region).toContainText("Tecnologia & soluções em software");
    await expect(region.getByRole("heading", { level: 1 })).toHaveText(
      "Tecnologia que resolve problemas reais.",
    );
    await expect(region).toContainText("sob medida para empresas que querem crescer");
    await expect(
      region.getByRole("link", { name: "Conversar sobre um projeto" }),
    ).toHaveAttribute("href", "#contato");
    await expect(
      region.getByRole("link", { name: "Conhecer nossas soluções" }),
    ).toHaveAttribute("href", "#solucoes");
  });

  test("a composição é decorativa, exceto a legenda conceitual", async ({ page }) => {
    await page.goto("/");
    const region = hero(page);

    await expect(region.getByText("Ilustração conceitual")).toBeVisible();
    // Imagens do palco têm alt vazio; fichas e trilhos ficam sob aria-hidden.
    for (const image of await region.locator("img").all()) {
      await expect(image).toHaveAttribute("alt", "");
    }
    await expect(region.locator('[aria-hidden="true"] svg').first()).toBeAttached();
  });

  test("o cubo (LCP) carrega com prioridade alta e sem lazy", async ({ page }) => {
    await page.goto("/");
    const cube = hero(page).locator("img").first();

    await expect(cube).toHaveAttribute("fetchpriority", "high");
    await expect(cube).not.toHaveAttribute("loading", "lazy");
  });

  test("com movimento reduzido nada fica invisível, nem durante os atrasos", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    try {
      await page.goto("/");
      await page.waitForTimeout(400); // antes do maior atraso de entrada (≈ 1,2 s)
      await expect(hero(page).locator(".hero-chip")).toHaveCount(3);
      // Leitura única e imediata: `toHaveCSS` repete por 5 s e esconderia o atraso.
      const state = await page.evaluate(() => ({
        chips: [...document.querySelectorAll(".hero-chip")].map(
          (el) => getComputedStyle(el).opacity,
        ),
        rails: [...document.querySelectorAll(".hero-rail")].map((el) =>
          parseFloat(getComputedStyle(el).strokeDashoffset),
        ),
      }));
      expect(state.chips).toEqual(["1", "1", "1"]);
      for (const offset of state.rails) expect(offset).toBe(0);
    } finally {
      await context.close();
    }
  });
});

test.describe("header (Fase 3A)", () => {
  test("transparente no topo e com superfície depois de rolar", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("body > header");

    await expect(header).toHaveAttribute("data-scrolled", "false");
    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await expect(header).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });
});

test.describe("menu mobile em telas baixas (F04)", () => {
  for (const size of [
    { width: 568, height: 320 },
    { width: 667, height: 375 },
    { width: 390, height: 844 },
  ]) {
    test(`todo o painel é alcançável em ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/");
      await page.getByRole("button", { name: "Abrir menu" }).click();

      const panel = page.getByRole("navigation", { name: "Principal" });
      await expect(panel).toBeVisible();
      const box = await panel.boundingBox();
      expect(box).not.toBeNull();
      // O painel nunca ultrapassa a viewport e rola por dentro quando preciso.
      expect(box!.y + box!.height).toBeLessThanOrEqual(size.height + 1);

      const cta = panel.getByRole("link", { name: "Conversar sobre um projeto" });
      await cta.scrollIntoViewIfNeeded();
      const ctaBox = await cta.boundingBox();
      expect(ctaBox).not.toBeNull();
      expect(ctaBox!.y).toBeGreaterThanOrEqual(0);
      expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(size.height + 1);
    });
  }
});

test.describe("fichas do hero dentro da viewport", () => {
  for (const width of [1024, 1100, 1280, 1440, 1920]) {
    test(`nenhuma ficha é cortada em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForTimeout(2500); // fim das animações de entrada

      for (const chip of await hero(page).locator(".hero-chip").all()) {
        if (!(await chip.isVisible())) continue;
        const box = await chip.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
    });
  }
});

test.describe("sem rolagem horizontal", () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`a página cabe em ${width}px`, async ({ page }) => {
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

const apiFigure = (page: Page) =>
  page.getByRole("article", { name: "APIs e integrações" });

test.describe("ilustração de APIs e integrações", () => {
  test("tem legenda curta, rótulo conceitual e é decorativa", async ({ page }) => {
    await page.goto("/");
    const card = apiFigure(page);

    await expect(card).toContainText("Dados que circulam sem redigitação.");
    await expect(card.getByText("Demonstração conceitual")).toBeVisible();
    await expect(card.locator('[aria-hidden="true"]').first()).toBeAttached();
  });

  test("sem nomes de empresas nem números de resultado", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#solucoes").innerText();

    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b\d+\s?x\b/i);
    expect(text).not.toMatch(/\b(sap|salesforce|stripe|shopify|totvs|vtex)\b/i);
  });

  test("o botão Repetir reinicia a animação e termina no estado final", async ({ page }) => {
    await page.goto("/#solucoes");
    const card = apiFigure(page);
    const replay = card.getByRole("button", { name: "Repetir animação" });
    await expect(replay).toBeVisible();

    await replay.click();
    const figure = card.locator("[data-play]");
    await expect(figure).toHaveAttribute("data-play", /armed|playing/);
    await expect(figure).toHaveAttribute("data-play", "playing");

    // Ao fim, todos os conectores estão desenhados (traço completo).
    await page.waitForTimeout(2500);
    const offsets = await card
      .locator(".nx-link")
      .evaluateAll((paths) => paths.map((p) => getComputedStyle(p).strokeDashoffset));
    expect(offsets.length).toBe(6);
    for (const offset of offsets) expect(parseFloat(offset)).toBeCloseTo(0, 1);
  });

  test("é acessível por teclado: o botão Repetir recebe foco visível", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Foco por teclado é testado no desktop.");
    await page.goto("/#solucoes");
    const replay = apiFigure(page).getByRole("button", { name: "Repetir animação" });
    await replay.focus();
    await expect(replay).toBeFocused();
    await expect(replay).toHaveCSS("outline-style", "solid");
  });

  test.describe("movimento reduzido", () => {
    test.use({ reducedMotion: "reduce" });

    test("mostra o estado final sem animar e sem botão de repetir", async ({ page }) => {
      await page.goto("/#solucoes");
      await page.waitForTimeout(500);
      const card = apiFigure(page);

      await expect(card.locator("[data-play]")).toHaveCount(0);
      await expect(card.getByRole("button", { name: "Repetir animação" })).toBeHidden();
      await expect(card.locator(".nx-node").first()).toHaveCSS("opacity", "1");
    });
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("a ilustração aparece completa e estática", async ({ page }) => {
      await page.goto("/#solucoes");
      const card = apiFigure(page);

      await expect(card.locator(".nx-node").first()).toBeVisible();
      await expect(card.locator("[data-play]")).toHaveCount(0);
      await expect(card.getByText("Demonstração conceitual")).toBeVisible();
    });
  });
});
