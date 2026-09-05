import type { ReactNode } from "react";

export function Faixa({
  children,
  className = "",
  id,
  fundo,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  fundo?: "papel" | "creme" | "tinta";
}) {
  const bg =
    fundo === "creme"
      ? "bg-[#f6eede]"
      : fundo === "tinta"
      ? "bg-[#2c1d14] text-[#efe3cc]"
      : "";
  return (
    <section id={id} className={`relative ${bg} ${className}`} style={{ scrollMarginTop: 84 }}>
      <div className="relative mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-2.5rem,1120px)]">
        {children}
      </div>
    </section>
  );
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
        {num} — {children}
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
