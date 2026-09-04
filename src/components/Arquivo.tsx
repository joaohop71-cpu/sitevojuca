import { jucaCavalo, jucaEstudio, jucaLinho, jucaRetratoSelo } from "@/imagens";
import { MARCA } from "@/dados";

type Retrato = { src: string; alt: string; legenda: string; nota: string };

const RETRATOS: Retrato[] = [
  {
    src: jucaEstudio,
    alt: "Retrato de estúdio do Juca jovem, de terno escuro e gravata-borboleta",
    legenda: "Retrato de estúdio. Avenida Photo, Rio de Janeiro.",
    nota: "sem data",
  },
  {
    src: jucaLinho,
    alt: "Juca de pé, em terno de linho claro e chapéu de palha, em cenário de estúdio",
    legenda: "Terno de linho, chapéu de palha. Arthur Photo, Rio.",
    nota: "sem data",
  },
  {
    src: jucaCavalo,
    alt: "Juca montado a cavalo na propriedade",
    legenda: "A cavalo, na propriedade.",
    nota: "sem data",
  },
  {
    src: jucaRetratoSelo,
    alt: "Retrato do Juca já idoso, de terno e gravata — a foto que deu origem ao selo da marca",
    legenda: "Últimos anos. É deste retrato que veio o selo.",
    nota: "origem do logo",
  },
];

/** os retratos do bisavô — bloco dentro da seção "Sobre nós" */
export default function Arquivo() {
  return (
    <div>
      <div className="reveal flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 className="text-[clamp(22px,3vw,30px)]">O que sobrou dele</h3>
        <span className="ficha num text-[13px] text-[#8c7a66]">
          04 retratos · arraste para o lado
        </span>
      </div>

      <p className="reveal mt-3 max-w-[60ch] text-[#5c4635]">
        Ele plantou café em {MARCA.local}. Chamavam ele de Juca. O que ficou são estes
        retratos e as histórias de quem ainda lembra.
      </p>

      <div className="reveal mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6">
        {RETRATOS.map((r, i) => (
          <figure
            key={r.legenda}
            className="m-0 shrink-0 snap-start"
            style={{ width: "min(70vw, 240px)" }}
          >
            <div className="moldura p-2.5">
              <img
                src={r.src}
                alt={r.alt}
                loading="lazy"
                className="block w-full"
                style={{ filter: "sepia(0.14)" }}
              />
            </div>
            <figcaption className="ficha mt-3 text-[12.5px] leading-relaxed text-[#6b4526]">
              <span className="num text-[#8c3a20]">{String(i + 1).padStart(2, "0")}</span> —{" "}
              {r.legenda}
              <br />
              <span className="opacity-65">[{r.nota}]</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="ficha reveal mt-4 max-w-[58ch] text-[12.5px] leading-relaxed text-[#8c7a66]">
        As datas e legendas ainda estão sendo conferidas com a família.
      </p>
    </div>
  );
}
