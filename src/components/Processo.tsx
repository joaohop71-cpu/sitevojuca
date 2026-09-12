import { useEffect, useRef, useState } from "react";
import { ETAPAS } from "@/dados";
import {
  processoColheita,
  processoMoagem,
  processoSecagem,
  processoSelecao,
  processoTorra,
} from "@/imagens";
import { Faixa, Rubrica } from "./base";

/* uma prancha por etapa, na ordem em que o café passa por elas */
const PRANCHAS = [
  { src: processoColheita, alt: "Homem de chapéu colhendo os frutos maduros direto no pé de café" },
  { src: processoSecagem, alt: "Homem rastelando o café espalhado no terreiro, com a serra ao fundo" },
  { src: processoSelecao, alt: "Duas mãos peneirando os grãos numa bandeja de furos" },
  { src: processoTorra, alt: "Torrador em funcionamento, com a fumaça saindo e os grãos caindo no resfriador" },
  { src: processoMoagem, alt: "Moinho de manivela moendo os grãos, com o pó caindo na tigela" },
];

/**
 * O palco fica preso na tela enquanto as etapas passam ao lado (ou por baixo,
 * no celular). A prancha troca conforme a etapa que está sendo lida, de modo
 * que o processo se desenrola sozinho à medida que a pessoa rola a página.
 *
 * A etapa ativa sai de uma conta simples de posição, e não de um
 * IntersectionObserver: são cinco elementos, a medição é barata, e assim o
 * estado fica certo também quando a página abre já rolada.
 */
/* O verde das folhas do ramo, medido nelas.
   A arte aqui aparece clareada por filtro (as folhas verdes contra o marrom
   quase sumiam), entao a medicao foi feita na imagem ja filtrada: o verde
   percorre de #666f35 na sombra a #c4ce7d na folha batida de luz. Este e' o
   tom do percentil 85, o mais claro que ainda e' folha e nao brilho, e o
   unico da faixa que da contraste de 5:1 com o marrom da secao. */
const OLIVA = "#8b954c";

export default function Processo() {
  const [ativa, setAtiva] = useState(0);
  const etapas = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const medir = () => {
      /* a linha de leitura: no celular o palco ocupa o alto da tela, então ela
         desce; no desktop as etapas correm ao lado, e ela fica no meio */
      const linha = window.innerWidth >= 1024 ? innerHeight * 0.45 : innerHeight * 0.74;
      let melhor = 0;
      let menor = Infinity;
      etapas.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - linha);
        if (d < menor) {
          menor = d;
          melhor = i;
        }
      });
      setAtiva(melhor);
    };
    medir();
    addEventListener("scroll", medir, { passive: true });
    addEventListener("resize", medir);
    return () => {
      removeEventListener("scroll", medir);
      removeEventListener("resize", medir);
    };
  }, []);

  return (
    /* atras = o creme dos vizinhos (Preços em cima, Sobre embaixo): é a cor
       que aparece na falha do rasgo, para a emenda passar direto de um tom
       para o outro em vez de deixar o papel do corpo aparecer no meio */
    <Faixa
      id="processo"
      fundo="tinta"
      atras="#f6eede"
      className="rasgo-ambos py-16 sm:py-20"
    >
      <Rubrica claro>O processo</Rubrica>

      <div className="reveal mt-6 max-w-[58ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)] text-[#f2e7d3]">
          Cinco etapas, todas dentro do sítio
        </h2>
        <p className="mt-4 text-[#c9b79c]">
          Nada sai da propriedade no meio do caminho. É isso que sustenta o padrão de um
          lote para o outro.
        </p>
      </div>

      <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-14">
        {/* o palco: preso no alto no celular, preso ao lado no desktop */}
        <div
          className="palco-fixo sticky top-[72px] z-10 -mx-4 bg-[#2c1d14] px-4 pb-3 pt-3 sm:top-[76px] sm:-mx-5 sm:px-5 lg:top-[13vh] lg:mx-0 lg:self-start lg:px-0 lg:pb-0"
          data-print-hide
        >
          <div className="caixa-prancha relative aspect-[3/2]">
            {PRANCHAS.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                width={1100}
                height={733}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-700 ease-out"
                style={{
                  opacity: i === ativa ? 1 : 0,
                  transform: i === ativa ? "scale(1)" : "scale(0.975)",
                }}
              />
            ))}
          </div>

          {/* a trilha das cinco etapas, que também navega */}
          <div className="mt-3 flex gap-1.5 sm:gap-2 lg:mt-6">
            {ETAPAS.map((e, i) => (
              <button
                key={e.n}
                type="button"
                onClick={() =>
                  etapas.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                aria-current={i === ativa ? "step" : undefined}
                aria-label={`Ir para a etapa ${e.n}, ${e.nome}`}
                className="group flex-1 pb-1 pt-2 text-left transition-opacity"
                style={{ opacity: i === ativa ? 1 : 0.42 }}
              >
                <span
                  className="block h-px w-full transition-colors duration-500"
                  style={{ background: i === ativa ? "#c98a5e" : "rgba(192,171,140,0.45)" }}
                />
                <span
                  className="num mt-2 block text-[13px] tracking-[0.16em] transition-colors duration-500 sm:text-[14px]"
                  style={{
                    fontFamily: '"Courier Prime", monospace',
                    color: i === ativa ? OLIVA : "#c0ab8c",
                  }}
                >
                  {e.n}
                </span>
                <span
                  className="ficha mt-0.5 hidden text-[14px] text-[#c9b79c] sm:block"
                  aria-hidden="true"
                >
                  {e.nome}
                </span>
              </button>
            ))}
          </div>

          {/* no celular o texto passa por baixo do palco; esta sombra evita o corte seco */}
          <div
            className="pointer-events-none absolute inset-x-0 top-full h-8 lg:hidden"
            style={{
              background: "linear-gradient(180deg, #2c1d14 0%, rgba(44,29,20,0) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* as etapas, uma por vez sob a leitura */}
        <ol className="mt-2 lg:mt-0">
          {ETAPAS.map((e, i) => (
            <li
              key={e.n}
              ref={(el) => {
                etapas.current[i] = el;
              }}
              className="flex min-h-[52vh] flex-col justify-center py-8 lg:min-h-[74vh] lg:py-0"
            >
              {/* a mesma arte do palco, servida no fluxo quando ele nao cabe.
                  E o mesmo arquivo, entao nao custa download nenhum a mais. */}
              <img
                src={PRANCHAS[i].src}
                alt={PRANCHAS[i].alt}
                width={1100}
                height={733}
                loading="lazy"
                decoding="async"
                className="prancha-inline mb-6 w-full"
              />
              <div
                className="etapa-corpo transition-opacity duration-500"
                style={{ opacity: i === ativa ? 1 : 0.38 }}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="num text-[clamp(44px,8vw,86px)] leading-none transition-colors duration-500"
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontVariationSettings: '"SOFT" 15, "opsz" 96',
                      fontWeight: 600,
                      color: i === ativa ? OLIVA : "#5c6440",
                    }}
                  >
                    {e.n}
                  </span>
                  <span className="ficha text-[13.5px] uppercase tracking-[0.18em] text-[#8c7a66]">
                    de 05
                  </span>
                </div>

                <h3 className="mt-3 text-[clamp(28px,4vw,44px)] text-[#f2e7d3]">{e.nome}</h3>
                <p
                  className="mt-1.5 text-[clamp(17px,2.2vw,22px)] leading-snug"
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "#c9a678",
                  }}
                >
                  {e.chamada}
                </p>
                <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-[#c9b79c]">
                  {e.texto}
                </p>
                {/* a frase que fica, para quem só passa o olho */}
                <p className="ficha mt-5 flex max-w-[42ch] items-start gap-2.5 text-[14.5px] leading-snug text-[#e8b98d]">
                  <span
                    aria-hidden="true"
                    className="mt-[11px] inline-block h-px w-4 shrink-0"
                    style={{ background: "#c98a5e" }}
                  />
                  {e.resumo}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Faixa>
  );
}
