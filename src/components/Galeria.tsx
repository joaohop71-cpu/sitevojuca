import { useCallback, useEffect, useRef, useState } from "react";
import {
  cerejaDetalhe,
  cerejas,
  jucaLavoura,
  montanhas,
  poente,
  talhoes,
  varanda,
} from "@/imagens";

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
  const toqueX = useRef<number | null>(null);

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(30,20,14,0.94)" }}
      onClick={fechar}
      data-print-hide
    >
      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center border border-[rgba(239,227,204,0.4)] text-[24px] leading-none text-[#efe3cc] transition-colors hover:bg-[rgba(239,227,204,0.14)] sm:right-5 sm:top-5 sm:h-11 sm:w-11 sm:text-[22px]"
      >
        ×
      </button>

      <figure
        className="m-0 flex max-h-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          toqueX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (toqueX.current === null) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
          toqueX.current = null;
        }}
      >
        <img
          src={f.src}
          alt={f.alt}
          className="max-h-[64vh] w-auto border border-[rgba(239,227,204,0.25)] object-contain sm:max-h-[74vh]"
        />
        <figcaption className="mt-4 flex w-full max-w-[640px] items-baseline justify-between gap-4">
          <span
            className="text-[18px] text-[#efe3cc] sm:text-[19px]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
          >
            {f.legenda}
          </span>
          <span className="ficha num shrink-0 text-[13px] text-[#bda88d]">
            {String(i + 1).padStart(2, "0")} / {String(FOTOS.length).padStart(2, "0")}
          </span>
        </figcaption>
        <p className="ficha mt-1 w-full max-w-[640px] text-left text-[13.5px] text-[#bda88d]">
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
            className="flex h-12 w-16 items-center justify-center border border-[rgba(239,227,204,0.4)] text-[18px] text-[#efe3cc] transition-colors hover:bg-[rgba(239,227,204,0.14)] sm:h-11 sm:w-14"
          >
            {b.s}
          </button>
        ))}
      </div>
    </div>
  );
}

/** bloco de fotos — usado dentro da seção "Sobre nós" */
export default function Galeria() {
  const [aberta, setAberta] = useState<number | null>(null);
  const ir = (d: number) =>
    setAberta((a) => (a === null ? null : (a + d + FOTOS.length) % FOTOS.length));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 className="text-[clamp(22px,3vw,30px)]">A propriedade, sem produção</h3>
        <span className="ficha num text-[13px] text-[#8c7a66]">
          {String(FOTOS.length).padStart(2, "0")} imagens · toque para ampliar
        </span>
      </div>
      <p className="mt-3 max-w-[52ch] text-[#5c4635]">
        Fotos feitas na própria lavoura, em Santa Rita do Sapucaí. Sem estúdio, sem xícara
        arrumada — é o que se vê de lá.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
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
                loading="lazy"
                className="foto w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                style={{ aspectRatio: "4 / 5" }}
              />
            </button>
            <figcaption className="mt-2 flex items-baseline justify-between gap-3">
              <span className="ficha text-[13.5px] text-[#3a271b]">{f.legenda}</span>
              <span className="ficha num shrink-0 text-[12px] text-[#8c7a66]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
            <p className="ficha mt-0.5 text-[12.5px] leading-snug text-[#8c7a66]">{f.ficha}</p>
          </figure>
        ))}
      </div>

      {aberta !== null && (
        <Lightbox i={aberta} fechar={() => setAberta(null)} ir={ir} />
      )}
    </div>
  );
}
