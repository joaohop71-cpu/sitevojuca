import { useState } from "react";
import { CAFES, brl, porQuilo, zap } from "@/dados";
import type { Cafe, Moagem } from "@/dados";
import { Botao, Faixa, Grao, Rubrica } from "./base";

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
            fontSize: 12,
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

function Preco({ cafe, moagem }: { cafe: Cafe; moagem: Moagem }) {
  const v = moagem === "grao" ? cafe.preco.grao : cafe.preco.moido;
  if (v === null) {
    return (
      <div>
        <span className="ficha text-[#8c7a66]">Só moído</span>
        <div className="ficha mt-1 text-[#8c7a66]">{brl(cafe.preco.moido)} · 250 g</div>
      </div>
    );
  }
  return (
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
          {brl(v)}
        </span>
        <span className="ficha text-[#6b4526]">/ 250 g</span>
      </div>
      <div className="ficha num mt-1 text-[#8c7a66]">{porQuilo(v)} por quilo</div>
    </div>
  );
}

function Fichas({ cafe }: { cafe: Cafe }) {
  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-0 border-t border-[rgba(58,39,27,0.18)] pt-1">
      {cafe.fichas.map((f, i) => (
        <div
          key={f.rotulo}
          className={`flex items-baseline justify-between gap-3 border-b border-dotted border-[rgba(58,39,27,0.22)] py-1.5 ${
            i === cafe.fichas.length - 1 && cafe.fichas.length % 2 === 1
              ? "col-span-2"
              : ""
          }`}
        >
          <dt className="ficha text-[11.5px] uppercase tracking-[0.12em] text-[#8c7a66]">
            {f.rotulo}
          </dt>
          <dd className="ficha m-0 text-right text-[#3a271b]">{f.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Cartao({ cafe, moagem }: { cafe: Cafe; moagem: Moagem }) {
  return (
    <article
      id={cafe.id}
      className="flex flex-col border border-[rgba(58,39,27,0.22)] bg-[rgba(255,250,240,0.4)] p-5 sm:p-8"
      style={{ scrollMarginTop: 96 }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="eyebrow">{cafe.categoria}</span>
        {cafe.destaque && (
          <span
            className="shrink-0 border border-[#8c3a20] px-2.5 py-1 text-[#8c3a20]"
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Mais pedido
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[clamp(26px,3vw,34px)]">{cafe.nome}</h3>

      <p
        className="mt-3 text-[17px] leading-snug text-[#6b4526]"
        style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
      >
        {cafe.chamada}
      </p>

      <p className="mt-4 text-[15.5px] text-[#5c4635]">{cafe.descricao}</p>

      {cafe.notas && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="ficha text-[11.5px] uppercase tracking-[0.14em] text-[#8c7a66]">
            Notas
          </span>
          {cafe.notas.map((n) => (
            <span key={n} className="ficha flex items-center gap-1.5 text-[#4f5b3f]">
              <Grao size={11} cor="#4f5b3f" />
              {n}
            </span>
          ))}
        </div>
      )}

      <Fichas cafe={cafe} />

      {cafe.sub && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {cafe.sub.map((s, i) => (
            <div key={s.nome} className="border-l-2 border-[#8c3a20] pl-4">
              <div className="ficha num text-[11.5px] text-[#8c7a66]">
                Cultivar {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="mt-1 text-[21px]">{s.nome}</h4>
              <p
                className="mt-1.5 text-[15px] leading-snug text-[#6b4526]"
                style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
              >
                {s.chamada}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#5c4635]">{s.descricao}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.fichas.map((f) => (
                  <span
                    key={f}
                    className="ficha border border-[rgba(58,39,27,0.25)] px-2 py-0.5 text-[11.5px] text-[#6b4526]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[rgba(58,39,27,0.18)] pt-6" style={{ marginTop: "2rem" }}>
        <Preco cafe={cafe} moagem={moagem} />
        <div data-print-hide>
          <Botao href={zap(`Olá! Quero pedir o ${cafe.nome} (${moagem === "grao" ? "em grão" : "moído"}).`)}>
            Pedir
          </Botao>
        </div>
      </div>
    </article>
  );
}

export default function Cafes() {
  const [moagem, setMoagem] = useState<Moagem>("grao");

  return (
    <Faixa id="cafes" className="py-16 sm:py-24">
      <Rubrica num="01">Os cafés</Rubrica>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
            Quatro linhas, uma lavoura só
          </h2>
          <p className="mt-4 max-w-[58ch] text-[#5c4635]">
            Todas vêm do mesmo talhão. O que muda é a seleção do grão, o ponto da torra e
            o quanto a xícara pede atenção.
          </p>
        </div>
        <div data-print-hide>
          <div className="ficha mb-2 text-[11.5px] uppercase tracking-[0.14em] text-[#8c7a66]">
            Preços em
          </div>
          <SeletorMoagem valor={moagem} aoTrocar={setMoagem} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {CAFES.slice(0, 2).map((c) => (
          <Cartao key={c.id} cafe={c} moagem={moagem} />
        ))}
      </div>

      <div className="mt-6 grid gap-6">
        {CAFES.slice(2).map((c) => (
          <Cartao key={c.id} cafe={c} moagem={moagem} />
        ))}
      </div>
    </Faixa>
  );
}
