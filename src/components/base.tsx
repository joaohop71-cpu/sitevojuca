import type { ReactNode } from "react";
import { selo } from "@/imagens";
import ramoCafe from "@/assets/ramo-cafe.webp";

/**
 * O selo pintado numa cor exata.
 *
 * Antes ele era clareado por filtro (`brightness(0) invert(1)`), que só sabe
 * produzir branco puro — e branco não é uma cor desta marca. Como a arte é de
 * uma tinta só sobre transparência, ela serve de máscara: o que pinta é o
 * fundo, e aí a cor é escolhida, não calculada.
 */
export function Selo({
  cor,
  className = "",
  rotulo,
}: {
  cor: string;
  className?: string;
  /** um nome acessível transforma o selo em imagem; sem ele, é decoração */
  rotulo?: string;
}) {
  return (
    <div
      className={`transition-colors duration-300 ${className}`}
      {...(rotulo ? { role: "img", "aria-label": rotulo } : { "aria-hidden": true })}
      style={{
        backgroundColor: cor,
        maskImage: `url(${selo})`,
        WebkitMaskImage: `url(${selo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/**
 * O ramo que marca uma emenda de fundo.
 *
 * Ele passa a ter um significado só: onde ele aparece, o chão da página muda.
 * Fica sempre do lado claro do rasgo, porque a arte é de tinta escura e
 * sumiria contra o bloco escuro.
 */
export function RamoEmenda({ className = "" }: { className?: string }) {
  return (
    <img
      src={ramoCafe}
      alt=""
      aria-hidden="true"
      width={1200}
      height={235}
      loading="lazy"
      className={`mx-auto w-[min(100%-2rem,360px)] ${className}`}
    />
  );
}

export function Faixa({
  children,
  className = "",
  id,
  fundo,
  atras,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  fundo?: "papel" | "creme" | "tinta";
  /**
   * A cor que aparece na falha, quando a seção tem borda rasgada.
   *
   * O rasgo não pinta nada: ele recorta a seção e deixa ver o que está atrás.
   * Sem esta cor, o que está atrás é o papel do corpo — e aí uma seção escura
   * entre duas cremes produz três tons na emenda, em vez de passar direto de
   * uma cor para a outra. Aqui se declara a cor do vizinho.
   */
  atras?: string;
}) {
  const bg =
    fundo === "creme"
      ? "bg-[#f6eede]"
      : fundo === "tinta"
      ? "bg-[#2c1d14] text-[#efe3cc]"
      : "";
  const secao = (
    <section id={id} className={`relative ${bg} ${className}`} style={{ scrollMarginTop: 84 }}>
      <div className="relative mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-2.5rem,1120px)]">
        {children}
      </div>
    </section>
  );
  return atras ? <div style={{ background: atras }}>{secao}</div> : secao;
}

export function Rubrica({
  num,
  children,
  claro = false,
}: {
  num: string;
  children: ReactNode;
  claro?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={claro ? "eyebrow-cru num" : "eyebrow num"} style={claro ? { color: "#c0ab8c" } : undefined}>
        {num} · {children}
      </span>
      <span
        className="h-px flex-1"
        style={{ background: claro ? "rgba(192,171,140,0.4)" : "rgba(58,39,27,0.22)", maxWidth: 180 }}
      />
    </div>
  );
}

export function Botao({
  href,
  children,
  tom = "cheio",
  onClick,
  type,
  largo = false,
}: {
  href?: string;
  children: ReactNode;
  tom?: "cheio" | "vazio" | "claro" | "contorno";
  onClick?: () => void;
  type?: "button";
  /** ocupa a linha inteira no mobile — alvo de toque maior */
  largo?: boolean;
}) {
  const base = `inline-flex items-center justify-center px-6 py-3.5 text-[16px] tracking-[0.1em] uppercase transition-colors duration-150 border sm:py-3 ${
    largo ? "w-full sm:w-auto" : ""
  }`;
  const estilos = {
    cheio: "bg-[#3a271b] text-[#efe3cc] border-[#3a271b] hover:bg-[#8c3a20] hover:border-[#8c3a20]",
    vazio:
      "bg-transparent text-[#3a271b] border-[rgba(58,39,27,0.4)] hover:border-[#3a271b] hover:bg-[rgba(58,39,27,0.05)]",
    claro:
      "bg-[#efe3cc] text-[#2c1d14] border-[#efe3cc] hover:bg-[#f7efe0] hover:border-[#f7efe0]",
    /* para fundo escuro: só o contorno, em creme */
    contorno:
      "bg-transparent text-[#efe3cc] border-[rgba(239,227,204,0.5)] hover:border-[#efe3cc] hover:bg-[rgba(239,227,204,0.1)]",
  }[tom];
  const cls = `${base} ${estilos}`;
  if (href) {
    const externo = href.startsWith("http") || href.startsWith("mailto");
    return (
      <a
        href={href}
        className={cls}
        style={{ fontFamily: '"Courier Prime", monospace' }}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls} style={{ fontFamily: '"Courier Prime", monospace' }}>
      {children}
    </button>
  );
}
