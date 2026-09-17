import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { busto, selo } from "@/imagens";
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

/**
 * O busto, pintado numa cor exata.
 *
 * Mesma técnica do <Selo>: a arte é de uma tinta só sobre transparência, então
 * ela serve de máscara e quem pinta é o fundo. É isso que deixa o desenho sair
 * no creme da marca sobre a capa escura e na tinta sobre o papel, sem filtro e
 * sem dois arquivos.
 */
export function Busto({
  cor,
  className = "",
  rotulo,
}: {
  cor: string;
  className?: string;
  rotulo?: string;
}) {
  return (
    <div
      className={`transition-colors duration-300 ${className}`}
      {...(rotulo ? { role: "img", "aria-label": rotulo } : { "aria-hidden": true })}
      style={{
        backgroundColor: cor,
        maskImage: `url(${busto})`,
        WebkitMaskImage: `url(${busto})`,
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
        className="link-sublinhado ficha inline-flex items-center gap-2 py-2.5 text-[14.5px] uppercase tracking-[0.1em]"
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

/**
 * O visor: uma imagem grande sobre a página, com o resto apagado.
 *
 * Serve às fotos da galeria e aos rótulos. Estava escrito só dentro da
 * galeria, e o segundo uso ia copiar as mesmas cinquenta linhas de tecla,
 * foco e trava de rolagem, que são justamente as que se erra.
 *
 * O foco entra ao abrir e volta para onde estava ao fechar; o Tab circula
 * dentro, senão ele sai por baixo do véu para links que ninguém está vendo e
 * não há como voltar a fechar pelo teclado.
 *
 * Vai desenhado direto no corpo da página, e não onde é escrito. As seções têm
 * borda rasgada, que é máscara, e máscara abre contexto de empilhamento: o
 * z-index do visor ficava preso dentro da seção, e o cabeçalho, que é irmão
 * dela, pintava por cima justamente do canto onde está o X.
 */
export function Visor({
  rotulo,
  aoFechar,
  aoIr,
  children,
}: {
  rotulo: string;
  aoFechar: () => void;
  /** quando há vizinhos: setas do teclado, botões e arrasto no toque */
  aoIr?: (d: number) => void;
  children: ReactNode;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const toqueX = useRef<number | null>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
      if (aoIr && e.key === "ArrowRight") aoIr(1);
      if (aoIr && e.key === "ArrowLeft") aoIr(-1);
      if (e.key === "Tab") {
        const botoes = Array.from(
          caixa.current?.querySelectorAll<HTMLElement>("button") ?? []
        );
        if (!botoes.length) return;
        const primeiro = botoes[0];
        const ultimo = botoes[botoes.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    },
    [aoFechar, aoIr]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = antes;
    };
  }, [onKey]);

  useEffect(() => {
    const devolver = document.activeElement as HTMLElement | null;
    caixa.current?.querySelector<HTMLElement>("button")?.focus();
    return () => devolver?.focus?.();
  }, []);

  return createPortal(
    <div
      ref={caixa}
      role="dialog"
      aria-modal="true"
      aria-label={rotulo}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(30,20,14,0.94)" }}
      onClick={aoFechar}
      data-print-hide
    >
      {/* O X era um traço fino de contorno translúcido sobre a foto: estava lá
          e não se anunciava, e no iPhone caía debaixo da barra do navegador.
          Agora é um disco do papel da marca, que se enxerga sobre qualquer
          imagem, e o topo respeita a área segura do aparelho. */}
      <button
        type="button"
        onClick={aoFechar}
        aria-label="Fechar"
        className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105 sm:right-5 sm:h-[52px] sm:w-[52px]"
        style={{
          top: "max(1rem, env(safe-area-inset-top))",
          background: "#efe3cc",
          color: "#2c1d14",
          boxShadow: "0 6px 20px rgba(20,12,8,0.45)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="sm:h-[21px] sm:w-[21px]"
        >
          <path
            d="M3.5 3.5 16.5 16.5M16.5 3.5 3.5 16.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className="flex max-h-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          toqueX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (toqueX.current === null || !aoIr) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          if (Math.abs(dx) > 50) aoIr(dx < 0 ? 1 : -1);
          toqueX.current = null;
        }}
      >
        {children}
      </div>

      {aoIr && (
        <div
          className="mt-6 flex gap-3"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { d: -1, r: "Anterior", s: "←" },
            { d: 1, r: "Próxima", s: "→" },
          ].map((b) => (
            <button
              key={b.r}
              type="button"
              onClick={() => aoIr(b.d)}
              aria-label={b.r}
              className="flex h-12 w-16 items-center justify-center border border-[rgba(239,227,204,0.4)] text-[18px] text-[#efe3cc] transition-colors hover:bg-[rgba(239,227,204,0.14)] sm:h-11 sm:w-14"
            >
              {b.s}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

/**
 * O mais, o menos e o número: o controle de quantidade.
 *
 * Estava escrito dentro da tabela de preços. Com a quantidade indo também para
 * o cartão do café, ficar em dois lugares era garantir que um dia os dois
 * divergissem.
 */
export function Contador({
  valor,
  aoMudar,
  rotulo,
  cor = "#6b4526",
  compacto = false,
}: {
  valor: number;
  aoMudar: (d: number) => void;
  /** o que o leitor de tela anuncia: "um Café Vô Juca em grão" */
  rotulo: string;
  /** a tinta da linha do café */
  cor?: string;
  /** dentro da faixa do rótulo o espaço é curto; a altura de toque não muda */
  compacto?: boolean;
}) {
  /* Dentro da faixa do rótulo cabem dois contadores lado a lado, e a largura
     do cartão manda: em tela de 320 px os dois somavam mais do que o quadro
     impresso tem de largura. A altura de toque nunca encolhe; só a largura
     acompanha o cartão. */
  const lado = "h-11";
  const meio = "h-11";
  const larg = compacto ? { width: "clamp(34px, 11cqw, 44px)" } : {};
  const largMeio = compacto ? { width: "clamp(34px, 11cqw, 48px)" } : {};
  const borda = `${cor}59`;
  return (
    <div className="flex shrink-0 items-center" data-print-hide>
      <button
        type="button"
        onClick={() => aoMudar(-1)}
        aria-label={`Remover um ${rotulo}`}
        className={`${lado} flex ${compacto ? "" : "w-11"} items-center justify-center border text-[18px] transition-colors hover:bg-[rgba(58,39,27,0.07)]`}
        style={{ borderColor: borda, color: cor, ...larg }}
      >
        −
      </button>
      <span
        className={`${meio} num flex ${compacto ? "" : "w-12"} items-center justify-center border-y text-[16px]`}
        style={{ borderColor: borda, color: valor ? cor : "#6f5b44", ...largMeio }}
        aria-live="polite"
      >
        {valor}
      </span>
      <button
        type="button"
        onClick={() => aoMudar(1)}
        aria-label={`Adicionar um ${rotulo}`}
        className={`${lado} flex ${compacto ? "" : "w-11"} items-center justify-center border text-[18px] transition-colors hover:bg-[rgba(58,39,27,0.07)]`}
        style={{ borderColor: borda, color: cor, ...larg }}
      >
        +
      </button>
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
        onClick={onClick}
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
