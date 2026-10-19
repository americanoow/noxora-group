import { expect, test, type Page } from "@playwright/test";

const go = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.scrollIntoView(), selector);

// As figuras só "armam" depois da hidratação; rolar antes disso as deixaria estáticas.
// Rola até o centro do elemento: figuras no fim de uma seção só tocam ao ficarem bem visíveis.
const center = (page: Page, selector: string) =>
  page.evaluate((sel) => document.querySelector(sel)!.scrollIntoView({ block: "center" }), selector);

const loopsOn = (page: Page) => page.locator("html[data-motion='on']").waitFor({ state: "attached" });

const hydrated = (page: Page) => page.locator("[data-play='armed']").first().waitFor({ state: "attached" });

const resting = (transform: string) => transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)";

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

  test("integrações: o sinal vai do sistema à API e da API aos outros sistemas", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const paths = await page.locator("#solucoes .nx-pulse").evaluateAll((els) =>
      els.map((el) => el.getAttribute("d")!.split(" ")[0]),
    );
    // Origens (Site, Loja) começam no sistema; destinos começam na API (caminho invertido).
    expect(paths).toEqual(["M138", "M502", "M264", "M376", "M296", "M344"]);

    await center(page, "article:has(#solucao-api) .nx-respond");
    // Cada destino responde ao receber o sinal.
    await page.waitForFunction(
      () => [...document.querySelectorAll("article:has(#solucao-api) .nx-respond")].some((el) => parseFloat(getComputedStyle(el).opacity) > 0.3),
      null,
      { timeout: 9000, polling: 50 },
    );
  });

  test("automação: o documento percorre origem, regra e destino, e dá para repetir", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await center(page, "#solucoes .nx-doc");
    const done = "#solucoes .nx-done";
    const doc = "#solucoes .nx-doc";

    await page.waitForFunction(
      (sel) => parseFloat(getComputedStyle(document.querySelector(sel)!).opacity) > 0.9,
      doc,
      { timeout: 9000, polling: 16 },
    );
    await page.waitForFunction(
      ([d, o]) =>
        parseFloat(getComputedStyle(document.querySelector(d)!).opacity) < 0.01 &&
        getComputedStyle(document.querySelector(o)!).opacity === "1",
      [doc, done],
      { timeout: 9000, polling: 50 },
    );

    const replay = page.getByRole("button", { name: "Repetir a animação da automação" });
    await expect(replay).toBeVisible();
    await replay.click();
    await page.waitForFunction(
      (sel) => parseFloat(getComputedStyle(document.querySelector(sel)!).opacity) > 0.9,
      doc,
      { timeout: 9000, polling: 16 },
    );
  });

  test("websites e sistemas: as camadas se encaixam e terminam completas", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await center(page, "#solucoes .nx-layer");
    await page.waitForFunction(
      () => [...document.querySelector("#solucoes .nx-layer")!.closest("[data-play]")!.querySelectorAll(".nx-layer")].some((el) => parseFloat(getComputedStyle(el).opacity) < 1),
      null,
      { timeout: 5000, polling: 16 },
    );
    await page.waitForFunction(
      () => [...document.querySelector("#solucoes .nx-layer")!.closest("[data-play]")!.querySelectorAll(".nx-layer")].every((el) => getComputedStyle(el).opacity === "1"),
      null,
      { timeout: 6000, polling: 50 },
    );
    expect(resting(await style(page, "#solucoes .nx-layer", "transform"))).toBe(true);
  });

  test("do disperso ao organizado: os blocos se alinham e os nomes aparecem", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await center(page, "#beneficios .nx-align");
    await page.waitForFunction(
      () => [...document.querySelectorAll("#beneficios .nx-align")].some((el) => getComputedStyle(el).transform !== "none"),
      null,
      { timeout: 4000, polling: 16 },
    );
    await page.waitForFunction(
      () => {
        const resting = (t: string) => t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)";
        return [...document.querySelectorAll("#beneficios .nx-align")].every((el) => resting(getComputedStyle(el).transform));
      },
      null,
      { timeout: 6000, polling: 50 },
    );
    for (const name of ["Planilhas", "E-mails", "Mensagens", "Pedidos"]) {
      for (const label of await page.locator("#beneficios").getByText(name, { exact: true }).all()) {
        await expect(label).toBeVisible();
        await expect.poll(() => label.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      }
    }
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

  test("a troca de projetos esmaece o que não está em foco, sem mudar a altura", async ({ page }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Projetos" });
    await expect(carousel.getByRole("button", { name: "Próximo projeto" })).toBeVisible();
    const slides = carousel.getByRole("group", { name: /^\d de 3/ });
    const opacity = (n: number) => slides.nth(n).evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    const heightBefore = await carousel.evaluate((el) => el.getBoundingClientRect().height);

    await expect.poll(() => opacity(0)).toBe(1);
    await expect.poll(() => opacity(1)).toBeLessThan(0.5);
    await carousel.getByRole("button", { name: "Próximo projeto" }).click();
    await expect.poll(() => opacity(1)).toBe(1);
    await expect.poll(() => opacity(0)).toBeLessThan(0.5);
    const heightAfter = await carousel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(heightAfter - heightBefore)).toBeLessThan(40);
  });

  test("as figuras recomeçam sozinhas (loop) enquanto estão à vista", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/");
    await hydrated(page);
    await loopsOn(page);
    await center(page, "#solucoes .nx-doc");
    const doc = "#solucoes .nx-doc";
    const opacity = (sel: string) => parseFloat(getComputedStyle(document.querySelector(sel)!).opacity);
    // Primeiro ciclo, fim do ciclo e segundo ciclo, sem nenhum clique.
    await page.waitForFunction(`(${opacity})("${doc}") > 0.9`, null, { timeout: 12000, polling: 30 });
    await page.waitForFunction(`(${opacity})("${doc}") < 0.01`, null, { timeout: 12000, polling: 50 });
    await page.waitForFunction(`(${opacity})("${doc}") > 0.9`, null, { timeout: 20000, polling: 30 });
  });

  test("o nome NOXORA. no topo: letras sobem em sequência e um brilho as percorre em loop", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    // Texto real para leitores de tela; as letras separadas são decorativas.
    await expect(header.getByRole("link", { name: "Noxora, voltar ao início" })).toBeVisible();
    const letters = header.locator(".wm-letter");
    await expect(letters).toHaveCount(7);
    await expect(header.locator(".wm[aria-hidden='true']")).toHaveCount(1);

    // Entrada: uma vez, com atrasos crescentes; termina com tudo visível.
    const delays = await letters.evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).animationDelay)));
    expect(delays).toEqual([...delays].sort((x, y) => x - y));
    expect(new Set(delays).size).toBe(7);
    await expect.poll(() => letters.evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === "1"))).toBe(true);

    // Brilho: loop com pausa longa, que passa por todas as letras (o ponto vai ao azul-gelo).
    await loopsOn(page);
    const glint = await header.locator(".wm-glint").evaluateAll((els) =>
      els.map((el) => {
        const a = el.getAnimations().find((x) => (x as CSSAnimation).animationName.startsWith("wm-glint"))!;
        const t = a.effect!.getTiming();
        return { name: (a as CSSAnimation).animationName, iterations: t.iterations, duration: t.duration, delay: t.delay };
      }),
    );
    expect(glint).toHaveLength(7);
    expect(glint.every((g) => g.iterations === Infinity && g.duration === 10000)).toBe(true);
    expect(glint.at(-1)!.name).toBe("wm-glint-dot");
    const glintDelays = glint.map((g) => Number(g.delay));
    expect(glintDelays).toEqual([...glintDelays].sort((x, y) => x - y));
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
    expect(await style(page, "#solucoes .nx-layer", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .nx-done", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .nx-doc", "opacity")).toBe("0");

    await go(page, "#beneficios");
    await page.waitForTimeout(300);
    expect(resting(await style(page, "#beneficios .nx-align", "transform"))).toBe(true);
    expect(await style(page, "#beneficios .nx-label", "opacity")).toBe("1");
    await expect(page.locator("#beneficios").getByText("Solução Noxora")).toBeVisible();
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("as figuras ficam completas no estado final", async ({ page }) => {
    await page.goto("/");
    expect(await style(page, "#solucoes .nx-layer", "opacity")).toBe("1");
    expect(await style(page, "#solucoes .nx-done", "opacity")).toBe("1");
    expect(resting(await style(page, "#beneficios .nx-align", "transform"))).toBe(true);
    expect(await style(page, "#beneficios .nx-label", "opacity")).toBe("1");
    await expect(page.locator("#beneficios").getByText("Solução Noxora")).toBeVisible();
  });
});
