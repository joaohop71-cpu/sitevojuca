import { useState } from "react";
import { CAFES, PROMO, TINTA_ROTULO, brl, comDesconto } from "@/dados";
import { ajustar, linhasDo, useCarrinho } from "@/carrinho";
import type { Cafe } from "@/dados";
import { Contador, Faixa, Rubrica, Visor } from "./base";

/* a arte web traz uma faixa vazia no pé, reservada para o preço e o botão:
   874 x 1854 nos cinco produtos, faixa de 22,006% ancorada no pé */
const ARTE = { largura: 874, altura: 1854, faixa: 22.006 };

/* a arte sem a faixa, que é a peça como vai impressa na embalagem: é ela que
   o visor mostra. A do cartão terminaria num terço de papel em branco, que é
   o espaço que o preço ocupa na página e que ali não existe. */
const ALTURA_IMPRESSA: Record<string, number> = {
  vojuca: 1350,
  minassanta: 1350,
  reserva998: 1350,
  herancas_2sl: 1446,
  herancas_24137: 1446,
};

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

/**
 * O rótulo em tamanho de verdade, dentro do visor.
 *
 * A arte não tem fundo próprio: é tinta escura sobre transparência, para poder
 * assentar no papel do site. Dentro do visor, que é escuro, ela sumia. Aqui
 * ela ganha o papel de volta, numa folha com folga em volta, que é como o
 * rótulo existe de verdade.
 */
function RotuloGrande({ cafe }: { cafe: Cafe }) {
  const base = `/rotulos/rotulo_${cafe.banner}_1x`;
  return (
    <div
      className="p-3 sm:p-4"
      style={{ background: "#f2e7d3", boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}
    >
      <picture>
        <source type="image/webp" srcSet={`${base}.webp`} />
        <img
          src={`${base}.png`}
          alt={descricaoArte(cafe)}
          width={ARTE.largura}
          height={ALTURA_IMPRESSA[cafe.banner] ?? 1350}
          className="block max-h-[72vh] w-auto object-contain"
        />
      </picture>
    </div>
  );
}

/** um preço: o cheio riscado em cima, o com desconto embaixo */
function Preco({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="text-center">
      <div className="ficha uppercase tracking-[0.16em] text-[#6f5b44]" style={{ fontSize: "min(2.5cqw, 12px)" }}>
        {rotulo}
      </div>
      <div className="ficha num text-[#6f5b44] line-through" style={{ fontSize: "min(2.7cqw, 13px)" }}>
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
  const qtd = useCarrinho();
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
        className="rasgo-lados"
        style={{ background: "rgba(255,250,240,0.6)", padding: "20px 16px" }}
      >
        {/* a caixa de referência é a IMAGEM, e não o cartão: o cartão tem uma
            folga de papel em volta, e a faixa medida contra ele saía uns
            quatro pixels mais larga que a moldura impressa de cada lado */}
        <div className="relative">
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
        /* A moldura impressa não é a borda da imagem: medindo o arquivo, as
           duas linhas do quadro caem em x = 55 e 818 de 874, e as de baixo em
           y = 1798 de 1854. O botão ia até 12% e passava por cima delas.
           Os recuos abaixo são esses números, com uma folga: em CSS a
           porcentagem de padding conta sempre a LARGURA, inclusive embaixo. */
        style={{ height: `${ARTE.faixa}%`, padding: "1% 8% 10%" }}
      >
        {semPreco ? (
          <p className="ficha text-center text-[#6b4526]" style={{ fontSize: "min(3.2cqw, 15px)" }}>
            Lote novo, preço sendo fechado. Pergunte no WhatsApp.
          </p>
        ) : (
          <>
            {/* as notas ficavam só no alt da imagem e no rótulo ampliado, e os
                dois Heranças, que têm mesmo peso e mesmo preço, ficavam
                indistinguíveis pelo cartão */}
            <div
              className="ficha uppercase tracking-[0.1em] text-[#3a271b]"
              style={{ fontSize: "min(2.7cqw, 13px)" }}
            >
              {cafe.notas.join(" · ")}
            </div>
            <div
              className="ficha mt-[1cqw] uppercase tracking-[0.14em]"
              style={{ color: cor, fontSize: "min(2.5cqw, 12px)" }}
            >
              {PROMO.rotulo} · {PROMO.prazo} · {cafe.gramas} g
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
      </div>
        </div>

        {/* A quantidade morava lá embaixo, numa segunda tabela com os mesmos
            cinco cafés e os mesmos preços. Duas fontes para o mesmo número é
            como elas divergem; e obrigava a pessoa a decidir aqui e pedir
            noutro lugar. Agora se escolhe onde se olha. */}
        <div className="mt-4 grid gap-2.5 px-1">
          {linhasDo(cafe.id).map((l) => (
            <div key={l.chave} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="ficha text-[15px] text-[#3a271b]">
                  {l.moagem === "grao" ? "Em grão" : "Moído"}
                </div>
                <div className="ficha num text-[13px] text-[#6f5b44]">
                  {brl(comDesconto(l.preco))} · {cafe.gramas} g
                </div>
              </div>
              <Contador
                valor={qtd[l.chave] ?? 0}
                aoMudar={(d) => ajustar(l.chave, d)}
                rotulo={`${l.nome} ${l.moagem === "grao" ? "em grão" : "moído"}`}
              />
            </div>
          ))}
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
          Cinco rótulos, uma lavoura só
        </h2>
        <p className="mt-4 max-w-[58ch] text-[#5c4635]">
          Todos vêm do mesmo talhão. O que muda é a seleção do grão, o ponto da torra e
          o quanto a xícara pede atenção. Escolha a quantidade aqui mesmo, no rótulo que
          quiser; toque na arte para ler a letra miúda.
        </p>
      </div>

      {/* o selo da promoção passou a viver aqui, junto do preço: era no pé da
          página que ele estava, longe de onde se decide */}
      <div
        className="reveal mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 py-4 text-center"
        style={{ background: "#8c3a20", color: "#f7efe0" }}
      >
        <span
          className="num text-[clamp(28px,4.4vw,40px)] leading-none"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 48',
            fontWeight: 600,
          }}
        >
          {PROMO.rotulo}
        </span>
        <span className="ficha text-[14.5px] uppercase tracking-[0.14em]">
          Preço de lançamento, por tempo limitado, já aplicado abaixo
        </span>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2 lg:gap-7">
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
