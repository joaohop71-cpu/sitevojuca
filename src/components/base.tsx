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

/** grão de café — o motivo do selo reduzido a ornamento tipográfico */
export function Grao({
  size = 14,
  cor = "#8c3a20",
  fundo = "#efe3cc",
}: {
  size?: number;
  cor?: string;
  fundo?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.32}
      viewBox="0 0 20 26"
      aria-hidden="true"
      className="inline-block shrink-0 translate-y-[0.1em]"
    >
      {/* corpo do grão, levemente inclinado como no selo */}
      <ellipse cx="10" cy="13" rx="7.6" ry="12" fill={cor} transform="rotate(-14 10 13)" />
      {/* o vinco central */}
      <path
        d="M10 1.6C7.1 6 7.1 20 10 24.4"
        fill="none"
        stroke={fundo}
        strokeWidth="2.1"
        strokeLinecap="round"
        transform="rotate(-14 10 13)"
      />
    </svg>
  );
}

/* folhas e frutos posicionados ao longo do galho — angulo em graus,
   medido a partir do eixo x; 180+ aponta para a esquerda */
const FOLHAS = [
  { x: 62, y: 30, a: 206, e: 1 },
  { x: 62, y: 30, a: 154, e: 0.86 },
  { x: 84, y: 30, a: 214, e: 0.8 },
  { x: 138, y: 30, a: -26, e: 1 },
  { x: 138, y: 30, a: 26, e: 0.86 },
  { x: 116, y: 30, a: -34, e: 0.8 },
];

const FRUTOS = [
  { x: 74, y: 41, r: 4.4 }, { x: 83, y: 44, r: 4 }, { x: 66, y: 45, r: 3.6 },
  { x: 92, y: 39, r: 3.4 },
  { x: 126, y: 41, r: 4.4 }, { x: 117, y: 44, r: 4 }, { x: 134, y: 45, r: 3.6 },
  { x: 108, y: 39, r: 3.4 },
  { x: 100, y: 46, r: 4.6 },
];

/** ramo de café — ornamento central dos rótulos */
export function RamoCafe({
  verde = "#4f5b3f",
  fruto = "#8c3a20",
  className = "",
}: {
  verde?: string;
  fruto?: string;
  className?: string;
}) {
  const folha = "M0 0C7-7.5 21-7.5 28 0C21 7.5 7 7.5 0 0Z";
  return (
    <svg viewBox="0 0 200 60" className={className} aria-hidden="true">
      <path
        d="M28 30C60 22 140 22 172 30"
        fill="none"
        stroke={verde}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {FOLHAS.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.a}) scale(${f.e})`}>
          <path d={folha} fill={verde} />
          <path d="M2 0H26" stroke="#e7d9bb" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      {FRUTOS.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={fruto} />
      ))}
    </svg>
  );
}

export function Ornamento({
  cor = "rgba(58,39,27,0.32)",
  grao = "#8c3a20",
  fundo = "#efe3cc",
}: {
  cor?: string;
  grao?: string;
  fundo?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-1" aria-hidden="true">
      <span className="h-px w-20" style={{ background: cor }} />
      <Grao size={11} cor={grao} fundo={fundo} />
      <span className="h-px w-20" style={{ background: cor }} />
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
  tom?: "cheio" | "vazio" | "claro";
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
