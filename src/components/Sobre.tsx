import type { ReactNode } from "react";
import { Dobra, Faixa, Rubrica } from "./base";
import Galeria from "./Galeria";
import Arquivo from "./Arquivo";
import { DUPLA, MARCA } from "@/dados";
import { fernandinho, joaoHenrique } from "@/imagens";

/* a foto de cada um, resolvida pela chave que vem dos dados */
const RETRATOS: Record<string, string> = { fernandinho, joaoHenrique };

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
    /* rasgo embaixo, para a emenda com "A terra"; o topo já é cortado pelo
       rasgo do bloco escuro do processo, logo acima */
    <Faixa id="sobre" fundo="creme" className="rasgo-baixo pb-12 pt-10 sm:pb-14 sm:pt-12">
      <Rubrica>Sobre nós</Rubrica>

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
        {/* Quem abre uma dobra já decidiu que quer saber, então aqui cabe mais
            do que caberia solto na página. */}
        <Dobra rotulo="Por que a marca existe" className="mt-5">
          <P>
            Aquele era um dos melhores cafés que eu já tinha tomado, e saía dali em saca,
            para cooperativa e empresa grande, sem nome e sem rosto. Num lugar onde todo
            mundo produz café, o bom se mistura com o resto e some.
          </P>
          <P>
            Me senti em casa naquela semana, e voltei querendo entender aquilo por dentro.
            Sou formado em economia, e foi por causa da viagem que escolhi o café como
            tema do meu trabalho de conclusão de curso:{" "}
            <em style={{ fontStyle: "italic", color: "#3a271b" }}>
              o papel da commodity café no contexto das exportações atuais do Brasil e a
              importância da agricultura familiar neste cenário
            </em>
            . Queria me aprofundar e contribuir de alguma forma com esse mercado.
          </P>
          <P>
            Passei meses estudando por que o café brasileiro sai daqui valendo uma coisa e
            chega na xícara valendo outra, e o peso que a agricultura familiar tem nessa
            conta. Era a conta da minha própria família.
          </P>
          <p className="ficha mt-4 text-[14.5px]">
            <a
              href={MARCA.tcc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sublinhado alvo uppercase tracking-[0.1em] text-[#6b4526]"
            >
              Ler o trabalho na íntegra (PDF, UFSC) →
            </a>
          </p>
          <p
            className="mt-6 text-[clamp(20px,2.8vw,28px)] leading-snug text-[#8c3a20]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
          >
            O Vô Juca nasceu disso.
          </p>
        </Dobra>
      </Capitulo>


      {/* ————— capítulo dois —————
          A vida do Juca era um bloco de 277 palavras com os retratos ao lado,
          só ilustrando. Agora a história está dentro dos retratos, um pedaço
          em cada, e o que fica na página é a frase, as fotos e o fecho. */}
      <Capitulo
        num="dois"
        nome="O apelido"
        frase="Um apelido sumiu por três gerações e voltou sem avisar."
      >
        <div id="arquivo" style={{ scrollMarginTop: 84 }}>
          <Arquivo />
        </div>

        <blockquote className="mt-12 border-y border-[rgba(58,39,27,0.25)] py-7">
          <p
            className="max-w-[26ch] text-[clamp(23px,3.4vw,38px)] leading-tight text-[#6b4526]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}
          >
            O que ficou não foi o dinheiro. Foi o café e um apelido.
          </p>
        </blockquote>

      </Capitulo>


      {/* ————— capítulo três ————— */}
      <Capitulo
        num="três"
        nome="Hoje"
        frase="Um economista e um farmacêutico tocando uma lavoura de café."
      >
        <div className="grid gap-10 sm:grid-cols-2">
          {/* O fio ficava entre a foto e o nome. Lado a lado isso alinha os dois
              nomes, mas empilhado no celular ele separava cada um do próprio
              retrato, e nada separava o texto de um da foto do outro: a foto do
              Fernandinho parecia ilustrar o parágrafo do João Henrique.
              Agora o fio fecha o bloco, embaixo do texto, e continua alinhado
              nos dois porque desce até o pé da coluna mais alta. */}
          {DUPLA.map((p) => (
            <div key={p.nome} className="flex h-full flex-col">
              <div className="moldura p-2.5">
                <img
                  src={RETRATOS[p.foto]}
                  alt={`Retrato de ${p.nome}`}
                  loading="lazy"
                  className="foto block aspect-[4/3] w-full object-cover"
                />
              </div>
              <h4 className="mt-5 text-[clamp(22px,3vw,28px)] leading-tight">
                {p.nome}
              </h4>
              <div className="eyebrow mt-2">{p.papel}</div>
              <p className="mt-3.5 text-[16.5px] leading-relaxed text-[#5c4635]">
                {p.texto}
              </p>
              <div
                aria-hidden="true"
                className="mt-auto border-b-2 border-[#3a271b] pt-6"
              />
            </div>
          ))}
        </div>

        <Dobra rotulo="Quem plantou a lavoura" className="mt-10">
          <p className="ficha mt-4 max-w-[64ch] text-[15px] leading-relaxed text-[#6b4526]">
            A lavoura de hoje é obra do meu tio Nando, neto do Juca. A família já
            entendia de plantação, mas no café ele começou do zero: abriu um armazém,
            trabalhou com cooperativa e, mais tarde, replantou a lavoura do começo. Hoje
            quem toca é o filho dele, o Fernandinho, com as pessoas que trabalham no
            sítio.
          </p>
        </Dobra>
      </Capitulo>


      <div id="fotos" className="reveal mt-12 sm:mt-14" style={{ scrollMarginTop: 84 }}>
        <Galeria />
      </div>
    </Faixa>
  );
}
