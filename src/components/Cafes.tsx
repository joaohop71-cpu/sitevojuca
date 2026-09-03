import { useState, type CSSProperties } from "react";
import { CAFES, MARCA, brl, porQuilo } from "@/dados";
import type { Cafe, CorRotulo, Moagem } from "@/dados";
import { Botao, Faixa, RamoCafe, Rubrica } from "./base";
import { selo } from "@/imagens";

const TINTA: Record<CorRotulo, string> = {
  vinho: "#8c3a20",
  verde: "#4f5b3f",
  tinta: "#3a271b",
};

/* cinza-tinta envelhecido dos rotulos secundarios — igual nas tres cores */
const APAGADO = "#8a7a62";

function SeletorMoagem({
  valor,
  aoTrocar,
}: {
  valor: Moagem;
  aoTrocar: (m: Moagem) => void;
}) {
  return (
    <div
      className="inline-flex border border-[rgba(58,39,27,0.3)]"
      role="group"
      aria-label="Escolher moagem"
      data-print-hide
    >
      {(["grao", "moido"] as Moagem[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => aoTrocar(m)}
          aria-pressed={valor === m}
          className="px-5 py-3 transition-colors sm:px-4 sm:py-2"
          style={{
            fontFamily: '"Courier Prime", monospace',
            fontSize: 14,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: valor === m ? "#3a271b" : "transparent",
            color: valor === m ? "#efe3cc" : "#6b4526",
          }}
        >
          {m === "grao" ? "Em grão" : "Moído"}
        </button>
      ))}
    </div>
  );
}

function Intensidade({ nivel }: { nivel: number }) {
  return (
    <div className="text-center md:text-left">
      <div
        className="ficha text-[10.5px] uppercase tracking-[0.2em]"
        style={{ color: "var(--acento)" }}
      >
        Intensidade
      </div>
      <div
        className="mt-2 flex justify-center gap-1.5 md:justify-start"
        role="img"
        aria-label={`Intensidade ${nivel} de 5`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="h-3.5 w-5"
            style={{
              border: "1.5px solid var(--acento)",
              background: i <= nivel ? "var(--acento)" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Ficha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt
        className="ficha shrink-0 text-[11.5px] uppercase tracking-[0.1em]"
        style={{ color: APAGADO }}
      >
        {rotulo}
      </dt>
      <span className="rotulo-fio" aria-hidden="true" />
      <dd
        className="ficha m-0 shrink-0 text-[12.5px] font-bold uppercase tracking-[0.04em]"
        style={{ color: "var(--acento)" }}
      >
        {valor}
      </dd>
    </div>
  );
}

/** o rótulo do pacote, reproduzido como cartão do café */
function Rotulo({ cafe }: { cafe: Cafe }) {
  const cor = TINTA[cafe.cor];
  return (
    <div className="rotulo" style={{ "--acento": cor } as CSSProperties}>
      <span className="rotulo-canto" data-canto="se" aria-hidden="true" />
      <span className="rotulo-canto" data-canto="sd" aria-hidden="true" />
      <span className="rotulo-canto" data-canto="ie" aria-hidden="true" />
      <span className="rotulo-canto" data-canto="id" aria-hidden="true" />

      <div className="rotulo-interno">
        <div className="grid gap-x-10 gap-y-7 md:grid-cols-[1fr_auto] md:items-start">
          {/* coluna principal */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
              <span className="rotulo-meta">Safra {MARCA.safra}</span>
              <span className="rotulo-meta">{cafe.tarja}</span>
            </div>
            <div className="rotulo-tracejado mt-2.5" />

            <div className="mt-6 text-center">
              {cafe.qualificacao.map((q) => (
                <p
                  key={q}
                  className="ficha text-[11.5px] uppercase tracking-[0.16em] sm:text-[13px]"
                  style={{ color: "var(--acento)" }}
                >
                  {q}
                </p>
              ))}

              <h3 className="rotulo-nome mt-3">{cafe.nome}</h3>

              {cafe.lote && (
                <p
                  className="ficha mt-1.5 text-[14px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--acento)" }}
                >
                  {cafe.lote}
                </p>
              )}

              <p
                className="mt-3 text-[clamp(15px,1.9vw,21px)] leading-snug"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--acento)",
                }}
              >
                {cafe.chamada}
              </p>

              <p
                className="ficha mt-3.5 text-[11.5px] uppercase tracking-[0.16em] sm:text-[13px]"
                style={{ color: "var(--acento)" }}
              >
                {cafe.notas.join("  ·  ")}
              </p>
            </div>

            {/* fio — ramo — fio */}
            <div className="mt-5 flex items-center gap-4" aria-hidden="true">
              <span
                className="h-px flex-1"
                style={{ background: `color-mix(in srgb, ${cor} 45%, transparent)` }}
              />
              <RamoCafe verde="#4f5b3f" fruto="#8c3a20" className="h-11 w-[150px] shrink-0" />
              <span
                className="h-px flex-1"
                style={{ background: `color-mix(in srgb, ${cor} 45%, transparent)` }}
              />
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {cafe.fichas.map((f) => (
                <Ficha key={f.rotulo} rotulo={f.rotulo} valor={f.valor} />
              ))}
            </dl>

            <div
              className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t pt-3.5"
              style={{ borderColor: `color-mix(in srgb, ${cor} 35%, transparent)` }}
            >
              <span
                className="ficha text-[12.5px] font-bold uppercase tracking-[0.08em]"
                style={{ color: "var(--acento)" }}
              >
                {cafe.formato} · {cafe.gramas} g
              </span>
              <span
                className="ficha text-[11.5px] uppercase tracking-[0.12em]"
                style={{ color: APAGADO }}
              >
                {MARCA.local} · {MARCA.regiao} · MG
              </span>
            </div>
          </div>

          {/* coluna do selo */}
          <div className="flex flex-col items-center gap-6 md:w-[clamp(150px,17vw,215px)]">
            <div className="rotulo-aro relative w-[clamp(120px,15vw,200px)] shrink-0">
              <div className="aspect-square p-[9%]">
                <div
                  className="rotulo-selo h-full w-full"
                  role="img"
                  aria-label={`Selo ${MARCA.nome}`}
                  style={{
                    maskImage: `url(${selo})`,
                    WebkitMaskImage: `url(${selo})`,
                  }}
                />
              </div>
            </div>
            <Intensidade nivel={cafe.intensidade} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** faixa de compra logo abaixo do rótulo */
function Compra({ cafe, moagem }: { cafe: Cafe; moagem: Moagem }) {
  const soMoido = cafe.preco.grao === null;
  const valor = moagem === "grao" && !soMoido ? cafe.preco.grao! : cafe.preco.moido;

  return (
    <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <p className="max-w-[54ch] text-[15.5px] text-[#5c4635]">{cafe.descricao}</p>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className="num text-[30px] leading-none"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
                fontWeight: 600,
              }}
            >
              {brl(valor)}
            </span>
            <span className="ficha text-[#6b4526]">/ {cafe.gramas} g</span>
          </div>
          <div className="ficha num mt-1 text-[#8c7a66]">
            {porQuilo(valor, cafe.gramas)} por quilo
            {soMoido && " · só moído"}
          </div>
        </div>

        <div data-print-hide>
          <Botao href="#precos">Botar no carrinho</Botao>
        </div>
      </div>
    </div>
  );
}

export default function Cafes() {
  const [moagem, setMoagem] = useState<Moagem>("grao");

  return (
    <Faixa id="cafes" className="py-16 sm:py-24">
      <Rubrica num="01">Os cafés</Rubrica>

      <div className="reveal mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
            Quatro rótulos, uma lavoura só
          </h2>
          <p className="mt-4 max-w-[58ch] text-[#5c4635]">
            Todos vêm do mesmo talhão. O que muda é a seleção do grão, o ponto da torra e
            o quanto a xícara pede atenção.
          </p>
        </div>
        <div data-print-hide>
          <div className="ficha mb-2 text-[12.5px] uppercase tracking-[0.14em] text-[#8c7a66]">
            Preços em
          </div>
          <SeletorMoagem valor={moagem} aoTrocar={setMoagem} />
        </div>
      </div>

      <div className="mt-10 grid gap-12 sm:gap-14">
        {CAFES.map((c) => (
          <article key={c.id} id={c.id} className="reveal" style={{ scrollMarginTop: 96 }}>
            <Rotulo cafe={c} />
            <Compra cafe={c} moagem={moagem} />
          </article>
        ))}
      </div>
    </Faixa>
  );
}
