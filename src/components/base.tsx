import { ReactNode } from "react";

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
    <section id={id} className={`relative ${bg} ${className}`} style={{ scrollMarginTop: 76 }}>
      <div className="relative mx-auto w-[min(100%-2.5rem,1120px)]">{children}</div>
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
}: {
  href?: string;
  children: ReactNode;
  tom?: "cheio" | "vazio" | "claro";
  onClick?: () => void;
  type?: "button";
}) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-[14px] tracking-[0.1em] uppercase transition-colors duration-150 border";
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
