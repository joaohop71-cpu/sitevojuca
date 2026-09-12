import { useCallback, useEffect, useRef, useState } from "react";
import {
  cafePoente,
  capelaPoente,
  casaSitio,
  cerejaGota,
  cerejasSerra,
  jucaLavoura,
  lavouraMudas,
  linhasCafezal,
  paiEFilho,
  poente,
  varandaCoqueiros,
} from "@/imagens";

type Foto = { src: string; alt: string; legenda: string; ficha: string };

const FOTOS: Foto[] = [
  {
    src: varandaCoqueiros,
    alt: "Xícara de café na mão, vista da varanda: a bandeira do Brasil no beiral, dois coqueiros e as montanhas ao fundo",
    legenda: "Os dois coqueiros",
    ficha: "Da varanda, com os coqueiros que dão nome ao sítio",
  },
  {
    src: jucaLavoura,
    alt: "Tio Nando de chapéu, em pé na lavoura, junto a um pé de café carregado de frutos",
    legenda: "O tio Nando na lavoura",
    ficha: "Quem começou a plantação",
  },
  {
    src: linhasCafezal,
    alt: "Cafezais adultos em renques formados, com palha entre as linhas e as montanhas do Sul de Minas ao fundo",
    legenda: "Os renques formados",
    ficha: "Cafezal adulto, em produção",
  },
  {
    src: cerejasSerra,
    alt: "Ramo carregado de frutos maduros em primeiro plano, com a lavoura e as montanhas ao fundo",
    legenda: "Fruto maduro e paisagem",
    ficha: "A cereja no ponto, e a serra atrás",
  },
  {
    src: poente,
    alt: "Céu de fim de tarde em tons de rosa e laranja sobre as montanhas, visto da casa da propriedade",
    legenda: "O poente, visto da casa",
    ficha: "Fim de tarde na propriedade",
  },
  {
    src: cerejaGota,
    alt: "Gota de orvalho escorrendo de uma folha sobre frutos de café, dentro do talhão",
    legenda: "Dentro do talhão",
    ficha: "Orvalho, cedo da manhã",
  },
  {
    src: lavouraMudas,
    alt: "Mudas de café recém-plantadas à mão, em linhas curvas na terra vermelha, com os morros ao fundo",
    legenda: "O futuro da lavoura",
    ficha: "Plantio novo, feito à mão, muda por muda",
  },
  {
    src: cafePoente,
    alt: "Ramo de café em contraluz, com o sol se pondo atrás das montanhas do Sul de Minas",
    legenda: "A serra ao entardecer",
    ficha: "Fim de tarde sobre a lavoura",
  },
  {
    src: capelaPoente,
    alt: "Capela branca da família no alto do morro, entre palmeiras, com o sol se pondo atrás da serra",
    legenda: "A capela da família",
    ficha: "Construída pela família, no alto do morro",
  },
  {
    src: casaSitio,
    alt: "Casa da família no Sítio JR, entre palmeiras na encosta, com dois cavalos no pasto em primeiro plano",
    legenda: "A casa do Sítio JR",
    ficha: "Levantada à mão pelo meu avô e pela família",
  },
  {
    src: paiEFilho,
    alt: "João Henrique e o pai, junto à porteira do sítio, com as montanhas do Sul de Minas ao fundo",
    legenda: "Juca e seu pai",
    ficha: "Na porteira, de onde se vê a lavoura inteira",
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
  const caixa = useRef<HTMLDivElement>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
      /* aria-modal esconde o resto da página do leitor de tela, mas não do
         Tab: sem isto o foco sai por baixo do véu, para links que ninguém
         está vendo, e não há como voltar a fechar a foto pelo teclado. */
      if (e.key === "Tab") {
        const botoes = Array.from(
          caixa.current?.querySelectorAll<HTMLElement>("button") ?? []
        );
        if (!botoes.length) return;
        const primeiro = botoes[0];
        const ultimo = botoes[botoes.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    },
    [fechar, ir]
  );

  /* o foco entra na foto ao abrir e volta para a miniatura ao fechar */
  useEffect(() => {
    const devolver = document.activeElement as HTMLElement | null;
    caixa.current?.querySelector<HTMLElement>("button")?.focus();
    return () => devolver?.focus?.();
  }, []);

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
      ref={caixa}
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
          <span className="ficha num shrink-0 text-[14.5px] text-[#bda88d]">
            {String(i + 1).padStart(2, "0")} / {String(FOTOS.length).padStart(2, "0")}
          </span>
        </figcaption>
        <p className="ficha mt-1 w-full max-w-[640px] text-left text-[15px] text-[#bda88d]">
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
        <span className="ficha num text-[14.5px] text-[#75634f]">
          {String(FOTOS.length).padStart(2, "0")} imagens · toque para ampliar
        </span>
      </div>
      <p className="mt-3 max-w-[52ch] text-[#5c4635]">
        Fotos feitas no sítio, em Santa Rita do Sapucaí. Sem estúdio e sem cenário
        montado; é o que se vê de lá.
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
              <span className="ficha text-[15px] text-[#3a271b]">{f.legenda}</span>
              <span className="ficha num shrink-0 text-[13.5px] text-[#75634f]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
            <p className="ficha mt-0.5 text-[14px] leading-snug text-[#75634f]">{f.ficha}</p>
          </figure>
        ))}
      </div>

      {aberta !== null && (
        <Lightbox i={aberta} fechar={() => setAberta(null)} ir={ir} />
      )}
    </div>
  );
}
