import { ETAPAS } from "@/dados";
import { Faixa, Rubrica } from "./base";

export default function Processo() {
  return (
    <Faixa id="processo" fundo="tinta" className="py-16 sm:py-24">
      <Rubrica num="05" claro>
        O processo
      </Rubrica>

      <div className="mt-6 max-w-[58ch]">
        <h2 className="text-[clamp(30px,4.4vw,52px)] text-[#f2e7d3]">
          Cinco etapas, todas dentro do sítio
        </h2>
        <p className="mt-4 text-[#c9b79c]">
          Nada sai da propriedade no meio do caminho. É isso que sustenta o padrão de um
          lote para o outro.
        </p>
      </div>

      <ol className="mt-12 grid gap-0 border-t border-[rgba(192,171,140,0.3)] sm:grid-cols-2 lg:grid-cols-5 lg:border-t-2">
        {ETAPAS.map((e, i) => (
          <li
            key={e.n}
            className="border-b border-[rgba(192,171,140,0.25)] py-6 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <div
              className="num text-[14px] tracking-[0.2em] text-[#8c3a20]"
              style={{ fontFamily: '"Courier Prime", monospace' }}
            >
              {e.n}
            </div>
            <h3 className="mt-3 text-[24px] text-[#f2e7d3]">{e.nome}</h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-[#bda88d]">{e.texto}</p>
            {i === ETAPAS.length - 1 && (
              <p className="ficha mt-4 text-[12.5px] leading-snug text-[#8c3a20]">
                É por isso que o pó chega mais fresco.
              </p>
            )}
          </li>
        ))}
      </ol>
    </Faixa>
  );
}
