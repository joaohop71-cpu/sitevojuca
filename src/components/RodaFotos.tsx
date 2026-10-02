import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type FotoRoda = { src: string; alt: string; legenda: string; ficha: string };

/**
 * As fotos numa roda que gira com a rolagem.
 *
 * O centro da roda fica abaixo da tela, e só o arco de cima aparece: a foto do
 * topo é a da vez, nítida e inteira; as vizinhas descem pela curva, inclinadas,
 * desfocadas e mais apagadas. O painel fica preso enquanto a seção passa, e a
 * rolagem dentro dela vira o giro.
 *
 * Escrita aqui em vez de instalada: a versão de referência pede GSAP e Motion,
 * duas bibliotecas para um efeito que cabe em um laço de requestAnimationFrame.
 * O laço só roda enquanto a roda está chegando na posição; parada, não gasta
 * nada.
 */

/* quanto de rolagem cada foto ocupa, em vh */
const VH_POR_FOTO = 22;

type Geo = {
  /** tamanho do cartão */
  w: number;
  h: number;
  /** raio da roda */
  R: number;
  /** ângulo entre duas fotos, em radianos */
  passo: number;
  /** altura do centro do cartão do topo, dentro do palco */
  y0: number;
  /** largura de uma casa da régua, para o marcador andar junto */
  casa: number;
};

function medir(largura: number, alturaPalco: number, casa: number): Geo {
  /* o cartão é 4:5, como na grade, e cresce até onde o palco deixa */
  const hMax = Math.min(340, Math.max(150, alturaPalco - 28));
  /* no celular a foto da vez ocupa mais da largura; as vizinhas viram uma
     fresta na borda, que é o que avisa que dá para girar */
  const w = Math.round(Math.min(hMax * 0.8, largura * (largura < 640 ? 0.58 : 0.46)));
  const h = Math.round(w * 1.25);
  const R = largura < 640 ? Math.max(largura * 1.05, 360) : Math.max(largura * 0.75, 900);
  return { w, h, R, passo: (w * 1.18) / R, y0: alturaPalco / 2, casa };
}

/**
 * A roda não para no meio do caminho entre duas fotos: perto de cada uma a
 * rolagem anda devagar, e entre elas anda depressa. É um detente, como o de
 * um seletor que estala em cada posição, só que contínuo.
 */
function detente(a: number) {
  const k = Math.round(a);
  const u = a - k;
  return k + Math.sign(u) * 0.5 * Math.pow(Math.abs(2 * u), 1.8);
}

/** a ficha entra letra por letra; as palavras não quebram no meio */
function FichaLetras({ texto }: { texto: string }) {
  let n = 0;
  return (
    <>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {texto.split(" ").map((palavra, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(palavra).map((c, j) => (
                <span key={j} className="roda-letra" style={{ animationDelay: `${n++ * 16}ms` }}>
                  {c}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

export default function RodaFotos({
  fotos,
  cabeca,
  aoAbrir,
}: {
  fotos: FotoRoda[];
  /** título e linha de apoio, presos no alto do painel */
  cabeca: ReactNode;
  aoAbrir: (i: number) => void;
}) {
  const n = fotos.length;
  const secao = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const regua = useRef<HTMLOListElement>(null);
  const marcador = useRef<HTMLSpanElement>(null);
  const cartoes = useRef<(HTMLButtonElement | null)[]>([]);
  const geoRef = useRef<Geo | null>(null);
  /* alvo: onde a rolagem manda; pos: onde a roda está, chegando com inércia */
  const giro = useRef({ alvo: 0, pos: 0, ativa: 0, raf: 0, primeira: true });
  const [geo, setGeo] = useState<Geo | null>(null);
  const [ativa, setAtiva] = useState(0);

  const desenhar = useCallback((pos: number) => {
    const g = geoRef.current;
    if (!g) return;
    cartoes.current.forEach((el, i) => {
      if (!el) return;
      const th = (i - pos) * g.passo;
      const d = Math.abs(i - pos);
      if (Math.abs(th) > 1.5 || d > 4.5) {
        el.style.visibility = "hidden";
        return;
      }
      const x = g.R * Math.sin(th);
      const y = g.y0 + g.R * (1 - Math.cos(th));
      const escala = 1 - 0.06 * Math.min(d, 3);
      const desfoque = Math.min(4, Math.max(0, d - 0.3) * 2.4);
      const brilho = 1 - 0.16 * Math.min(d, 2.5) / 2.5;
      const cor = 1 - 0.45 * Math.min(d, 2) / 2;
      el.style.visibility = "visible";
      el.style.transform = `translate3d(${(x - g.w / 2).toFixed(1)}px, ${(y - g.h / 2).toFixed(1)}px, 0) rotate(${th.toFixed(4)}rad) scale(${escala.toFixed(3)})`;
      el.style.filter =
        d < 0.04
          ? "none"
          : `blur(${desfoque.toFixed(2)}px) brightness(${brilho.toFixed(3)}) saturate(${cor.toFixed(3)})`;
      el.style.opacity = d < 2.6 ? "1" : Math.max(0, 1 - (d - 2.6) / 1.6).toFixed(3);
      el.style.zIndex = String(100 - Math.round(d * 10));
    });
    if (marcador.current) {
      marcador.current.style.transform = `translateX(${(pos * g.casa).toFixed(1)}px)`;
    }
  }, []);

  const quadro = useCallback(function proximo() {
    const e = giro.current;
    const dif = e.alvo - e.pos;
    e.pos = Math.abs(dif) < 0.001 ? e.alvo : e.pos + dif * 0.16;
    desenhar(e.pos);
    /* a da vez só troca depois de passar da metade com folga, para a legenda
       não piscar quando a rolagem para bem na divisa */
    if (Math.abs(e.pos - e.ativa) > 0.56) {
      e.ativa = Math.min(n - 1, Math.max(0, Math.round(e.pos)));
      setAtiva(e.ativa);
    }
    e.raf = e.pos === e.alvo ? 0 : requestAnimationFrame(proximo);
  }, [desenhar, n]);

  const ler = useCallback(() => {
    const s = secao.current;
    const p = painel.current;
    if (!s || !p) return;
    const curso = s.offsetHeight - p.offsetHeight;
    const prog = curso > 0 ? Math.min(1, Math.max(0, -s.getBoundingClientRect().top / curso)) : 0;
    const e = giro.current;
    e.alvo = detente(prog * (n - 1));
    /* quem recarrega a página no meio da roda não vê ela girar do zero */
    if (e.primeira) {
      e.primeira = false;
      e.pos = e.alvo;
      e.ativa = Math.round(e.alvo);
      setAtiva(e.ativa);
    }
    if (!e.raf) e.raf = requestAnimationFrame(quadro);
  }, [n, quadro]);

  /* leva a rolagem até a foto i; a roda acompanha sozinha */
  const irPara = useCallback(
    (i: number) => {
      const s = secao.current;
      const p = painel.current;
      if (!s || !p) return;
      const alvo = Math.min(n - 1, Math.max(0, i));
      const curso = s.offsetHeight - p.offsetHeight;
      const topo = s.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topo + (alvo / (n - 1)) * curso, behavior: "smooth" });
    },
    [n],
  );

  useLayoutEffect(() => {
    const pn = palco.current;
    const pl = painel.current;
    if (!pn || !pl) return;
    const remedir = () => {
      const casa = regua.current?.firstElementChild?.getBoundingClientRect().width ?? 0;
      const g = medir(pl.clientWidth, pn.clientHeight, casa);
      geoRef.current = g;
      setGeo(g);
      desenhar(giro.current.pos);
    };
    remedir();
    const ro = new ResizeObserver(remedir);
    ro.observe(pn);
    ro.observe(pl);
    return () => ro.disconnect();
  }, [desenhar]);

  useEffect(() => {
    const e = giro.current;
    ler();
    window.addEventListener("scroll", ler, { passive: true });
    window.addEventListener("resize", ler);
    return () => {
      window.removeEventListener("scroll", ler);
      window.removeEventListener("resize", ler);
      cancelAnimationFrame(e.raf);
      e.raf = 0;
    };
  }, [ler]);

  const teclas = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
      ev.preventDefault();
      irPara(ativa + (ev.key === "ArrowRight" ? 1 : -1));
    }
  };

  const f = fotos[ativa];
  const dois = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div
      id="fotos"
      ref={secao}
      className="relative mx-[calc(50%-50vw)] print:hidden"
      style={{ height: `calc(100svh + ${(n - 1) * VH_POR_FOTO}vh)` }}
      onKeyDown={teclas}
    >
      <div
        ref={painel}
        className="roda-painel sticky top-0 flex h-svh flex-col overflow-clip pb-4 sm:pb-6"
      >
        <div className="mx-auto w-[min(100%-2rem,1120px)] pt-[88px] sm:w-[min(100%-2.5rem,1120px)] sm:pt-[100px]">
          {cabeca}
        </div>

        {/* o palco é só a origem da roda: largura zero, centrado; os cartões
            se posicionam em relação ao meio dele */}
        <div ref={palco} className="relative mx-auto mt-3 min-h-0 w-0 flex-1 sm:mt-5">
          {fotos.map((foto, i) => (
            <button
              key={foto.legenda}
              ref={(el) => {
                cartoes.current[i] = el;
              }}
              type="button"
              tabIndex={i === ativa ? 0 : -1}
              onClick={() => (i === ativa ? aoAbrir(i) : irPara(i))}
              aria-label={i === ativa ? `Ampliar: ${foto.legenda}` : `Ir para a foto ${dois(i)}: ${foto.legenda}`}
              className={`roda-cartao absolute left-0 top-0 block border bg-[#f6eede] p-1.5 transition-[border-color,box-shadow] duration-300 ${
                i === ativa
                  ? "border-[#8c3a20] shadow-[0_22px_40px_-22px_rgba(58,39,27,0.55)]"
                  : "border-[rgba(58,39,27,0.22)]"
              }`}
              style={{ width: geo?.w, height: geo?.h, visibility: "hidden" }}
            >
              <img
                src={foto.src}
                alt={foto.alt}
                /* as vizinhas já vêm carregadas, para não chegarem em branco */
                loading={Math.abs(i - ativa) <= 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="foto block h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* a legenda fica acima dos cartões que descem pela curva */}
        <div className="relative z-[200] mx-auto mt-3 min-h-[92px] w-[min(100%-2rem,460px)] text-center">
          <p
            key={`l${ativa}`}
            className="roda-sobe text-[19px] leading-tight text-[#3a271b] sm:text-[22px]"
            style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 }}
          >
            {f.legenda}
          </p>
          <p key={`f${ativa}`} className="ficha mt-1.5 text-[14.5px] leading-snug text-[#6f5b44]">
            <FichaLetras texto={f.ficha} />
          </p>
        </div>

        {/* A régua: as fotos estão numeradas desde a grade, e o número é o que
            o leitor já reconhece. O marcador anda junto com a roda, e cada
            número leva direto à sua foto. */}
        <nav aria-label="Fotos da propriedade" className="relative z-[200] mx-auto mt-2">
          <ol ref={regua} className="flex border-t border-[rgba(58,39,27,0.3)]">
            {fotos.map((foto, i) => (
              <li key={foto.legenda} className="w-7 sm:w-10">
                <button
                  type="button"
                  onClick={() => irPara(i)}
                  aria-label={`Foto ${dois(i)}: ${foto.legenda}`}
                  aria-current={i === ativa ? "true" : undefined}
                  className="ficha num relative block h-11 w-full pt-2.5 text-[13px] transition-colors hover:text-[#8c3a20]"
                  style={{ color: i === ativa ? "#8c3a20" : "#6f5b44" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 h-[6px] w-px -translate-x-1/2 bg-[rgba(58,39,27,0.45)]"
                  />
                  {dois(i)}
                </button>
              </li>
            ))}
          </ol>
          <span
            ref={marcador}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[-2px] block h-[3px] w-7 bg-[#8c3a20] sm:w-10"
          />
        </nav>
      </div>
    </div>
  );
}
