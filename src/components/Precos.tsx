import { useMemo, useState } from "react";
import { CAFES, brl, porQuilo, zap } from "@/dados";
import { Botao, Faixa, Rubrica } from "./base";

type Linha = {
  chave: string;
  nome: string;
  moagem: "grao" | "moido";
  preco: number;
  gramas: number;
};

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function rotuloCafe(c: (typeof CAFES)[number]) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

const LINHAS: Linha[] = CAFES.flatMap((c) => {
  const out: Linha[] = [];
  const base = { nome: rotuloCafe(c), gramas: c.gramas };
  if (c.preco.grao !== null)
    out.push({ ...base, chave: `${c.id}-grao`, moagem: "grao", preco: c.preco.grao });
  out.push({ ...base, chave: `${c.id}-moido`, moagem: "moido", preco: c.preco.moido });
  return out;
});

const DESCONTO = 0.1;

export default function Precos() {
  const [qtd, setQtd] = useState<Record<string, number>>({});
  const [primeira, setPrimeira] = useState(true);

  const itens = useMemo(
    () => LINHAS.filter((l) => (qtd[l.chave] ?? 0) > 0),
    [qtd]
  );

  const subtotal = itens.reduce((s, l) => s + l.preco * (qtd[l.chave] ?? 0), 0);
  const total = primeira ? subtotal * (1 - DESCONTO) : subtotal;
  const pacotes = itens.reduce((s, l) => s + (qtd[l.chave] ?? 0), 0);
  /* os pacotes têm pesos diferentes (300 g e 500 g), então o peso vem de cada linha */
  const quilos = itens.reduce((s, l) => s + (l.gramas / 1000) * (qtd[l.chave] ?? 0), 0);

  function ajustar(chave: string, d: number) {
    setQtd((q) => {
      const n = Math.max(0, Math.min(99, (q[chave] ?? 0) + d));
      return { ...q, [chave]: n };
    });
  }

  const mensagem = useMemo(() => {
    if (!itens.length) return "Olá! Quero montar um pedido dos cafés do Vô Juca.";
    const linhas = itens
      .map(
        (l) =>
          `• ${qtd[l.chave]}x ${l.nome} ${l.gramas} g — ${
            l.moagem === "grao" ? "em grão" : "moído"
          } (${brl(l.preco)} cada)`
      )
      .join("\n");
    return `Olá! Quero fazer este pedido:\n\n${linhas}\n\nSubtotal: ${brl(subtotal)}${
      primeira ? `\nCom 10% da primeira compra: ${brl(total)}` : ""
    }`;
  }, [itens, qtd, subtotal, total, primeira]);

  return (
    <Faixa id="precos" fundo="creme" className="py-16 sm:py-24">
      <Rubrica num="02">Preços e pedido</Rubrica>

      <div className="reveal mt-6 max-w-[60ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)]">Monte o pedido aqui</h2>
        <p className="mt-4 text-[#5c4635]">
          Pacotes de 300 g, e de 500 g no Minas Santa. Some o que quiser na tabela e o
          WhatsApp já abre com o pedido escrito — sem formulário, sem cadastro.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        {/* tabela */}
        <div>
          <div className="border-t-2 border-[#3a271b]">
            {CAFES.map((c) => {
              /* pelo id, e não pelo nome: as duas Heranças se chamam igual */
              const doCafe = LINHAS.filter((l) => l.chave.startsWith(`${c.id}-`));
              return (
                <div
                  key={c.id}
                  className="border-b border-[rgba(58,39,27,0.2)] py-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <a href={`#${c.id}`} className="link-sublinhado text-[22px]" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}>
                      {rotuloCafe(c)}
                    </a>
                    <span className="ficha text-[12.5px] uppercase tracking-[0.12em] text-[#8c7a66]">
                      {c.tarja} · {c.gramas} g
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2.5">
                    {doCafe.map((l) => (
                      <div
                        key={l.chave}
                        className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <span className="ficha text-[#6b4526]">
                            {l.moagem === "grao" ? "Em grão" : "Moído"}
                          </span>
                          <span className="num text-[19px]" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}>
                            {brl(l.preco)}
                          </span>
                          <span className="ficha num text-[12.5px] text-[#8c7a66]">
                            {porQuilo(l.preco, l.gramas)}/kg
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-0" data-print-hide>
                          <button
                            type="button"
                            onClick={() => ajustar(l.chave, -1)}
                            aria-label={`Remover um ${l.nome} ${l.moagem}`}
                            className="flex h-11 w-11 items-center justify-center border border-[rgba(58,39,27,0.3)] text-[18px] text-[#6b4526] transition-colors hover:bg-[rgba(58,39,27,0.07)] sm:h-9 sm:w-9 sm:text-[16px]"
                          >
                            −
                          </button>
                          <span
                            className="num flex h-11 w-12 items-center justify-center border-y border-[rgba(58,39,27,0.3)] text-[16px] sm:h-9 sm:w-10 sm:text-[16px]"
                            aria-live="polite"
                          >
                            {qtd[l.chave] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => ajustar(l.chave, 1)}
                            aria-label={`Adicionar um ${l.nome} ${l.moagem}`}
                            className="flex h-11 w-11 items-center justify-center border border-[rgba(58,39,27,0.3)] text-[18px] text-[#6b4526] transition-colors hover:bg-[rgba(58,39,27,0.07)] sm:h-9 sm:w-9 sm:text-[16px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    {c.preco.grao === null && (
                      <span className="ficha text-[12.5px] text-[#8c7a66]">
                        Esta linha sai só moída.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* torra e moagem sob medida — cabe aqui, onde a quantidade é decidida */}
          <div className="reveal mt-8 border-l-2 border-[#8c3a20] pl-5 sm:pl-6">
            <div className="eyebrow">Torra e moagem</div>
            <h3 className="mt-2 max-w-[24ch] text-[clamp(21px,2.7vw,28px)] leading-tight">
              O ponto pode ser o seu
            </h3>
            <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
              Quem torra e mói somos nós, aqui mesmo — então o ponto não precisa ser
              sempre o mesmo. Se você gosta da xícara mais clara e ácida, ou de uma torra
              mais escura e encorpada, dá para acertar isso no seu pedido. A moagem
              também: mais fina para a italiana, mais grossa para a prensa, ou em grão,
              se você prefere moer na hora.
            </p>
            <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
              Em pedidos pequenos eu trabalho com a torra da semana. A partir de uma
              quantidade maior, separo um lote e faço só para você. Me conte como você
              prepara o seu café — eu digo o que consigo fazer.
            </p>
            <a
              href={zap(
                "Olá, João Henrique! Queria saber sobre a torra e a moagem sob medida — costumo preparar meu café assim:"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sublinhado ficha mt-4 inline-block text-[13px] uppercase tracking-[0.1em] text-[#8c3a20]"
              data-print-hide
            >
              Combinar a minha torra →
            </a>
          </div>
        </div>

        {/* resumo */}
        <aside className="reveal lg:sticky lg:top-24 lg:self-start">
          <div className="border border-[rgba(58,39,27,0.3)] bg-[rgba(255,250,240,0.6)] p-6">
            <div className="eyebrow">Seu carrinho</div>

            {itens.length === 0 ? (
              <p className="mt-4 text-[16px] text-[#6b4526]">
                Nada escolhido ainda. Use o + na tabela.
              </p>
            ) : (
              <div className="mt-4">
                {itens.map((l) => (
                  <div
                    key={l.chave}
                    className="flex items-baseline justify-between gap-3 border-b border-dotted border-[rgba(58,39,27,0.22)] py-2"
                  >
                    <span className="ficha text-[14px] text-[#3a271b]">
                      <span className="num">{qtd[l.chave]}×</span> {l.nome}{" "}
                      <span className="text-[#8c7a66]">
                        {l.moagem === "grao" ? "grão" : "moído"}
                      </span>
                    </span>
                    <span className="ficha num shrink-0">
                      {brl(l.preco * (qtd[l.chave] ?? 0))}
                    </span>
                  </div>
                ))}

                <label className="mt-4 flex cursor-pointer items-start gap-2.5" data-print-hide>
                  <input
                    type="checkbox"
                    checked={primeira}
                    onChange={(e) => setPrimeira(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#8c3a20]"
                  />
                  <span className="ficha text-[13.5px] leading-snug text-[#6b4526]">
                    Primeira compra — 10% de desconto
                  </span>
                </label>

                <div className="mt-4 flex items-baseline justify-between border-t-2 border-[#3a271b] pt-3">
                  <div>
                    <div className="ficha text-[12.5px] uppercase tracking-[0.14em] text-[#8c7a66]">
                      Total
                    </div>
                    <div className="ficha num text-[12.5px] text-[#8c7a66]">
                      {pacotes} {pacotes === 1 ? "pacote" : "pacotes"} ·{" "}
                      {quilos.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg
                    </div>
                  </div>
                  <div className="text-right">
                    {primeira && (
                      <div className="ficha num text-[14px] text-[#8c7a66] line-through">
                        {brl(subtotal)}
                      </div>
                    )}
                    <div
                      className="num text-[28px] leading-none"
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
                        fontWeight: 600,
                      }}
                    >
                      {brl(total)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6" data-print-hide>
              <Botao href={zap(mensagem)} largo>
                {itens.length ? "Enviar no WhatsApp" : "Falar com a gente"}
              </Botao>
            </div>

            <p className="ficha mt-4 text-[12.5px] leading-relaxed text-[#8c7a66]">
              O frete é combinado na conversa. Para revenda e volume maior, o preço muda —
              pergunte.
            </p>
          </div>
        </aside>
      </div>
    </Faixa>
  );
}
