import { expect, test } from "@playwright/test";

// A fila usa window.setTimeout: em Node, window aponta para o próprio global.
(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test.describe("requestTurn (fila de demonstrações)", () => {
  test("só uma sequência por vez, na ordem dos pedidos", async () => {
    const { requestTurn } = await import("@/components/ui/playQueue");
    const log: string[] = [];
    const waited: string[] = [];
    requestTurn(() => log.push("a"), 60);
    requestTurn(() => log.push("b"), 60, () => waited.push("b"));
    requestTurn(() => log.push("c"), 60, () => waited.push("c"));

    expect(log).toEqual(["a"]); // só a primeira começa
    expect(waited).toEqual(["b", "c"]); // as outras são avisadas de que esperam
    await sleep(90);
    expect(log).toEqual(["a", "b"]);
    await sleep(70);
    expect(log).toEqual(["a", "b", "c"]);
    await sleep(80); // fila vazia de novo
  });

  test("quem sai da tela libera a vez e some da fila", async () => {
    const { requestTurn } = await import("@/components/ui/playQueue");
    const log: string[] = [];
    const cancelA = requestTurn(() => log.push("a"), 500);
    const cancelB = requestTurn(() => log.push("b"), 500);
    requestTurn(() => log.push("c"), 60);

    cancelB(); // b sai antes de começar: nunca toca
    cancelA(); // a sai no meio: libera a vez para c
    expect(log).toEqual(["a", "c"]);
    await sleep(100);
  });
});
