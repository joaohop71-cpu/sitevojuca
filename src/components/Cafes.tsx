import { useState } from "react";
import { CAFES, PROMO, TINTA_ROTULO, brl, comDesconto, estaEsgotado } from "@/dados";
import { ajustar, useCarrinho } from "@/carrinho";
import type { Cafe } from "@/dados";
import { Contador, Faixa, Rubrica, Visor } from "./base";

/* a arte web traz uma faixa vazia no pé, reservada para o preço e o botão:
   874 x 1854 nos cinco produtos, faixa de 22,006% ancorada no pé */
const ARTE = { largura: 874, altura: 1854, faixa: 22.006 };

/* A arte traz um vão em branco entre a última linha de texto e o divisor que
   abre a faixa do preço (y = 1440). Em vez de pedir outro arquivo, a arte é
   costurada: mostro dela o pedaço de cima até CORTE e retomo em RETOMA, logo
   antes do divisor. O corte cai no vão, onde só existe papel e as duas linhas
   verticais do quadro, que são retas e continuam sem emenda visível.
   CORTE é medido no rótulo que desce mais: o Vô Juca, o Reserva e o Minas
   Santa acabam em y = 1309, mas os dois Heranças acabam em 1357, porque
   trazem a linha do lote. Cortar em 1330, como estava, escondia vinte e sete
   pixels da última linha deles. */
const CORTE = 1372;
const RETOMA = 1430;
const ALTURA_COSTURADA = ARTE.altura - (RETOMA - CORTE);
/* a faixa, agora medida na peça mais curta */
const FAIXA_COSTURADA = ((ARTE.altura - 1440) / ALTURA_COSTURADA) * 100;

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

/**
 * Uma coluna de preço, com o contador embaixo.
 *
 * O mais e o menos ficavam fora da arte, num bloco solto no pé do cartão: o
 * preço numa caixa e a decisão noutra. Dentro da faixa que a arte reserva,
 * escolher passa a ser um gesto só, no mesmo lugar onde se lê o valor.
 *
 * O preço cheio sobe para a linha do rótulo em vez de ocupar uma linha própria:
 * é o que faz o contador caber na faixa sem apertar a altura de toque.
 */
function Preco({
  rotulo,
  valor,
  cor,
  chave,
  qtd,
  nome,
  promo = true,
  esgotado = false,
}: {
  rotulo: string;
  valor: number;
  cor: string;
  chave: string;
  qtd: number;
  nome: string;
  /** fora da promoção: mostra um preço só, o de tabela */
  promo?: boolean;
  esgotado?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="ficha flex items-baseline gap-[1.6cqw] uppercase tracking-[0.12em] text-[#6f5b44]"
        style={{ fontSize: "min(2.4cqw, 11.5px)" }}
      >
        {rotulo}
        {/* o risco só existe onde há desconto: riscar um preço que continua
            valendo é anunciar uma promoção que não existe */}
        {promo && !esgotado && <span className="num line-through">{brl(valor)}</span>}
      </div>
      <div
        className="num leading-none"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
          fontWeight: 600,
          fontSize: "min(5.8cqw, 29px)",
          color: esgotado ? "#6f5b44" : cor,
          opacity: esgotado ? 0.55 : 1,
        }}
      >
        {brl(comDesconto(valor, promo))}
      </div>
      <div className="mt-[1.3cqw]">
        {/* Sem estoque, no lugar do contador vai a palavra. O preço fica, mais
            apagado: some-lo faria a moagem parecer que nunca existiu, e o que
            aconteceu é que ela volta. */}
        {esgotado ? (
          <div
            className="ficha whitespace-nowrap border uppercase"
            style={{
              fontSize: "min(2.5cqw, 12px)",
              letterSpacing: "0.12em",
              color: "#8c3a20",
              borderColor: "rgba(140,58,32,0.45)",
              padding: "0.9cqw 2.2cqw",
            }}
          >
            Sem estoque
          </div>
        ) : (
          <Contador
            valor={qtd}
            aoMudar={(d) => ajustar(chave, d)}
            rotulo={`${nome} ${rotulo.toLowerCase()}`}
            cor={cor}
            compacto
          />
        )}
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
        {/* A caixa de referência é a ARTE, e não o cartão: o cartão tem uma
            folga de papel em volta, e a faixa medida contra ele saía uns quatro
            pixels mais larga que a moldura impressa de cada lado.
            A altura é a da peça costurada, sem o vão em branco, e é ela que dá
            às duas metades uma porcentagem contra a qual se medir. */}
        <div
          className="relative"
          style={{ aspectRatio: `${ARTE.largura} / ${ALTURA_COSTURADA}` }}
        >
      {/* a altura precisa descer até o botão: com ele em altura automática, a
          porcentagem das duas metades não tem contra o que se medir e cada uma
          mostra a arte inteira */}
      <button
        type="button"
        onClick={aoVerRotulo}
        aria-label={`Ver o rótulo do ${nomeCheio(cafe)} em tamanho grande`}
        className="group block h-full w-full"
      >
        {/* duas metades da mesma imagem, encostadas: o navegador baixa um
            arquivo só e o vão em branco fica de fora */}
        <div style={{ height: `${(CORTE / ALTURA_COSTURADA) * 100}%`, overflow: "hidden" }}>
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
        </div>
        <div
          style={{
            height: `${((ARTE.altura - RETOMA) / ALTURA_COSTURADA) * 100}%`,
            overflow: "hidden",
          }}
        >
          <picture>
            <source
              type="image/webp"
              srcSet={`${base}_1x.webp 874w, ${base}_2x.webp 1748w`}
              sizes="(min-width: 1024px) 540px, 92vw"
            />
            <img
              src={`${base}_1x.png`}
              alt=""
              aria-hidden="true"
              width={ARTE.largura}
              height={ARTE.altura}
              loading="lazy"
              decoding="async"
              className="block w-full transition-opacity duration-200 group-hover:opacity-90"
              style={{ marginTop: `-${(RETOMA / ARTE.largura) * 100}%` }}
            />
          </picture>
        </div>
      </button>

      {/* a faixa reservada pela arte */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center"
        /* A moldura impressa não é a borda da imagem: medindo o arquivo, as
           duas linhas do quadro caem em x = 55 e 818 de 874, e as de baixo em
           y = 1798 de 1854. O botão ia até 12% e passava por cima delas.
           Os recuos abaixo são esses números, com uma folga: em CSS a
           porcentagem de padding conta sempre a LARGURA, inclusive embaixo. */
        style={{ height: `${FAIXA_COSTURADA}%`, padding: "1% 7% 8%" }}
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
            {/* uma linha só: no Heranças 24/137, que tem as notas mais longas,
                a segunda linha empurrava o contador para fora do quadro
                impresso no celular */}
            <div
              className="ficha whitespace-nowrap uppercase text-[#3a271b]"
              style={{ fontSize: "min(2.4cqw, 12.5px)", letterSpacing: "0.05em" }}
            >
              {cafe.notas.join(" · ")}
            </div>
            <div
              className="ficha mt-[0.5cqw] uppercase tracking-[0.14em]"
              style={{ color: cor, fontSize: "min(2.5cqw, 12px)" }}
            >
              {cafe.semPromo
                ? `Preço de tabela · ${cafe.gramas} g`
                : `${PROMO.rotulo} · ${PROMO.prazo} · ${cafe.gramas} g`}
            </div>
            <div className="mt-[1cqw] flex items-start justify-center gap-[4cqw]">
              {cafe.preco.grao !== null && (
                <Preco
                  rotulo="Em grão"
                  valor={cafe.preco.grao}
                  cor={cor}
                  chave={`${cafe.id}-grao`}
                  qtd={qtd[`${cafe.id}-grao`] ?? 0}
                  nome={nomeCheio(cafe)}
                  promo={!cafe.semPromo}
                  esgotado={estaEsgotado(cafe, "grao")}
                />
              )}
              {cafe.preco.moido !== null && (
                <Preco
                  rotulo="Moído"
                  valor={cafe.preco.moido}
                  cor={cor}
                  chave={`${cafe.id}-moido`}
                  qtd={qtd[`${cafe.id}-moido`] ?? 0}
                  nome={nomeCheio(cafe)}
                  promo={!cafe.semPromo}
                  esgotado={estaEsgotado(cafe, "moido")}
                />
              )}
            </div>
          </>
        )}
      </div>
        </div>

      </div>
    </article>
  );
}

/** o que acabou, dito pelos dados e não à mão */
const SEM_ESTOQUE = CAFES.flatMap((c) =>
  (c.esgotado ?? []).map((m) => `${nomeCheio(c)} ${m === "grao" ? "em grão" : "moído"}`)
);

export default function Cafes() {
  const [aberto, setAberto] = useState<number | null>(null);
  const ir = (d: number) =>
    setAberto((a) => (a === null ? null : (a + d + CAFES.length) % CAFES.length));

  return (
    <Faixa id="cafes" className="py-10 sm:py-12">
      <Rubrica>Os cafés</Rubrica>

      <div className="abertura reveal mt-6">
        <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
          Cinco rótulos, uma lavoura só
        </h2>
        <p className="mt-4 max-w-[58ch] text-[#5c4635]">
          Todos vêm da mesma lavoura, hoje repartida em nove talhões. O que muda é a
          variedade, a seleção do grão e o ponto da torra. Escolha a quantidade aqui
          mesmo, no rótulo que quiser; toque na arte para ler a letra miúda.
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
          Preço de lançamento, já aplicado abaixo · exceto o Minas Santa
        </span>
      </div>

      {/* O aviso de estoque sai da própria lista de cafés: escrito à mão, ele
          continuaria no ar depois do lote voltar. Sem nada esgotado, a linha
          não existe. */}
      {SEM_ESTOQUE.length > 0 && (
        <p className="ficha reveal mt-4 text-center text-[14.5px] leading-relaxed text-[#6b4526]">
          Sem estoque no momento: {SEM_ESTOQUE.join(" e ")}. Os dois voltam; o resto
          está disponível.
        </p>
      )}

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
