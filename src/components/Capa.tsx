import { selo } from "@/imagens";
import capaTerra from "@/assets/capa-terra.webp";
import { Botao, RamoEmenda } from "./base";
import { MARCA, SELOS, zap } from "@/dados";

export default function Capa() {
  return (
    /* a nav e' sticky e ocupa lugar no fluxo; a margem negativa traz a foto
       para debaixo dela, e o padding do miolo devolve o espaco do conteudo */
    <header
      id="topo"
      className="relative -mt-[73px] sm:-mt-[77px]"
    >
      <div className="rasgo-baixo relative isolate overflow-hidden">
      {/* a terra ao fim da tarde, por baixo de tudo */}
      <img
        src={capaTerra}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 62%", zIndex: 0 }}
        fetchPriority="high"
      />
      {/* véu de tinta: escurece a foto o bastante para o texto ficar legível */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(24,15,10,0.9) 0%, rgba(44,29,20,0.76) 38%, rgba(36,23,15,0.84) 74%, rgba(28,18,12,0.94) 100%)",
        }}
      />
      <div
        className="relative mx-auto w-[min(100%-2rem,1120px)] pb-16 pt-[117px] text-center sm:w-[min(100%-2.5rem,1120px)] sm:pb-20 sm:pt-[145px]"
        style={{ zIndex: 3 }}
      >
        {/* O selo, carimbado no papel sobre a foto.
            Antes a arte entrava como máscara pintada de creme: isso acendia os
            traços e apagava a pele, e o rosto do Juca saía em negativo. Agora é
            a ilustração original, na tinta dela, sobre um disco do papel do
            site — que é como ela aparece impressa nos rótulos.
            A largura fica no invólucro e a caixa por dentro ocupa 100% dela:
            é o que faz a reserva de altura por padding (o retrato de quem não
            tem aspect-ratio) medir contra a largura certa. */}
        <div className="mx-auto w-[clamp(172px,30vw,236px)]">
          <div
            className="caixa-brasao relative rounded-full"
            style={{ aspectRatio: "1 / 1", backgroundColor: "#f2e7d3" }}
          >
            <img
              src={selo}
              alt={MARCA.nome}
              width={512}
              height={512}
              fetchPriority="high"
              className="absolute left-1/2 top-1/2 w-[97%] -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <p className="eyebrow-cru mt-6 leading-relaxed" style={{ color: "#d8c3a0" }}>
          {MARCA.descritor} · {MARCA.regiao}
        </p>

        <h1
          className="mx-auto mt-7 max-w-[19ch] text-[clamp(34px,5.4vw,60px)]"
          style={{ color: "#f7efe0" }}
        >
          Quatro gerações nas mesmas terras. O apelido pulou três.
        </h1>

        <p
          className="mx-auto mt-6 max-w-[54ch] text-[17px] leading-relaxed"
          style={{ color: "#d6c3a8" }}
        >
          Café plantado, colhido, seco, torrado e moído nos{" "}
          <strong className="font-semibold" style={{ color: "#f2e7d3" }}>
            {MARCA.sitio}
          </strong>
          , em {MARCA.local}. Terra de família há mais de cem anos. O nome é do meu
          bisavô, o Juca.
        </p>

        <div
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
          data-print-hide
        >
          <Botao href={zap("Olá! Quero conhecer os cafés do Vô Juca.")} tom="claro" largo>
            Pedir pelo WhatsApp
          </Botao>
          <Botao href="#cafes" tom="contorno" largo>
            Ver os cafés
          </Botao>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-7 text-left sm:mt-16 sm:grid-cols-4"
          style={{ borderColor: "rgba(239,227,204,0.28)" }}
        >
          {SELOS.map((s) => (
            <div key={s} className="flex items-start gap-2.5">
              <span
                className="mt-[10px] inline-block h-px w-4 shrink-0"
                style={{ background: "#c98a5e" }}
              />
              <dt className="ficha leading-snug" style={{ color: "#d6c3a8" }}>
                {s}
              </dt>
            </div>
          ))}
        </dl>
      </div>
      </div>

      {/* o ramo assenta na emenda, logo abaixo do rasgo */}
      <RamoEmenda className="pb-12 pt-10 sm:pb-14 sm:pt-12" />
    </header>
  );
}
