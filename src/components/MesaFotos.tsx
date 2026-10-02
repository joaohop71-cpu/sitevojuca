import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

export type FotoMesa = { src: string; alt: string; legenda: string; ficha: string };

/**
 * As fotos como cópias em papel, num monte em cima da mesa.
 *
 * Arrasta-se a de cima para o lado e ela volta para baixo do monte, como quem
 * passa as fotos de um envelope de revelação. O peso vem de três coisas: a
 * cópia gira conforme o ponto por onde foi pega, sobe e ganha sombra enquanto
 * está na mão, e o arremesso respeita a velocidade do gesto. Quem quiser ver
 * todas de uma vez espalha o monte na mesa.
 *
 * Tudo é transform, e só a cópia que está na mão é redesenhada a cada quadro:
 * nada de desfoque nem filtro animado, que era o que pesava na roda.
 */

/* a inclinação de cada cópia é dela, e não do lugar no monte */
const GIROS = [-3.2, 2.4, -1.6, 3.6, -2.4, 1.4, -3.8, 2.8, -1.2, 3.1, -2.1, 1.9, -2.7];
const giro = (i: number) => GIROS[i % GIROS.length];
/* quanto cada camada escapa da de cima: é o que dá espessura ao monte */
const ESCAPE = [
  [0, 0], [7, 3], [-9, 5], [11, 6], [-6, 8], [4, 9],
  [-11, 10], [9, 11], [-4, 12], [12, 13], [-8, 14], [5, 15],
];
/* a faixa do envelope que aparece por baixo do monte */
const ENVELOPE = 74;

/**
 * A borda serrilhada das cópias de laboratório antigas, como máscara. Os
 * dentes são arcos de 9 px, gerados uma vez; a máscara estica com o cartão,
 * e como a proporção dele é sempre a mesma, os dentes não deformam.
 */
const SERRILHA = (() => {
  const W = 340, H = 427, a = 2.2, alvo = 9;
  const partes = (c: number) => {
    const n = Math.max(1, Math.round((c - 2 * a) / alvo));
    return { n, p: (c - 2 * a) / n };
  };
  const t = partes(W);
  const v = partes(H);
  const f = (x: number) => x.toFixed(2);
  let d = `M${a} ${a}`;
  for (let k = 0; k < t.n; k++) { const x = a + k * t.p; d += `Q${f(x + t.p / 2)} ${-a} ${f(x + t.p)} ${a}`; }
  for (let k = 0; k < v.n; k++) { const y = a + k * v.p; d += `Q${W + a} ${f(y + v.p / 2)} ${W - a} ${f(y + v.p)}`; }
  for (let k = 0; k < t.n; k++) { const x = W - a - k * t.p; d += `Q${f(x - t.p / 2)} ${H + a} ${f(x - t.p)} ${H - a}`; }
  for (let k = 0; k < v.n; k++) { const y = H - a - k * v.p; d += `Q${-a} ${f(y - v.p / 2)} ${a} ${f(y - v.p)}`; }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path d='${d}Z'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

type Geo = { largura: number; w: number; h: number; x0: number; topo: number };

function medir(largura: number, encostar: boolean): Geo {
  const w = Math.round(Math.min(360, largura * 0.8));
  /* a foto é 4:5, e o papel tem margem de 10 px, um pouco mais embaixo */
  const h = Math.round((w - 20) * 1.25 + 24);
  /* no computador o monte encosta na ficha ao lado, em vez de ficar no meio
     da coluna dele com um vão até o texto */
  const x0 = encostar ? largura - w - 56 : (largura - w) / 2;
  return { largura, w, h, x0, topo: 16 };
}

type Pos = { x: number; y: number; r: number; s?: number };
const tf = (p: Pos) =>
  `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.r.toFixed(2)}deg)${p.s ? ` scale(${p.s.toFixed(4)})` : ""}`;

function noMonte(i: number, k: number, g: Geo): Pos {
  const e = ESCAPE[Math.min(k, ESCAPE.length - 1)];
  /* a de cima fica mais reta, para a foto ser lida */
  return { x: g.x0 + e[0], y: g.topo + e[1], r: giro(i) * (k === 0 ? 0.5 : 1) };
}

/** as doze em linhas, na ordem dos números, cada uma ainda um pouco torta */
function naMesa(i: number, n: number, g: Geo) {
  const cols = g.largura < 560 ? 2 : g.largura < 900 ? 3 : 4;
  const gap = g.largura < 560 ? 14 : 24;
  const cw = (g.largura - gap * (cols - 1)) / cols;
  const s = (cw * 0.92) / g.w;
  const linha = g.h * s + 40;
  const c = i % cols;
  const r = Math.floor(i / cols);
  const pos: Pos = {
    x: c * (cw + gap) + cw / 2 - g.w / 2,
    y: 10 + r * (linha + gap) + (g.h * s) / 2 - g.h / 2,
    r: giro(i) * 0.45,
    s,
  };
  return { pos, s, altura: 10 + Math.ceil(n / cols) * (linha + gap) };
}

const semMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MesaFotos({
  fotos,
  aoAbrir,
}: {
  fotos: FotoMesa[];
  aoAbrir: (i: number) => void;
}) {
  const n = fotos.length;
  const mesa = useRef<HTMLDivElement>(null);
  const cartas = useRef<(HTMLButtonElement | null)[]>([]);
  const ordem = useRef(fotos.map((_, i) => i));
  const geoRef = useRef<Geo | null>(null);
  const mexeu = useRef(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [topo, setTopo] = useState(0);
  const [espalhada, setEspalhada] = useState(false);
  const espalhadaRef = useRef(false);

  /* cópias no meio de uma troca: o arrumar não mexe nelas */
  const soltas = useRef(new Set<number>());

  /* põe cada cópia no seu lugar */
  const arrumar = useCallback(
    () => {
      const g = geoRef.current;
      const m = mesa.current;
      if (!g || !m) return;
      if (espalhadaRef.current) {
        let altura = 0;
        cartas.current.forEach((el, i) => {
          if (!el) return;
          const r = naMesa(i, n, g);
          altura = r.altura;
          el.style.zIndex = String(n - i);
          el.style.transform = tf(r.pos);
          m.style.setProperty("--s", r.s.toFixed(4));
        });
        m.style.height = `${altura}px`;
        return;
      }
      ordem.current.forEach((i, k) => {
        const el = cartas.current[i];
        if (!el || soltas.current.has(i)) return;
        el.style.zIndex = String(n - k);
        el.style.transform = tf(noMonte(i, k, g));
      });
      m.style.height = `${g.topo + g.h + 16 + ENVELOPE}px`;
    },
    [n],
  );

  /* mede a mesa; só troca a geometria se ela mudou de fato */
  const remedir = useCallback(() => {
    const m = mesa.current;
    if (!m) return;
    const encostar =
      !espalhadaRef.current && window.matchMedia("(min-width: 1024px)").matches;
    const g = medir(m.clientWidth, encostar);
    const velho = geoRef.current;
    if (velho && velho.largura === g.largura && velho.x0 === g.x0) return;
    geoRef.current = g;
    setGeo(g);
  }, []);

  useLayoutEffect(() => {
    const m = mesa.current;
    if (!m) return;
    remedir();
    const ro = new ResizeObserver(remedir);
    ro.observe(m);
    return () => ro.disconnect();
  }, [remedir]);

  /* depois de cada mudança de tamanho ou de modo, o React já desenhou as
     cópias no tamanho novo; aqui elas vão para o lugar */
  useLayoutEffect(() => {
    espalhadaRef.current = espalhada;
    remedir();
    arrumar();
  }, [geo, espalhada, arrumar, remedir]);

  const focarTopo = (i: number) => {
    if (mesa.current?.contains(document.activeElement)) {
      cartas.current[i]?.focus({ preventScroll: true });
    }
  };

  /* As duas metades de cada troca. A cópia não voa para fora da tela: sai
     só até a beira do monte, como quem puxa a foto com os dedos, e dali
     escorrega para baixo (ou, voltando, para cima). Enquanto faz isso, ela
     fica fora do arrumar, para outra troca no meio não a puxar de volta. */
  const SAIDA = 520;
  const ENTRADA = 820;

  /** a de cima sai pelo lado e entra por baixo do monte */
  const jogar = useCallback(
    (lado: number, dy = 0) => {
      const g = geoRef.current;
      const m = mesa.current;
      if (!g || !m || espalhadaRef.current) return;
      mexeu.current = true;
      const o = ordem.current;
      const i = o[0];
      const el = cartas.current[i];
      o.push(o.shift()!);
      setTopo(o[0]);
      focarTopo(o[0]);
      if (!el || semMovimento()) {
        arrumar();
        return;
      }
      soltas.current.add(i);
      el.classList.remove("no-ar", "mola", "guardando");
      el.classList.add("saindo");
      el.style.zIndex = String(n + 2);
      el.style.transform = tf({
        x: g.x0 + lado * g.w * 0.92,
        y: g.topo - 10 + dy * 0.25,
        r: giro(i) + lado * 9,
        s: 1.03,
      });
      arrumar();
      window.setTimeout(() => {
        el.classList.replace("saindo", "guardando");
        soltas.current.delete(i);
        arrumar();
        window.setTimeout(() => el.classList.remove("guardando"), ENTRADA);
      }, SAIDA - 90);
    },
    [arrumar, n],
  );

  /** a de baixo sai pelo lado e volta para cima do monte */
  const voltar = useCallback(() => {
    const g = geoRef.current;
    const m = mesa.current;
    if (!g || !m || espalhadaRef.current) return;
    mexeu.current = true;
    const o = ordem.current;
    const i = o.pop()!;
    o.unshift(i);
    setTopo(i);
    focarTopo(i);
    const el = cartas.current[i];
    if (!el || semMovimento()) {
      arrumar();
      return;
    }
    soltas.current.add(i);
    el.classList.remove("no-ar", "mola", "guardando");
    el.classList.add("saindo");
    el.style.zIndex = "0";
    el.style.transform = tf({ x: g.x0 - g.w * 0.92, y: g.topo - 10, r: giro(i) - 9, s: 1.03 });
    arrumar();
    window.setTimeout(() => {
      el.classList.replace("saindo", "guardando");
      soltas.current.delete(i);
      arrumar();
      window.setTimeout(() => el.classList.remove("guardando"), ENTRADA);
    }, SAIDA - 90);
  }, [arrumar]);

  /* ————— o arrasto ————— */
  const mao = useRef<{
    id: number;
    x0: number;
    y0: number;
    t0: number;
    /* onde a cópia foi pega, de -1 (embaixo) a 1 (em cima) */
    alavanca: number;
    base: Pos;
    rastro: { x: number; y: number; t: number }[];
  } | null>(null);

  const pegar = (ev: PointerEvent<HTMLDivElement>) => {
    if (espalhadaRef.current || ev.button !== 0) return;
    const g = geoRef.current;
    const i = ordem.current[0];
    const el = cartas.current[i];
    if (!g || !el || !el.contains(ev.target as Node)) return;
    const r = el.getBoundingClientRect();
    mao.current = {
      id: ev.pointerId,
      x0: ev.clientX,
      y0: ev.clientY,
      t0: performance.now(),
      alavanca: Math.max(-1, Math.min(1, (r.top + r.height / 2 - ev.clientY) / (r.height / 2))),
      base: noMonte(i, 0, g),
      rastro: [{ x: ev.clientX, y: ev.clientY, t: performance.now() }],
    };
    el.setPointerCapture(ev.pointerId);
    el.classList.remove("mola", "saindo", "guardando");
    el.classList.add("no-ar");
    mexeu.current = true;
  };

  const arrastar = (ev: PointerEvent<HTMLDivElement>) => {
    const h = mao.current;
    const g = geoRef.current;
    if (!h || !g || ev.pointerId !== h.id) return;
    const dx = ev.clientX - h.x0;
    const dy = (ev.clientY - h.y0) * 0.35;
    const agora = performance.now();
    h.rastro.push({ x: ev.clientX, y: ev.clientY, t: agora });
    while (h.rastro.length > 2 && agora - h.rastro[0].t > 90) h.rastro.shift();
    /* pegou por cima, gira para o lado do arrasto; por baixo, gira ao contrário */
    const inclina = h.base.r + (dx / g.w) * (5 + 16 * h.alavanca);
    const el = cartas.current[ordem.current[0]];
    if (el) el.style.transform = tf({ x: h.base.x + dx, y: h.base.y + dy, r: inclina, s: 1.035 });
  };

  const soltar = (ev: PointerEvent<HTMLDivElement>) => {
    const h = mao.current;
    const g = geoRef.current;
    if (!h || !g || ev.pointerId !== h.id) return;
    mao.current = null;
    const i = ordem.current[0];
    const el = cartas.current[i];
    const dx = ev.clientX - h.x0;
    const dy = ev.clientY - h.y0;
    const ini = h.rastro[0];
    const dt = Math.max(1, performance.now() - ini.t);
    const vx = (ev.clientX - ini.x) / dt;
    el?.classList.remove("no-ar");
    if (ev.type === "pointerup" && Math.hypot(dx, dy) < 7 && performance.now() - h.t0 < 450) {
      arrumar();
      aoAbrir(i);
      return;
    }
    if (Math.abs(dx) > g.w * 0.3 || (Math.abs(vx) > 0.45 && Math.sign(vx) === Math.sign(dx))) {
      jogar(Math.sign(dx || vx), dy);
      return;
    }
    /* não foi longe o bastante: volta para o monte, com um quique */
    el?.classList.add("mola");
    arrumar();
    window.setTimeout(() => el?.classList.remove("mola"), 520);
  };

  const teclas = (ev: KeyboardEvent) => {
    if (espalhadaRef.current) return;
    if (ev.key === "ArrowRight") { ev.preventDefault(); jogar(-1); }
    if (ev.key === "ArrowLeft") { ev.preventDefault(); voltar(); }
  };

  /* Na primeira vez que o monte aparece inteiro, a de cima dá uma mexida,
     como quem empurra a foto com o dedo: é o aviso de que dá para arrastar. */
  useEffect(() => {
    const m = mesa.current;
    if (!m || semMovimento() || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        window.setTimeout(() => {
          const g = geoRef.current;
          const i = ordem.current[0];
          const el = cartas.current[i];
          if (!g || !el || mexeu.current || espalhadaRef.current) return;
          const b = tf(noMonte(i, 0, g));
          el.animate(
            [
              { transform: b },
              { transform: `${b} translateX(-30px) rotate(-3deg)`, offset: 0.4 },
              { transform: `${b} translateX(8px) rotate(0.8deg)`, offset: 0.75 },
              { transform: b },
            ],
            { duration: 1100, easing: "ease-in-out" },
          );
        }, 500);
      },
      { threshold: 0.7 },
    );
    obs.observe(m);
    return () => obs.disconnect();
  }, []);

  const espalhar = (sim: boolean) => {
    mexeu.current = true;
    setEspalhada(sim);
    if (!sim) {
      /* quem junta lá do fim da mesa volta a ver o monte */
      const m = mesa.current;
      if (m && m.getBoundingClientRect().top < 0) {
        m.scrollIntoView({ block: "start", behavior: semMovimento() ? "auto" : "smooth" });
      }
    }
  };

  const f = fotos[topo];
  const dois = (i: number) => String(i + 1).padStart(2, "0");
  const env = geo && {
    left: geo.x0 - geo.w * 0.05,
    top: geo.topo + geo.h * 0.5,
    width: geo.w * 1.1,
    height: geo.h * 0.5 + 16 + ENVELOPE - 6,
  };

  return (
    /* a cópia arremessada sai da tela; quem corta é a borda da janela, e não
       a da coluna */
    <div className="mx-[calc(50%-50vw)] mt-8 overflow-x-clip print:hidden">
      <div className="mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-2.5rem,1120px)]">
        {espalhada && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[rgba(58,39,27,0.22)] pb-4">
            <p className="ficha text-[14.5px] text-[#6f5b44]">
              As {n} na mesa · toque numa para ampliar
            </p>
            <button
              type="button"
              onClick={() => espalhar(false)}
              className="ficha alvo border border-[rgba(58,39,27,0.35)] px-4 py-2.5 text-[13px] uppercase tracking-[0.1em] transition-colors hover:border-[#8c3a20] hover:text-[#8c3a20]"
            >
              Juntar o monte
            </button>
          </div>
        )}

        <div
          className={
            espalhada
              ? ""
              : "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-center lg:gap-14"
          }
        >
          <div
            ref={mesa}
            className="mesa relative"
            data-espalhada={espalhada || undefined}
            style={{ "--serrilha": SERRILHA } as CSSProperties}
            role="group"
            aria-roledescription="monte de fotos"
            aria-label="Fotos da propriedade"
            onPointerDown={pegar}
            onPointerMove={arrastar}
            onPointerUp={soltar}
            onPointerCancel={soltar}
            onKeyDown={teclas}
          >
            {/* O envelope do laboratório, com a marca, por baixo do monte.
                Diz só o que é verdade: de onde são as fotos e quantas são. */}
            {env && (
              <div className="envelope" aria-hidden="true" style={env}>
                <div className="envelope-impresso">
                  <div>
                    <div
                      className="text-[19px] leading-none"
                      style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                    >
                      Vô Juca
                    </div>
                    <div className="ficha mt-1 text-[10.5px] uppercase tracking-[0.16em]">
                      Fotos do Sítio JR
                    </div>
                  </div>
                  <div className="envelope-campo ficha">
                    <span className="text-[9.5px] uppercase tracking-[0.16em]">Cópias</span>
                    <span className="num text-[17px] leading-none text-[#3a271b]">{n}</span>
                  </div>
                </div>
              </div>
            )}

            {fotos.map((foto, i) => {
              const daVez = !espalhada && i === topo;
              return (
                <button
                  key={foto.legenda}
                  ref={(el) => {
                    cartas.current[i] = el;
                  }}
                  type="button"
                  className="copia"
                  style={geo ? { width: geo.w, height: geo.h } : { visibility: "hidden" }}
                  tabIndex={espalhada || daVez ? 0 : -1}
                  aria-hidden={espalhada || daVez ? undefined : true}
                  aria-label={
                    espalhada
                      ? `Ampliar a foto ${dois(i)}: ${foto.legenda}`
                      : `Ampliar a foto ${dois(i)} de ${n}: ${foto.legenda}. Setas trocam a foto`
                  }
                  onClick={(e) => {
                    /* no monte, o toque é lido no soltar do arrasto; aqui só
                       chega o Enter do teclado, que tem detail 0 */
                    if (espalhada || e.detail === 0) aoAbrir(i);
                  }}
                >
                  <span className="copia-sombra" aria-hidden="true" />
                  <span className="copia-papel">
                    <span className="copia-foto">
                      <img
                        src={foto.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="foto"
                      />
                    </span>
                  </span>
                  <span className="copia-leg ficha" aria-hidden="true">
                    {dois(i)} · {foto.legenda}
                  </span>
                </button>
              );
            })}
          </div>

          {!espalhada && (
            <div className="mt-7 text-center lg:mt-0 lg:text-left">
              <div key={topo} className="mesa-sobe" aria-live="polite">
                <div className="flex items-baseline justify-center gap-2.5 lg:justify-start">
                  <span
                    className="num text-[44px] leading-none text-[#8c3a20] lg:text-[68px]"
                    style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 500 }}
                  >
                    {dois(topo)}
                  </span>
                  <span className="ficha text-[14px] text-[#6f5b44]">de {n}</span>
                </div>
                <p
                  className="mt-3 text-[22px] leading-tight text-[#3a271b] lg:text-[28px]"
                  style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
                >
                  {f.legenda}
                </p>
                <p className="ficha mt-2 text-[15px] leading-snug text-[#6f5b44]">{f.ficha}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={voltar}
                  aria-label="Foto anterior"
                  className="alvo flex h-11 w-11 items-center justify-center border border-[rgba(58,39,27,0.35)] text-[18px] transition-colors hover:border-[#8c3a20] hover:text-[#8c3a20]"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => jogar(-1)}
                  aria-label="Próxima foto"
                  className="alvo flex h-11 w-11 items-center justify-center border border-[rgba(58,39,27,0.35)] text-[18px] transition-colors hover:border-[#8c3a20] hover:text-[#8c3a20]"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => espalhar(true)}
                  className="ficha alvo ml-1 h-11 px-1 text-[13px] uppercase tracking-[0.1em] text-[#6b4526] underline decoration-[rgba(107,69,38,0.4)] underline-offset-4 transition-colors hover:text-[#8c3a20]"
                >
                  Espalhar as {n} na mesa
                </button>
              </div>
              <p className="ficha mt-3 text-[13.5px] text-[#6f5b44]">
                Arraste a de cima para o lado · toque para ampliar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
