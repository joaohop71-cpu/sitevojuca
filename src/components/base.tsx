import type { ReactNode } from "react";
import { selo } from "@/imagens";
import ramoEsq from "@/assets/ramo-esq.webp";
import ramoDir from "@/assets/ramo-dir.webp";

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

/**
 * O título da seção, entre ramos de café.
 *
 * A letra é a Fraunces, a mesma da marca e dos rótulos; antes era a de máquina
 * de escrever, que é a voz das etiquetas pequenas e não a do título.
 *
 * Em tela larga os ramos ficam um de cada lado e se esticam até o espaço que
 * sobra, como fio de ornamento. No celular não existe esse espaço: o que sobra
 * de cada lado daria uns sessenta pixels, e o desenho vira um risco. Aí a
 * composição vira em coluna: um ramo inteiro, em toda a largura, com o título
 * embaixo. Mesmo motivo, tamanho de verdade.
 */
export function Rubrica({
  children,
  claro = false,
}: {
  children: ReactNode;
  claro?: boolean;
}) {
  const ramo = `ramo-titulo ${claro ? "ramo-claro" : ""}`;
  return (
    <div className="rubrica-linha">
      <img
        src={ramoEsq}
        alt=""
        aria-hidden="true"
        width={760}
        height={228}
        className={ramo}
      />
      <span className="rubrica" style={claro ? { color: "#e8b98d" } : undefined}>
        {children}
      </span>
      <img
        src={ramoDir}
        alt=""
        aria-hidden="true"
        width={760}
        height={244}
        className={`${ramo} ramo-dir`}
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
