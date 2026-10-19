import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Pixel 7"] },
    },
    // Testes de funções puras, sem navegador.
    { name: "unit", testMatch: "unit/**/*.spec.ts" },
  ],
  webServer: {
    // Build de produção com os canais ainda pendentes, como no lançamento atual.
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    // Nunca reaproveitar um servidor já aberto: o `npm run check` testaria código antigo.
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
      CONTACT_EMAIL: "",
      WHATSAPP_NUMBER: "",
      CONTACT_WEBHOOK_URL: "",
    },
  },
});
