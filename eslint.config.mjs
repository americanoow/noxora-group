// Perfil leve do Vibe Coding Toolkit para Next.js: presets oficiais do Next
// (core-web-vitals + TypeScript) e o limite de 350 linhas por arquivo.
// A base fica em eslint-rules/next-base.mjs; aqui entram só as exclusões do projeto.
import { defineConfig, globalIgnores } from "eslint/config";
import base from "./eslint-rules/next-base.mjs";

export default defineConfig([
  ...base,
  globalIgnores([
    // Backups locais e artefatos do Playwright.
    ".backups/**",
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
  ]),
]);
