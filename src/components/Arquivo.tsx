import { jucaCavalo, jucaEstudio, jucaLinho, jucaRetratoSelo } from "@/imagens";
import { Faixa, Rubrica } from "./base";
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

export default function Arquivo() {
  return (
    <Faixa id="arquivo" fundo="creme" className="py-16 sm:py-24">
      <Rubrica num="03">O arquivo</Rubrica>

      <div className="mt-6 grid gap-x-16 gap-y-6 lg:grid-cols-[0.5fr_1fr]">
        <h2 className="reveal text-[clamp(28px,4vw,44px)]">O que sobrou dele</h2>

        <div className="reveal max-w-[60ch]">
          <p className="text-[17px] text-[#5c4635]">
            Ele plantou café em {MARCA.local}. Chamavam ele de Juca. O apelido atravessou a
            família e caiu em mim três gerações depois — a única coisa desta marca que não
            foi decidida numa reunião.
          </p>
          <p className="mt-5 text-[17px] text-[#6b4526]">
            O que ficou dele são estes retratos e as histórias de quem ainda lembra.
          </p>
        </div>
      </div>

      <div className="reveal mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6">
        {RETRATOS.map((r, i) => (
          <figure
            key={r.legenda}
            className="m-0 shrink-0 snap-start"
            style={{ width: "min(74vw, 250px)" }}
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
              <span className="num text-[#8c3a20]">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              — {r.legenda}
              <br />
              <span className="opacity-65">[{r.nota}]</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="ficha reveal mt-6 max-w-[58ch] text-[12.5px] leading-relaxed text-[#8c7a66]">
        Arraste para o lado para ver os quatro. As datas e legendas ainda estão sendo
        conferidas com a família.
      </p>
    </Faixa>
  );
}
