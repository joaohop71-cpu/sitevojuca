import { useRef, useState } from "react";
import { jucaCavalo, jucaEstudio, jucaLinho, jucaRetratoSelo } from "@/imagens";
import { MARCA } from "@/dados";

type Retrato = {
  src: string;
  alt: string;
  legenda: string;
  nota: string;
  /** a etiqueta curta, o que se lê sem clicar */
  gancho: string;
  historia: string;
};

/**
 * A história do Juca morava num bloco de 277 palavras, e os retratos ficavam
 * ali do lado só ilustrando. Aqui ela passa a morar neles: cada retrato guarda
 * o pedaço que lhe pertence, e a pessoa descobre em vez de ler uma parede.
 */
const RETRATOS: Retrato[] = [
  {
    src: jucaEstudio,
    alt: "Retrato de estúdio do Juca jovem, de terno escuro e gravata-borboleta",
    legenda: "Retrato de estúdio. Avenida Photo, Rio de Janeiro.",
    nota: "sem data",
    gancho: "O nome que ninguém usava",
    historia: `Meu bisavô se chamava ${MARCA.fundador}. Ninguém o chamava assim: ele era o Juca Chaves. Filho de portugueses, nasceu em ${MARCA.local} em ${MARCA.fundadorNasc}.`,
  },
  {
    src: jucaLinho,
    alt: "Juca de pé, em terno de linho claro e chapéu de palha, em cenário de estúdio",
    legenda: "Terno de linho, chapéu de palha. Arthur Photo, Rio.",
    nota: "sem data",
    gancho: "A mala que ficou no trem",
    historia:
      "Os pais vieram de Portugal para construir alguma coisa aqui e chegaram quase sem nada: a mala com as joias e boa parte do patrimônio ficou para trás no trem. Começaram do zero.",
  },
  {
    src: jucaCavalo,
    alt: "Juca montado a cavalo na propriedade",
    legenda: "A cavalo, na propriedade.",
    nota: "sem data",
    gancho: "Onde entrou o café",
    historia: `O pai morreu cedo, num naufrágio, mas deu tempo de levantar o que a família precisava para seguir. O Juca foi além: juntou terra no ${MARCA.regiao} e plantou café.`,
  },
  {
    src: jucaRetratoSelo,
    alt: "Retrato do Juca já idoso, de terno e gravata, a foto que deu origem ao selo da marca",
    legenda: "Últimos anos. É deste retrato que veio o selo.",
    nota: "origem do logo",
    gancho: "O rosto que virou selo",
    historia:
      "A fortuna não atravessou a vida dele inteira, e minha avó, filha dele, cresceu bem e viveu com simplicidade. Este é o último retrato que temos, e é dele que saiu o desenho do selo que está no rótulo.",
  },
];

/** os retratos do bisavô, cada um com o seu pedaço da história */
export default function Arquivo() {
  const [aberta, setAberta] = useState<number | null>(null);
  /* O painel guarda o último retrato aberto mesmo depois de fechado: assim o
     texto não some no meio da animação de fechar, e com nada selecionado o
     que fica no HTML é história de verdade, não um par de colchetes vazios. */
  const ultimo = useRef(0);
  if (aberta !== null) ultimo.current = aberta;
  const atual = RETRATOS[aberta ?? ultimo.current];

  return (
    <div>
      <div className="reveal flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 className="text-[clamp(22px,3vw,30px)]">O que sobrou dele</h3>
        <span className="ficha num text-[14.5px] text-[#75634f]" data-print-hide>
          04 retratos · toque para ler
        </span>
      </div>

      {/* A tira rola para o lado e agora tem botões dentro, então o teclado
          chega nela sozinho; o tabIndex de antes saiu junto. */}
      <div className="reveal mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6">
        {RETRATOS.map((r, i) => {
          const ativo = aberta === i;
          return (
            <figure
              key={r.legenda}
              className="m-0 shrink-0 snap-start"
              style={{ width: "min(60vw, 212px)" }}
            >
              <button
                type="button"
                onClick={() => setAberta(ativo ? null : i)}
                aria-expanded={ativo}
                aria-controls="arquivo-historia"
                className="block w-full text-left transition-opacity"
                style={{ opacity: aberta === null || ativo ? 1 : 0.45 }}
              >
                {/* sem moldura: a foto escaneada já traz a própria borda
                    serrilhada, e a do site virava um segundo quadro em volta
                    do primeiro. A marca de seleção é o fio embaixo. */}
                {/* Os quatro escaneados têm proporções diferentes, e soltos
                    na tira cada rótulo caía numa altura. Assentados pelo pé
                    numa caixa de altura fixa, os fios e as etiquetas ficam na
                    mesma linha sem precisar recortar retrato nenhum. */}
                <span className="flex h-[clamp(190px,30vw,250px)] items-end justify-center">
                  <img
                    src={r.src}
                    alt={r.alt}
                    loading="lazy"
                    className="block max-h-full w-auto"
                    style={{ filter: ativo ? "sepia(0.14)" : "sepia(0.3) saturate(0.85)" }}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-[2px] w-full transition-colors duration-300"
                  style={{ background: ativo ? "#8c3a20" : "rgba(58,39,27,0.2)" }}
                />
                <span
                  className="ficha mt-2.5 block text-[14.5px] leading-snug transition-colors duration-300"
                  style={{ color: ativo ? "#8c3a20" : "#3a271b" }}
                >
                  {r.gancho}
                </span>
              </button>
            </figure>
          );
        })}
      </div>

      {/* um painel só, embaixo da tira: a foto escolhida conta o que sabe */}
      <div
        id="arquivo-historia"
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: aberta === null ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden" inert={aberta === null}>
          <div className="border-l-2 border-[#8c3a20] pl-5 pt-1 sm:pl-6">
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-[#5c4635]">
              {atual.historia}
            </p>
            <p className="ficha mt-3 text-[14px] leading-relaxed text-[#75634f]">
              {atual.legenda} <span className="opacity-65">[{atual.nota}]</span>
            </p>
          </div>
        </div>
      </div>

      <p className="ficha reveal mt-6 max-w-[58ch] text-[14px] leading-relaxed text-[#75634f]">
        As datas e legendas ainda estão sendo conferidas com a família.
      </p>
    </div>
  );
}
