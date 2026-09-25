import { useSyncExternalStore } from "react";
import { CAFES, PROMO, TINTA_ROTULO, brl, centavos, estaEsgotado } from "@/dados";
import type { Moagem } from "@/dados";

export type Linha = {
  chave: string;
  id: string;
  nome: string;
  moagem: Moagem;
  preco: number;
  gramas: number;
  /** o item exato da aba Produtos da planilha: "Reserva 998 · Moído" */
  item: string;
  /** a tinta da linha do café, para o item aparecer com a cor dele */
  cor: string;
  /** entra na promoção de lançamento? o Minas Santa não entra */
  promo: boolean;
  /** acabou: fica no site, mas não entra no carrinho */
  esgotado: boolean;
};

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function rotuloCafe(c: (typeof CAFES)[number]) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

/** uma linha de pedido por café e moagem, que é a unidade que se compra */
export const LINHAS: Linha[] = CAFES.flatMap((c) => {
  const base = {
    id: c.id,
    nome: rotuloCafe(c),
    gramas: c.gramas,
    cor: TINTA_ROTULO[c.cor],
    promo: !c.semPromo,
  };
  const out: Linha[] = [];
  if (c.preco.grao !== null)
    out.push({
      ...base,
      chave: `${c.id}-grao`,
      moagem: "grao",
      preco: c.preco.grao,
      item: `${c.planilha} · Grão`,
      esgotado: estaEsgotado(c, "grao"),
    });
  if (c.preco.moido !== null)
    out.push({
      ...base,
      chave: `${c.id}-moido`,
      moagem: "moido",
      preco: c.preco.moido,
      item: `${c.planilha} · Moído`,
      esgotado: estaEsgotado(c, "moido"),
    });
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

/**
 * O código do pedido.
 *
 * É o que amarra a conversa no WhatsApp à linha na planilha. Sem ele, um
 * pedido que chega pelo site e uma conversa que termina em "fechado" são dois
 * fatos soltos, e quem tem de reconciliar os dois é a memória.
 *
 * O alfabeto não tem I, O, 0, 1 nem U: o código é lido em voz alta e digitado
 * na busca do celular, e é ali que I vira 1 e O vira 0. Sem U porque quatro
 * letras sorteadas formam palavrão com uma frequência que surpreende.
 */
const ALFABETO = "ABCDEFGHJKLMNPQRSTVWXYZ23456789";

function novoCodigo() {
  const n = new Uint32Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(n);
  else for (let i = 0; i < 4; i++) n[i] = Math.floor(Math.random() * 2 ** 32);
  return (
    "VJ-" +
    Array.from(n, (x) => ALFABETO[x % ALFABETO.length]).join("")
  );
}

let codigo = "";

function ler(): Record<string, number> {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return {};
    const guardado = JSON.parse(cru) as {
      itens: Record<string, number>;
      salvoEm: string;
      codigo?: string;
    };
    const { itens, salvoEm } = guardado;
    if (Date.now() - new Date(salvoEm).getTime() > VALIDADE) {
      localStorage.removeItem(CHAVE);
      return {};
    }
    if (guardado.codigo) codigo = guardado.codigo;
    /* só as linhas que ainda existem no catálogo e ainda têm estoque, e só
       números sãos: um pedido salvo ontem pode trazer o que acabou hoje */
    const validas = new Set(LINHAS.filter((l) => !l.esgotado).map((l) => l.chave));
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
  const vazio = Object.values(novo).every((n) => !n);
  /* um código por carrinho: enquanto houver pedido em pé ele é o mesmo, e
     some junto com o pedido para que o próximo nasça com outro */
  if (vazio) codigo = "";
  else if (!codigo) codigo = novoCodigo();
  try {
    if (vazio) localStorage.removeItem(CHAVE);
    else
      localStorage.setItem(
        CHAVE,
        JSON.stringify({ itens: novo, salvoEm: new Date().toISOString(), codigo })
      );
  } catch {
    /* sem espaço ou sem permissão: o pedido continua em memória */
  }
  ouvintes.forEach((f) => f());
}

export function ajustar(chave: string, d: number) {
  /* tirar sempre pode; pôr, só o que existe em estoque — inclusive porque um
     pedido salvo ontem pode trazer uma linha que acabou desde então */
  if (d > 0 && LINHAS.find((l) => l.chave === chave)?.esgotado) return;
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
  /* O desconto não é mais uma porcentagem do carrinho inteiro: o Minas Santa
     fica no preço de tabela. Some-se primeiro o que entra na promoção e só
     depois arredonde, uma vez, senão cada linha traz o seu meio centavo. */
  const comPromoC = itens.reduce(
    (s, l) => s + (l.promo ? centavos(l.preco) * (qtd[l.chave] ?? 0) : 0),
    0
  );
  const descontoC = Math.round(comPromoC * PROMO.pct);
  const totalC = subtotalC - descontoC;
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
        ...(descontoC ? [`${PROMO.chamada}: -${brl(descontoC / 100)}`] : []),
        `Total: ${brl(totalC / 100)}`,
        "",
        `Pedido ${codigo}`,
      ].join("\n");

  return {
    qtd,
    codigo,
    itens,
    pacotes,
    quilos,
    subtotal: subtotalC / 100,
    desconto: descontoC / 100,
    total: totalC / 100,
    mensagem,
  };
}
