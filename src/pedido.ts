import { PROMO, centavos } from "@/dados";
import type { Linha } from "@/carrinho";

/**
 * O registro do pedido na planilha.
 *
 * O pedido nasce aqui, na tela, e até agora morria aqui: o WhatsApp abria com
 * o texto pronto, a conversa acontecia, e alguém tinha de digitar tudo de novo
 * num arquivo no fim do dia. Este módulo aproveita o único instante em que o
 * site sabe tudo — itens, moagem, gramas, preço praticado — e manda isso para
 * a planilha antes de sair para a conversa.
 *
 * Três decisões que valem explicação:
 *
 * 1. É disparo sem espera. Nada de `await`: o navegador bloqueia a abertura do
 *    WhatsApp se o clique não navegar quase de imediato, e uma rede lenta no
 *    celular custaria o pedido inteiro para salvar uma digitação.
 *
 * 2. Falhar é silencioso, e isso é de propósito. O pedido não depende deste
 *    envio para existir: ele está escrito na mensagem do WhatsApp, que é o que
 *    de fato chega. Se a planilha não receber, o pior caso é o de hoje, digitar
 *    à mão. Um alerta de erro aqui assustaria o cliente por um problema que não
 *    é dele.
 *
 * 3. `no-cors`. O Apps Script responde por um redirecionamento para outro
 *    domínio, o que faz o navegador recusar a leitura da resposta. Como não há
 *    nada para ler, pedimos ao navegador que nem tente. É também por isso que o
 *    corpo vai como texto puro: qualquer outro tipo dispara uma consulta prévia
 *    de permissão que o Apps Script não responde.
 */

const DESTINO = import.meta.env.VITE_PEDIDOS_URL as string | undefined;
const SENHA = import.meta.env.VITE_PEDIDOS_TOKEN as string | undefined;

export type Resumo = {
  codigo: string;
  itens: Linha[];
  qtd: Record<string, number>;
  subtotal: number;
  desconto: number;
  total: number;
  pacotes: number;
  quilos: number;
};

/** o mesmo carrinho não pode virar duas linhas se a pessoa clicar duas vezes */
const enviados = new Set<string>();

export function registrarPedido(r: Resumo) {
  if (!DESTINO || !r.itens.length || !r.codigo) return;
  if (enviados.has(r.codigo)) return;
  enviados.add(r.codigo);

  const corpo = JSON.stringify({
    senha: SENHA ?? "",
    codigo: r.codigo,
    quando: new Date().toISOString(),
    origem: "site",
    promo: PROMO.pct,
    subtotal: centavos(r.subtotal),
    desconto: centavos(r.desconto),
    total: centavos(r.total),
    pacotes: r.pacotes,
    /* em gramas inteiras, que é a unidade que a planilha recebe */
    gramas: Math.round(r.quilos * 1000),
    itens: r.itens.map((l) => ({
      item: l.item,
      id: l.id,
      qtd: r.qtd[l.chave] ?? 0,
      gramas: l.gramas * (r.qtd[l.chave] ?? 0),
      /* preço de tabela do pacote, em centavos; o desconto vai à parte para a
         planilha guardar a mesma conta que a tela mostrou */
      tabela: centavos(l.preco),
    })),
  });

  try {
    void fetch(DESTINO, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: corpo,
    }).catch(() => {
      /* ver a decisão 2 acima */
    });
  } catch {
    /* idem: nem a chamada em si pode derrubar o clique */
  }
}
