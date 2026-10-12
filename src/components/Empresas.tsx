import { useState } from "react";
import { MARCA, PAGAMENTO, PROMO, zap } from "@/dados";
import { selo } from "@/imagens";
import { Botao, Dobra, Faixa, Rubrica } from "./base";

const PLANOS = [
  {
    id: "assinatura",
    eyebrow: "Para casa",
    titulo: "Assinatura",
    resumo: "O café que você escolher, torrado perto da data e entregue todo mês.",
    detalhe: "Você escolhe o café e a moagem uma vez, e ele chega sem precisar pedir de novo.",
    itens: [
      "Envio mensal, na data que a gente combinar",
      "Troca de café a qualquer mês, sem taxa",
      "Torra feita para o seu envio",
      `Pagamento em ${PAGAMENTO.frase}`,
      "Pausa ou cancelamento por mensagem, sem multa",
    ],
    zap: "Olá, João Henrique! Quero saber da assinatura mensal do Vô Juca: quais cafés, quanto por mês e quanto fica.",
    botao: "Montar a minha assinatura",
  },
  {
    id: "empresas",
    eyebrow: "Para empresas",
    titulo: "Fornecimento",
    resumo: "Para escritório, cafeteria, restaurante, pousada ou revenda, com preço por quilo.",
    detalhe: "Volume maior tem preço próprio, e quem faz a proposta sou eu, olhando o seu consumo.",
    itens: [
      "Preço por quilo, e não por pacote",
      "Moagem acertada para a sua máquina",
      "Entrega mensal programada, no volume que você usa",
      "Rótulo com o seu nome, a partir de um volume combinado",
      "Nota fiscal e faturamento",
      `Pagamento em ${PAGAMENTO.frase}`,
    ],
    zap: "Olá, João Henrique! Represento uma empresa e quero uma proposta de fornecimento do Vô Juca. Nosso consumo aproximado é de",
    botao: "Pedir uma proposta",
  },
];

type Plano = (typeof PLANOS)[number];

/** as condições, que abrem para quem quiser saber; quem já decidiu vai direto ao botão */
function Condicoes({ p }: { p: Plano }) {
  return (
    <Dobra className="mt-2">
      <p className="mt-2 text-[15.5px] leading-relaxed text-[#5c4635]">{p.detalhe}</p>
      <ul className="mt-4 grid gap-2.5 border-t border-[rgba(58,39,27,0.22)] pt-4">
        {p.itens.map((i) => (
          <li key={i} className="ficha flex items-start gap-2.5 text-[15px] leading-snug">
            <span aria-hidden="true" className="mt-[9px] block h-[5px] w-[5px] shrink-0 rotate-45 bg-[#8c3a20]" />
            {i}
          </li>
        ))}
      </ul>
    </Dobra>
  );
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/**
 * A assinatura numa caderneta de capa de pano, como a de fiado do empório:
 * os doze meses na pauta, com um risco à mão em cada entrega. A forma já diz
 * "todo mês" antes de qualquer frase.
 */
function Caderneta({ p }: { p: Plano }) {
  return (
    <article className="reveal cad">
      <div className="cad-lombada" aria-hidden="true" />
      <div className="cad-folha">
        <div className="cad-topo">
          <span>
            Caderneta de assinatura · <span className="num">Nº 0001</span>
          </span>
          <img src={selo} alt="" width={42} height={42} loading="lazy" decoding="async" />
        </div>
        <div className="eyebrow">{p.eyebrow}</div>
        <h3 className="mt-2 text-[clamp(26px,3.2vw,32px)] leading-tight">{p.titulo}</h3>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-[#5c4635]">{p.resumo}</p>
        <ol className="cad-meses" aria-hidden="true">
          {MESES.map((m, i) => (
            <li key={m}>
              {m}
              {i < 3 && (
                <svg viewBox="0 0 26 22">
                  <path d="M3 12C6 14 8 17 10 20 13 12 18 6 24 2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ol>
        <div className="ficha text-[12.5px] tracking-[0.04em] text-[#6f5b44]">cada entrega, um risco na caderneta</div>
        <Condicoes p={p} />
        <div className="pt-5" data-print-hide>
          <Botao href={zap(p.zap)} tom="cobre" largo>
            {p.botao}
          </Botao>
        </div>
      </div>
    </article>
  );
}

const NEGOCIOS = ["escritório", "cafeteria", "restaurante", "pousada", "revenda"];

/**
 * O fornecimento no talão de pedido do empório, picotado em cima. As
 * caixinhas e o quilo são de verdade: o que se marca ali já vai escrito na
 * mensagem do WhatsApp, e a proposta começa com o tipo de negócio e o
 * consumo na mão.
 */
function NotaDePedido({ p }: { p: Plano }) {
  const [negocio, setNegocio] = useState<string | null>(null);
  const [kg, setKg] = useState("");
  const quilos = Number(kg.replace(",", "."));
  const artigo = negocio === "escritório" || negocio === "restaurante" ? "um" : "uma";
  const mensagem =
    !negocio && !(quilos > 0)
      ? p.zap
      : `Olá, João Henrique! Represento ${negocio ? `${artigo} ${negocio}` : "uma empresa"} e quero uma proposta de fornecimento do Vô Juca.` +
        (quilos > 0 ? ` Nosso consumo é de uns ${kg.replace(".", ",")} kg por mês.` : " Nosso consumo aproximado é de");
  return (
    <article className="reveal ped">
      <div className="ped-topo">
        <b>Nota de pedido</b>
        <span className="num">Nº 0427</span>
      </div>
      <div className="ped-casa">Vô Juca · Sítio JR · Sul de Minas</div>
      <div className="eyebrow mt-5">{p.eyebrow}</div>
      <h3 className="mt-2 text-[clamp(26px,3.2vw,32px)] leading-tight">{p.titulo}</h3>
      <div className="ped-campos">
        <div className="ped-campo" role="group" aria-labelledby="ped-para">
          <span id="ped-para">Para</span>
          <div className="ped-caixas">
            {NEGOCIOS.map((n) => (
              <label key={n}>
                <input
                  type="checkbox"
                  checked={negocio === n}
                  onChange={() => setNegocio((a) => (a === n ? null : n))}
                />
                <i aria-hidden="true" />
                {n}
              </label>
            ))}
          </div>
        </div>
        <div className="ped-campo">
          <label htmlFor="ped-kg">Por mês</label>
          <span className="ped-preencher">
            <input
              id="ped-kg"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="12"
              maxLength={5}
              value={kg}
              onChange={(e) => setKg(e.target.value.replace(/[^\d.,]/g, ""))}
            />
            kg
          </span>
        </div>
        <div className="ped-campo">
          <span>Preço</span>
          <span>por quilo, feito em cima do seu consumo</span>
        </div>
      </div>
      <Condicoes p={p} />
      <div className="pt-5" data-print-hide>
        <Botao href={zap(mensagem)} largo>
          {p.botao}
        </Botao>
      </div>
      <div className="ped-via">1ª via · cliente</div>
    </article>
  );
}

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

      <div className="abertura reveal mt-6 max-w-[60ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)]">
          Para quem não quer ficar sem
        </h2>
        <p className="mt-4 text-[#5c4635]">
          Receber todo mês em casa, ou abastecer uma empresa inteira.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <Caderneta p={PLANOS[0]} />
        <NotaDePedido p={PLANOS[1]} />
      </div>

      <div className="reveal mt-8 border-l-2 border-[#8c3a20] pl-5 sm:pl-6">
        <div className="eyebrow">Preços e condições</div>
        <Dobra className="mt-1">
          <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            Assinatura e fornecimento não têm um preço de prateleira porque dependem de
            duas coisas: qual café e quanto por mês. Quem responde e faz a conta sou eu,
            e faço em cima do seu consumo de verdade, não de uma faixa genérica.
          </p>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            O que já dá para adiantar: quanto maior o volume, menor o preço por quilo, e
            quem assina paga menos do que quem compra avulso. Enquanto a promoção de{" "}
            <strong className="font-semibold text-[#3a271b]">{PROMO.chamada}</strong>{" "}
            estiver de pé, ela vale também para o primeiro envio da assinatura.
          </p>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-[#5c4635]">
            Me diga quanto café a sua casa ou a sua empresa consome por mês e eu volto
            com número e prazo. O envio é mensal, e o pagamento é em{" "}
            <strong className="font-semibold text-[#3a271b]">{PAGAMENTO.frase}</strong>.
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
