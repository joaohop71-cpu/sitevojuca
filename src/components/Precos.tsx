import { PROMO, brl, centavos, zap } from "@/dados";
import { useResumo, ajustar } from "@/carrinho";
import { registrarPedido } from "@/pedido";
import { Botao, Contador, Dobra, Faixa, Rubrica } from "./base";

/**
 * O pedido.
 *
 * Esta seção era uma segunda tabela com os mesmos cinco cafés e os mesmos
 * preços que os cartões lá em cima: dois lugares para o mesmo número, o que é
 * exatamente como eles divergem, e uma ida e volta obrigatória entre escolher
 * e pedir. A escolha voltou para o rótulo; aqui ficou o que só cabia aqui, que
 * é a conta e o envio.
 */
export default function Precos() {
  const resumo = useResumo();
  const { qtd, itens, pacotes, quilos, subtotal, desconto, total, mensagem } = resumo;

  return (
    /* rasgo em cima: a emenda com a seção dos cafés era um corte reto, o único
       que tinha sobrado. Quem recebe o corte é o bloco creme, e a falha revela
       o papel do corpo, que é justamente o fundo da seção de cima */
    <Faixa id="precos" fundo="creme" className="rasgo-cima py-10 sm:py-14">
      <Rubrica>O seu pedido</Rubrica>

      <div className="reveal mt-6 max-w-[60ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)]">
          {itens.length ? "Confira e mande" : "Ainda não tem nada aqui"}
        </h2>
        <p className="mt-4 text-[#5c4635]">
          {itens.length
            ? "O WhatsApp abre com o pedido já escrito, com o preço de tabela, o desconto e o total. Sem formulário e sem cadastro; o frete a gente combina na conversa."
            : "Escolha a quantidade no rótulo do café que quiser, aqui em cima, e o pedido aparece nesta lista. O WhatsApp abre depois com tudo escrito, sem formulário e sem cadastro."}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div className="reveal">
          <div className="border border-[rgba(58,39,27,0.3)] bg-[rgba(255,250,240,0.6)] p-6">
            <div className="eyebrow">Seu carrinho</div>

            {itens.length === 0 ? (
              <>
                <p className="mt-4 text-[16px] text-[#6b4526]">
                  Nada escolhido ainda. Use o + no rótulo do café.
                </p>
                <div className="mt-5" data-print-hide>
                  <Botao href="#cafes" tom="vazio" largo>
                    Ver os cafés
                  </Botao>
                </div>
              </>
            ) : (
              <div className="mt-4">
                {/* no celular o nome ocupa a linha inteira: espremido ao lado do
                    preço e do contador, "Café Vô Juca grão · 300 g" caía em três
                    linhas de duas palavras */}
                {itens.map((l) => (
                  <div
                    key={l.chave}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-dotted border-[rgba(58,39,27,0.22)] py-3"
                  >
                    <span className="ficha w-full text-[15.5px] sm:w-auto sm:flex-1" style={{ color: l.cor }}>
                      {l.nome}{" "}
                      <span className="text-[#6f5b44]">
                        {l.moagem === "grao" ? "grão" : "moído"} · {l.gramas} g
                      </span>
                    </span>
                    <span className="flex flex-1 shrink-0 items-center justify-between gap-3 sm:flex-none sm:justify-end">
                      {/* pelo preço de tabela, que é o que o subtotal soma: com
                          o valor já descontado em cada linha, somar as linhas
                          dava um centavo a mais que o total, porque o desconto
                          é aplicado uma vez só, no fim */}
                      <span className="ficha num text-[15px] text-[#6f5b44]">
                        {brl((centavos(l.preco) * (qtd[l.chave] ?? 0)) / 100)}
                      </span>
                      <Contador
                        valor={qtd[l.chave] ?? 0}
                        aoMudar={(d) => ajustar(l.chave, d)}
                        rotulo={`${l.nome} ${l.moagem === "grao" ? "em grão" : "moído"}`}
                        cor={l.cor}
                      />
                    </span>
                  </div>
                ))}

                <dl className="mt-5 grid gap-1.5 border-t-2 border-[#3a271b] pt-4">
                  <div className="flex items-baseline justify-between">
                    <dt className="ficha text-[15px] text-[#6f5b44]">Preço de tabela</dt>
                    <dd className="ficha num m-0 text-[15px] text-[#6f5b44]">
                      {brl(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="ficha text-[15px] text-[#8c3a20]">{PROMO.chamada}</dt>
                    <dd className="ficha num m-0 text-[15px] text-[#8c3a20]">
                      -{brl(desconto)}
                    </dd>
                  </div>
                  <div className="mt-2 flex items-end justify-between border-t border-[rgba(58,39,27,0.25)] pt-3">
                    <div>
                      <dt className="ficha text-[14px] uppercase tracking-[0.14em] text-[#6f5b44]">
                        Total
                      </dt>
                      <dd className="ficha num m-0 text-[14px] text-[#6f5b44]">
                        {pacotes} {pacotes === 1 ? "pacote" : "pacotes"} ·{" "}
                        {quilos.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg
                      </dd>
                    </div>
                    <dd
                      className="num m-0 text-[30px] leading-none"
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
                        fontWeight: 600,
                      }}
                    >
                      {brl(total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6" data-print-hide>
                  <Botao href={zap(mensagem)} onClick={() => registrarPedido(resumo)} largo>
                    Fechar pedido no WhatsApp
                  </Botao>
                </div>
              </div>
            )}

            <p className="ficha mt-4 text-[14px] leading-relaxed text-[#6f5b44]">
              O frete é combinado na conversa. Para revenda e volume maior, o preço
              muda; pergunte.
            </p>
          </div>
        </div>

        <div className="reveal">
        {/* Torra e moagem sob medida. Interessa a poucos, mas interessa muito
            a esses poucos, então fica recolhido: só o convite ocupa espaço, e
            o texto abre para quem quiser. Foi este bloco que deu origem ao
            <Dobra>, e agora ele usa o componente como todo o resto. */}
        <div className="reveal mt-8 border-l-2 border-[#8c3a20] pl-5 sm:pl-6">
          <div className="eyebrow">Torra e moagem</div>
          <h3 className="mt-2 max-w-[24ch] text-[clamp(21px,2.7vw,28px)] leading-tight">
            O ponto pode ser o seu
          </h3>

          <Dobra rotulo="Como funciona a torra sob medida" className="mt-3">
            <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
              Quem torra e mói somos nós, aqui mesmo, então o ponto não precisa ser
              sempre o mesmo. Se você gosta da xícara mais clara e ácida, ou de uma
              torra mais escura e encorpada, dá para acertar isso no seu pedido. A
              moagem também: mais fina para a italiana, mais grossa para a prensa, ou
              em grão, se você prefere moer na hora.
            </p>
            <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
              Um aviso honesto, para não frustrar ninguém: de pronta entrega sai{" "}
              <strong className="font-semibold text-[#3a271b]">
                sempre a torra média
              </strong>
              , que é o ponto que agrada mais gente e o que mantenho pronto o ano
              todo. Fora dela, o café é torrado depois que você pede. Por isso o café
              sob medida depende da quantidade e precisa de uma{" "}
              <strong className="font-semibold text-[#3a271b]">
                boa antecedência
              </strong>{" "}
              para prepararmos o seu pedido.
            </p>
            <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
              Me conte como você prepara o seu café e a gente acerta o ponto e o prazo
              com calma.
            </p>
            <div className="mt-5 pb-1" data-print-hide>
              <Botao
                href={zap(
                  "Olá, João Henrique! Queria saber sobre a torra e a moagem sob medida. Costumo preparar meu café assim:"
                )}
                tom="vazio"
                largo
              >
                Combinar a minha torra
              </Botao>
            </div>
          </Dobra>
        </div>
        </div>
      </div>
    </Faixa>
  );
}
