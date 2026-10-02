import { MENU } from "@/dados";

/*
 * O relógio da abertura da capa, num lugar só. A capa e o cabeçalho precisam
 * combinar o instante em que o pacote sai do selo e o botão do pedido se cola
 * no canto; no computador esse instante depende de quanto o cabeçalho leva
 * para ser datilografado.
 */

/** o cabeçalho começa a aparecer junto com a primeira linha da capa */
const INICIO = 1.15;
/** uma tecla, e a pausa entre uma palavra e a seguinte, em segundos */
const TECLA = 0.022;
const PAUSA = 0.07;

/** quando cada link começa a ser batido, e quantas letras tem */
export const DATILOGRAFIA = (() => {
  let t = INICIO;
  return MENU.map((m) => {
    const n = Array.from(m.rotulo).length;
    const d = t;
    t += n * TECLA + PAUSA;
    return { n, d, dur: n * TECLA };
  });
})();

const fimDatilografia = (() => {
  const u = DATILOGRAFIA[DATILOGRAFIA.length - 1];
  return u.d + u.dur;
})();

/** quando o botão do pedido se cola, em segundos desde o carregamento */
export const ETIQUETA = { celular: 2.15, computador: +(fimDatilografia + 0.1).toFixed(2) };

/** o voo do pacote leva 0,7 s; sai do selo para chegar junto com a etiqueta */
export const VOO = 0.7;

/** a entrada da etiqueta (0,75 s) e o brilho que passa depois (0,9 s) */
export const DEPOIS_DA_ETIQUETA = 0.55 + 0.9 + 0.15;

/** o cabeçalho de links aparece a partir de 1280 px, como no CSS (xl) */
export const ehComputador = () => window.matchMedia("(min-width: 1280px)").matches;
