import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { selo } from "@/imagens";
import capaTerra from "@/assets/capa-terra.webp";
import { Botao } from "./base";
import { MARCA, SELOS, zap } from "@/dados";

/* quanto dura a abertura, até a última camada da revelação sumir */
const ABERTURA = 2300;

const semMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A capa abre como uma cópia na bandeja de revelação: primeiro o papel,
 * depois a serra aparecendo em sépia clara, e só então a foto inteira. O selo
 * é carimbado por cima e o texto entra linha a linha.
 *
 * Tudo isso é CSS e só opacidade: se o script falhar, a abertura acontece do
 * mesmo jeito, e o navegador anima opacidade sem redesenhar a foto. Terminada
 * a abertura, as camadas da revelação saem da página e entra a profundidade:
 * o fundo, o selo e o título andam em ritmos diferentes com o mouse e com a
 * rolagem.
 */
function useProfundidade() {
  const capa = useRef<HTMLDivElement>(null);
  const fundo = useRef<HTMLDivElement>(null);
  const brasao = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLDivElement>(null);
  const [revelando, setRevelando] = useState(() => !semMovimento());

  useEffect(() => {
    if (!revelando) return;
    const t = window.setTimeout(() => setRevelando(false), ABERTURA);
    return () => window.clearTimeout(t);
  }, [revelando]);

  useEffect(() => {
    if (revelando || semMovimento()) return;
    const c = capa.current;
    if (!c) return;
    /* o mouse só conta onde há mouse; no toque fica só a rolagem, mais curta */
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ritmo = fino ? 0.35 : 0.2;
    const alvo = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let visivel = true;

    const pintar = () => {
      pos.x += (alvo.x - pos.x) * 0.07;
      pos.y += (alvo.y - pos.y) * 0.07;
      const rol = Math.min(window.scrollY, c.offsetHeight);
      if (fundo.current)
        fundo.current.style.transform = `translate3d(${(-pos.x * 26).toFixed(2)}px, ${(-pos.y * 18 + rol * ritmo).toFixed(2)}px, 0)`;
      if (brasao.current)
        brasao.current.style.transform = `translate3d(${(pos.x * 16).toFixed(2)}px, ${(pos.y * 12 - rol * 0.12).toFixed(2)}px, 0)`;
      if (titulo.current)
        titulo.current.style.transform = `translate3d(${(pos.x * 7).toFixed(2)}px, ${(pos.y * 5).toFixed(2)}px, 0)`;
      const chegou = Math.abs(alvo.x - pos.x) < 0.001 && Math.abs(alvo.y - pos.y) < 0.001;
      raf = chegou ? 0 : requestAnimationFrame(pintar);
    };
    const acordar = () => {
      if (!raf && visivel) raf = requestAnimationFrame(pintar);
    };
    const mexeu = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visivel) return;
      alvo.x = e.clientX / window.innerWidth - 0.5;
      alvo.y = e.clientY / window.innerHeight - 0.5;
      acordar();
    };
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) acordar();
    });
    obs.observe(c);
    window.addEventListener("scroll", acordar, { passive: true });
    if (fino) window.addEventListener("pointermove", mexeu, { passive: true });
    acordar();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", acordar);
      window.removeEventListener("pointermove", mexeu);
      cancelAnimationFrame(raf);
    };
  }, [revelando]);

  return { capa, fundo, brasao, titulo, revelando };
}

/* o atraso de cada linha da abertura */
const linha = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

export default function Capa() {
  const { capa, fundo, brasao, titulo, revelando } = useProfundidade();
  return (
    /* a nav e' sticky e ocupa lugar no fluxo; a margem negativa traz a foto
       para debaixo dela, e o padding do miolo devolve o espaco do conteudo */
    <header
      id="topo"
      className="relative -mt-[73px] sm:-mt-[77px]"
    >
      <div ref={capa} className="rasgo-baixo relative isolate overflow-hidden">
      {/* a terra ao fim da tarde, por baixo de tudo; sobra um pouco de foto
          em cada lado para a profundidade não mostrar a borda */}
      <div ref={fundo} className="capa-fundo absolute inset-0" style={{ zIndex: 0 }}>
        <img
          src={capaTerra}
          alt=""
          aria-hidden="true"
          className="absolute -inset-[4%] h-[108%] w-[108%] max-w-none object-cover"
          style={{ objectPosition: "center 62%" }}
          fetchPriority="high"
        />
      </div>
      {/* véu de tinta: escurece a foto o bastante para o texto ficar legível */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(24,15,10,0.9) 0%, rgba(44,29,20,0.76) 38%, rgba(36,23,15,0.84) 74%, rgba(28,18,12,0.94) 100%)",
        }}
      />
      {/* A revelação: a mesma foto em sépia clara, e o papel por cima dela.
          O papel some primeiro, a sépia depois, e fica a foto de verdade.
          Acabada a abertura, as duas camadas saem da página. */}
      {revelando && (
        <div className="absolute inset-0" style={{ zIndex: 2 }} aria-hidden="true" data-print-hide>
          <img
            src={capaTerra}
            alt=""
            className="capa-sepia absolute -inset-[4%] h-[108%] w-[108%] max-w-none object-cover"
            style={{ objectPosition: "center 62%" }}
          />
          <div className="capa-papel absolute inset-0" />
        </div>
      )}
      <div
        className="relative mx-auto w-[min(100%-2rem,1120px)] pb-16 pt-[117px] text-center sm:w-[min(100%-2.5rem,1120px)] sm:pb-20 sm:pt-[145px]"
        style={{ zIndex: 3 }}
      >
        {/* O selo, carimbado no papel sobre a foto.
            Antes a arte entrava como máscara pintada de creme: isso acendia os
            traços e apagava a pele, e o rosto do Juca saía em negativo. Agora é
            a ilustração original, na tinta dela, sobre um disco do papel do
            site — que é como ela aparece impressa nos rótulos.
            A largura fica no invólucro e a caixa por dentro ocupa 100% dela:
            é o que faz a reserva de altura por padding (o retrato de quem não
            tem aspect-ratio) medir contra a largura certa. */}
        {/* o descritor abre a página, como a linha de cima de um rótulo; o selo
            vem depois dele, e não antes */}
        <p className="capa-sobe eyebrow-cru leading-relaxed" style={{ color: "#d8c3a0", ...linha(1.15) }}>
          {MARCA.descritor} · {MARCA.regiao}
        </p>

        <div ref={brasao} className="capa-camada mx-auto mt-6 w-[clamp(172px,30vw,236px)]">
          <div
            className="capa-carimbo caixa-brasao relative rounded-full"
            style={{ aspectRatio: "1 / 1", backgroundColor: "#f2e7d3" }}
          >
            {/* a tinta que espalha quando o carimbo bate */}
            <span className="capa-tinta" aria-hidden="true" />
            <img
              src={selo}
              alt={MARCA.nome}
              width={512}
              height={512}
              fetchPriority="high"
              className="absolute left-1/2 top-1/2 w-[97%] -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* A capa era um enigma: "o apelido pulou três" só fecha depois que a
            pessoa leu o "Sobre nós", lá embaixo. E era a única parte do site
            escrita em terceira pessoa, justamente onde se decide se fica.
            Agora quem fala é quem escreveu o resto. */}
        <div ref={titulo} className="capa-camada">
        <h1
          className="capa-sobe mx-auto mt-7 max-w-[23ch] text-[clamp(33px,5vw,56px)]"
          style={{ color: "#f7efe0", ...linha(1.3) }}
        >
          Juca foi o meu bisavô.{" "}
          {/* A segunda frase muda de voz sem mudar de letra: o itálico da
              Fraunces é desenhado à parte, não é a romana inclinada, e o cobre
              é o mesmo dos fios e das etiquetas da capa. O número não se
              separa da unidade: solto no fim da linha, o "115" ficava colado
              na frase anterior e a segunda começava em "anos". */}
          <span className="italic" style={{ color: "#e8b98d", fontWeight: 400 }}>
            {MARCA.anosEntreOsJucas}
            {"\u00A0anos depois, estou aqui para continuar a história dele."}
          </span>
        </h1>
        </div>

        <p
          className="capa-sobe mx-auto mt-6 max-w-[56ch] text-[17px] leading-relaxed"
          style={{ color: "#d6c3a8", ...linha(1.5) }}
        >
          O café vem da terra que a minha família planta há mais de cem anos:{" "}
          <strong className="font-semibold" style={{ color: "#f2e7d3" }}>
            arábica colhido à mão a 998 metros
          </strong>
          , seco no terreiro e torrado em lotes pequenos, aqui dentro, por nós mesmos.
        </p>

        <div
          className="capa-sobe mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
          style={linha(1.65)}
          data-print-hide
        >
          <Botao href={zap("Olá! Quero conhecer os cafés do Vô Juca.")} tom="claro" largo>
            Pedir pelo WhatsApp
          </Botao>
          <Botao href="#cafes" tom="contorno" largo>
            Ver os cafés
          </Botao>
        </div>

        {/* A capa promete a história ("para continuar a história dele") e
            não dava o caminho até ela: a primeira linha do "Sobre nós" fica a
            vinte telas de rolagem, depois dos cafés, do pedido, da assinatura
            e do processo. Quem veio pela história desistia antes. O tempo vai
            escrito porque é ele que faz a pessoa ir: três minutos parece
            pouco, e é — são cerca de 450 palavras nos três capítulos, mais os
            retratos. Link e não botão, para não disputar com os dois de cima. */}
        <a
          href="#sobre"
          className="capa-sobe ficha mt-6 inline-flex items-center gap-2.5 py-2 text-[14.5px] uppercase tracking-[0.14em] underline decoration-[rgba(232,185,141,0.45)] underline-offset-[6px] transition-colors hover:decoration-[#e8b98d]"
          style={{ color: "#e8b98d", ...linha(1.8) }}
          data-print-hide
        >
          Ler a história · 3 min
          <span aria-hidden="true">↓</span>
        </a>

        <dl className="capa-sobe mt-14 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-7 text-left sm:mt-16 sm:grid-cols-4"
          style={{ borderColor: "rgba(239,227,204,0.28)", ...linha(1.95) }}
        >
          {SELOS.map((s) => (
            <div key={s} className="flex items-start gap-2.5">
              <span
                className="mt-[10px] inline-block h-px w-4 shrink-0"
                style={{ background: "#c98a5e" }}
              />
              <dt className="ficha leading-snug" style={{ color: "#d6c3a8" }}>
                {s}
              </dt>
            </div>
          ))}
        </dl>
      </div>
      </div>

    </header>
  );
}
