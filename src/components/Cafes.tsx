import type { CSSProperties } from "react";
import { CAFES, brl, porQuilo } from "@/dados";
import type { Cafe } from "@/dados";
import { Botao, Faixa, Rubrica } from "./base";

/** altura da arte vertical — as Heranças têm a linha do lote e ficam mais altas */
const ALTURA_VERTICAL: Record<string, number> = {
  vojuca: 1350,
  minassanta: 1350,
  herancas_2sl: 1446,
  herancas_24137: 1446,
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
  const altura = ALTURA_VERTICAL[cafe.banner] ?? 1350;
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
    <div className="min-w-[124px]">
      <div className="ficha text-[13.5px] uppercase tracking-[0.16em] text-[#75634f]">
        {rotulo}
      </div>
      <div
        className="num mt-1 text-[26px] leading-none sm:text-[28px]"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
          fontWeight: 600,
        }}
      >
        {brl(valor)}
      </div>
      <div className="ficha num mt-1 text-[14px] text-[#75634f]">
        {porQuilo(valor, gramas)}/kg
      </div>
    </div>
  );
}

/**
 * A faixa de compra, logo abaixo do rótulo.
 *
 * O preço aparecia um de cada vez, conforme um seletor "Preços em grão / moído"
 * que ficava lá em cima, longe. Quem chegava rolando num café via um número só
 * e não tinha como saber que ele mudava conforme a moagem. Agora os dois estão
 * lado a lado: a diferença é a informação, então ela tem que estar visível, e
 * o seletor sai porque deixou de ter função.
 */
function Compra({ cafe }: { cafe: Cafe }) {
  const soMoido = cafe.preco.grao === null;

  return (
    <div className="mt-5 flex flex-col items-center gap-5 text-center">
      <p className="max-w-[54ch] text-[15.5px] text-[#5c4635]">{cafe.descricao}</p>

      <div className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:items-end sm:gap-8">
        <div>
          <div className="ficha text-[13.5px] uppercase tracking-[0.14em] text-[#6b4526]">
            Pacote de {cafe.gramas} g
          </div>
          <div className="mt-2.5 flex items-end justify-center divide-x divide-[rgba(58,39,27,0.22)]">
            {!soMoido && (
              <div className="pr-6">
                <Preco rotulo="Em grão" valor={cafe.preco.grao!} gramas={cafe.gramas} />
              </div>
            )}
            <div className={soMoido ? "" : "pl-6"}>
              <Preco rotulo="Moído" valor={cafe.preco.moido} gramas={cafe.gramas} />
            </div>
          </div>
          {soMoido && (
            <div className="ficha mt-2 text-[14px] text-[#75634f]">
              Esta linha sai só moída.
            </div>
          )}
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
  return (
    <Faixa id="cafes" className="py-12 sm:py-16">
      <Rubrica>Os cafés</Rubrica>

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
      </div>

      <div className="mt-10 grid gap-12 sm:gap-14">
        {CAFES.map((c) => (
          <article key={c.id} id={c.id} className="reveal" style={{ scrollMarginTop: 96 }}>
            <RotuloImagem cafe={c} />
            <Compra cafe={c} />
          </article>
        ))}
      </div>
    </Faixa>
  );
}
