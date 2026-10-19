import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) =>
  page.getByRole("region", { name: "Veja como transformamos problemas em soluções." });
const carousel = (page: Page) => section(page).getByRole("region", { name: "Projetos" });
const scroller = (page: Page) => carousel(page).getByRole("group", { name: /Use as setas/ });
const position = (page: Page) => carousel(page).getByText(/^Projeto \d de \d$/);

test.describe("vitrine de projetos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("mostra três demonstrações conceituais, todas identificadas como tal", async ({ page }) => {
    const slides = section(page).getByRole("article");
    await expect(slides).toHaveCount(3);
    await expect(slides.getByText("Demonstração conceitual")).toHaveCount(3);
    await expect(section(page).getByRole("heading", { level: 3 })).toHaveText([
      "Website comercial",
      "Sistema de gestão",
      "Automação de processos",
    ]);
    // Nada de cliente, depoimento ou resultado numérico.
    const text = await section(page).innerText();
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b\d+\s?x\b/i);
    expect(text).not.toMatch(/depoimento/i);
    await expect(section(page)).toContainText("primeiros projetos reais");
  });

  test("a prévia visual é decorativa e não traz texto legível", async ({ page }) => {
    const previews = section(page).locator("article [data-preview]");
    await expect(previews).toHaveCount(3);
    for (const preview of await previews.all()) {
      expect((await preview.innerText()).trim()).toBe("");
    }
  });

  test("setas, pontos e indicador navegam sem loop e sem autoplay", async ({ page }) => {
    const prev = carousel(page).getByRole("button", { name: "Projeto anterior" });
    const next = carousel(page).getByRole("button", { name: "Próximo projeto" });

    await expect(position(page)).toHaveText("Projeto 1 de 3");
    await expect(prev).toHaveAttribute("aria-disabled", "true");

    await next.click();
    await expect(position(page)).toHaveText("Projeto 2 de 3");
    await expect(prev).toHaveAttribute("aria-disabled", "false");

    await carousel(page).getByRole("button", { name: /Ir para o projeto 3/ }).click();
    await expect(position(page)).toHaveText("Projeto 3 de 3");
    await expect(next).toHaveAttribute("aria-disabled", "true");
    // Sem loop: no último projeto, "próximo" não volta ao primeiro.
    await next.click({ force: true });
    await page.waitForTimeout(500);
    await expect(position(page)).toHaveText("Projeto 3 de 3");
    await expect(carousel(page).getByRole("button", { name: /Ir para o projeto 3/ })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Sem autoplay: a posição não muda sozinha.
    await carousel(page).getByRole("button", { name: /Ir para o projeto 1/ }).click();
    await expect(position(page)).toHaveText("Projeto 1 de 3");
    await page.waitForTimeout(2500);
    await expect(position(page)).toHaveText("Projeto 1 de 3");
  });

  test("o teclado troca de projeto e o foco fica visível", async ({ page, isMobile }) => {
    test.skip(isMobile, "Teclado físico não se aplica ao celular.");
    const area = scroller(page);
    await expect(position(page)).toBeVisible(); // hidratou
    await area.focus();
    await expect(area).toBeFocused();
    const outline = await area.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).toBe("solid");

    await page.keyboard.press("ArrowRight");
    await expect(position(page)).toHaveText("Projeto 2 de 3");
    await page.keyboard.press("End");
    await expect(position(page)).toHaveText("Projeto 3 de 3");
    await page.keyboard.press("ArrowLeft");
    await expect(position(page)).toHaveText("Projeto 2 de 3");
    await page.keyboard.press("Home");
    await expect(position(page)).toHaveText("Projeto 1 de 3");
  });

  test("os controles são alcançáveis e têm alvo de pelo menos 24 px", async ({ page }) => {
    const buttons = carousel(page).getByRole("button");
    await expect(buttons).toHaveCount(5);
    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(24);
      expect(box!.height).toBeGreaterThanOrEqual(24);
    }
    const next = carousel(page).getByRole("button", { name: "Próximo projeto" });
    await next.focus();
    await expect(next).toBeFocused();
  });

  test("a rolagem real (gesto de arrastar) atualiza o indicador", async ({ page }) => {
    await expect(position(page)).toBeVisible(); // hidratou
    await scroller(page).evaluate((el) => {
      el.style.scrollSnapType = "none";
      el.scrollTo({ left: (el.children[1] as HTMLElement).offsetLeft, behavior: "auto" });
      el.style.scrollSnapType = "";
    });
    await expect(position(page)).toHaveText("Projeto 2 de 3");
  });

  test("o próximo projeto aparece de lado, sinalizando que há mais", async ({ page }) => {
    await expect(position(page)).toBeVisible(); // hidratou
    const { sliderRight, nextLeft, nextRight } = await scroller(page).evaluate((el) => {
      const box = el.getBoundingClientRect();
      const next = (el.children[1] as HTMLElement).getBoundingClientRect();
      return { sliderRight: box.right, nextLeft: next.left, nextRight: next.right };
    });
    expect(nextLeft).toBeLessThan(sliderRight - 12); // um pedaço visível
    expect(nextRight).toBeGreaterThan(sliderRight); // e continua cortado
  });

  test("o mouse arrasta para trocar de projeto", async ({ page, isMobile }) => {
    test.skip(isMobile, "No celular o arrasto é o toque nativo.");
    await expect(position(page)).toBeVisible(); // hidratou
    await scroller(page).scrollIntoViewIfNeeded();
    const box = (await scroller(page).boundingBox())!;
    const y = box.y + 80;
    await page.mouse.move(box.x + box.width * 0.7, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.4, y, { steps: 8 });
    await page.mouse.up();
    await expect(position(page)).toHaveText("Projeto 2 de 3");
    // Arrasto curto volta ao mesmo projeto.
    await page.mouse.move(box.x + box.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 + 20, y, { steps: 4 });
    await page.mouse.up();
    await expect(position(page)).toHaveText("Projeto 2 de 3");
  });

  test("o conteúdo do projeto ativo entra em sequência e termina visível", async ({ page }) => {
    await expect(position(page)).toBeVisible(); // hidratou
    const reveal = carousel(page).getByRole("group", { name: /^1 de 3/ }).locator(".pj-reveal");
    await expect(reveal).toHaveCount(4);
    await expect.poll(() => reveal.evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === "1"))).toBe(true);
    const delays = await reveal.evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toEqual([...delays].sort((x, y) => x - y)); // um depois do outro
    expect(new Set(delays).size).toBe(delays.length);
  });

  test("a página não ganha rolagem horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("a troca de projeto é instantânea", async ({ page }) => {
    await page.goto("/");
    await expect(position(page)).toBeVisible(); // hidratou
    // Clica e olha dois quadros depois, dentro da página (não depende da carga da máquina):
    // sem animação a rolagem já chegou; a suave ainda estaria a caminho.
    const settled = await scroller(page).evaluate(async (el) => {
      const next = el.parentElement!.querySelector<HTMLButtonElement>("button[aria-label='Próximo projeto']")!;
      next.click();
      for (let i = 0; i < 4; i++) await new Promise((resolve) => requestAnimationFrame(resolve));
      return el.scrollLeft >= (el.children[1] as HTMLElement).offsetLeft * 0.9;
    });
    expect(settled).toBe(true);
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("os três projetos continuam presentes e sem controles inúteis", async ({ page }) => {
    await page.goto("/");
    await expect(section(page).getByRole("article")).toHaveCount(3);
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

  test("2 projetos: carrossel com dois pontos", async ({ page }) => {
    await page.goto(fixture(2));
    const c = carousel(page);
    await expect(c.getByRole("article")).toHaveCount(2);
    await expect(c.getByRole("button", { name: /Ir para o projeto/ })).toHaveCount(2);
    await expect(c.getByText("Projeto 1 de 2")).toBeVisible();
    await c.getByRole("button", { name: "Próximo projeto" }).click();
    await expect(c.getByText("Projeto 2 de 2")).toBeVisible();
  });

  test("5 projetos: o indicador acompanha até o último", async ({ page }) => {
    await page.goto(fixture(5));
    const c = carousel(page);
    await expect(c.getByRole("button", { name: /Ir para o projeto/ })).toHaveCount(5);
    await c.getByRole("button", { name: /Ir para o projeto 5/ }).click();
    await expect(c.getByText("Projeto 5 de 5")).toBeVisible();
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
