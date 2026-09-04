import { logoSecundaria } from "@/imagens";
import capaTerra from "@/assets/capa-terra.webp";
import ramoCafe from "@/assets/ramo-cafe.webp";
import { Botao, Grao } from "./base";
import { MARCA, SELOS, zap } from "@/dados";

export default function Capa() {
  return (
    /* a nav e' sticky e ocupa lugar no fluxo; a margem negativa traz a foto
       para debaixo dela, e o padding do miolo devolve o espaco do conteudo */
    <header
      id="topo"
      className="relative -mt-[73px] sm:-mt-[77px]"
    >
      <div className="relative isolate overflow-hidden">
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
      {/*
        Passagem do escuro para o papel, no pé do bloco.
        Primeiro a foto se apaga contra o próprio tom da capa; só depois a cor
        sobe, já opaca, por marrom e areia até o papel. Véu claro por cima do
        escuro passaria por cinza no meio e sujaria a emenda.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] sm:h-[220px]"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(180deg," +
            " rgba(30,20,13,0) 0%," +
            " rgba(30,20,13,0.72) 26%," +
            " rgb(30,20,13) 46%," +
            " rgb(84,62,42) 66%," +
            " rgb(158,133,101) 84%," +
            " rgb(213,196,166) 94%," +
            " #efe3cc 100%)",
        }}
      />

      <div
        className="relative mx-auto w-[min(100%-2rem,1120px)] pb-[140px] pt-[117px] text-center sm:w-[min(100%-2.5rem,1120px)] sm:pb-[180px] sm:pt-[145px]"
        style={{ zIndex: 3 }}
      >
        {/* o brasão, pintado em creme a partir da própria arte */}
        <div
          className="mx-auto w-[clamp(148px,26vw,208px)]"
          role="img"
          aria-label={MARCA.nome}
          style={{
            aspectRatio: "700 / 1005",
            backgroundColor: "#f2e7d3",
            maskImage: `url(${logoSecundaria})`,
            WebkitMaskImage: `url(${logoSecundaria})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />

        <p className="eyebrow-cru mt-6 leading-relaxed" style={{ color: "#d8c3a0" }}>
          <Grao size={12} cor="#c98a5e" fundo="#241710" />
          <span className="ml-2.5">
            {MARCA.descritor} · {MARCA.regiao}
          </span>
        </p>

        <h1
          className="mx-auto mt-7 max-w-[19ch] text-[clamp(34px,5.4vw,60px)]"
          style={{ color: "#f7efe0" }}
        >
          A mesma lavoura, o mesmo apelido, quatro gerações depois
        </h1>

        <p
          className="mx-auto mt-6 max-w-[54ch] text-[17px] leading-relaxed"
          style={{ color: "#d6c3a8" }}
        >
          Café plantado, colhido, seco, torrado e moído nos{" "}
          <strong className="font-semibold" style={{ color: "#f2e7d3" }}>
            {MARCA.sitio}
          </strong>
          , em {MARCA.local}, onde meu bisavô plantou os primeiros pés no início do
          século 20.
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

      {/* o ramo fecha a capa já sobre o papel, onde a tinta escura da arte aparece */}
      <div style={{ background: "#efe3cc" }}>
        <img
          src={ramoCafe}
          alt=""
          aria-hidden="true"
          width={1200}
          height={235}
          className="mx-auto w-[min(100%-2rem,460px)] pb-10 sm:pb-12"
        />
      </div>
    </header>
  );
}
