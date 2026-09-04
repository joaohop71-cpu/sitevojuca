import { Faixa, Rubrica } from "./base";
import Galeria from "./Galeria";
import { MARCA } from "@/dados";

const MARCOS = [
  {
    ano: "1887",
    titulo: "Nasce José Palma Chaves",
    texto:
      "Filho de portugueses, nasce em Santa Rita do Sapucaí no dia 27 de dezembro. A vida toda seria conhecido por outro nome: Juca Chaves.",
  },
  {
    ano: "Início do séc. XX",
    titulo: "Os primeiros pés de café",
    texto:
      "Ainda jovem, o Juca planta café nos Sítios Dois Coqueiros e JR. É a lavoura que segue na família até hoje.",
  },
  {
    ano: "1976",
    titulo: "O apelido se apaga",
    texto:
      "Ele morre em Santa Rita do Sapucaí, aos 88 anos. O café continua. O apelido, não — atravessa três gerações sem aparecer.",
  },
  {
    ano: "2002",
    titulo: "Nasce João Henrique",
    texto:
      "O bisneto nasce 115 anos depois do bisavô. Ninguém na família o chama de Juca.",
  },
  {
    ano: "Hoje",
    titulo: "O apelido volta sozinho",
    texto:
      "Os amigos apelidam João Henrique de Juca — sem saber do bisavô, sem nenhuma relação com a lavoura. A coincidência virou o nome desta marca.",
  },
];

export default function Sobre() {
  return (
    <Faixa id="sobre" fundo="creme" className="py-16 sm:py-24">
      <Rubrica num="02">Sobre nós</Rubrica>

      <h2 className="reveal mt-6 max-w-[16ch] text-[clamp(32px,5vw,58px)]">
        Juca era o apelido do meu bisavô.{" "}
        <em className="block" style={{ fontStyle: "italic", color: "#6b4526" }}>
          115 anos depois, virou o meu.
        </em>
      </h2>

      <p className="reveal mt-7 max-w-[48ch] text-[17px] text-[#6b4526]">
        Por força do destino, e sem ninguém planejar — e com o apelido veio também a
        paixão pelo café.
      </p>

      <div className="reveal mt-10 grid gap-x-16 gap-y-4 lg:grid-cols-2">
        <p className="text-[17px] text-[#5c4635]">
          Meu bisavô se chamava{" "}
          <strong className="font-semibold text-[#3a271b]">{MARCA.fundador}</strong>, mas
          ninguém o chamava assim. Ele era o Juca Chaves — filho de portugueses, nascido em{" "}
          {MARCA.local} em 1887, e o primeiro da família a plantar café nos{" "}
          {MARCA.sitio}. Morreu em 1976, na mesma cidade onde nasceu.
        </p>
        <p className="text-[17px] text-[#5c4635]">
          Nasci em 2002. Em algum momento meus amigos começaram a me chamar de Juca — sem
          saber que existiu um Juca antes de mim, e sem nenhuma ligação com café. Levei
          anos para achar graça na coincidência. Este projeto é o que fiz com ela: o mesmo
          apelido e o mesmo café, quatro gerações depois.
        </p>
      </div>

      {/* linha do tempo do apelido */}
      <ol className="reveal mt-14 grid gap-0 border-t-2 border-[#3a271b] sm:grid-cols-2 lg:grid-cols-5">
        {MARCOS.map((m) => (
          <li
            key={m.ano}
            className="border-b border-[rgba(58,39,27,0.2)] py-6 sm:border-r sm:pr-5 sm:last:border-r-0 lg:border-b-0"
          >
            <div
              className="text-[15px] tracking-[0.14em] text-[#8c3a20]"
              style={{ fontFamily: '"Courier Prime", monospace' }}
            >
              {m.ano.toUpperCase()}
            </div>
            <h3 className="mt-2.5 text-[19px] leading-tight">{m.titulo}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5c4635]">{m.texto}</p>
          </li>
        ))}
      </ol>

      <p className="ficha mt-8 max-w-[60ch] text-[13.5px] leading-relaxed text-[#8c7a66]">
        Ainda estou levantando as histórias das gerações do meio — as safras, as mudanças,
        o que se perdeu e o que ficou. Elas entram aqui conforme eu apurar.
      </p>

      <div className="mt-14">
        <img
          src="/img/ramo-cafe.webp"
          alt=""
          aria-hidden="true"
          width={1000}
          height={227}
          loading="lazy"
          className="mx-auto w-[min(100%,380px)]"
        />
      </div>

      <div id="fotos" className="reveal mt-14" style={{ scrollMarginTop: 84 }}>
        <Galeria />
      </div>
    </Faixa>
  );
}
