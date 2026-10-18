import { expect, test } from "@playwright/test";

// O servidor de teste é construído com NEXT_PUBLIC_SITE_URL=http://localhost:3100.
const ORIGIN = "http://localhost:3100";

test.describe("origem pública nos artefatos de SEO (F01)", () => {
  test("canonical, Open Graph e JSON-LD usam a origem configurada", async ({
    page,
  }) => {
    await page.goto("/");

    // O Next pode serializar a raiz com ou sem barra final.
    const root = new RegExp(`^${ORIGIN}/?$`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      root,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      root,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(`^${ORIGIN}/opengraph-image`),
    );

    const jsonLd = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ??
        "{}",
    );
    expect(jsonLd.url).toBe(ORIGIN);
  });

  test("robots e sitemap apontam para a mesma origem", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain(`<loc>${ORIGIN}</loc>`);
  });
});
