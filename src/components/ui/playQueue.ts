/**
 * Fila de "vez" das demonstrações (ui/PlayFigure.tsx): só uma sequência
 * automática roda por vez, mesmo com várias figuras à vista. Cada figura pede
 * a vez; quando a anterior termina (`ms`) ou sai da tela, a próxima começa.
 */
type Waiter = { id: symbol; run: () => void; ms: number };

const waiting: Waiter[] = [];
let current: symbol | null = null;
let timer = 0;

function next() {
  window.clearTimeout(timer);
  current = null;
  const waiter = waiting.shift();
  if (!waiter) return;
  current = waiter.id;
  waiter.run();
  timer = window.setTimeout(next, waiter.ms);
}

/**
 * Pede a vez. `run` é chamado quando a figura pode tocar; `onWait`, se ela
 * precisar esperar. Devolve o cancelamento (sai da fila ou libera a vez).
 */
export function requestTurn(run: () => void, ms: number, onWait?: () => void) {
  const id = Symbol("turn");
  const idle = current === null;
  waiting.push({ id, run, ms });
  if (idle) next();
  else onWait?.();

  return () => {
    const index = waiting.findIndex((waiter) => waiter.id === id);
    if (index >= 0) waiting.splice(index, 1);
    if (current === id) next();
  };
}
