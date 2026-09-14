import { useState } from "react";
import { Visor } from "./base";
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
  terreiroCerejas,
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
    src: terreiroCerejas,
    alt: "Terreiro coberto de frutos de café recém-colhidos, em vermelho, amarelo e verde, com a serra e o céu azul ao fundo",
    legenda: "O terreiro na safra",
    ficha: "A colheita do dia, espalhada para secar ao sol",
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

/* a moldura escura, as teclas, o foco e o arrasto vivem no <Visor>; aqui fica
   só o que é da foto: a imagem, a legenda e a ficha */
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
  return (
    <Visor rotulo={f.legenda} aoFechar={fechar} aoIr={ir}>
      <figure className="m-0 flex max-h-full flex-col items-center">
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
    </Visor>
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
        <span className="ficha num text-[14.5px] text-[#6f5b44]">
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
              <span className="ficha num shrink-0 text-[13.5px] text-[#6f5b44]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </figcaption>
            <p className="ficha mt-0.5 text-[14px] leading-snug text-[#6f5b44]">{f.ficha}</p>
          </figure>
        ))}
      </div>

      {aberta !== null && (
        <Lightbox i={aberta} fechar={() => setAberta(null)} ir={ir} />
      )}
    </div>
  );
}
