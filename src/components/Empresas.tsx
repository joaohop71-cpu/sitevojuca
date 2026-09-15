import { MARCA, PROMO, zap } from "@/dados";
import { Botao, Dobra, Faixa, Rubrica } from "./base";

const PLANOS = [
  {
    id: "assinatura",
    eyebrow: "Para casa",
    titulo: "Assinatura",
    resumo:
      "Você escolhe o café, o moído ou o grão e de quanto em quanto tempo quer receber. Eu torro perto da data de enviar, não antes.",
    itens: [
      "Mensal, quinzenal ou do seu jeito",
      "Troca de café a qualquer mês, sem taxa",
      "Torra feita para o seu envio",
      "Pausa ou cancelamento por mensagem, sem multa",
    ],
    zap: "Olá, João Henrique! Quero saber da assinatura do Vô Juca: quais cafés, com que frequência e quanto fica.",
    botao: "Montar a minha assinatura",
  },
  {
    id: "empresas",
    eyebrow: "Para empresas",
    titulo: "Fornecimento",
    resumo:
      "Escritório, cafeteria, restaurante, pousada ou revenda. Volume maior tem preço próprio, e quem faz a proposta sou eu, olhando o seu consumo.",
    itens: [
      "Preço por quilo, e não por pacote",
      "Moagem acertada para a sua máquina",
      "Entrega programada, na frequência que você usa",
      "Rótulo com o seu nome, a partir de um volume combinado",
      "Nota fiscal e faturamento",
    ],
    zap: "Olá, João Henrique! Represento uma empresa e quero uma proposta de fornecimento do Vô Juca. Nosso consumo aproximado é de",
    botao: "Pedir uma proposta",
  },
];

/**
 * Assinatura e fornecimento.
 *
 * Duas conversas diferentes que estavam faltando: quem quer receber sempre e
 * quem compra por quilo. Nenhuma das duas fecha num botão de carrinho, então
 * a seção não finge que fecha: ela diz a condição e leva para a conversa, que
 * é como esta operação de fato vende.
 */
export default function Empresas() {
  return (
    /* Sem rasgo nenhum, e de propósito. Acima está a seção do pedido, que é do
       mesmo creme: emenda entre cores iguais não existe. Abaixo está o bloco
       escuro do processo, que já rasga a borda de cima dele. Quando as duas
       vizinhas rasgavam, entre uma falha e outra aparecia o papel do corpo, e
       a emenda ficava com três cores em vez de passar direto de uma para a
       outra. A regra da página é essa: quem recebe o rasgo é o bloco escuro. */
    <Faixa id="empresas" fundo="creme" className="py-10 sm:py-12">
      <Rubrica>Sempre em casa</Rubrica>

      <div className="reveal mt-6 max-w-[60ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)]">
          Para quem não quer ficar sem
        </h2>
        <p className="mt-4 text-[#5c4635]">
          Dá para receber todo mês sem precisar pedir de novo, e dá para abastecer
          uma empresa inteira. São dois acertos diferentes, e os dois passam por mim.
        </p>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {PLANOS.map((p) => (
          <div
            key={p.id}
            className="reveal flex flex-col border border-[rgba(58,39,27,0.3)] bg-[rgba(255,250,240,0.6)] p-6 sm:p-7"
          >
            <div className="eyebrow">{p.eyebrow}</div>
            <h3 className="mt-2 text-[clamp(24px,3.2vw,32px)] leading-tight">{p.titulo}</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-[#5c4635]">{p.resumo}</p>

            <ul className="mt-5 grid gap-2.5 border-t border-[rgba(58,39,27,0.22)] pt-4">
              {p.itens.map((i) => (
                <li key={i} className="ficha flex items-start gap-2.5 text-[15px] leading-snug">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] block h-[5px] w-[5px] shrink-0 rotate-45"
                    style={{ background: "#8c3a20" }}
                  />
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-1" data-print-hide>
              <Botao href={zap(p.zap)} largo>
                {p.botao}
              </Botao>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal mt-8 border-l-2 border-[#8c3a20] pl-5 sm:pl-6">
        <div className="eyebrow">Preços e condições</div>
        <h3 className="mt-2 max-w-[28ch] text-[clamp(21px,2.7vw,28px)] leading-tight">
          O valor sai da conversa, e não de uma tabela
        </h3>
        <Dobra rotulo="Como eu calculo o preço" className="mt-3">
          <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            Assinatura e fornecimento não têm um preço de prateleira porque dependem de
            três coisas: qual café, quanto por mês e com que frequência. Quem responde e
            faz a conta sou eu, e faço em cima do seu consumo de verdade, não de uma
            faixa genérica.
          </p>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            O que já dá para adiantar: quanto maior o volume, menor o preço por quilo, e
            quem assina paga menos do que quem compra avulso. Enquanto a promoção de{" "}
            <strong className="font-semibold text-[#3a271b]">{PROMO.chamada}</strong>{" "}
            estiver de pé, ela vale também para o primeiro envio da assinatura.
          </p>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            Me diga quanto café a sua casa ou a sua empresa consome por mês e eu volto
            com número, prazo e forma de pagamento.
          </p>
          <div className="mt-5 pb-1" data-print-hide>
            <Botao href={`mailto:${MARCA.email}?subject=Assinatura%20e%20fornecimento`} tom="vazio" largo>
              Falar por e-mail
            </Botao>
          </div>
        </Dobra>
      </div>
    </Faixa>
  );
}
