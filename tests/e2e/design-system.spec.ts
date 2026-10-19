import { expect, test, type Page } from "@playwright/test";

test.describe("tokens do design system", () => {
  test("fundo AMOLED, superfícies, texto e borda de controle", async ({
    page,
  }) => {
    await page.goto("/");

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      // O minificador de CSS pode encurtar #000000 para #000: normaliza para 6 dígitos.
      const read = (name: string) => {
        const value = root.getPropertyValue(name).trim().toLowerCase();
        return /^#[0-9a-f]{3}$/.test(value)
          ? `#${[...value.slice(1)].map((digit) => digit + digit).join("")}`
          : value;
      };
      return {
        background: getComputedStyle(document.body).backgroundColor,
        ink: read("--color-ink"),
        surface: read("--color-surface"),
        surface2: read("--color-surface-2"),
        surface3: read("--color-surface-3"),
        line: read("--color-line"),
        control: read("--color-control"),
        fg: read("--color-fg"),
        muted: read("--color-muted"),
      };
    });

    expect(tokens).toEqual({
      background: "rgb(0, 0, 0)",
      ink: "#000000",
      surface: "#0a0a0a",
      surface2: "#111111",
      surface3: "#171717",
      line: "#27272a",
      control: "#71717a",
      fg: "#f5f5f7",
      muted: "#a1a1aa",
    });
  });

  test("nenhum texto visível abaixo de 14 px", async ({ page }) => {
    await page.goto("/");

    const tooSmall = await page.evaluate(() => {
      const found: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent?.trim();
        const parent = node.parentElement;
        if (!text || !parent) continue;
        if (["SCRIPT", "STYLE"].includes(parent.tagName)) continue;
        const style = getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const size = parseFloat(style.fontSize);
        if (size < 14) found.push(`${size}px: ${text.slice(0, 40)}`);
      }
      return found;
    });

    expect(tooSmall).toEqual([]);
  });

  test("foco visível não altera o raio dos botões arredondados", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Foco por teclado é testado no desktop.");
    await page.goto("/");

    const cta = page
      .getByRole("region", { name: /Tecnologia que resolve/ })
      .getByRole("link", { name: "Conversar sobre um projeto" });
    const radius = () =>
      cta.evaluate((element) => getComputedStyle(element).borderRadius);

    const before = await radius();
    await cta.focus();
    await expect(cta).toBeFocused();
    expect(await radius()).toBe(before);
    await expect(cta).toHaveCSS("outline-style", "solid");
  });
});

/** O wrapper do Reveal é o div imediatamente acima do <header> da seção. */
function revealWrapper(page: Page) {
  return page.locator("#contato-title").locator("xpath=ancestor::div[1]");
}

test.describe("Reveal", () => {
  test("esconde conteúdo abaixo da dobra e o revela ao rolar", async ({
    page,
  }) => {
    await page.goto("/");
    const wrapper = revealWrapper(page);

    await expect(wrapper).toHaveAttribute("data-reveal", "hidden");

    await page.locator("#contato-title").scrollIntoViewIfNeeded();
    await expect(wrapper).toHaveAttribute("data-reveal", "shown");
    await expect(wrapper).toHaveCSS("opacity", "1");
  });

  test("não esconde nada que já esteja visível ao carregar", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(300);

    const hiddenInView = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal="hidden"]')].some(
        (element) => {
          const { top, bottom } = element.getBoundingClientRect();
          return top < window.innerHeight && bottom > 0;
        },
      ),
    );
    expect(hiddenInView).toBe(false);
  });

  test.describe("movimento reduzido", () => {
    test.use({ reducedMotion: "reduce" });

    test("nada é escondido nem animado", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);
      await expect(page.locator("[data-reveal]")).toHaveCount(0);
      await expect(page.locator("#contato-title")).toBeVisible();
    });
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("todo o conteúdo permanece visível", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("[data-reveal]")).toHaveCount(0);
      await expect(page.locator("#contato-title")).toBeVisible();
      await expect(page.locator("#projetos-title")).toBeVisible();
    });
  });
});
