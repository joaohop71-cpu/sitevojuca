import { useState } from "react";
import { CAFES, TINTA_ROTULO, brl, porQuilo } from "@/dados";
import type { Cafe } from "@/dados";
import { Botao, Faixa, Rubrica, Selo, Visor } from "./base";

/** altura da arte vertical — as Heranças têm a linha do lote e ficam mais altas */
const ALTURA_VERTICAL: Record<string, number> = {
  vojuca: 1350,
  minassanta: 1350,
  herancas_2sl: 1446,
  herancas_24137: 1446,
};

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

/** os cinco quadradinhos de intensidade, na tinta da linha */
function Intensidade({ n, cor }: { n: number; cor: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="ficha text-[13px] uppercase tracking-[0.14em] text-[#75634f]">
        Intensidade
      </span>
      <span className="flex gap-[3px]" role="img" aria-label={`${n} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="block h-[9px] w-[9px]"
            style={{
              background: i <= n ? cor : "transparent",
              border: `1px solid ${i <= n ? cor : "rgba(58,39,27,0.3)"}`,
            }}
          />
        ))}
      </span>
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
    <div>
      <div className="ficha text-[13px] uppercase tracking-[0.16em] text-[#75634f]">
        {rotulo}
      </div>
      <div
        className="num mt-1 text-[24px] leading-none sm:text-[26px]"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
          fontWeight: 600,
        }}
      >
        {brl(valor)}
      </div>
      <div className="ficha num mt-1 text-[13.5px] text-[#75634f]">
        {porQuilo(valor, gramas)}/kg
      </div>
    </div>
  );
}

/**
 * O cartão de um café.
 *
 * Antes esta seção eram os quatro rótulos em tamanho cheio, um embaixo do
 * outro: 4,8 telas de celular para comparar quatro cafés, o que na prática
 * quer dizer que ninguém comparava. O cartão traz os mesmos campos, na mesma
 * ordem nos quatro, para o olho varrer de um para o outro; o rótulo continua
 * inteiro, a um clique.
 *
 * A estética é a do rótulo, mas composta em texto e não em imagem: a mesma
 * Fraunces, a mesma letra de máquina nas fichas e a tinta da linha. Texto
 * também alinha, se busca, muda de tamanho com a tela e não pesa download.
 */
function Cartao({ cafe, aoVerRotulo }: { cafe: Cafe; aoVerRotulo: () => void }) {
  const cor = TINTA_ROTULO[cafe.cor];
  const soMoido = cafe.preco.grao === null;

  return (
    <article
      id={cafe.id}
      className="reveal flex flex-col border border-[rgba(58,39,27,0.28)] p-6 sm:p-7"
      style={{ background: "rgba(255,250,240,0.5)", scrollMarginTop: 96 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className="ficha text-[13px] uppercase tracking-[0.16em]"
            style={{ color: cor }}
          >
            {cafe.tarja}
          </div>
          {/* o lote na mesma linha do nome, e não embaixo: numa grade de
              comparação, uma linha a mais num cartão desalinha todas as
              fichas dele em relação ao vizinho */}
          <h3
            className="mt-1.5 text-[clamp(25px,3.4vw,32px)] leading-none"
            style={{ color: cor }}
          >
            {cafe.nome}
            {cafe.lote && (
              <span className="ficha num ml-2.5 align-middle text-[15px] tracking-[0.16em] text-[#6b4526]">
                {cafe.lote}
              </span>
            )}
          </h3>
        </div>
        {/* o selo na tinta da linha: o sinal que diz de longe qual é qual.
            É aqui que entra o emblema próprio de cada linha, quando houver. */}
        <Selo cor={cor} className="h-11 w-11 shrink-0 opacity-90 sm:h-12 sm:w-12" />
      </div>

      <p
        className="mt-3 text-[16px] leading-snug text-[#6b4526]"
        style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
      >
        {cafe.chamada}
      </p>

      <div className="mt-5 border-t border-[rgba(58,39,27,0.22)] pt-4">
        <div className="ficha text-[14px] leading-snug text-[#3a271b]">
          {cafe.notas.join(" · ")}
        </div>
        <div className="mt-2.5">
          <Intensidade n={cafe.intensidade} cor={cor} />
        </div>
      </div>

      {/* a ficha técnica, nos mesmos seis campos e na mesma ordem nos quatro
          cartões: é o alinhamento que faz a comparação acontecer */}
      {/* duas colunas só quando há largura: a 390 px "PONTUAÇÃO SCA" e o valor
          ao lado se encavalavam no vizinho */}
      <dl className="mt-4 grid gap-x-5 gap-y-1.5 border-t border-[rgba(58,39,27,0.22)] pt-4 sm:grid-cols-2">
        {cafe.fichas.map((f) => (
          <div key={f.rotulo} className="flex items-baseline justify-between gap-2">
            <dt className="ficha text-[12.5px] uppercase tracking-[0.1em] text-[#75634f]">
              {f.rotulo}
            </dt>
            <dd className="ficha m-0 shrink-0 text-[13.5px] text-[#3a271b]">{f.valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t-2 border-[#3a271b] pt-4">
        <div className="ficha text-[13px] uppercase tracking-[0.14em] text-[#6b4526]">
          Pacote de {cafe.gramas} g · {cafe.formato}
        </div>
        <div className="mt-2.5 flex items-end gap-6">
          {!soMoido && (
            <Preco rotulo="Em grão" valor={cafe.preco.grao!} gramas={cafe.gramas} />
          )}
          <Preco rotulo="Moído" valor={cafe.preco.moido} gramas={cafe.gramas} />
        </div>
        {soMoido && (
          <div className="ficha mt-2 text-[13.5px] text-[#75634f]">
            Esta linha sai só moída.
          </div>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[#5c4635]">{cafe.descricao}</p>

      <div className="mt-5 flex flex-col gap-3 pt-1 sm:flex-row" data-print-hide>
        <Botao href="#precos" largo>
          Monte o seu pedido
        </Botao>
        <button
          type="button"
          onClick={aoVerRotulo}
          className="link-sublinhado ficha self-center text-[14px] uppercase tracking-[0.1em] sm:self-end sm:pb-3"
          style={{ color: cor, borderBottomColor: `${cor}73` }}
        >
          Ver o rótulo →
        </button>
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
          o quanto a xícara pede atenção. Os quatro estão lado a lado de propósito, para
          dar para comparar; o rótulo inteiro abre no clique.
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
