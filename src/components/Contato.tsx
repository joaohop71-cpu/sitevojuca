import { Botao, Faixa, Ornamento, Rubrica } from "./base";
import { MARCA, zap } from "@/dados";

export default function Contato() {
  return (
    <>
      <Faixa id="contato" className="py-16 sm:py-24">
        <Rubrica num="06">Contato</Rubrica>

        <h2 className="mt-6 max-w-[20ch] text-[clamp(30px,4.4vw,52px)]">
          Quem responde aqui sou eu
        </h2>
        <p className="mt-5 max-w-[54ch] text-[17px] text-[#5c4635]">
          Escolha a linha, defina a moagem e feche o pedido no WhatsApp. Para empresas,
          revenda e volume maior, o caminho é o e-mail — respondo com uma proposta. Não
          há revendedor nem central de atendimento no meio: do outro lado sou eu,{" "}
          <strong className="font-semibold text-[#3a271b]">{MARCA.bisneto}</strong>, bisneto
          do Juca.
        </p>

        <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[1.1fr_0.9fr]">
          <dl className="border-t-2 border-[#3a271b]">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
              <dt className="ficha text-[11.5px] uppercase tracking-[0.16em] text-[#8c7a66]">
                WhatsApp
              </dt>
              <dd className="m-0">
                <a
                  href={zap("Olá! Vim pelo site do Vô Juca.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sublinhado num text-[20px]"
                  style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                >
                  {MARCA.whatsappVisivel}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
              <dt className="ficha text-[11.5px] uppercase tracking-[0.16em] text-[#8c7a66]">
                E-mail
              </dt>
              <dd className="m-0">
                <a
                  href={`mailto:${MARCA.email}`}
                  className="link-sublinhado break-all text-[19px]"
                  style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                >
                  {MARCA.email}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
              <dt className="ficha text-[11.5px] uppercase tracking-[0.16em] text-[#8c7a66]">
                Onde ficamos
              </dt>
              <dd className="ficha m-0 text-right text-[#3a271b]">
                {MARCA.sitio} · {MARCA.local}
              </dd>
            </div>
          </dl>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-print-hide>
              <Botao href={zap("Olá! Quero fazer um pedido dos cafés do Vô Juca.")} largo>
                Pedir pelo WhatsApp
              </Botao>
              <Botao
                href={`mailto:${MARCA.email}?subject=Proposta%20para%20revenda`}
                tom="vazio"
                largo
              >
                Proposta para revenda
              </Botao>
            </div>

            <div className="mt-6 border border-[#8c3a20] bg-[rgba(140,58,32,0.06)] p-5">
              <div className="eyebrow">Condição especial</div>
              <p className="mt-2 text-[18px] leading-snug" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}>
                10% na primeira compra. Acima de 10 pacotes, o preço muda — pergunte.
              </p>
            </div>
          </div>
        </div>
      </Faixa>

      <footer className="border-t border-[rgba(58,39,27,0.2)]">
        <div className="mx-auto w-[min(100%-2rem,1120px)] py-10 sm:w-[min(100%-2.5rem,1120px)]">
          <Ornamento />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="ficha text-[12.5px] text-[#8c7a66]">
              {MARCA.nome} · {MARCA.descritor}
            </span>
            <span className="ficha text-[12.5px] text-[#8c7a66]">
              {MARCA.local} — {MARCA.regiao}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
