import { useState } from "react";
import { CAFES, PROMO, TINTA_ROTULO, brl, comDesconto } from "@/dados";
import type { Cafe } from "@/dados";
import { Faixa, Rubrica, Visor } from "./base";

/* a arte web traz uma faixa vazia no pé, reservada para o preço e o botão:
   874 x 1854 nos cinco produtos, faixa de 22,006% ancorada no pé */
const ARTE = { largura: 874, altura: 1854, faixa: 22.006 };

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function nomeCheio(c: Cafe) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

function descricaoArte(c: Cafe) {
  return [c.nome, c.lote, "·", c.qualificacao.join(", "), "·", c.notas.join(", "),
    `· ${c.formato}, ${c.gramas} g`].filter(Boolean).join(" ");
}

function arte(c: Cafe) {
  return `/rotulos-web/rotulo_${c.banner}_web`;
}

/** o rótulo em tamanho de verdade, dentro do visor */
function RotuloGrande({ cafe }: { cafe: Cafe }) {
  const base = arte(cafe);
  return (
    <picture>
      <source type="image/webp" srcSet={`${base}_1x.webp 1x, ${base}_2x.webp 2x`} />
      <img
        src={`${base}_1x.png`}
        alt={descricaoArte(cafe)}
        width={ARTE.largura}
        height={ARTE.altura}
        className="max-h-[78vh] w-auto object-contain"
      />
    </picture>
  );
}

/** um preço: o cheio riscado em cima, o com desconto embaixo */
function Preco({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="text-center">
      <div className="ficha uppercase tracking-[0.16em] text-[#75634f]" style={{ fontSize: "min(2.5cqw, 12px)" }}>
        {rotulo}
      </div>
      <div className="ficha num text-[#8a7358] line-through" style={{ fontSize: "min(2.7cqw, 13px)" }}>
        {brl(valor)}
      </div>
      <div
        className="num leading-none"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
          fontWeight: 600,
          fontSize: "min(6.4cqw, 30px)",
        }}
      >
        {brl(comDesconto(valor))}
      </div>
    </div>
  );
}

/**
 * O rótulo, com o preço e o botão dentro da faixa que a própria arte reserva.
 *
 * A arte web termina numa área vazia de 22% da altura, com o papel e a moldura
 * seguindo em volta. É ali que entram o preço e o botão, em texto vivo, porque
 * preço muda e imagem de botão ninguém clica. Como o tamanho da faixa é uma
 * fração da peça, o que vai dentro dela também é medido em fração da largura
 * do cartão (cqw), e não em pixels: assim o pé continua cabendo em qualquer
 * largura de tela.
 *
 * A borda reta saiu. O papel do cartão é rasgado nos quatro lados, como o
 * resto do site.
 */
function Cartao({ cafe, aoVerRotulo }: { cafe: Cafe; aoVerRotulo: () => void }) {
  const cor = TINTA_ROTULO[cafe.cor];
  const base = arte(cafe);
  const cheio = cafe.preco.grao ?? cafe.preco.moido;
  const semPreco = cheio === null;

  return (
    /* duas máscaras aninhadas: a de fora morde em cima e embaixo, a de dentro
       nos lados, e a interseção das duas dá o canto rasgado de verdade */
    <article
      id={cafe.id}
      className="reveal rasgo-ambos"
      style={{ containerType: "inline-size", scrollMarginTop: 96 }}
    >
      <div
        className="rasgo-lados relative"
        style={{ background: "rgba(255,250,240,0.6)", padding: "20px 16px" }}
      >
      <button
        type="button"
        onClick={aoVerRotulo}
        aria-label={`Ver o rótulo do ${nomeCheio(cafe)} em tamanho grande`}
        className="group block w-full"
      >
        <picture>
          <source
            type="image/webp"
            srcSet={`${base}_1x.webp 874w, ${base}_2x.webp 1748w`}
            sizes="(min-width: 1024px) 540px, 92vw"
          />
          <img
            src={`${base}_1x.png`}
            alt={descricaoArte(cafe)}
            width={ARTE.largura}
            height={ARTE.altura}
            loading="lazy"
            decoding="async"
            className="block w-full transition-opacity duration-200 group-hover:opacity-90"
          />
        </picture>
      </button>

      {/* a faixa reservada pela arte */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center"
        style={{ height: `${ARTE.faixa}%`, padding: "0 12% 2%" }}
      >
        {semPreco ? (
          <p className="ficha text-center text-[#6b4526]" style={{ fontSize: "min(3.2cqw, 15px)" }}>
            Lote novo, preço sendo fechado. Pergunte no WhatsApp.
          </p>
        ) : (
          <>
            <div
              className="ficha uppercase tracking-[0.16em]"
              style={{ color: cor, fontSize: "min(2.6cqw, 12.5px)" }}
            >
              {PROMO.rotulo} · {cafe.gramas} g
            </div>
            <div className="mt-[1.5cqw] flex items-end justify-center gap-[7cqw]">
              {cafe.preco.grao !== null && (
                <Preco rotulo="Em grão" valor={cafe.preco.grao} />
              )}
              {cafe.preco.moido !== null && (
                <Preco rotulo="Moído" valor={cafe.preco.moido} />
              )}
            </div>
          </>
        )}

        <div className="mt-[3cqw] w-full" data-print-hide>
          <a
            href="#precos"
            className="flex w-full items-center justify-center border transition-colors"
            style={{
              fontFamily: '"Courier Prime", monospace',
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "min(3cqw, 14px)",
              padding: "min(2.4cqw, 12px) 0",
              background: cor,
              borderColor: cor,
              color: "#f2e7d3",
            }}
          >
            {semPreco ? "Falar com a gente" : "Monte o seu pedido"}
          </a>
        </div>
      </div>
      </div>
    </article>
  );
}

export default function Cafes() {
  const [aberto, setAberto] = useState<number | null>(null);
  const ir = (d: number) =>
    setAberto((a) => (a === null ? null : (a + d + CAFES.length) % CAFES.length));

  return (
    <Faixa id="cafes" className="py-10 sm:py-12">
      <Rubrica>Os cafés</Rubrica>

      <div className="reveal mt-6">
        <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
          Quatro rótulos, uma lavoura só
        </h2>
        <p className="mt-4 max-w-[58ch] text-[#5c4635]">
          Todos vêm do mesmo talhão. O que muda é a seleção do grão, o ponto da torra e
          o quanto a xícara pede atenção. Os rótulos estão lado a lado de propósito, para
          dar para comparar; toque em um para ler a letra miúda.
        </p>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-2 lg:gap-7">
        {CAFES.map((c, i) => (
          <Cartao key={c.id} cafe={c} aoVerRotulo={() => setAberto(i)} />
        ))}
      </div>

      {aberto !== null && (
        <Visor
          rotulo={`Rótulo do ${nomeCheio(CAFES[aberto])}`}
          aoFechar={() => setAberto(null)}
          aoIr={ir}
        >
          <RotuloGrande cafe={CAFES[aberto]} />
          <p
            className="mt-4 text-center text-[17px] text-[#efe3cc]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
          >
            {nomeCheio(CAFES[aberto])}
            <span className="ficha num ml-3 text-[14px] text-[#bda88d]">
              {String(aberto + 1).padStart(2, "0")} / 0{CAFES.length}
            </span>
          </p>
        </Visor>
      )}
    </Faixa>
  );
}
