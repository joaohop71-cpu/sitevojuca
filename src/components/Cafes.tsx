import { useState, type CSSProperties } from "react";
import { CAFES, brl, porQuilo } from "@/dados";
import type { Cafe, Moagem } from "@/dados";
import { Botao, Faixa, Rubrica } from "./base";

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

/** altura da arte vertical — as Heranças têm a linha do lote e ficam mais altas */
const ALTURA_VERTICAL: Record<string, number> = {
  vojuca: 1508,
  minassanta: 1508,
  herancas_2sl: 1567,
  herancas_24137: 1567,
};

/**
 * O rótulo impresso, servido como imagem. A arte tem fundo transparente, então
 * assenta direto sobre o papel do site — sem caixa nem cor por baixo.
 *
 * São duas artes: a deitada, para telas largas, e a em pé, para o celular —
 * onde a deitada encolheria a ponto de a letra miúda sumir. O <picture> troca
 * pela largura da tela e baixa só a que vai usar.
 */
function RotuloImagem({ cafe }: { cafe: Cafe }) {
  const deitado = `/banners/banner_${cafe.banner}`;
  const emPe = `/rotulos/rotulo_${cafe.banner}`;
  const altura = ALTURA_VERTICAL[cafe.banner] ?? 1508;
  const descricao = [
    cafe.nome,
    cafe.lote,
    "·",
    cafe.qualificacao.join(", "),
    "·",
    cafe.notas.join(", "),
    `· ${cafe.formato}, ${cafe.gramas} g`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <picture>
      {/* telas largas: a arte deitada, em 1x e 2x */}
      <source
        media="(min-width: 1024px)"
        type="image/webp"
        srcSet={`${deitado}_1x.webp 1x, ${deitado}_2x.webp 2x`}
      />
      <source
        media="(min-width: 1024px)"
        srcSet={`${deitado}_1x.png 1x, ${deitado}_2x.png 2x`}
      />

      {/* tablet: a arte em pé, ainda com 2x — a tela é grande e a banda, larga */}
      <source
        media="(min-width: 640px)"
        type="image/webp"
        srcSet={`${emPe}_1x.webp 1x, ${emPe}_2x.webp 2x`}
      />
      <source media="(min-width: 640px)" srcSet={`${emPe}_1x.png 1x, ${emPe}_2x.png 2x`} />

      {/* Celular: só a arte de 874 px, sem o 2x.
          O rótulo ocupa no máximo ~400 px de largura num telefone, então esses
          874 px já entregam de 2,2x a 2,5x de densidade — acima do retina de
          2x, e visualmente indistinguível do arquivo de 1748 px. Ele pesa um
          terço: são ~1,6 MB a menos de download nos quatro rótulos, na tela
          onde a banda costuma ser pior. */}
      <source type="image/webp" srcSet={`${emPe}_1x.webp`} />
      <img
        src={`${emPe}_1x.png`}
        alt={descricao}
        width={874}
        height={altura}
        loading="lazy"
        decoding="async"
        className="rotulo-arte mx-auto block w-full"
        style={{ "--ar-em-pe": `874 / ${altura}` } as CSSProperties}
      />
    </picture>
  );
}

/** faixa de compra logo abaixo do rótulo */
function Compra({ cafe, moagem }: { cafe: Cafe; moagem: Moagem }) {
  const soMoido = cafe.preco.grao === null;
  const valor = moagem === "grao" && !soMoido ? cafe.preco.grao! : cafe.preco.moido;

  return (
    <div className="mt-5 flex flex-col items-center gap-5 text-center">
      <p className="max-w-[54ch] text-[15.5px] text-[#5c4635]">{cafe.descricao}</p>

      <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:items-end sm:gap-8">
        <div>
          <div className="flex items-baseline justify-center gap-2">
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

        <div className="w-full sm:w-auto" data-print-hide>
          <Botao href="#precos" largo>
            Monte o seu pedido
          </Botao>
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
            <RotuloImagem cafe={c} />
            <Compra cafe={c} moagem={moagem} />
          </article>
        ))}
      </div>
    </Faixa>
  );
}
