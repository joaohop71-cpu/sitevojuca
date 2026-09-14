import { useId, useState, type ReactNode } from "react";
import { selo } from "@/imagens";
import ramoEsq from "@/assets/ramo-esq.webp";
import ramoDir from "@/assets/ramo-dir.webp";
import ramoEsqCurto from "@/assets/ramo-esq-curto.webp";
import ramoDirCurto from "@/assets/ramo-dir-curto.webp";

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
 * O título da seção, entre dois ramos de café.
 *
 * A letra é a Fraunces, a mesma da marca e dos rótulos; antes era a de máquina
 * de escrever, que é a voz das etiquetas pequenas e não a de um título.
 *
 * Os ramos ficam sempre um de cada lado e comem o que sobra de largura, como
 * fio de ornamento. No celular sobram uns setenta pixels por lado, e um ramo
 * de um metro de comprido espremido nisso vira um risco: lá entra um pedaço
 * do mesmo desenho, o pedaço que encosta no título, que nessa largura ainda
 * se lê como ramo.
 */
export function Rubrica({
  children,
  claro = false,
}: {
  children: ReactNode;
  claro?: boolean;
}) {
  const tinta = claro ? "ramo-claro" : "";
  return (
    <div className="rubrica-linha">
      <picture className="ramo-titulo ramo-lado-esq">
        <source media="(max-width: 639px)" srcSet={ramoEsqCurto} />
        <img src={ramoEsq} alt="" aria-hidden="true" className={tinta} />
      </picture>
      <span className="rubrica" style={claro ? { color: "#e8b98d" } : undefined}>
        {children}
      </span>
      <picture className="ramo-titulo ramo-lado-dir">
        <source media="(max-width: 639px)" srcSet={ramoDirCurto} />
        <img src={ramoDir} alt="" aria-hidden="true" className={tinta} />
      </picture>
    </div>
  );
}

/**
 * Um trecho que só aparece se a pessoa pedir.
 *
 * A página tinha 1.841 palavras e nove minutos de leitura, e quase tudo
 * chegava de uma vez. O que está aqui dentro continua no HTML, com altura
 * zero: o Google lê, o leitor de tela não tropeça (o conteúdo fica inerte
 * enquanto está fechado, senão o Tab entra num texto que ninguém vê) e a
 * altura anima pelo truque das linhas de grade, que dispensa medir em
 * JavaScript.
 *
 * O rótulo é sempre o mesmo, "saiba mais". Tentei antes fazer cada um dizer o
 * que tinha lá dentro ("o que me incomodou"), e virava eco: o texto de cima
 * abria a pergunta, o botão repetia a pergunta e o de dentro respondia. Um
 * rótulo só, repetido, também ensina o gesto mais rápido.
 */
export function Dobra({
  rotulo = "saiba mais",
  fechar = "fechar",
  claro = false,
  className = "",
  children,
}: {
  rotulo?: string;
  fechar?: string;
  /** para o bloco escuro do processo */
  claro?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const cor = claro ? "#e8b98d" : "#8c3a20";
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls={id}
        className="link-sublinhado ficha inline-flex items-center gap-2 text-[14.5px] uppercase tracking-[0.1em]"
        style={{ color: cor, borderBottomColor: `${cor}73` }}
        data-print-hide
      >
        {aberto ? fechar : rotulo}
        <span
          aria-hidden="true"
          className="inline-block text-[15px] leading-none transition-transform duration-300"
          style={{ transform: aberto ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: aberto ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" inert={!aberto}>
          {children}
        </div>
      </div>
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
    /* mailto entrega o endereço ao programa de e-mail e não navega: numa aba
       nova ela ficaria em branco, aberta, sem nada dentro */
    const externo = href.startsWith("http");
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
