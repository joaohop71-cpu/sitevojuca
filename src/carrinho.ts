import { useSyncExternalStore } from "react";
import { CAFES, PROMO, brl, centavos } from "@/dados";
import type { Moagem } from "@/dados";

export type Linha = {
  chave: string;
  id: string;
  nome: string;
  moagem: Moagem;
  preco: number;
  gramas: number;
};

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function rotuloCafe(c: (typeof CAFES)[number]) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

/** uma linha de pedido por café e moagem, que é a unidade que se compra */
export const LINHAS: Linha[] = CAFES.flatMap((c) => {
  const base = { id: c.id, nome: rotuloCafe(c), gramas: c.gramas };
  const out: Linha[] = [];
  if (c.preco.grao !== null)
    out.push({ ...base, chave: `${c.id}-grao`, moagem: "grao", preco: c.preco.grao });
  if (c.preco.moido !== null)
    out.push({ ...base, chave: `${c.id}-moido`, moagem: "moido", preco: c.preco.moido });
  return out;
});

export const linhasDo = (id: string) => LINHAS.filter((l) => l.id === id);

/**
 * O carrinho, fora do React.
 *
 * Ele morava dentro da seção de preços, e isso obrigava tudo que precisava dele
 * a morar lá também: a quantidade não podia ficar no cartão do café, não havia
 * como uma barra fixa saber que existe pedido, e o botão do cabeçalho não tinha
 * como mudar de texto. Guardado aqui, qualquer componente lê sem que ninguém
 * precise passar propriedade para ninguém.
 *
 * Fica salvo por 24 horas. Depois disso o preço pode ter mudado, e restaurar um
 * pedido velho seria pior do que esvaziá-lo.
 */
const CHAVE = "vojuca:carrinho";
const VALIDADE = 24 * 60 * 60 * 1000;

function ler(): Record<string, number> {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return {};
    const { itens, salvoEm } = JSON.parse(cru) as {
      itens: Record<string, number>;
      salvoEm: string;
    };
    if (Date.now() - new Date(salvoEm).getTime() > VALIDADE) {
      localStorage.removeItem(CHAVE);
      return {};
    }
    /* só as linhas que ainda existem no catálogo, e só números sãos */
    const validas = new Set(LINHAS.map((l) => l.chave));
    const limpo: Record<string, number> = {};
    for (const [k, n] of Object.entries(itens ?? {}))
      if (validas.has(k) && Number.isFinite(n) && n > 0)
        limpo[k] = Math.min(99, Math.floor(n));
    return limpo;
  } catch {
    /* Safari anônimo recusa ler; o pedido segue valendo em memória */
    return {};
  }
}

let estado: Record<string, number> = ler();
const ouvintes = new Set<() => void>();

function publicar(novo: Record<string, number>) {
  estado = novo;
  try {
    if (Object.values(novo).every((n) => !n)) localStorage.removeItem(CHAVE);
    else
      localStorage.setItem(
        CHAVE,
        JSON.stringify({ itens: novo, salvoEm: new Date().toISOString() })
      );
  } catch {
    /* sem espaço ou sem permissão: o pedido continua em memória */
  }
  ouvintes.forEach((f) => f());
}

export function ajustar(chave: string, d: number) {
  const n = Math.max(0, Math.min(99, (estado[chave] ?? 0) + d));
  const novo = { ...estado, [chave]: n };
  if (!n) delete novo[chave];
  publicar(novo);
}

export function esvaziar() {
  publicar({});
}

export function useCarrinho() {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => estado,
    () => estado
  );
}

/**
 * A conta do pedido, em centavos inteiros.
 *
 * Somar float de dinheiro foi o que fez a mensagem enviada discordar do que
 * estava na tela por um centavo. Aqui o arredondamento acontece uma vez só, no
 * fim, e todo mundo lê o mesmo número.
 *
 * O nome é o único em inglês do projeto: a regra de hooks do React exige que
 * quem chama um hook comece por "use", e o verificador não entende "usar".
 */
export function useResumo() {
  const qtd = useCarrinho();
  const itens = LINHAS.filter((l) => (qtd[l.chave] ?? 0) > 0);
  const subtotalC = itens.reduce(
    (s, l) => s + centavos(l.preco) * (qtd[l.chave] ?? 0),
    0
  );
  const totalC = Math.round(subtotalC * (1 - PROMO.pct));
  const pacotes = itens.reduce((s, l) => s + (qtd[l.chave] ?? 0), 0);
  /* os pacotes têm pesos diferentes, então o peso vem de cada linha */
  const quilos = itens.reduce((s, l) => s + (l.gramas / 1000) * (qtd[l.chave] ?? 0), 0);

  const mensagem = !itens.length
    ? "Olá! Quero montar um pedido dos cafés do Vô Juca."
    : [
        "Olá! Quero fazer este pedido:",
        "",
        itens
          .map(
            (l) =>
              `• ${qtd[l.chave]}x ${l.nome} ${l.gramas} g, ${
                l.moagem === "grao" ? "em grão" : "moído"
              } · ${brl(l.preco)} cada`
          )
          .join("\n"),
        "",
        `Subtotal (preço de tabela): ${brl(subtotalC / 100)}`,
        `${PROMO.chamada}: -${brl((subtotalC - totalC) / 100)}`,
        `Total: ${brl(totalC / 100)}`,
      ].join("\n");

  return {
    qtd,
    itens,
    pacotes,
    quilos,
    subtotal: subtotalC / 100,
    desconto: (subtotalC - totalC) / 100,
    total: totalC / 100,
    mensagem,
  };
}
