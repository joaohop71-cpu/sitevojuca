import { useState } from "react";
import { CAFES, MARCA, TINTA_ROTULO, brl, porQuilo } from "@/dados";
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

/** as marcas de corte nos quatro cantos, como na prova de impressão */
function Cantos({ cor }: { cor: string }) {
  const lados = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];
  return (
    <>
      {lados.map((l) => (
        <span
          key={l}
          aria-hidden="true"
          className={`pointer-events-none absolute h-3 w-3 ${l}`}
          style={{ borderColor: cor }}
        />
      ))}
    </>
  );
}

/** os cinco quadradinhos de intensidade, na tinta da linha */
function Intensidade({ n, cor }: { n: number; cor: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span className="ficha text-[12.5px] uppercase tracking-[0.16em] text-[#75634f]">
        Intensidade
      </span>
      <span className="flex gap-[3px]" role="img" aria-label={`${n} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="block h-[9px] w-[9px] rotate-45"
            style={{
              background: i <= n ? cor : "transparent",
              border: `1px solid ${i <= n ? cor : "rgba(58,39,27,0.35)"}`,
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
 * O cartão de um café, desenhado como o rótulo e não como ficha de loja.
 *
 * A primeira versão disto era uma tabela alinhada à esquerda: comparava bem e
 * não parecia nada. O que faz o rótulo ser o rótulo não é a informação, é a
 * composição, e ela dá para reproduzir em texto vivo: a moldura com as marcas
 * de corte, a tarja e a safra na cabeça, as linhas de qualificação em caixa
 * alta, o brasão centrado, o nome grande, a chamada em itálico, os fios com
 * losango e a ficha com os pontinhos levando o olho até o valor.
 *
 * Composto assim ele continua sendo texto: alinha entre um cartão e outro,
 * muda de tamanho com a tela, se busca e não pesa download. O rótulo impresso
 * continua inteiro, a um clique.
 */
function Cartao({ cafe, aoVerRotulo }: { cafe: Cafe; aoVerRotulo: () => void }) {
  const cor = TINTA_ROTULO[cafe.cor];
  const soMoido = cafe.preco.grao === null;

  return (
    <article
      id={cafe.id}
      className="reveal relative flex flex-col p-3 sm:p-5"
      style={{ background: "rgba(255,250,240,0.55)", scrollMarginTop: 96 }}
    >
      <Cantos cor={cor} />

      {/* a moldura de dentro, como a que é impressa no papel */}
      <div
        className="flex flex-1 flex-col px-4 py-5 text-center sm:px-7 sm:py-7"
        style={{ border: `1px solid ${cor}59` }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="ficha num text-[11.5px] uppercase tracking-[0.16em] text-[#75634f]">
            Safra {MARCA.safra}
          </span>
          <span
            className="ficha text-[11.5px] uppercase tracking-[0.16em]"
            style={{ color: cor }}
          >
            {cafe.tarja}
          </span>
        </div>

        <div className="mt-4 space-y-1 sm:mt-5">
          {cafe.qualificacao.map((q) => (
            <div
              key={q}
              className="ficha text-[12.5px] uppercase leading-snug tracking-[0.14em] text-[#6b4526]"
            >
              {q}
            </div>
          ))}
        </div>

        {/* o brasão, na tinta da linha. É aqui que entra o emblema próprio de
            cada café, quando houver: o lugar já está reservado e centrado. */}
        <Selo
          cor={cor}
          className="mx-auto mt-4 h-[68px] w-[68px] sm:mt-5 sm:h-[96px] sm:w-[96px]"
        />

        <h3
          className="mt-4 text-[clamp(27px,4.6vw,42px)] uppercase leading-[0.95] sm:mt-5"
          style={{ color: cor, letterSpacing: "0.01em" }}
        >
          {cafe.nome}
        </h3>
        {/* Rótulo impresso se compõe numa grade fixa, e é isso que faz dois
            deles lado a lado parecerem irmãos. Aqui a linha do lote e a da
            chamada guardam o lugar mesmo quando têm menos texto: sem isso, o
            cartão sem lote sobe cinquenta pixels e nenhuma ficha bate com a
            do vizinho. */}
        <div
          className="ficha num mt-2 text-[15px] tracking-[0.4em]"
          style={{ color: cor }}
        >
          {cafe.lote ?? "\u00a0"}
        </div>

        <p
          className="mx-auto mt-3 flex max-w-[30ch] items-start justify-center text-[16.5px] leading-snug text-[#6b4526]"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            minHeight: "2.75em",
          }}
        >
          {cafe.chamada}
        </p>

        <div className="mt-5 sm:mt-6">
          <FioLosango cor={cor} />
        </div>

        <div className="ficha mt-4 text-[14px] uppercase leading-snug tracking-[0.1em] text-[#3a271b]">
          {cafe.notas.join(" · ")}
        </div>
        <div className="mt-3">
          <Intensidade n={cafe.intensidade} cor={cor} />
        </div>

        <div className="mt-4">
          <FioLosango cor={cor} />
        </div>

        {/* a ficha com os pontinhos levando o rótulo até o valor, como no papel;
            os mesmos seis campos na mesma ordem nos quatro cartões, que é o que
            deixa comparar um com o outro */}
        <dl className="mt-4 grid gap-x-7 gap-y-1 text-left sm:grid-cols-2">
          {cafe.fichas.map((f) => (
            <div key={f.rotulo} className="flex items-baseline gap-1.5">
              <dt className="ficha shrink-0 text-[12px] uppercase tracking-[0.1em] text-[#75634f]">
                {f.rotulo}
              </dt>
              <span
                aria-hidden="true"
                className="mb-[3px] flex-1 border-b border-dotted"
                style={{ borderColor: "rgba(58,39,27,0.35)" }}
              />
              <dd className="ficha m-0 shrink-0 text-[13px] text-[#3a271b]">{f.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-5 sm:pt-6">
          <div
            className="ficha text-[12px] uppercase tracking-[0.16em]"
            style={{ color: cor }}
          >
            {cafe.gramas} g · {cafe.formato}
          </div>
          <div
            className="mt-3 flex items-end justify-center gap-7 border-y py-3.5 sm:py-4"
            style={{ borderColor: `${cor}40` }}
          >
            {!soMoido && (
              <Preco rotulo="Em grão" valor={cafe.preco.grao!} gramas={cafe.gramas} />
            )}
            <Preco rotulo="Moído" valor={cafe.preco.moido} gramas={cafe.gramas} />
          </div>
          {soMoido && (
            <div className="ficha mt-2 text-[13px] text-[#75634f]">
              Esta linha sai só moída.
            </div>
          )}

          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[#5c4635] sm:mt-5">
            {cafe.descricao}
          </p>

          <div
            className="mt-4 flex flex-col items-center gap-3.5 sm:mt-5 sm:flex-row sm:justify-center sm:gap-5"
            data-print-hide
          >
            <Botao href="#precos" largo>
              Monte o seu pedido
            </Botao>
            <button
              type="button"
              onClick={aoVerRotulo}
              className="link-sublinhado ficha text-[14px] uppercase tracking-[0.1em]"
              style={{ color: cor, borderBottomColor: `${cor}73` }}
            >
              Ver o rótulo impresso →
            </button>
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
