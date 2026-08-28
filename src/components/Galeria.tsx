import { useCallback, useEffect, useState } from "react";
import {
  cerejaDetalhe,
  cerejas,
  jucaLavoura,
  montanhas,
  poente,
  talhoes,
  varanda,
} from "@/imagens";
import { Faixa, Rubrica } from "./base";

type Foto = { src: string; alt: string; legenda: string; ficha: string };

const FOTOS: Foto[] = [
  {
    src: jucaLavoura,
    alt: "Homem de chapéu em pé no meio de um pé de café carregado de frutos",
    legenda: "Na colheita",
    ficha: "Pé carregado, fruto no ponto",
  },
  {
    src: talhoes,
    alt: "Linhas de café recém-plantadas descendo a encosta em terra vermelha",
    legenda: "Os talhões na encosta",
    ficha: "Plantio novo, terra vermelha",
  },
  {
    src: cerejas,
    alt: "Cacho de cerejas de café maduras entre as folhas",
    legenda: "Cerejas maduras",
    ficha: "O ponto da colheita",
  },
  {
    src: montanhas,
    alt: "Lavoura de café adulta com as montanhas do Sul de Minas ao fundo",
    legenda: "A lavoura e a serra",
    ficha: "Café adulto, 830 m",
  },
  {
    src: poente,
    alt: "Céu de fim de tarde em tons de rosa e laranja sobre as montanhas",
    legenda: "O poente da sede",
    ficha: "Fim de tarde na propriedade",
  },
  {
    src: varanda,
    alt: "Vista da varanda da sede, com palmeiras, cerca de madeira e a serra ao fundo",
    legenda: "A vista da varanda",
    ficha: "Onde se toma o café",
  },
  {
    src: cerejaDetalhe,
    alt: "Detalhe aproximado dos frutos vermelhos agarrados ao ramo",
    legenda: "O fruto de perto",
    ficha: "Detalhe do ramo",
  },
];

function Lightbox({
  i,
  fechar,
  ir,
}: {
  i: number;
  fechar: () => void;
  ir: (d: number) => void;
}) {
  const f = FOTOS[i];

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    },
    [fechar, ir]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [onKey]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={f.legenda}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-5 sm:p-10"
      style={{ background: "rgba(30,20,14,0.94)" }}
      onClick={fechar}
      data-print-hide
    >
      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-[rgba(239,227,204,0.4)] text-[22px] leading-none text-[#efe3cc] transition-colors hover:bg-[rgba(239,227,204,0.14)]"
      >
        ×
      </button>

      <figure className="m-0 flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={f.src}
          alt={f.alt}
          className="max-h-[74vh] w-auto border border-[rgba(239,227,204,0.25)] object-contain"
        />
        <figcaption className="mt-4 flex w-full max-w-[640px] items-baseline justify-between gap-4">
          <span
            className="text-[19px] text-[#efe3cc]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
          >
            {f.legenda}
          </span>
          <span className="ficha num shrink-0 text-[12px] text-[#bda88d]">
            {String(i + 1).padStart(2, "0")} / {String(FOTOS.length).padStart(2, "0")}
          </span>
        </figcaption>
        <p className="ficha mt-1 w-full max-w-[640px] text-left text-[12.5px] text-[#bda88d]">
          {f.ficha}
        </p>
      </figure>

      <div className="mt-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
        {[
          { d: -1, r: "Anterior", s: "←" },
          { d: 1, r: "Próxima", s: "→" },
        ].map((b) => (
          <button
            key={b.r}
            type="button"
            onClick={() => ir(b.d)}
            aria-label={b.r}
            className="flex h-11 w-14 items-center justify-center border border-[rgba(239,227,204,0.4)] text-[18px] text-[#efe3cc] transition-colors hover:bg-[rgba(239,227,204,0.14)]"
          >
            {b.s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Galeria() {
  const [aberta, setAberta] = useState<number | null>(null);
  const ir = (d: number) =>
    setAberta((a) => (a === null ? null : (a + d + FOTOS.length) % FOTOS.length));

  return (
    <Faixa id="fotos" fundo="creme" className="py-16 sm:py-24">
      <Rubrica num="06">As fotos</Rubrica>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[52ch]">
          <h2 className="text-[clamp(30px,4.4vw,52px)]">A propriedade, sem produção</h2>
          <p className="mt-4 text-[#5c4635]">
            Fotos feitas na própria lavoura, em Santa Rita do Sapucaí. Sem estúdio, sem
            xícara arrumada — é o que se vê de lá.
          </p>
        </div>
        <span className="ficha num text-[12px] text-[#8c7a66]">
          {String(FOTOS.length).padStart(2, "0")} imagens · clique para ampliar
        </span>
      </div>

      {/* grade uniforme: evita colunas desbalanceadas do mosaico anterior */}
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {FOTOS.map((f, i) => (
          <figure key={f.legenda} className="m-0">
            <button
              type="button"
              onClick={() => setAberta(i)}
              className="group block w-full overflow-hidden border border-[rgba(58,39,27,0.22)] p-1.5 text-left transition-colors hover:border-[#8c3a20]"
              aria-label={`Ampliar: ${f.legenda}`}
            >
              <img
                src={f.src}
                alt={f.alt}
                className="foto w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                style={{ aspectRatio: "4 / 5" }}
              />
            </button>
            <figcaption className="mt-2 flex items-baseline justify-between gap-3">
              <span className="ficha text-[12.5px] text-[#3a271b]">{f.legenda}</span>
              <span className="ficha num shrink-0 text-[11px] text-[#8c7a66]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
            <p className="ficha mt-0.5 text-[11.5px] leading-snug text-[#8c7a66]">{f.ficha}</p>
          </figure>
        ))}
      </div>

      {aberta !== null && (
        <Lightbox i={aberta} fechar={() => setAberta(null)} ir={ir} />
      )}
    </Faixa>
  );
}
