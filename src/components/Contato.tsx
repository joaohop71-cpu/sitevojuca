import { Botao, Faixa, Rubrica } from "./base";
import { MARCA, PROMO, zap } from "@/dados";
import { selo } from "@/imagens";

/* Ícones pequenos, de um traço só, na cor do texto do rodapé — o site não
   usa o verde do WhatsApp nem o gradiente do Instagram em lugar nenhum, e
   aqui não seria diferente. */
function IconeInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconeWhatsApp() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5a8.3 8.3 0 0 0-7.1 12.6L3.5 20.5l4.55-1.35A8.3 8.3 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.7 8.9c.2-.4.4-.42.56-.42h.42c.14 0 .33-.02.5.4.2.46.65 1.6.71 1.72.06.12.1.26 0 .42-.09.16-.14.25-.27.38-.13.13-.28.3-.4.4-.13.12-.26.24-.11.5.15.28.66 1.13 1.42 1.83.98.9 1.8 1.19 2.06 1.32.26.13.42.11.57-.06.15-.18.66-.8.84-1.07.18-.27.36-.23.6-.14s1.55.75 1.82.89c.27.14.44.2.5.32.06.12.06.68-.16 1.34s-1.3 1.28-1.79 1.35c-.49.08-1.1.11-1.78-.12a11 11 0 0 1-1.84-.71c-2.7-1.19-4.46-3.9-4.6-4.08-.14-.18-1.1-1.46-1.1-2.79s.7-1.98.94-2.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Contato() {
  return (
    <>
      {/* Contato e "A terra" eram os dois do papel do corpo, e emenda entre
          cores iguais não aparece. Passando o contato para o creme, o rasgo
          tem o que revelar: a falha abre no papel da seção de cima. É o mesmo
          arranjo da seção do pedido, logo abaixo dos cafés. */}
      <Faixa id="contato" fundo="creme" className="rasgo-cima py-12 sm:py-14">
        <Rubrica>Contato</Rubrica>

        <h2 className="reveal mt-6 max-w-[20ch] text-[clamp(30px,4.4vw,52px)]">
          Quem responde aqui sou eu
        </h2>
        <p className="mt-5 max-w-[54ch] text-[17px] text-[#5c4635]">
          Escolha a linha, defina a moagem e feche o pedido no WhatsApp. Para empresas,
          revenda e volume maior, o caminho é o e-mail, e respondo com uma proposta. Não
          há revendedor nem central de atendimento no meio: do outro lado sou eu,{" "}
          <strong className="font-semibold text-[#3a271b]">João Henrique, o Juca</strong>,
          o bisneto!
        </p>

        <div className="reveal mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <dl className="border-t-2 border-[#3a271b]">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
                <dt className="ficha text-[14px] uppercase tracking-[0.16em] text-[#6f5b44]">
                  WhatsApp
                </dt>
                <dd className="m-0">
                  <a
                    href={zap("Olá! Vim pelo site do Vô Juca.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sublinhado alvo num text-[20px]"
                    style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                  >
                    {MARCA.whatsappVisivel}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
                <dt className="ficha text-[14px] uppercase tracking-[0.16em] text-[#6f5b44]">
                  E-mail
                </dt>
                <dd className="m-0">
                  <a
                    href={`mailto:${MARCA.email}`}
                    className="link-sublinhado alvo break-all text-[19px]"
                    style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                  >
                    {MARCA.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
                <dt className="ficha text-[14px] uppercase tracking-[0.16em] text-[#6f5b44]">
                  Instagram
                </dt>
                <dd className="m-0">
                  <a
                    href={`https://instagram.com/${MARCA.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sublinhado alvo text-[19px]"
                    style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                  >
                    @{MARCA.instagram}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(58,39,27,0.2)] py-4">
                <dt className="ficha text-[14px] uppercase tracking-[0.16em] text-[#6f5b44]">
                  Onde ficamos
                </dt>
                <dd className="ficha m-0 text-right text-[#3a271b]">
                  {MARCA.sitio} · {MARCA.local}
                </dd>
              </div>
            </dl>

          </div>

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
              <div className="eyebrow">Promoção de lançamento</div>
              <p className="mt-2 text-[18px] leading-snug" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}>
                {PROMO.chamada}, já aplicado nos preços do site.
              </p>
            </div>
          </div>
        </div>

        {/* O mapa saiu da coluna estreita: ali ele tinha 250 px de largura e
            era um selo de endereço. Em linha própria, com a largura da seção,
            vira o que de fato é, a lavoura vista do alto. O convite para a
            visita anda ao lado dele, que é onde a vontade aparece. */}
        <div className="reveal mt-12 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-end">
          {/* O MAPA
              Ele levava o mesmo filtro sépia das fotos, para assentar no
              papel. Só que aqui a imagem não é ilustração: é a lavoura vista
              de cima, de verdade, e o sépia justamente apagava o que ela tem
              de interessante, que é o contraste entre o verde dos renques e a
              terra. Sai o filtro, e a imagem quase dobra de altura: é o único
              lugar do site onde dá para ver o tamanho da coisa. */}
          <div className="mt-8" data-print-hide>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
              <h3 className="text-[clamp(21px,2.6vw,26px)] leading-tight">
                A lavoura vista de cima
              </h3>
              <a
                href={MARCA.mapaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sublinhado alvo ficha text-[14px] uppercase tracking-[0.1em] text-[#6b4526]"
              >
                Abrir no Google Maps →
              </a>
            </div>
            <p className="ficha mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-[#6f5b44]">
              Imagem de satélite, sem filtro nenhum. O marcador está na entrada do
              sítio; arraste o mapa para subir a estrada de terra e ver a serra em
              volta.
            </p>
            <div className="moldura mt-4 p-2.5">
              <iframe
                title={`Mapa: ${MARCA.sitio}`}
                src={`https://maps.google.com/maps?q=${MARCA.mapaLat},${MARCA.mapaLng}&z=16&output=embed&t=h`}
                className="block h-[300px] w-full sm:h-[420px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

            <div
              className="border border-[rgba(58,39,27,0.3)] bg-[rgba(255,250,240,0.6)] p-5"
              data-print-hide
            >
              <h3 className="text-[clamp(21px,2.6vw,26px)] leading-tight">
                Venha nos conhecer!
              </h3>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-[#5c4635]">
                A visita é combinada antes, para eu conseguir receber e mostrar a
                lavoura, a torra e o resto com calma.
              </p>
              <div className="mt-5">
                <Botao
                  href={zap(
                    "Olá! Gostaria de conhecer as instalações do Vô Juca, em Santa Rita do Sapucaí. Quando seria possível uma visita?"
                  )}
                  largo
                >
                  Agendar visita
                </Botao>
              </div>
            </div>
        </div>
      </Faixa>

      {/* o rasgo do rodapé revela o que está atrás dele, e o que está atrás é
          o corpo da página; sem esta cor, a emenda com o contato creme voltaria
          a mostrar três tons */}
      <div style={{ background: "#f6eede" }}>
      <footer className="rasgo-cima" style={{ background: "#3a271b", color: "#c0ab8c" }}>
        <div className="mx-auto w-[min(100%-2rem,1120px)] py-12 sm:w-[min(100%-2.5rem,1120px)] sm:py-14">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {/* O selo, na tinta original dele, sobre um disco do papel — o
                mesmo tratamento da capa. A marca pintada de creme apagava o
                rosto e o traço saía em negativo; aqui ele fica como é
                impresso no rótulo. */}
            <div
              className="relative h-14 w-14 shrink-0 rounded-full sm:h-16 sm:w-16"
              style={{ backgroundColor: "#f2e7d3" }}
            >
              <img
                src={selo}
                alt={MARCA.nome}
                className="absolute left-1/2 top-1/2 w-[97%] -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <p
                className="text-[22px] leading-none sm:text-[24px]"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 24',
                  fontWeight: 600,
                  color: "#efe3cc",
                }}
              >
                {MARCA.nome}
              </p>
              <p className="ficha mt-1.5 text-[14px] leading-relaxed tracking-[0.1em]">
                {MARCA.descritor} · St. Rita do Sapucaí · {MARCA.regiao}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1">
                <a
                  href={`https://instagram.com/${MARCA.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ficha alvo inline-flex items-center gap-1.5 text-[14px] tracking-[0.1em] text-[#efe3cc] underline-offset-4 hover:underline"
                >
                  <IconeInstagram />
                  @{MARCA.instagram}
                </a>
                <a
                  href={zap("Olá! Vim pelo site do Vô Juca.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ficha alvo inline-flex items-center gap-1.5 text-[14px] tracking-[0.1em] text-[#efe3cc] underline-offset-4 hover:underline"
                >
                  <IconeWhatsApp />
                  {MARCA.whatsappVisivel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
