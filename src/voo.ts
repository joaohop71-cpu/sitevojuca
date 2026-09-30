/**
 * O pacotinho que sai do + e cai no pedido, lá no cabeçalho.
 *
 * No celular o carrinho fica fora da tela, e o único sinal de que o café
 * entrou no pedido era o número do contador mudar embaixo do dedo. O voo é a
 * confirmação: o pacote sobe, vai até o botão do pedido, e o botão pulsa.
 *
 * É só enfeite de uma coisa que já aconteceu. O número do pedido muda na hora,
 * pelo carrinho; o voo não segura nada. E se o relógio das animações estiver
 * parado — aba em segundo plano, economia de bateria — quem chega primeiro, o
 * fim do voo ou um relógio comum, encerra.
 */

const PACOTE = `<svg viewBox="0 0 26 32" width="26" height="32" aria-hidden="true">
  <path d="M3 6h20l-1.5 24h-17z" fill="#f6eede" stroke="#3a271b" stroke-width="1.6"/>
  <path d="M3 6l3-4h14l3 4" fill="#efe3cc" stroke="#3a271b" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="13" cy="17" r="4.2" fill="none" stroke="#3a271b" stroke-width="1.3"/>
</svg>`;

/** o botão do pedido que está na tela agora: o do computador ou o do celular */
function alvo(): HTMLElement | null {
  const todos = document.querySelectorAll<HTMLElement>("[data-alvo-pedido]");
  for (const el of todos) if (el.getClientRects().length) return el;
  return null;
}

function bate(el: HTMLElement) {
  el.classList.remove("pedido-bate");
  void el.offsetWidth; /* reinicia a animação se dois pacotes chegam juntos */
  el.classList.add("pedido-bate");
}

export function voarAtePedido(origem: HTMLElement) {
  const destino = alvo();
  if (!destino) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return bate(destino);

  const a = origem.getBoundingClientRect();
  const z = destino.getBoundingClientRect();
  const x0 = a.left + a.width / 2 - 13;
  const y0 = a.top - 34;
  const dx = z.left + z.width / 2 - 13 - x0;
  const dy = z.top + z.height / 2 - 16 - y0;

  const el = document.createElement("div");
  el.innerHTML = PACOTE;
  Object.assign(el.style, {
    position: "fixed",
    left: `${x0}px`,
    top: `${y0}px`,
    zIndex: "90",
    pointerEvents: "none",
  });
  document.body.appendChild(el);

  /* sobe um pouco antes de ir: é o gesto de tirar o pacote da prateleira */
  const voo = el.animate(
    [
      { transform: "translate(0, 0) scale(1)" },
      { transform: `translate(${dx * 0.3}px, ${Math.min(-56, dy * 0.3 - 56)}px) scale(1.06)`, offset: 0.35 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.45)`, opacity: 0.85 },
    ],
    { duration: 700, easing: "cubic-bezier(.4, 0, .2, 1)" }
  );

  let pousou = false;
  const pousa = () => {
    if (pousou) return;
    pousou = true;
    el.remove();
    bate(destino);
  };
  voo.onfinish = pousa;
  setTimeout(pousa, 800);
}
