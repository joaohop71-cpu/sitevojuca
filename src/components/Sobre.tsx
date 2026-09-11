import type { ReactNode } from "react";
import { Faixa, RamoEmenda, Rubrica } from "./base";
import Galeria from "./Galeria";
import Arquivo from "./Arquivo";
import { DUPLA, MARCA, MARCOS } from "@/dados";

/**
 * A história em três capítulos.
 *
 * Num site ninguém lê parágrafo longo, então a seção foi montada para ser lida
 * em dois níveis: quem só passa o olho pega as três frases grandes e sai com a
 * história inteira; quem se interessa desce para o texto miúdo. Por isso cada
 * capítulo abre com uma afirmação em corpo grande, e o corpo vem em blocos
 * curtos embaixo.
 */
function Capitulo({
  num,
  nome,
  frase,
  children,
}: {
  num: string;
  nome: string;
  frase: string;
  children: ReactNode;
}) {
  return (
    <section className="reveal mt-16 border-t-2 border-[#3a271b] pt-7 sm:mt-20">
      <div className="eyebrow">
        Capítulo {num} · {nome}
      </div>
      <h3 className="mt-4 max-w-[20ch] text-[clamp(28px,4.6vw,48px)] leading-[1.05]">
        {frase}
      </h3>
      <div className="mt-7">{children}</div>
    </section>
  );
}

/** um parágrafo do corpo: medida curta, para a leitura não cansar */
function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-[#5c4635] first:mt-0">
      {children}
    </p>
  );
}

export default function Sobre() {
  return (
    <Faixa id="sobre" fundo="creme" className="pb-16 pt-6 sm:pb-24 sm:pt-7">
      {/* emenda que vem do bloco escuro do processo */}
      <RamoEmenda className="mb-14 sm:mb-16" />

      <Rubrica num="04">Sobre nós</Rubrica>

      <h2 className="reveal mt-6 max-w-[17ch] text-[clamp(32px,5vw,58px)]">
        Juca era o apelido do meu bisavô.{" "}
        <em className="block" style={{ fontStyle: "italic", color: "#6b4526" }}>
          115 anos depois, virou o meu.
        </em>
      </h2>

      {/* ————— capítulo um ————— */}
      <Capitulo
        num="um"
        nome="A ideia"
        frase="Passei uma semana na fazenda. Voltei com uma marca na cabeça."
      >
        <P>
          Foi em 2025. Meu primo Fernandinho me levou para ver o café de perto, do pé ao
          terreiro, do terreiro à torra. Saí apaixonado pelo processo e incomodado com uma
          coisa.
        </P>
        <P>
          Aquele era um dos melhores cafés que eu já tinha tomado, e saía dali em saca,
          para cooperativa e empresa grande, sem nome e sem rosto. Num lugar onde todo
          mundo produz café, o bom se mistura com o resto e some.
        </P>
        <p
          className="mt-6 text-[clamp(20px,2.8vw,28px)] leading-snug text-[#8c3a20]"
          style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
        >
          O Vô Juca nasceu disso.
        </p>
      </Capitulo>


      {/* ————— capítulo dois ————— */}
      <Capitulo
        num="dois"
        nome="O apelido"
        frase="Um apelido sumiu por três gerações e voltou sem avisar."
      >
        <div className="grid gap-x-14 lg:grid-cols-2">
          <div>
            <P>
              Meu bisavô se chamava{" "}
              <strong className="font-semibold text-[#3a271b]">{MARCA.fundador}</strong>.
              Ninguém o chamava assim: ele era o Juca Chaves. Filho de portugueses, nasceu
              em {MARCA.local} em {MARCA.fundadorNasc}.
            </P>
            <P>
              Os pais vieram de Portugal para construir alguma coisa aqui e chegaram quase
              sem nada: a mala com as joias e boa parte do patrimônio ficou para trás no
              trem. Começaram do zero.
            </P>
          </div>
          <div>
            <P>
              O pai morreu cedo, num naufrágio, mas deu tempo de levantar o que a família
              precisava para seguir. O Juca foi além: juntou terra no {MARCA.regiao} e
              plantou café.
            </P>
            <P>
              A fortuna não atravessou a vida dele inteira, e minha avó, filha dele,
              cresceu bem e viveu com simplicidade.
            </P>
          </div>
        </div>

        <blockquote className="mt-10 border-y border-[rgba(58,39,27,0.25)] py-7">
          <p
            className="max-w-[26ch] text-[clamp(23px,3.4vw,38px)] leading-tight text-[#6b4526]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
          >
            O que ficou não foi o dinheiro. Foi o café e um apelido.
          </p>
        </blockquote>

        {/* a linha do tempo é o espinho da história: cinco marcos, cinco olhadas */}
        <ol className="mt-12 grid gap-0 border-t-2 border-[#3a271b] sm:grid-cols-2 lg:grid-cols-5">
          {MARCOS.map((m) => (
            <li
              key={m.ano}
              className="border-b border-[rgba(58,39,27,0.2)] py-6 sm:border-r sm:pr-5 sm:last:border-r-0 lg:border-b-0"
            >
              <div
                className="text-[16px] tracking-[0.14em] text-[#8c3a20]"
                style={{ fontFamily: '"Courier Prime", monospace' }}
              >
                {m.ano.toUpperCase()}
              </div>
              <h4 className="mt-2.5 text-[19px] leading-tight">{m.titulo}</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-[#5c4635]">{m.texto}</p>
            </li>
          ))}
        </ol>

        <div id="arquivo" className="mt-12 sm:mt-14" style={{ scrollMarginTop: 84 }}>
          <Arquivo />
        </div>

        <div className="mt-12 border-l-2 border-[#8c3a20] pl-5 sm:pl-6">
          <P>
            Nasci em {MARCA.bisnetoNasc}, {MARCA.anosEntreOsJucas} anos depois dele. Filho
            de mineiro com baiana, nascido em São Paulo, criado em Florianópolis. Ninguém
            em casa me chamava de Juca.
          </P>
          <P>
            Depois dos 18, os amigos começaram, sem saber que existiu um Juca antes de mim
            e sem nenhuma relação com café. Descobri as duas coisas muito depois, e nessa
            ordem.
          </P>
        </div>
      </Capitulo>


      {/* ————— capítulo três ————— */}
      <Capitulo
        num="três"
        nome="Hoje"
        frase="Dois primos, e uma divisão simples de trabalho."
      >
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          {DUPLA.map((p) => (
            <div key={p.nome} className="border-t-2 border-[#3a271b] pt-5">
              <h4 className="text-[clamp(22px,3vw,28px)] leading-tight">{p.nome}</h4>
              <div className="eyebrow mt-2">{p.papel}</div>
              <p className="mt-3.5 text-[16.5px] leading-relaxed text-[#5c4635]">
                {p.texto}
              </p>
            </div>
          ))}
        </div>

        <p className="ficha mt-10 max-w-[64ch] text-[15px] leading-relaxed text-[#6b4526]">
          A plantação foi coisa do meu tio Nando, neto do Juca. Ele passou a vida no café,
          com armazém e cooperativa, e mais velho resolveu plantar. Hoje quem toca é o
          filho dele, o Fernandinho, com as pessoas que trabalham no sítio.
        </p>
      </Capitulo>


      <div id="fotos" className="reveal mt-12 sm:mt-14" style={{ scrollMarginTop: 84 }}>
        <Galeria />
      </div>
    </Faixa>
  );
}
