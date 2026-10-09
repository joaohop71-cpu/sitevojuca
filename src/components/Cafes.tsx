import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { CAFES, PROMO, TINTA_ROTULO, brl, comDesconto, esgotadoDeVez, estaEsgotado } from "@/dados";
import type { Cafe, Moagem } from "@/dados";
import { ajustar, useCarrinho } from "@/carrinho";
import { Contador, Faixa, Rubrica, Visor } from "./base";
import { explicaFicha } from "@/ficha";
import { voarAtePedido } from "@/voo";

/**
 * Os cafés numa prateleira de empório.
 *
 * Os cinco pacotes ficam em pé na tábua, cada um com a etiqueta de preço
 * pendurada na frente; tocar num pacote abre embaixo o rótulo inteiro, preso
 * numa prancheta, ao lado de onde se escolhe a moagem e a quantidade.
 *
 * Tudo o que é desenho (pacote, tábua, mãos-francesas, etiqueta, prancheta)
 * vem do ilustrador, no mesmo traço de gravura dos rótulos. Tudo o que muda
 * (preço, estoque, quantidade) é texto vivo por cima, para mudar sem refazer
 * imagem nenhuma.
 */

const V = "/vitrine";

/** nome cheio: as duas Heranças só se distinguem pelo lote */
function nomeCheio(c: Cafe) {
  return c.lote ? `${c.nome} ${c.lote}` : c.nome;
}

function descricaoArte(c: Cafe) {
  return [c.nome, c.lote, "·", c.qualificacao.join(", "), "·", c.notas.join(", "),
    `· ${c.formato}, ${c.gramas} g`].filter(Boolean).join(" ");
}

/* o verso descrito por extenso: os especiais têm o mesmo guia, e o Minas
   Santa, que vai moído fino, traz receitas próprias */
const ALT_VERSO = {
  especial:
    "Como aproveitar o melhor do seu café: água entre 92 e 96 °C e o café pesado em balança. Coado no filtro, 20 g de moagem média para 300 ml, em 3 a 4 minutos. Prensa francesa, 30 g de moagem grossa para 450 ml, em 4 minutos. Cafeteira italiana, 20 g de moagem média-fina para 140 ml. Guarde em lugar seco e arejado, longe da luz e do calor, e feche bem o pacote; depois de aberto, consuma em até 30 dias.",
  minassanta:
    "Como aproveitar o melhor do seu café: água entre 92 e 96 °C e o café pesado em balança. Coador tradicional, de Melitta ou de pano, com 8 a 10 g de pó para cada 100 ml. Cafeteira elétrica, na mesma proporção, sem fazer grandes volumes de uma vez para não amargar. Cafeteira italiana, 20 g para 140 ml, em fogo baixo ou médio. Guarde em lugar seco e arejado, longe da luz e do calor, e feche bem o pacote; depois de aberto, consuma em até 30 dias.",
};

/* As artes do rótulo saem de dentro dos PDFs da gráfica, no papel do
   designer, sem a sangria; o papel foi levado para o tom do kraft da
   prancheta. O verso vem sem a caixa de lote e validade (numa venda torrada
   sob encomenda, uma data impressa estaria sempre velha) e sem o rodapé,
   que ainda traz CNPJ, endereço e registro MAPA de exemplo. */
const versoDe = (c: Cafe) => (c.banner.startsWith("herancas") ? "herancas" : c.banner);
const ALTURA_VERSO: Record<string, number> = { vojuca: 1122, reserva998: 1122, herancas: 1122, minassanta: 1095 };

const MOAGENS: Moagem[] = ["grao", "moido"];
const nomeMoagem = (c: Cafe, m: Moagem) =>
  m === "grao" ? "em grão" : c.banner === "minassanta" ? "moído fino" : "moído";

/** o preço da etiqueta: a primeira moagem que ainda tem estoque, já com o desconto */
function etiquetaDe(c: Cafe) {
  const comPreco = MOAGENS.filter((m) => c.preco[m] !== null);
  const m = comPreco.find((x) => !estaEsgotado(c, x)) ?? comPreco[0];
  if (!m) return null;
  return {
    valor: comDesconto(c.preco[m]!, !c.semPromo),
    moagem: nomeMoagem(c, m),
    esgotado: esgotadoDeVez(c),
  };
}

const valorSemCifrao = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** a etiqueta de kraft, com o preço escrito à mão por cima do desenho */
function Etiqueta({ cafe, mexidas }: { cafe: Cafe; mexidas: number }) {
  const e = etiquetaDe(cafe);
  const ref = useRef<HTMLSpanElement>(null);
  /* balança uma vez a cada toque ou passada no pacote dela */
  useEffect(() => {
    const el = ref.current;
    if (!el || mexidas === 0) return;
    el.classList.remove("vt-balancando");
    void el.offsetWidth;
    el.classList.add("vt-balancando");
  }, [mexidas]);
  return (
    <span ref={ref} className="vt-tag">
      <img src={`${V}/etiqueta.webp`} alt="" width={152} height={360} loading="lazy" decoding="async" />
      <span className="vt-tag-txt">
        {!e ? (
          <em>em breve</em>
        ) : e.esgotado ? (
          <>
            <b className="vt-tag-acabou">Sem</b>
            <em>estoque</em>
          </>
        ) : (
          <>
            <small>R$</small>
            <b className="num">{valorSemCifrao(e.valor)}</b>
            <em>{cafe.gramas} g</em>
            <em>{e.moagem}</em>
          </>
        )}
        <i style={{ background: TINTA_ROTULO[cafe.cor] }} />
      </span>
    </span>
  );
}

/**
 * A lupa de classificador: segue o mouse sobre o rótulo; no toque, aparece
 * depois de segurar o dedo um instante, um pouco acima dele, para o dedo não
 * tapar o que ela mostra.
 */
function useLupa(caixa: RefObject<HTMLDivElement | null>, alvo: () => HTMLImageElement | null) {
  const lupa = useRef<HTMLDivElement>(null);
  /* o alvo muda quando a folha vira; guardado aqui, não refaz os eventos */
  const alvoRef = useRef(alvo);
  useEffect(() => {
    alvoRef.current = alvo;
  });
  useEffect(() => {
    const c = caixa.current;
    const l = lupa.current;
    if (!c || !l) return;
    const ZOOM = 1.8;
    let segurando = 0;
    let toque = false;
    let timer = 0;
    const mover = (x: number, y: number) => {
      const img = alvoRef.current();
      if (!img) return;
      const r = img.getBoundingClientRect();
      const b = c.getBoundingClientRect();
      const L = l.offsetWidth;
      const px = x - r.left;
      const py = y - r.top;
      const cy = toque ? y - L * 0.75 : y;
      l.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
      l.style.left = `${x - b.left - L / 2}px`;
      l.style.top = `${cy - b.top - L / 2}px`;
      l.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
      l.style.backgroundPosition = `${-(px * ZOOM - L / 2)}px ${-(py * ZOOM - L / 2)}px`;
      l.classList.toggle("ativa", px >= 0 && py >= 0 && px <= r.width && py <= r.height);
    };
    const anda = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || segurando === 2) {
        toque = e.pointerType !== "mouse";
        mover(e.clientX, e.clientY);
      }
    };
    const sai = (e: PointerEvent) => {
      if (e.pointerType === "mouse") l.classList.remove("ativa");
    };
    const desce = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      segurando = 1;
      const x = e.clientX;
      const y = e.clientY;
      timer = window.setTimeout(() => {
        segurando = 2;
        c.style.touchAction = "none";
        toque = true;
        mover(x, y);
      }, 260);
    };
    const solta = () => {
      window.clearTimeout(timer);
      segurando = 0;
      c.style.touchAction = "";
      if (toque) l.classList.remove("ativa");
    };
    const menu = (e: Event) => {
      if (segurando) e.preventDefault();
    };
    c.addEventListener("pointermove", anda);
    c.addEventListener("pointerleave", sai);
    c.addEventListener("pointerdown", desce);
    c.addEventListener("pointerup", solta);
    c.addEventListener("pointercancel", solta);
    c.addEventListener("contextmenu", menu);
    return () => {
      c.removeEventListener("pointermove", anda);
      c.removeEventListener("pointerleave", sai);
      c.removeEventListener("pointerdown", desce);
      c.removeEventListener("pointerup", solta);
      c.removeEventListener("pointercancel", solta);
      c.removeEventListener("contextmenu", menu);
      window.clearTimeout(timer);
    };
  }, [caixa]);
  return lupa;
}

/** uma moagem: o preço, riscado só onde há desconto, e o contador do pedido */
function LinhaPreco({ cafe, m, qtd }: { cafe: Cafe; m: Moagem; qtd: number }) {
  const valor = cafe.preco[m]!;
  const promo = !cafe.semPromo;
  const esgotado = estaEsgotado(cafe, m);
  const cor = TINTA_ROTULO[cafe.cor];
  const chave = `${cafe.id}-${m}`;
  return (
    <div className="vt-linha-preco">
      <div className="min-w-0">
        <div className="ficha text-[12.5px] uppercase tracking-[0.12em] text-[#6f5b44]">
          {nomeMoagem(cafe, m)} · {cafe.gramas} g
          {/* o risco só existe onde há desconto: riscar um preço que continua
              valendo é anunciar uma promoção que não existe */}
          {promo && !esgotado && <span className="num ml-2 line-through">{brl(valor)}</span>}
        </div>
        <div
          className="num leading-none"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 600,
            fontSize: 28,
            marginTop: 4,
            color: esgotado ? "#6f5b44" : cor,
            opacity: esgotado ? 0.55 : 1,
          }}
        >
          {brl(comDesconto(valor, promo))}
        </div>
      </div>
      {/* sem estoque, no lugar do contador vai a palavra; o preço fica, mais
          apagado, porque aquela moagem volta */}
      {esgotado ? (
        <span
          className="ficha whitespace-nowrap border px-3 py-2 text-[12px] uppercase tracking-[0.12em]"
          style={{ color: "#8c3a20", borderColor: "rgba(140,58,32,0.45)" }}
        >
          Sem estoque
        </span>
      ) : (
        <Contador
          valor={qtd}
          aoMudar={(d, origem) => {
            if (ajustar(chave, d) && d > 0) voarAtePedido(origem);
          }}
          rotulo={`${nomeCheio(cafe)} ${nomeMoagem(cafe, m)}`}
          cor={cor}
        />
      )}
    </div>
  );
}

/** a ficha técnica do rótulo, em texto: cada linha se explica quando tocada */
function FichaTecnica({ cafe }: { cafe: Cafe }) {
  const [aberta, setAberta] = useState<number | null>(null);
  const f = aberta === null ? null : cafe.fichas[aberta];
  return (
    <div className="mt-6">
      <div className="ficha text-[12.5px] uppercase tracking-[0.14em] text-[#6f5b44]">
        Ficha técnica · toque numa linha para entender
      </div>
      <div className="vt-tecnica mt-2">
        {cafe.fichas.map((x, i) => (
          <button
            key={x.rotulo}
            type="button"
            className="vt-tecnica-linha"
            aria-expanded={aberta === i}
            aria-controls={`${cafe.id}-explica`}
            onClick={() => setAberta((a) => (a === i ? null : i))}
          >
            <span>{x.rotulo}</span>
            <i aria-hidden="true" />
            <b style={{ color: TINTA_ROTULO[cafe.cor] }}>{x.valor}</b>
          </button>
        ))}
      </div>
      {f && (
        <p id={`${cafe.id}-explica`} role="note" className="vt-explica">
          <strong>
            {f.rotulo}: {f.valor}.
          </strong>{" "}
          {explicaFicha(f.rotulo, f.valor)}
        </p>
      )}
    </div>
  );
}

/** o rótulo aberto: preso na prancheta, com a compra ao lado */
function Gaveta({ cafe, aoAmpliar }: { cafe: Cafe; aoAmpliar: (verso: boolean) => void }) {
  const qtd = useCarrinho();
  const cor = TINTA_ROTULO[cafe.cor];
  const [virado, setVirado] = useState(false);
  /* o verso só baixa na primeira vez que alguém vira */
  const [jaVirou, setJaVirou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const frente = useRef<HTMLImageElement>(null);
  const costas = useRef<HTMLImageElement>(null);
  const viradoRef = useRef(false);
  useEffect(() => {
    viradoRef.current = virado;
  }, [virado]);
  const lupa = useLupa(palco, () => (viradoRef.current ? costas.current : frente.current));
  const toque = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const virar = () => {
    setJaVirou(true);
    setVirado((v) => !v);
    lupa.current?.classList.remove("ativa");
  };

  return (
    <div className="vt-gaveta">
      <div>
        {/* só a folha vira: a tábua e o grampo ficam parados, e o grampo
            continua por cima da folha enquanto ela gira */}
        <div ref={palco} className="vt-palco">
          <div className="vt-prancheta">
            <img className="vt-prancheta-tabua" src={`${V}/prancheta.webp`} alt="" width={760} height={1260} decoding="async" />
            <div className="vt-papel">
              <div className="vt-virador" data-virado={virado}>
                <div className="vt-lado" inert={virado}>
                  <div className="vt-folha">
                    <img
                      ref={frente}
                      src={`${V}/rotulo_${cafe.banner}.jpg`}
                      alt={descricaoArte(cafe)}
                      width={760}
                      height={1368}
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="vt-lado vt-costas" inert={!virado}>
                  <div className="vt-folha">
                    {jaVirou && (
                      <img
                        ref={costas}
                        src={`${V}/verso_${versoDe(cafe)}.jpg`}
                        alt={ALT_VERSO[cafe.banner === "minassanta" ? "minassanta" : "especial"]}
                        width={760}
                        height={ALTURA_VERSO[versoDe(cafe)]}
                        decoding="async"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <img className="vt-grampo" src={`${V}/grampo.webp`} alt="" width={760} height={1260} decoding="async" />
          </div>
          <div ref={lupa} className="vt-lupa" aria-hidden="true" />
        </div>
        <p className="ficha mt-3 text-center text-[12.5px] uppercase tracking-[0.12em] text-[#6f5b44]" data-print-hide>
          {toque ? "Segure o dedo no rótulo para ler de perto" : "Passe o mouse no rótulo para ler de perto"}
        </p>
      </div>

      <div className="min-w-0">
        <div className="ficha text-[12.5px] font-bold uppercase tracking-[0.16em]" style={{ color: cor }}>
          {cafe.tarja}
        </div>
        <h3 className="mt-1 text-[clamp(28px,3.4vw,36px)] leading-tight">
          {cafe.nome}
          {cafe.lote && <span className="ml-2 text-[0.62em] font-medium text-[#5c4635]">{cafe.lote}</span>}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {cafe.notas.map((n) => (
            <li key={n} className="ficha border border-[rgba(58,39,27,0.22)] bg-[rgba(255,250,240,0.6)] px-2 py-0.5 text-[13px]">
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-[#5c4635]">{cafe.descricao}</p>

        <div className="ficha mt-5 text-[12.5px] uppercase tracking-[0.14em]" style={{ color: cor }}>
          {esgotadoDeVez(cafe)
            ? "Sem estoque no momento"
            : cafe.semPromo
            ? "Preço de tabela"
            : `${PROMO.rotulo} · ${PROMO.prazo}`}
        </div>
        <div className="mt-2 grid gap-3">
          {cafe.preco.grao === null && cafe.preco.moido === null ? (
            <p className="ficha text-[15px] text-[#6b4526]">Lote novo, preço sendo fechado. Pergunte no WhatsApp.</p>
          ) : (
            MOAGENS.filter((m) => cafe.preco[m] !== null).map((m) => (
              <LinhaPreco key={m} cafe={cafe} m={m} qtd={qtd[`${cafe.id}-${m}`] ?? 0} />
            ))
          )}
        </div>

        <FichaTecnica cafe={cafe} />

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1" data-print-hide>
          <button
            type="button"
            onClick={virar}
            aria-pressed={virado}
            className="ficha py-2 text-[13.5px] uppercase tracking-[0.12em] underline underline-offset-[6px]"
            style={{ color: cor }}
          >
            {virado ? "Ver a frente do rótulo" : "Ver o verso · como preparar"}
          </button>
          <button
            type="button"
            onClick={() => aoAmpliar(virado)}
            className="ficha py-2 text-[13.5px] uppercase tracking-[0.12em] text-[#6b4526] underline underline-offset-[6px]"
          >
            Ampliar o rótulo
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * O que acabou, dito pelos dados e não à mão.
 *
 * Quando as duas moagens de um café acabam, ele entra uma vez só, pelo nome:
 * "Café Vô Juca em grão e Café Vô Juca moído" é a mesma notícia dita duas
 * vezes. E a lista se fecha com "e", como se escreve em português, não com o
 * "e" entre todos os itens.
 */
const SEM_ESTOQUE = CAFES.filter((c) => c.esgotado?.length).map((c) =>
  esgotadoDeVez(c)
    ? nomeCheio(c)
    : `${nomeCheio(c)} ${c.esgotado![0] === "grao" ? "em grão" : "moído"}`
);

const emLista = (xs: string[]) =>
  xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`;

export default function Cafes() {
  /* a gaveta já abre no primeiro café, mas nenhum pacote sai da fileira até
     a pessoa escolher: a prateleira começa simétrica */
  const [escolhido, setEscolhido] = useState(0);
  const [marcado, setMarcado] = useState(false);
  const [mexidas, setMexidas] = useState<number[]>(() => CAFES.map(() => 0));
  const [visor, setVisor] = useState<{ i: number; verso: boolean } | null>(null);
  const gaveta = useRef<HTMLDivElement>(null);

  const mexe = (i: number) => setMexidas((b) => b.map((n, k) => (k === i ? n + 1 : n)));
  const escolher = (i: number) => {
    setEscolhido(i);
    setMarcado(true);
    mexe(i);
    /* no celular a gaveta fica abaixo da dobra: leva até ela */
    window.requestAnimationFrame(() => {
      const g = gaveta.current;
      if (!g) return;
      const r = g.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.6) {
        g.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    });
  };
  const cafe = CAFES[escolhido];
  const irVisor = (d: number) =>
    setVisor((v) => (v === null ? null : { i: (v.i + d + CAFES.length) % CAFES.length, verso: v.verso }));

  return (
    <Faixa id="cafes" className="py-10 sm:py-12">
      <Rubrica>Os cafés</Rubrica>

      <div className="abertura reveal mt-6">
        <h2 className="max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
          Cinco rótulos, uma lavoura só
        </h2>
        <p className="mt-4 max-w-[58ch] text-[#5c4635]">
          Todos vêm da mesma lavoura, hoje repartida em nove talhões. O que muda é a
          variedade, a seleção do grão e o ponto da torra. Toque num pacote para abrir
          o rótulo inteiro; na ficha técnica, cada linha explica o que quer dizer.
        </p>
      </div>

      {/* o selo da promoção vive aqui, junto do preço */}
      <div
        className="reveal mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 py-4 text-center"
        style={{ background: "#8c3a20", color: "#f7efe0" }}
      >
        <span
          className="num text-[clamp(28px,4.4vw,40px)] leading-none"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 48',
            fontWeight: 600,
          }}
        >
          {PROMO.rotulo}
        </span>
        <span className="ficha text-[14.5px] uppercase tracking-[0.14em]">
          Preço de lançamento, já aplicado abaixo · exceto o Minas Santa
        </span>
      </div>

      {/* o aviso de estoque sai da própria lista de cafés; sem nada esgotado,
          a linha não existe */}
      {SEM_ESTOQUE.length > 0 && (
        <p className="ficha reveal mt-4 text-center text-[14.5px] leading-relaxed text-[#6b4526]">
          Sem estoque no momento: {emLista(SEM_ESTOQUE)}. {SEM_ESTOQUE.length > 1 ? "Voltam" : "Volta"}{" "}
          assim que sair o próximo lote; o resto está disponível.
        </p>
      )}

      {/* ————— a prateleira ————— */}
      <div className="vt-estante">
        <div className="vt-estante-in">
          <div className="vt-fileira" data-escolheu={marcado || undefined}>
            {CAFES.map((c, i) => (
              <button
                key={c.id}
                id={c.id}
                type="button"
                className="vt-pac"
                aria-pressed={marcado && i === escolhido}
                aria-label={`Abrir o rótulo do ${nomeCheio(c)}`}
                onClick={() => escolher(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") mexe(i);
                }}
                style={{ scrollMarginTop: 96 }}
              >
                <img src={`${V}/pacote_${c.banner}.webp`} alt="" width={360} height={540} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <div className="vt-prateleira" aria-hidden="true">
            <div className="vt-tabua" />
            <img className="vt-mao vt-m1" src={`${V}/mao0.webp`} alt="" width={171} height={230} loading="lazy" />
            <img className="vt-mao vt-m2" src={`${V}/mao1.webp`} alt="" width={170} height={230} loading="lazy" />
          </div>
          {/* a etiqueta repete o preço que o pacote ao lado já diz no painel;
              para quem usa leitor de tela, é o botão do pacote que conta */}
          <div className="vt-etiquetas" aria-hidden="true">
            {CAFES.map((c, i) => (
              <div key={c.id} className="vt-etq" onClick={() => escolher(i)}>
                <Etiqueta cafe={c} mexidas={mexidas[i]} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ————— o rótulo aberto ————— */}
      <div ref={gaveta} className="reveal" style={{ scrollMarginTop: 90 }}>
        <Gaveta key={cafe.id} cafe={cafe} aoAmpliar={(verso) => setVisor({ i: escolhido, verso })} />
      </div>

      {visor !== null && (
        <Visor
          rotulo={`${visor.verso ? "Verso" : "Rótulo"} do ${nomeCheio(CAFES[visor.i])}`}
          aoFechar={() => setVisor(null)}
          aoIr={irVisor}
        >
          <img
            src={visor.verso ? `${V}/verso_${versoDe(CAFES[visor.i])}.jpg` : `${V}/rotulo_${CAFES[visor.i].banner}.jpg`}
            alt={visor.verso ? ALT_VERSO[CAFES[visor.i].banner === "minassanta" ? "minassanta" : "especial"] : descricaoArte(CAFES[visor.i])}
            className="block max-h-[76vh] w-auto object-contain"
            style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}
          />
          <p
            className="mt-4 text-center text-[17px] text-[#efe3cc]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
          >
            {nomeCheio(CAFES[visor.i])}
            <span className="ficha num ml-3 text-[14px] text-[#bda88d]">
              {String(visor.i + 1).padStart(2, "0")} / 0{CAFES.length}
            </span>
          </p>
        </Visor>
      )}
    </Faixa>
  );
}
