import { useState } from "react";
import { CAFES, TINTA_ROTULO, brl, porQuilo } from "@/dados";
import type { Cafe } from "@/dados";
import { Botao, Faixa, Rubrica, Visor } from "./base";

/** altura da arte vertical — as Heranças têm a linha do lote e ficam mais altas */
const ALTURA_VERTICAL: Record<string, number> = {
  vojuca: 1350,
  minassanta: 1350,
  herancas_2sl: 1446,
  herancas_24137: 1446,
};

/** a mais alta das quatro artes: é ela que dá a caixa comum dos cartões */
const ALTURA_MAIOR = Math.max(...Object.values(ALTURA_VERTICAL));

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function nomeCheio(c: Cafe) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

function descricaoArte(c: Cafe) {
  return [
    c.nome,
    c.lote,
    "·",
    c.qualificacao.join(", "),
    "·",
    c.notas.join(", "),
    `· ${c.formato}, ${c.gramas} g`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * O rótulo em tamanho de verdade, dentro do visor.
 *
 * Aqui não há por que economizar resolução: a pessoa abriu justamente para
 * olhar de perto, e é a única tela onde a letra miúda do rótulo se lê.
 */
function RotuloGrande({ cafe }: { cafe: Cafe }) {
  const base = `/rotulos/rotulo_${cafe.banner}`;
  return (
    <picture>
      <source type="image/webp" srcSet={`${base}_1x.webp 1x, ${base}_2x.webp 2x`} />
      <img
        src={`${base}_1x.png`}
        alt={descricaoArte(cafe)}
        width={874}
        height={ALTURA_VERTICAL[cafe.banner] ?? 1350}
        className="max-h-[74vh] w-auto object-contain"
      />
    </picture>
  );
}

/** o fio com o losango no meio, o mesmo divisor impresso nos rótulos */
function FioLosango({ cor }: { cor: string }) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span className="h-px flex-1" style={{ background: `${cor}4d` }} />
      <span className="block h-[5px] w-[5px] rotate-45" style={{ background: cor }} />
      <span className="h-px flex-1" style={{ background: `${cor}4d` }} />
    </div>
  );
}

/** uma das duas colunas de preço: a moagem, o valor do pacote e o preço por quilo */
function Preco({
  rotulo,
  valor,
  gramas,
}: {
  rotulo: string;
  valor: number;
  gramas: number;
}) {
  return (
    <div className="text-center">
      <div className="ficha text-[12px] uppercase tracking-[0.18em] text-[#75634f]">
        {rotulo}
      </div>
      <div
        className="num mt-1 text-[25px] leading-none sm:text-[27px]"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
          fontWeight: 600,
        }}
      >
        {brl(valor)}
      </div>
      <div className="ficha num mt-1 text-[13px] text-[#75634f]">
        {porQuilo(valor, gramas)}/kg
      </div>
    </div>
  );
}

/**
 * O rótulo, com o preço e os botões no pé, dentro da mesma moldura.
 *
 * Tentei substituir a arte por uma composição em texto e não era a mesma
 * coisa: o rótulo é desenho, e desenho não se reescreve em CSS. O que estava
 * errado antes não era a arte, era a largura. Os quatro ocupavam a página
 * inteira, um embaixo do outro, e aí cada um sozinho dava quase duas telas.
 * Em duas colunas eles cabem, e dá para comparar.
 *
 * O preço e os botões ficam dentro da moldura, embaixo da arte e separados
 * por um fio com losango, que é o divisor do próprio rótulo: lidos juntos,
 * arte e pé viram uma peça só. O que é preço e o que é botão continua sendo
 * texto vivo, porque preço muda e imagem de botão ninguém clica.
 */
function Cartao({ cafe, aoVerRotulo }: { cafe: Cafe; aoVerRotulo: () => void }) {
  const cor = TINTA_ROTULO[cafe.cor];
  const soMoido = cafe.preco.grao === null;
  const base = `/rotulos/rotulo_${cafe.banner}`;
  const altura = ALTURA_VERTICAL[cafe.banner] ?? 1350;

  return (
    <article
      id={cafe.id}
      className="reveal flex flex-col p-3 sm:p-4"
      style={{
        background: "rgba(255,250,240,0.55)",
        border: `1px solid ${cor}4d`,
        scrollMarginTop: 96,
      }}
    >
      {/* a arte, do jeito que vai impressa. Clicar abre ela grande, que é onde
          a letra miúda do rótulo se lê. */}
      <button
        type="button"
        onClick={aoVerRotulo}
        aria-label={`Ver o rótulo do ${nomeCheio(cafe)} em tamanho grande`}
        className="group block w-full"
      >
        {/* As Heranças são mais altas que as outras duas, porque trazem a linha
            do lote. Lado a lado, isso deixava sessenta pixels de vão morto no
            pé dos cartões vizinhos. Aqui todos ocupam a caixa da arte mais
            alta e a menor se centra dentro dela: como o fundo do rótulo é
            transparente, o que sobra vira margem de papel e não se vê, e os
            quatro pés ficam na mesma linha. */}
        <div
          className="relative w-full"
          style={{ aspectRatio: `874 / ${ALTURA_MAIOR}` }}
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
              width={874}
              height={altura}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
          </picture>
        </div>
      </button>

      {/* o pé: preço e pedido, dentro da mesma moldura da arte */}
      <div className="mt-3 px-3 pb-2 sm:px-5">
        <FioLosango cor={cor} />

        <div className="mt-4 flex items-end justify-center gap-7">
          {!soMoido && (
            <Preco rotulo="Em grão" valor={cafe.preco.grao!} gramas={cafe.gramas} />
          )}
          <Preco rotulo="Moído" valor={cafe.preco.moido} gramas={cafe.gramas} />
        </div>

        <div className="ficha mt-2.5 text-center text-[12.5px] uppercase tracking-[0.14em] text-[#75634f]">
          {cafe.gramas} g{soMoido && " · esta linha sai só moída"}
        </div>

        <div
          className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          data-print-hide
        >
          <Botao href="#precos" largo>
            Monte o seu pedido
          </Botao>
          <button
            type="button"
            onClick={aoVerRotulo}
            className="link-sublinhado ficha text-[13.5px] uppercase tracking-[0.1em]"
            style={{ color: cor, borderBottomColor: `${cor}73` }}
          >
            Ampliar o rótulo →
          </button>
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
    <Faixa id="cafes" className="py-12 sm:py-16">
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
