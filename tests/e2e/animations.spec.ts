import { expect, test, type Page } from "@playwright/test";

const go = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.scrollIntoView(), selector);

// As figuras só "armam" depois da hidratação; rolar antes disso as deixaria estáticas.
// Rola até o centro do elemento: figuras no fim de uma seção só tocam ao ficarem bem visíveis.
const center = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.scrollIntoView({ block: "center" }), selector);

const loopsOn = (page: Page) => page.locator("html[data-motion='on']").waitFor({ state: "attached" });

const hydrated = (page: Page) => page.locator("[data-play='armed']").first().waitFor({ state: "attached" });

const style = (page: Page, selector: string, prop: "opacity" | "transform") =>
  page.locator(selector).first().evaluate((el, p) => getComputedStyle(el)[p], prop);

test.describe("animações", () => {
  test("luz percorrendo o cubo: em loop, com pausa longa, sem esconder o texto", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("region", { name: /Tecnologia que resolve/ });
    // Título e botões visíveis desde o começo.
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Conversar sobre um projeto" })).toBeVisible();
    await loopsOn(page);

    // Loop com atraso inicial: a luz começa e termina apagada e acende no meio de cada ciclo.
    const sheen = await page.evaluate(() => {
      const animation = document
        .getAnimations()
        .find((a) => (a as CSSAnimation).animationName === "sheen-loop" && (a.effect as KeyframeEffect).target?.classList.contains("hero-sheen"));
      const effect = animation!.effect as KeyframeEffect;
      const timing = effect.getTiming();
      return {
        iterations: timing.iterations,
        delay: timing.delay,
        opacities: effect.getKeyframes().map((k) => String(k.opacity)),
      };
    });
    expect(sheen.iterations).toBe(Infinity);
    expect(sheen.delay).toBeGreaterThanOrEqual(1500);
    expect(sheen.opacities[0]).toBe("0");
    expect(sheen.opacities.at(-1)).toBe("0");
    expect(sheen.opacities).toContain("1");
    const decorative = await page.locator(".hero-sheen").evaluate((el) => el.getAttribute("alt") === "");
    expect(decorative).toBe(true);
  });

  test("luz da cena: passa atrás do cubo em momentos espaçados, contida no palco", async ({ page }) => {
    await page.goto("/");
    await loopsOn(page);
    const light = await page.evaluate(() => {
      const animation = document
        .getAnimations()
        .find((a) => (a as CSSAnimation).animationName === "scene-pass");
      const effect = animation!.effect as KeyframeEffect;
      const target = effect.target as HTMLElement;
      return {
        iterations: effect.getTiming().iterations,
        duration: effect.getTiming().duration,
        opacities: effect.getKeyframes().map((k) => String(k.opacity)),
        insideStage: Boolean(target.closest("[aria-hidden='true']")),
        zIndex: getComputedStyle(target).zIndex,
      };
    });
    expect(light.iterations).toBe(Infinity);
    expect(light.duration).toBeGreaterThanOrEqual(12000); // pausa longa entre passagens
    expect(light.opacities[0]).toBe("0");
    expect(light.opacities.at(-1)).toBe("0");
    expect(light.insideStage).toBe(true);
    expect(Number(light.zIndex)).toBeLessThan(10); // atrás dos trilhos e do cubo
  });

  test("o trilho cromado recebe um reflexo ao entrar na tela", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator("#solucoes > div[aria-hidden='true']").first();
    await expect(rail).not.toHaveAttribute("data-sweep", "play");
    await go(page, "#solucoes");
    await expect(rail).toHaveAttribute("data-sweep", "play");
  });

  test("o cubo do contato pega a luz ao entrar na tela", async ({ page }) => {
    await page.goto("/");
    const sealBox = page.locator("#contato div:has(> .seal-sheen)");
    await expect(sealBox).not.toHaveAttribute("data-sweep", "play");
    await go(page, "#contato");
    await expect(sealBox).toHaveAttribute("data-sweep", "play");
    await page.waitForFunction(
      () => parseFloat(getComputedStyle(document.querySelector(".seal-sheen")!).opacity) > 0.8,
      null,
      { timeout: 6000, polling: 16 },
    );
  });

  test("as figuras recomeçam sozinhas (loop) enquanto estão à vista", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/");
    await hydrated(page);
    await loopsOn(page);
    await page.locator("#solucoes summary").nth(2).click();
    await center(page, "#solucoes details[open] .scene-integrations");
    const doc = "#solucoes details[open] .scene-beam-pulse";
    const opacity = (sel: string) => parseFloat(getComputedStyle(document.querySelector(sel)!).opacity);
    // Primeiro ciclo, fim do ciclo e segundo ciclo, sem nenhum clique.
    await page.waitForFunction(`(${opacity})("${doc}") > 0.9`, null, { timeout: 30000, polling: 30 });
    await page.waitForFunction(`(${opacity})("${doc}") < 0.01`, null, { timeout: 12000, polling: 50 });
    await page.waitForFunction(`(${opacity})("${doc}") > 0.9`, null, { timeout: 30000, polling: 30 });
  });

  test("o nome NOXORA. se expande horizontalmente sem onda nem texto oculto", async ({ page }) => {
    await page.goto("/");
    await loopsOn(page);
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "Noxora, voltar ao início" })).toBeVisible();
    await expect(header.locator(".wm[aria-hidden='true']")).toHaveCount(1);
    const letters = header.locator(".wm-letter");
    await expect(letters).toHaveCount(7);
    const movement = await letters.evaluateAll((els) => {
      const sample = (time: number) => {
        els.forEach((el) => {
          const animation = el.getAnimations()[0];
          animation.pause();
          animation.currentTime = time;
        });
        return els.map((el) => {
          const rect = el.getBoundingClientRect();
          return { x: rect.x, y: rect.y, opacity: getComputedStyle(el).opacity };
        });
      };
      const rest = sample(0);
      const expanded = sample(600);
      const end = sample(1600);
      return { rest, expanded, end };
    });
    expect(movement.expanded[0].x).toBeLessThan(movement.rest[0].x);
    expect(movement.expanded[6].x).toBeGreaterThan(movement.rest[6].x);
    expect(movement.expanded.map((r) => r.y)).toEqual(movement.rest.map((r) => r.y));
    expect(movement.expanded.every((r) => r.opacity === "1")).toBe(true);
    expect(movement.end).toEqual(movement.rest);
  });
  test("o botão de pausa para todos os loops e retoma", async ({ page }) => {
    await page.goto("/");
    await loopsOn(page);
    const infinite = () =>
      page.evaluate(
        () => document.getAnimations().filter((a) => (a.effect as KeyframeEffect).getComputedTiming().iterations === Infinity).length,
      );
    expect(await infinite()).toBeGreaterThan(0);

    const toggle = page.getByRole("button", { name: "Pausar animações" });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Retomar animações" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    expect(await infinite()).toBe(0);
    expect(await style(page, ".hero-sheen", "opacity")).toBe("0");

    await page.getByRole("button", { name: "Retomar animações" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
    await expect.poll(infinite).toBeGreaterThan(0);
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("nada se move: tudo já está no estado final e visível", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    expect(await style(page, ".hero-sheen", "opacity")).toBe("0");
    // Sem loops: nenhuma animação infinita e sem botão de pausa (não há o que pausar).
    await expect(page.locator("html")).not.toHaveAttribute("data-motion", /.+/);
    await expect(page.getByRole("button", { name: /animações/ })).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.getAnimations().filter((a) => (a.effect as KeyframeEffect).getComputedTiming().iterations === Infinity).length,
      ),
    ).toBe(0);
    await expect(page.locator("[data-play]")).toHaveCount(0);
    await expect(page.locator("[data-sweep]")).toHaveCount(0);

    await go(page, "#solucoes");
    await page.waitForTimeout(300);
    expect(await style(page, "#solucoes .scene-desktop", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .scene-notice", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .scene-beam-pulse", "opacity")).toBe("0");

    await go(page, "#beneficios");
    await page.waitForTimeout(300);
    await expect(page.locator("#beneficios").getByRole("heading", { name: "Acompanhar", exact: true })).toBeVisible();
    expect(await style(page, "#solucoes .scene-beam-pulse", "opacity")).toBe("0");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("as figuras ficam completas no estado final", async ({ page }) => {
    await page.goto("/");
    expect(await style(page, "#solucoes .scene-desktop", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .scene-notice", "opacity")).toBe("1");
    await expect(page.locator("#beneficios").getByRole("heading", { name: "Acompanhar", exact: true })).toBeVisible();
    await expect(page.locator("#beneficios").getByRole("button")).toBeHidden();
  });
});
